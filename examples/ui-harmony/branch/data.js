export const devices=[
 {id:'heating',name:'Heating & cooling',location:'Utility room',color:'#27765f'},
 {id:'water',name:'Water heater',location:'Mechanical closet',color:'#518c80'},
 {id:'kitchen',name:'Kitchen',location:'Kitchen',color:'#bf9250'},
 {id:'laundry',name:'Laundry',location:'Laundry room',color:'#8392b0'},
 {id:'lighting',name:'Lighting',location:'Living room',color:'#919f62'},
 {id:'other',name:'Other circuits',location:'Main panel',color:'#9b91a2'}
];
export const ratesDefault={off:0.15,peak:0.32};
export const FIRST='2026-01-01',LAST='2026-11-22';
const dayMs=864e5;
export const utc=s=>new Date(s+'T00:00:00Z');
export const iso=d=>d.toISOString().slice(0,10);
export const addDays=(s,n)=>iso(new Date(+utc(s)+dayMs*n));
export const formatDate=(s,options={month:'short',day:'numeric'})=>utc(s).toLocaleDateString('en-US',{timeZone:'UTC',...options});
export function intervalStart(date,period){const d=utc(date);return period==='Month'?date.slice(0,7)+'-01':period==='Week'?addDays(date,-((d.getUTCDay()+6)%7)):date}
export function shiftPeriod(date,period,n){const start=intervalStart(date,period);if(period==='Month'){const d=utc(start);d.setUTCMonth(d.getUTCMonth()+n);return iso(d)}return addDays(start,n*(period==='Week'?7:1))}
export function bounds(date,period){const origin=intervalStart(date,period);return {start:origin<FIRST?FIRST:origin,end:[LAST,addDays(shiftPeriod(date,period,1),-1)].sort()[0]}}
export function clock(i){const h=Math.floor(i/2)%24;return (h%12||12)+':'+(i%2?'30':'00')+' '+(h<12?'AM':'PM')}
function bell(x,at,width){return Math.exp(-((x-at)**2)/(2*width*width))}
function generate(date){
 const index=Math.floor(+utc(date)/dayMs),weekday=utc(date).getUTCDay(),weekend=weekday===0||weekday===6;
 const season=.70+.39*Math.cos((utc(date).getUTCMonth()/12)*Math.PI*2);
 const jitter=(s,k)=>{const n=Math.sin(index*17.13+s*45.71+k*12.91)*43758.54;return n-Math.floor(n)};
 return Array.from({length:48},(_,i)=>{const h=i/2,shift=weekend?.8:0;const per=[
 season*(.09+.34*bell(h,6+shift,1.2)+.38*bell(h,19,2.2)+.13*(1+Math.sin(i*2.1+index*.75))*.5),
 .026+.39*bell(h,7+shift,.6)+.36*bell(h,20.3,.65),
 .038+.23*bell(h,7.3+shift,.65)+.19*bell(h,12.5,.7)+.73*bell(h,18.2,.9),
 .012+((weekday===0||weekday===3||weekday===6)?(.46*bell(h,11.5,.42)+.62*bell(h,12.5,.56)):0),
 .011+.065*bell(h,6.5,.85)+.13*bell(h,20.4,2),
 .08+.035*bell(h,19,2.4)];
 const values=Object.fromEntries(devices.map((d,k)=>[d.id,Math.round(per[k]*(.78+.43*jitter(i,k))*1000)/1000]));
 return {date,i,peak:i>=32&&i<42,values,kwh:Object.values(values).reduce((a,b)=>a+b,0)};
 });
}
const cache=new Map();
export function readings(start,end){const data=[];for(let d=start;d<=end;d=addDays(d,1)){if(!cache.has(d))cache.set(d,generate(d));data.push(...cache.get(d))}return data}
export function summarize(rows,rates,device){let kwh=0,cost=0,off=0,max=0,peakRow=null;for(const r of rows){const n=device?r.values[device]:r.kwh;kwh+=n;cost+=n*(r.peak?rates.peak:rates.off);if(!r.peak)off+=n;if(n*2>max){max=n*2;peakRow=r}}return {kwh,cost,off,max,peakRow}}
export function buckets(rows,period,rates,device){if(period==='Day')return rows.map(r=>{const n=device?r.values[device]:r.kwh;return {label:clock(r.i)+' – '+clock(r.i+1),shortLabel:clock(r.i).replace(':00','').replace(' ',''),kwh:n,cost:n*(r.peak?rates.peak:rates.off),peak:r.peak}});
 const grouped=new Map();for(const row of rows){if(!grouped.has(row.date))grouped.set(row.date,[]);grouped.get(row.date).push(row)}
 return [...grouped].map(([date,group])=>({label:formatDate(date,{weekday:'short',month:'short',day:'numeric'}),shortLabel:formatDate(date,period==='Week'?{weekday:'short'}:{day:'numeric'}),...summarize(group,rates,device),peak:false}));
}
export const money=n=>n.toLocaleString('en-US',{style:'currency',currency:'USD'});
export const energy=n=>n.toLocaleString('en-US',{minimumFractionDigits:1,maximumFractionDigits:1});
