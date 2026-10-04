import type { Metadata } from "next";
import { DeadlockLesson } from "@/components/lesson/runtime-lessons";
export const metadata:Metadata={title:"Deadlocks & Locking Strategies",description:"Detect wait cycles, impose lock ordering, and choose deliberate lock granularity."};
export default function Page(){return <DeadlockLesson/>}
