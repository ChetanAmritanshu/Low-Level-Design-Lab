"use client";
import { useEffect, useState } from "react";
export type Language="cpp"|"go"|"java"|"typescript";
const labels:Record<Language,string>={cpp:"C++",go:"Go",java:"Java",typescript:"TypeScript"};
const order:Language[]=["cpp","go","java","typescript"];
const storageKey="lld-lab:preferred-language";
export function MultiLanguageCode({examples,title="IMPLEMENTATION"}:{examples:Record<Language,string>;title?:string}){const[language,setLanguage]=useState<Language>("cpp");useEffect(()=>{const saved=localStorage.getItem(storageKey);const timer=window.setTimeout(()=>{if(saved&&order.includes(saved as Language))setLanguage(saved as Language)},0);return()=>window.clearTimeout(timer)},[]);function choose(next:Language){setLanguage(next);localStorage.setItem(storageKey,next)}return <div className="code-panel"><div className="code-toolbar"><span>{title}</span><div role="tablist" aria-label="Programming language">{order.map(lang=><button type="button" role="tab" aria-selected={language===lang} aria-controls={`code-${lang}`} id={`tab-${lang}`} onClick={()=>choose(lang)} key={lang}>{labels[lang]}</button>)}</div></div><pre id={`code-${language}`} role="tabpanel" aria-labelledby={`tab-${language}`} tabIndex={0}><code>{examples[language]}</code></pre><div className="code-note">Preference is saved on this device · examples are idiomatic, not line-for-line translations</div></div>}
