"use client";
import { motion } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";
const query="(prefers-reduced-motion: reduce)";
const subscribe=(cb:()=>void)=>{const media=window.matchMedia(query);media.addEventListener("change",cb);return()=>media.removeEventListener("change",cb)};
export function Reveal({children,className="",delay=0}:{children:ReactNode;className?:string;delay?:number}){const reduce=useSyncExternalStore(subscribe,()=>window.matchMedia(query).matches,()=>false);return <motion.div className={className} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:reduce?0:.62,delay:reduce?0:delay,ease:[.22,1,.36,1]}}>{children}</motion.div>}
