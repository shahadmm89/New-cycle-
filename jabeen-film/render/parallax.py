"""
Depth-parallax camera moves from a single still render ("2.5D").

Not image-to-video generation: no new content is invented. A monocular depth
model (MiDaS v2.1 small, ONNX) estimates how far each pixel is, and a virtual
camera then dollies, trucks or rises through that depth, so near objects move
more than far ones. This gives real perspective parallax rather than a flat
zoom. Moves are kept small, because anything the render does not show (behind
a wall or a car) cannot be revealed honestly.

Usage:
  python3 -I render/parallax.py <shots.json> <out_dir>
Needs: numpy, opencv-python-headless, onnxruntime, ffmpeg, and the model at
  $MIDAS_ONNX (default /tmp/claude-0/models/midas-small.onnx), from
  https://github.com/isl-org/MiDaS/releases/download/v2_1/model-small.onnx
"""
import json
import os
import subprocess
import sys

import cv2
import numpy as np
import onnxruntime as ort

W, H, FPS, SUB = 1920, 1080, 24, 3  # SUB: sub-frames averaged per frame for motion blur
MODEL = os.environ.get("MIDAS_ONNX", "/tmp/claude-0/models/midas-small.onnx")
_sess = None


def depth_of(img):
    """Relative nearness 0 (far) .. 1 (near), full resolution, edge-preserving."""
    global _sess
    if _sess is None:
        _sess = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
    x = cv2.resize(img, (256, 256), interpolation=cv2.INTER_AREA)[:, :, ::-1].astype(np.float32) / 255.0
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    d = _sess.run(None, {_sess.get_inputs()[0].name: x.transpose(2, 0, 1)[None].astype(np.float32)})[0][0]
    d = cv2.resize(d, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_CUBIC)
    d = (d - np.percentile(d, 1)) / max(1e-6, np.percentile(d, 99) - np.percentile(d, 1))
    d = np.clip(d, 0, 1).astype(np.float32)
    # Soften so the warp bends gently at depth edges instead of tearing.
    d = cv2.bilateralFilter(d, 9, 0.1, 9)
    return cv2.GaussianBlur(d, (0, 0), 3)


def ease(t):
    return t * t * (3 - 2 * t)


def fractal_clouds(h, w, seed):
    rng = np.random.default_rng(seed)
    acc = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for octave in range(6):
        s = 2 ** (octave + 2)
        n = rng.random((s, int(s * w / h) + 1)).astype(np.float32)
        acc += amp * cv2.resize(n, (w, h), interpolation=cv2.INTER_CUBIC)
        total += amp
        amp *= 0.5
    acc /= total
    return np.clip((acc - 0.45) * 3.2, 0, 1)


def open_ffmpeg(out_path):
    return subprocess.Popen(
        ["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
         "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-crf", "15", "-preset", "slow",
         "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", out_path],
        stdin=subprocess.PIPE)


def finish(frame, rng, grade):
    """Shared look: partial grey-world white balance toward neutral daylight, gentle contrast, fine grain."""
    if grade:
        means = frame.reshape(-1, 3).mean(0)
        frame = frame * (1 + 0.35 * (means.mean() / np.maximum(means, 1) - 1))
        frame = (frame - 128) * 1.04 + 128
    frame = frame + rng.normal(0, 2.2, frame.shape[:2])[..., None]
    return np.clip(frame, 0, 255).astype(np.uint8)


def render_graphic(shot, out_path):
    page = cv2.imread(shot["src"], cv2.IMREAD_COLOR)
    x0, y0, x1, y1 = shot["box"]
    img = page[y0:y1, x0:x1]
    bg = np.array(shot.get("bg", [232, 235, 236]), np.float32)
    frames = int(round(shot["dur"] * FPS))
    ff = open_ffmpeg(out_path)
    rng = np.random.default_rng(1)
    for f in range(frames):
        t = ease(f / max(1, frames - 1))
        sc = (0.86 + 0.07 * t) * min(W / img.shape[1], H / img.shape[0])
        w, h = int(img.shape[1] * sc), int(img.shape[0] * sc)
        canvas = np.empty((H, W, 3), np.float32)
        canvas[:] = bg
        im = cv2.resize(img, (w, h), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
        ox, oy = (W - w) // 2, (H - h) // 2
        canvas[oy:oy + h, ox:ox + w] = im
        ff.stdin.write(finish(canvas, rng, False).tobytes())
    ff.stdin.close()
    ff.wait()


def render_shot(shot, out_path):
    if shot.get("kind") == "graphic":
        return render_graphic(shot, out_path)
    page = cv2.imread(shot["src"], cv2.IMREAD_COLOR)
    x0, y0, x1, y1 = shot["box"]
    img = page[y0:y1, x0:x1]
    # Work at output size plus overscan, so moves never expose the frame edge.
    over = shot.get("overscan", 1.12)
    big = cv2.resize(img, (int(W * over), int(H * over)), interpolation=cv2.INTER_LANCZOS4)
    blur = cv2.GaussianBlur(big, (0, 0), 1.0)
    big = cv2.addWeighted(big, 1.5, blur, -0.5, 0)  # mild unsharp after upscaling
    dep = depth_of(big)
    bh, bw = dep.shape
    cx, cy = bw / 2, bh / 2
    gx, gy = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
    gx += (bw - W) / 2
    gy += (bh - H) / 2

    m = shot["move"]  # all in pixels / fractions at full move
    frames = int(round(shot["dur"] * FPS))
    clouds = None
    if shot.get("clouds"):
        clouds = [fractal_clouds(bh, bw, s) for s in (3, 7, 11)]

    ff = open_ffmpeg(out_path)
    rng = np.random.default_rng(7)

    for f in range(frames):
        acc = np.zeros((H, W, 3), np.float32)
        for s in range(SUB):
            t = ease(min(1.0, (f + s / SUB) / max(1, frames - 1)))
            tx = m.get("truck", 0) * (t - 0.5)  # lateral, px of parallax for the nearest plane
            ty = m.get("pedestal", 0) * (t - 0.5)
            tz = m.get("dolly", 0) * t  # forward motion, fraction of nearest-plane magnification
            base = 1 + m.get("zoom", 0) * t
            # Backward map: find the source pixel q that lands on output pixel p.
            qx, qy = gx.copy(), gy.copy()
            for _ in range(3):
                d = cv2.remap(dep, qx, qy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
                k = base * (1 + tz * d)
                qx = cx + (gx - cx - tx * d) / k
                qy = cy + (gy - cy - ty * d) / k
            frame = cv2.remap(big, qx, qy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT).astype(np.float32)
            if clouds is not None:
                # Cloud layers rush past and thin out as the camera descends through them.
                fade = max(0.0, 1 - t / 0.75)
                for i, c in enumerate(clouds):
                    sc = 1 + (t * (1.5 + i)) ** 1.4
                    M = cv2.getRotationMatrix2D((cx, cy), 0, sc)
                    layer = cv2.warpAffine(c, M, (bw, bh), borderMode=cv2.BORDER_REFLECT)
                    layer = layer[int((bh - H) / 2):int((bh - H) / 2) + H, int((bw - W) / 2):int((bw - W) / 2) + W]
                    a = (layer * fade * (0.95 - 0.2 * i))[..., None]
                    frame = frame * (1 - a) + 245 * a
            acc += frame
        ff.stdin.write(finish(acc / SUB, rng, shot.get("grade", True)).tobytes())
    ff.stdin.close()
    ff.wait()
    np.save(out_path.replace(".mp4", "-depth.npy"), cv2.resize(dep, (480, 270)))


if __name__ == "__main__":
    spec, out_dir = json.load(open(sys.argv[1])), sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    for shot in spec["shots"]:
        p = os.path.join(out_dir, shot["id"] + ".mp4")
        if os.path.exists(p) and "--force" not in sys.argv:
            print("exists", p)
            continue
        render_shot(shot, p)
        print("rendered", p)
