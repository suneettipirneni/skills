import React, {useState} from 'react';
import {SectionTitle, Segments} from './system';
import './usage-chart.css';

const formatUsage = value => Number(value).toLocaleString(undefined, {maximumFractionDigits: 2});
const formatCost = value => `$${Number(value).toFixed(2)}`;

export function UsageChart({bins, period}) {
  const [unit, setUnit] = useState('kWh');
  const [index, setIndex] = useState(null);
  const isCost = unit === '$';
  const value = bin => isCost ? bin.cost : bin.kwh;
  const maximum = Math.max(...bins.map(value));
  const highestIndex = bins.findIndex(bin => value(bin) === maximum);
  const selectedIndex = index ?? highestIndex;
  const selected = bins[selectedIndex];
  const magnitude = 10 ** Math.floor(Math.log10(maximum || 1));
  const ceiling = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(step => step * magnitude >= maximum) * magnitude;
  const format = isCost ? formatCost : formatUsage;
  const tickIndexes = period === 'Day' ? [0, 12, 24, 36] :
    [...new Set([0, Math.round((bins.length - 1) / 3), Math.round((bins.length - 1) * 2 / 3), bins.length - 1])];
  const changeIndex = event => {
    let next = selectedIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next++;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next--;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = bins.length - 1;
    else return;
    event.preventDefault();
    setIndex(Math.max(0, Math.min(bins.length - 1, next)));
  };
  return <section className="usage-card" aria-labelledby="usage-title">
    <div className="usage-heading">
      <SectionTitle id="usage-title">Consumption profile</SectionTitle>
      <Segments label="Chart unit" options={['kWh', '$']} value={unit} onChange={setUnit}/>
    </div>
    <div className="usage-summary">
      <div><div className="usage-value">{format(value(selected))}<span>{isCost ? '' : ' kWh'}</span></div><div className="usage-interval">{selectedIndex === highestIndex && maximum > 0 && (period === 'Day' ? 'Highest interval · ' : 'Highest day · ')}{selected.label}</div></div>
      {period === 'Day' && <div className="usage-legend"><span/>Peak tariff</div>}
    </div>
    <div className="usage-plot-row">
      <div className="usage-axis" aria-hidden="true"><span>{format(ceiling)}</span><span>{format(ceiling / 2)}</span><span>{format(0)}</span></div>
      <div className="usage-plot-area">
        <div className="usage-plot" role="slider" tabIndex={0} aria-label="Inspect consumption interval" aria-valuemin={1} aria-valuemax={bins.length} aria-valuenow={selectedIndex + 1} aria-valuetext={`${selected.label}: ${format(value(selected))}${isCost ? '' : ' kWh'}`} onKeyDown={changeIndex}>
          <div className="usage-grid" aria-hidden="true"><i/><i/><i/></div>
          <div className="usage-bars" aria-hidden="true">{bins.map((bin, i) => <div className="usage-bar-slot" key={i} onPointerEnter={event => {if (event.pointerType !== 'touch') setIndex(i)}} onPointerDown={() => setIndex(i)}><div className={'usage-bar' + (period === 'Day' && bin.peak ? ' is-peak' : '') + (i === selectedIndex ? ' is-selected' : '')} style={{height: `${value(bin) / ceiling * 100}%`}}/></div>)}</div>
        </div>
        <div className="usage-ticks" aria-hidden="true">{tickIndexes.map(i => <span key={i} data-edge={i === 0 ? 'first' : i === bins.length - 1 ? 'last' : undefined} style={{left: ((i + .5) / bins.length * 100) + '%'}}>{bins[i].shortLabel}</span>)}</div>
      </div>
    </div>
  </section>;
}
