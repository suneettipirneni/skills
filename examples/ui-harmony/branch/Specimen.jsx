import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Download} from 'lucide-react';
import {Brand, Action, Segments} from './system';
import {UsageChart} from './UsageChart';
import {LAST, bounds, buckets, ratesDefault, readings} from './data';

function Sheet() {
  const [period, setPeriod] = useState('Day');
  const {start, end} = bounds(LAST, period);
  const bins = buckets(readings(start, end), period, ratesDefault);
  return <main style={{padding:18, maxWidth:580, background:'var(--paper)'}}>
    <Brand/>
    <div style={{margin:'14px 0', borderTop:'1px solid var(--line)'}}/>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <h1 className="page-title">Electricity overview</h1>
      <Action icon={Download}>Export CSV</Action>
    </div>
    <div style={{paddingBlock:12}}>
      <Segments label="Time period" options={['Day','Week','Month']} value={period} onChange={setPeriod}/>
    </div>
    <UsageChart key={period} period={period} bins={bins}/>
  </main>;
}
createRoot(document.getElementById('root')).render(<Sheet/>);
