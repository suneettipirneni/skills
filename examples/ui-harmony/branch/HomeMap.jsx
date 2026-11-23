import React, {useEffect, useRef} from 'react';
import {devices} from './data.js';
import {SectionTitle} from './system.jsx';
import './home-map.css';

const points = {
  kitchen: [183, 42], laundry: [257, 75], water: [245, 92],
  lighting: [128, 65], heating: [195, 101], other: [81, 61],
};

function paint(canvas, selected) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = 350 * dpr; canvas.height = 150 * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, 350, 150);
  // A quiet drafting grid sits behind the house rather than competing with it.
  ctx.strokeStyle = 'rgba(195,220,213,.055)'; ctx.lineWidth = .5;
  for (let x = 0; x < 350; x += 16) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 150); ctx.stroke(); }
  for (let y = 0; y < 150; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(350, y); ctx.stroke(); }
  const p = (x,y) => [175 + .78*x - .78*y, 12 + .38*x + .38*y];
  function poly(coords, fill, stroke, width = 1) {
    ctx.beginPath(); coords.forEach(([x,y], i) => { const [a,b] = p(x,y); i ? ctx.lineTo(a,b) : ctx.moveTo(a,b); }); ctx.closePath();
    if (fill) {ctx.fillStyle = fill; ctx.fill();} if (stroke) {ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke();}
  }
  function line(coords, color = '#789a96', width = 1) {
    ctx.beginPath(); coords.forEach(([x,y],i) => {const [a,b] = p(x,y); i ? ctx.lineTo(a,b) : ctx.moveTo(a,b);}); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  }
  // The floor has four real rooms, with slightly different slate finishes.
  poly([[0,0],[180,0],[180,130],[0,130]], '#223b3b', '#89a7a1', 2);
  poly([[0,0],[90,0],[90,65],[0,65]], '#355452', '#6d8c87');
  poly([[90,0],[180,0],[180,65],[90,65]], '#304d4b', '#6d8c87');
  poly([[0,65],[90,65],[90,130],[0,130]], '#2a4645', '#6d8c87');
  poly([[90,65],[180,65],[180,130],[90,130]], '#304b49', '#6d8c87');
  // Room walls, with breaks for doorways.
  line([[90,0],[90,23]], '#9db6af', 2.8); line([[90,42],[90,86]], '#9db6af', 2.8); line([[90,106],[90,130]], '#9db6af', 2.8);
  line([[0,65],[30,65]], '#9db6af', 2.8); line([[48,65],[128,65]], '#9db6af', 2.8); line([[147,65],[180,65]], '#9db6af', 2.8);
  // Kitchen counters and sink.
  poly([[5,5],[75,5],[75,16],[5,16]], '#91a9a1', '#b8cac1');
  poly([[8,7],[26,7],[26,14],[8,14]], '#405f5c', '#d0ded5', .7);
  poly([[5,17],[17,17],[17,48],[5,48]], '#77948d', '#b8cac1');
  // Washer, dryer and water tank.
  poly([[104,6],[130,6],[130,27],[104,27]], '#9eb4ab', '#ccdad2');
  poly([[137,6],[163,6],[163,27],[137,27]], '#849f98', '#c4d4cb');
  poly([[147,36],[170,36],[170,57],[147,57]], '#7d9a94', '#c7d8ce');
  line([[150,42],[167,42]], '#d5e0d8'); line([[150,51],[167,51]], '#d5e0d8');
  // Living area sofa and rug, utility furnace in the final room.
  poly([[12,82],[60,82],[60,115],[12,115]], '#365752', '#6e9088');
  poly([[17,87],[52,87],[52,99],[17,99]], '#8ca9a0', '#bad0c5');
  poly([[18,99],[27,99],[27,108],[18,108]], '#8ca9a0', '#bad0c5');
  poly([[130,83],[163,83],[163,112],[130,112]], '#77948e', '#c0d1c7');
  line([[136,90],[157,90]], '#d0ddd4'); line([[136,96],[157,96]], '#d0ddd4');
  // Exterior wall thickness makes the cutaway legible at small sizes.
  const front = [p(0,130),p(180,130),p(180,0)];
  ctx.beginPath(); ctx.moveTo(...front[0]); ctx.lineTo(...front[1]); ctx.lineTo(...front[2]); ctx.lineTo(front[2][0],front[2][1]+6); ctx.lineTo(front[1][0],front[1][1]+6); ctx.lineTo(front[0][0],front[0][1]+6); ctx.closePath(); ctx.fillStyle='#152f30'; ctx.fill(); ctx.strokeStyle='#668780'; ctx.lineWidth=1; ctx.stroke();
  // A subtle guide traces the selected circuit to its room.
  const [x,y] = points[selected] || points.heating;
  ctx.beginPath(); ctx.arc(x,y,12,0,Math.PI*2); ctx.strokeStyle='rgba(184,233,202,.28)'; ctx.lineWidth=1; ctx.stroke();
}

export function HomeMap({selected, onSelect, value, share}) {
  const canvas = useRef(null);
  useEffect(() => { if (canvas.current) paint(canvas.current, selected); }, [selected]);
  const active = devices.find(device => device.id === selected) || devices[0];
  return <section className="home-map" aria-labelledby="home-map-title">
    <div className="home-map-head"><SectionTitle id="home-map-title">Home circuits</SectionTitle><label className="home-map-select-label"><span className="home-map-sr-only">Select circuit</span><select value={selected} onChange={event => onSelect(event.target.value)}>{devices.map(device => <option key={device.id} value={device.id}>{device.name}</option>)}</select></label></div>
    <div className="home-map-stage">
      <canvas ref={canvas} aria-hidden="true" />
      {devices.filter(device => points[device.id]).map(device => <button key={device.id} type="button" className={'home-map-pin' + (device.id === selected ? ' is-selected' : '')} style={{left: `${points[device.id][0] / 3.5}%`, top: `${points[device.id][1] / 1.5}%`}} onClick={() => onSelect(device.id)} aria-label={device.name} aria-pressed={device.id === selected} title={device.name}><span /></button>)}
    </div>
    <div className="home-map-bottom">
      <div className="home-map-current"><span className="home-map-eyebrow">SELECTED CIRCUIT</span><strong>{active?.name}</strong><span>{active?.location}</span></div>
      <div className="home-map-reading"><strong>{Number(value || 0).toLocaleString(undefined, {maximumFractionDigits: 1})} <small>kWh</small></strong><span>{Math.round(Number(share || 0))}% of usage</span></div>
    </div>
  </section>;
}
