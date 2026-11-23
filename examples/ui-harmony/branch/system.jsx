import React from 'react';
import {Button} from '@base-ui/react/button';
import {Cable} from 'lucide-react';
import './system.css';
export function Brand(){return <span className="brand"><span className="brand-sign" aria-hidden="true"><Cable size={19} strokeWidth={2}/></span>Branch</span>}
export function SectionTitle({children,...props}){return <h2 className="section-title" {...props}>{children}</h2>}
export function Action({icon:Icon,label,children,className='',...props}){return <Button type="button" aria-label={label} title={label} className={'action '+className} {...props}>{Icon&&<Icon size={15} aria-hidden="true"/>}{children}</Button>}
export function Segments({label,options,value,onChange}){return <div className="segments" role="group" aria-label={label}>{options.map(option=><Button type="button" key={option} aria-pressed={value===option} onClick={()=>onChange(option)}>{option}</Button>)}</div>}
