"use client";
import { useState } from "react";
import { ArrowRight, Rotate } from "@/components/ui/icons";

const signals=["NESTING DEPTH","BRANCH COUNT","VARIABLE MEANING","RESPONSIBILITY MIX","MAGIC VALUES","SIDE EFFECTS"] as const;
const levels=[[4,7,1,5,4,4],[2,4,3,4,2,3],[1,3,5,2,0,1]] as const;
export function CognitiveLoadLab(){const[step,setStep]=useState(0);return <div className="maintain-lab lab-panel"><div className="lab-toolbar"><div><span className={step===2?"live-dot":"alert-dot"}/> COGNITIVE LOAD SIGNALS</div><span>PASS {step+1} / 3</span></div><div className="signal-meter">{signals.map((name,i)=><div key={name}><span>{name}</span><i><b style={{width:`${levels[step][i]*14}%`}}/></i><strong>{levels[step][i]}</strong></div>)}</div><div className={`lab-feedback ${step===2?"success":"error"}`} aria-live="polite"><b>{["WORKING, BUT EXPENSIVE TO SIMULATE","INTENT EMERGING","LOWER MENTAL STACK"][step]}</b><p>{["Six signals compete for attention. These heuristics start a conversation; they are not a universal quality score.","Names and guard clauses reduce decoding, but pricing, payment, and logging still change together.","Domain operations and explicit effects let a reviewer follow the happy path and inspect each policy separately."][step]}</p></div><button className="lab-button cycle-button" type="button" onClick={()=>setStep((step+1)%3)}>{step===2?<Rotate/>:<ArrowRight/>}{step===2?"RESTORE MESS":"APPLY NEXT REFACTOR"}</button></div>}

const refactors=[
 ["ORIGINAL","process(o,u,x,p,f)","nested validation · status == 7 · hidden logging"],
 ["RENAME","checkout(order, customer, coupon, payment, notify)","intent appears; structure still fights the reader"],
 ["GUARDS","validate(order); requireActive(customer)","failure paths leave early; happy path is visible"],
 ["CONCEPTS","pricing.price(order, coupon)","magic constants move into domain policy"],
 ["EFFECTS","payments.charge(total); events.publish(...) ","payment and notification effects are explicit"],
] as const;
export function StepRefactorLab(){const[step,setStep]=useState(0);const item=refactors[step];return <div className="maintain-lab lab-panel"><div className="lab-toolbar"><div><span className={step===4?"live-dot":"alert-dot"}/> STEP-BY-STEP REFACTOR</div><span>{step+1} / {refactors.length}</span></div><div className="refactor-diff" aria-live="polite"><small>{item[0]}</small><code>{item[1]}</code><p>{item[2]}</p>{step>0?<div><del>{refactors[step-1][1]}</del><ins>{item[1]}</ins></div>:null}</div><div className="lab-actions"><button className="lab-button" type="button" onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0}>PREVIOUS</button><button className="lab-button" type="button" onClick={()=>setStep(step===4?0:step+1)}>{step===4?"RESET":"NEXT CHANGE"} <ArrowRight/></button></div></div>}

const smells=[
 ["Long parameter list","unclear boundary","command or value object"],
 ["God object","mixed responsibility","cohesive collaborators"],
 ["Type checks","weak polymorphic boundary","review abstraction and substitution"],
 ["Unsupported methods","broad interface","segregate capabilities"],
 ["Deep navigation","excessive object knowledge","move behavior or expose intent"],
] as const;
export function CodeSmellMap(){const[selected,setSelected]=useState(0);const item=smells[selected];return <div className="maintain-lab lab-panel"><div className="lab-toolbar"><div><span className="live-dot"/> CODE SMELL MAP</div><span>SIGNAL, NOT VERDICT</span></div><div className="smell-map"><div>{smells.map(([smell],i)=><button type="button" aria-pressed={selected===i} onClick={()=>setSelected(i)} key={smell}>{smell}</button>)}</div><section aria-live="polite"><span>SMELL</span><b>{item[0]}</b><i>→</i><span>LIKELY PRESSURE</span><b>{item[1]}</b><i>→</i><span>POSSIBLE REFACTOR</span><b>{item[2]}</b></section></div><p className="lab-caption">A smell is evidence to investigate. Context can justify the design, and the named refactor may be wrong for your constraints.</p></div>}

const modules=["Delivery","Pricing","Drivers","Restaurant","Payment","Notify","Analytics","SQLRow"];
export function DependencyRefactorLab(){const[step,setStep]=useState(0);const labels=["GOD SERVICE","BOUNDARIES","DOMAIN PORTS","OWNED DATA"];return <div className="maintain-lab lab-panel"><div className="lab-toolbar"><div><span className={step===3?"live-dot":"alert-dot"}/> DEPENDENCY / REFACTOR LAB</div><span>{labels[step]}</span></div><div className={`dependency-refactor step-${step}`}>{modules.map((m,i)=><div key={m} className={i>step+4?"dim":""}><small>{step===0?"FoodDeliveryService":i===7?"INFRASTRUCTURE":m.toUpperCase()}</small><b>{m}</b></div>)}</div><div className={`lab-feedback ${step===3?"success":"error"}`} aria-live="polite"><b>{["SEVEN POLICIES + LEAKY ROW","COHESIVE COLLABORATORS","SQL DETAIL TRANSLATED AT PORT","MUTATION HAS ONE OWNER"][step]}</b><p>{["One local-looking service carries a system-wide change blast radius.","Pricing, assignment, payment, and effects have named responsibilities.","Business policy receives Order and Money—not a database row.","Immutable snapshots cross boundaries; the aggregate controls legal mutation."][step]}</p></div><button className="lab-button cycle-button" type="button" onClick={()=>setStep((step+1)%4)}>{step===3?<Rotate/>:<ArrowRight/>}{step===3?"RESTORE GOD SERVICE":"APPLY SAFE REFACTOR"}</button></div>}

const failures=[
 ["Seat already booked","DOMAIN","non-retryable","return SeatAlreadyReserved"],
 ["Payment timeout","INFRASTRUCTURE","retryable with idempotency","preserve timeout cause"],
 ["Invalid coupon","VALIDATION","non-retryable","return InvalidCoupon"],
 ["Request cancelled","CANCELLATION","do not retry","propagate cancellation"],
 ["Broken invariant","PROGRAMMER BUG","non-retryable","fail fast and contain at boundary"],
] as const;
export function ErrorClassificationLab(){const[selected,setSelected]=useState(0);const item=failures[selected];return <div className="maintain-lab lab-panel"><div className="lab-toolbar"><div><span className="live-dot"/> ERROR CLASSIFICATION</div><span>CHOOSE A FAILURE</span></div><div className="error-classifier"><div>{failures.map(([name],i)=><button type="button" aria-pressed={selected===i} onClick={()=>setSelected(i)} key={name}>{name}</button>)}</div><section aria-live="polite"><span>KIND</span><b>{item[1]}</b><span>RETRY</span><b>{item[2]}</b><span>CALLER SEMANTICS</span><b>{item[3]}</b></section></div></div>}

const injected=[
 ["Inventory unavailable","translate","retry at bounded owner","abort before payment","log once at request boundary"],
 ["Payment decline","domain result","never retry automatically","release inventory","no error log required"],
 ["Payment timeout","preserve cause","retry only with idempotency","outcome may be unknown","log provider context"],
 ["Database down","propagate","bounded transient retry","do not report success","log at operation boundary"],
] as const;
export function FailureHandlingSimulator(){const[selected,setSelected]=useState(0);const[action,setAction]=useState("propagate");const item=injected[selected];const correct=action===item[1];return <div className="maintain-lab lab-panel"><div className="lab-toolbar"><div><span className={correct?"live-dot":"alert-dot"}/> FAILURE HANDLING SIMULATOR</div><span>CHECKOUT PIPELINE</span></div><div className="failure-pipeline"><b>CHECKOUT</b><i>→</i><b>INVENTORY</b><i>→</i><b>PAYMENT</b><i>→</i><b>PERSISTENCE</b></div><div className="failure-controls">{injected.map(([name],i)=><button type="button" aria-pressed={selected===i} onClick={()=>{setSelected(i);setAction("propagate")}} key={name}>{name}</button>)}</div><div className="handling-options" role="group" aria-label="Handling decision">{["translate","domain result","preserve cause","propagate"].map(x=><button type="button" aria-pressed={action===x} onClick={()=>setAction(x)} key={x}>{x}</button>)}</div><div className={`lab-feedback ${correct?"success":"error"}`} aria-live="polite"><b>{correct?"HANDLING MATCHES THE FAILURE":"RECONSIDER WHO CAN HANDLE THIS"}</b><p>{correct?`${item[1]}; ${item[2]}; ${item[3]}; ${item[4]}.`:"Classify the failure, decide whether this layer can recover, and preserve information the next owner needs."}</p></div></div>}
