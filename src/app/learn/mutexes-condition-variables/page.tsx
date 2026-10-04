import type { Metadata } from "next";
import { MutexLesson } from "@/components/lesson/runtime-lessons";
export const metadata:Metadata={title:"Mutexes & Condition Variables",description:"Protect compound invariants and coordinate bounded producer-consumer queues correctly."};
export default function Page(){return <MutexLesson/>}
