import type { Metadata } from "next";
import { MemoryLesson } from "@/components/lesson/runtime-lessons";
export const metadata:Metadata={title:"Memory & Performance Awareness",description:"Connect allocation, retention, layout, locality, cache behavior, and profiling evidence."};
export default function Page(){return <MemoryLesson/>}
