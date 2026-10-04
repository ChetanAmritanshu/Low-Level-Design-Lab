import type { Metadata } from "next";
import { ConcurrencyLesson } from "@/components/lesson/runtime-lessons";
export const metadata:Metadata={title:"Concurrency Fundamentals",description:"Reason about interleavings, races, atomicity, scheduling, visibility, and shared-state design."};
export default function Page(){return <ConcurrencyLesson/>}
