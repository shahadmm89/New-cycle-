import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ASSETS} from '../config/assets';
import {SPEC_LABELS} from '../config/project';
import type {Floor, VillaType} from '../config/project';
import {FPS} from '../lib/timeline';
import type {Shot} from '../lib/timeline';
import {FONT, UI_FONT} from '../lib/fonts';
import {GOLD} from '../lib/theme';

/**
 * Signature moment: the overhead cutaway render becomes the architect's 2D
 * plan, then rooms, dimensions and the specification panel are annotated.
 *
 * Expects each plan as black linework on white (PNG/SVG export from the
 * drawings). It is inverted to light lines on a dark field - the geometry is
 * never redrawn, so the layout and dimensions are exactly the architect's.
 */

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const s = (sec: number) => Math.round(sec * FPS);
const BG = '#0f1113';
// Mirrored for Arabic: the plan sits right, the specification panel left.
const PLAN_BOX = {left: 680, top: 120, width: 1130, height: 840};

const fit = (aspect: number) => {
  const w = Math.min(PLAN_BOX.width, PLAN_BOX.height * aspect);
  const h = w / aspect;
  return {left: PLAN_BOX.left + (PLAN_BOX.width - w) / 2, top: PLAN_BOX.top + (PLAN_BOX.height - h) / 2, width: w, height: h};
};

const FloorLayer: React.FC<{floor: Floor; local: number; segment: number; fadeOut: boolean; showTitle: boolean}> = ({floor, local, segment, fadeOut, showTitle}) => {
  const box = fit(floor.planAspect);
  const wipe = interpolate(local, [0, s(2.2)], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const out = !fadeOut ? 1 : interpolate(local, [segment - s(0.6), segment], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const roomsStart = s(2.4);
  const roomsSpan = Math.max(s(1), segment * 0.5 - roomsStart);
  const step = floor.rooms.length > 1 ? roomsSpan / floor.rooms.length : 0;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', ...box, clipPath: `inset(0 ${100 - wipe}% 0 0)`, mixBlendMode: 'screen'}}>
        <Img src={staticFile(floor.planImage)} style={{width: '100%', height: '100%', filter: 'invert(1) grayscale(1) brightness(1.1)'}} />
      </div>
      {wipe > 0 && wipe < 100 && (
        <div style={{position: 'absolute', top: box.top - 20, height: box.height + 40, left: box.left + (box.width * wipe) / 100, width: 2, background: GOLD, boxShadow: `0 0 18px 4px ${GOLD}`}} />
      )}
      {showTitle && (
        <div style={{position: 'absolute', right: 1920 - PLAN_BOX.left - PLAN_BOX.width, top: 56, fontFamily: FONT, direction: 'rtl', fontSize: 28, fontWeight: 300, color: GOLD, opacity: wipe / 100}}>
          {floor.name}
        </div>
      )}
      {floor.rooms.map((room, i) => {
        const a = interpolate(local, [roomsStart + i * step, roomsStart + i * step + s(0.6)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
        return (
          <div key={room.name + i} style={{position: 'absolute', left: box.left + room.x * box.width, top: box.top + room.y * box.height, transform: `translate(-50%, -50%) translateY(${(1 - a) * 8}px)`, opacity: a, textAlign: 'center', fontFamily: FONT, direction: 'rtl', whiteSpace: 'nowrap'}}>
            <div style={{fontSize: 22, fontWeight: 400, color: '#fff', textShadow: `0 0 6px ${BG}, 0 0 12px ${BG}`}}>{room.name}</div>
            {room.dims && <div style={{fontSize: 18, fontWeight: 400, color: GOLD, marginTop: 1, textShadow: `0 0 6px ${BG}`}}>{room.dims}</div>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SpecPanel: React.FC<{villa: VillaType; frame: number}> = ({villa, frame}) => {
  const rows: [string, string][] = [];
  if (villa.builtUpArea) rows.push([SPEC_LABELS.builtUpArea, villa.builtUpArea]);
  if (villa.plotArea) rows.push([SPEC_LABELS.plotArea, villa.plotArea]);
  if (villa.bedrooms != null) rows.push([SPEC_LABELS.bedrooms, String(villa.bedrooms)]);
  if (villa.bathrooms != null) rows.push([SPEC_LABELS.bathrooms, String(villa.bathrooms)]);
  const outdoor = villa.outdoor ?? [];
  const appear = (i: number) => interpolate(frame, [s(3.2) + i * s(0.45), s(3.2) + i * s(0.45) + s(0.7)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return (
    <div style={{position: 'absolute', left: 110, top: 200, width: 460, fontFamily: FONT, direction: 'rtl', color: '#fff'}}>
      <div style={{opacity: appear(0), fontSize: 24, fontWeight: 300, color: GOLD}}>{SPEC_LABELS.villaType}</div>
      <div style={{opacity: appear(0), fontSize: 60, fontWeight: 200, marginTop: 4}}>{villa.name}</div>
      <div style={{height: 1, background: 'rgba(255,255,255,0.25)', margin: '28px 0', transformOrigin: 'right', transform: `scaleX(${appear(1)})`}} />
      {rows.map(([k, v], i) => (
        <div key={k} style={{opacity: appear(i + 1), display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
          <span style={{fontSize: 24, fontWeight: 300, color: 'rgba(255,255,255,0.72)'}}>{k}</span>
          <span style={{fontSize: 30, fontWeight: 300}}>{v}</span>
        </div>
      ))}
      {outdoor.length > 0 && (
        <div style={{opacity: appear(rows.length + 1), marginTop: 26}}>
          <div style={{fontSize: 22, fontWeight: 300, color: GOLD}}>{SPEC_LABELS.outdoor}</div>
          {outdoor.map((o) => (
            <div key={o} style={{fontSize: 24, fontWeight: 300, marginTop: 8, color: 'rgba(255,255,255,0.85)'}}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FloorPlanReveal: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame() - shot.overlap; // 0 at the cut
  const villa = shot.villa;
  const top = ASSETS[`6B-top@${villa?.id}`];
  const intro = s(1.5);
  // The overhead render holds, then sinks back as the linework takes over.
  const renderOpacity = interpolate(frame, [intro, intro + s(2.2)], [1, 0.12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const bgIn = interpolate(frame, [intro, intro + s(2.2)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  if (!villa || villa.floors.length === 0) {
    return (
      <AbsoluteFill style={{background: BG, justifyContent: 'center', alignItems: 'center', fontFamily: UI_FONT, color: 'rgba(255,255,255,0.85)'}}>
        <div style={{width: 1100, textAlign: 'center'}}>
          <div style={{fontSize: 22, letterSpacing: '0.4em', color: GOLD}}>S6 · SHOT 6B · FLOOR-PLAN REVEAL</div>
          <div style={{fontSize: 44, fontWeight: 300, marginTop: 18}}>Awaiting the villa’s floor plan</div>
          <div style={{fontSize: 24, fontWeight: 300, lineHeight: 1.6, marginTop: 22, color: 'rgba(255,255,255,0.65)'}}>
            Plan drawings (black lines on white) · room names and dimensions as printed · built-up area · plot size · bedroom and bathroom count · outdoor / landscaping items · overhead cutaway render matched to the plan
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const floors = villa.floors;
  const segment = Math.floor((shot.duration - intro) / floors.length);
  const firstBox = fit(floors[0].planAspect);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{background: BG, opacity: bgIn}} />
      {top && top.kind === 'image' && (
        <div style={{position: 'absolute', ...firstBox, opacity: renderOpacity}}>
          <Img src={staticFile(top.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      )}
      {floors.map((floor, i) => {
        const start = intro + i * segment;
        const local = frame - start;
        const last = i === floors.length - 1;
        if (local < 0 || (!last && local > segment)) return null;
        return <FloorLayer key={floor.name} floor={floor} local={local} segment={segment} fadeOut={!last} showTitle={floors.length > 1} />;
      })}
      <SpecPanel villa={villa} frame={frame - intro} />
    </AbsoluteFill>
  );
};
