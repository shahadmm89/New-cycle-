"""Final-vowel formants, done properly: decimate to 10 kHz before LPC so the
model order actually matches the bandwidth (order ~= 2 + sr/1000)."""
import wave, numpy as np
def load(p):
    w=wave.open(p); sr=w.getframerate(); ch=w.getnchannels()
    a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float64)/32768
    if ch>1: a=a.reshape(-1,ch).mean(1)
    return a, sr
def decimate(a, sr, target=10000):
    if sr<=target: return a, sr
    step=int(round(sr/target))
    # crude anti-alias: moving average over the decimation window
    k=np.ones(step)/step
    return np.convolve(a,k,'same')[::step], sr//step
def voiced_runs(a,sr,thr=0.18,zmax=0.12,minf=4):
    hop=int(sr*0.01); win=int(sr*0.025)
    rms=np.array([np.sqrt((a[i:i+win]**2).mean()) for i in range(0,len(a)-win,hop)])
    zc=np.array([np.mean(np.abs(np.diff(np.sign(a[i:i+win]))))/2 for i in range(0,len(a)-win,hop)])
    son=(rms>rms.max()*thr)&(zc<zmax)
    runs=[];i=0
    while i<len(son):
        if son[i]:
            j=i
            while j<len(son) and son[j]: j+=1
            if j-i>=minf: runs.append((i*hop,j*hop+win))
            i=j
        else: i+=1
    return runs
def formants(a,sr,s,e):
    order=int(2+sr/1000)
    seg=a[s:e]; hop=int(sr*0.01); win=int(sr*0.025); out=[]
    for i in range(0,max(1,len(seg)-win),hop):
        f=seg[i:i+win]*np.hamming(win); f=np.append(f[0], f[1:]-0.97*f[:-1])
        r=np.correlate(f,f,'full')[win-1:][:order+1]
        if r[0]<=0: continue
        R=np.array([[r[abs(m-n)] for n in range(order)] for m in range(order)])
        try: c=np.linalg.solve(R+np.eye(order)*1e-9*r[0], r[1:order+1])
        except Exception: continue
        rt=[z for z in np.roots(np.append(1,-c)) if np.imag(z)>0.01 and abs(z)>0.7]
        fr=sorted(x for x in (np.angle(rt)*sr/(2*np.pi)) if 180<x<4500)
        if len(fr)>=2: out.append(fr[:2])
    return np.array(out)
def final_vowel(path):
    a0,sr0=load(path); a,sr=decimate(a0,sr0)
    runs=voiced_runs(a,sr)
    if not runs: return None
    s,e=runs[-1]
    F=formants(a,sr,s,e)
    if len(F)==0: return None
    k=max(1,len(F)//3)
    return dict(dur=(e-s)/sr, f1=F[:,0].mean(), f1_end=F[-k:,0].mean(), f2=F[:,1].mean(), f2_end=F[-k:,1].mean())
