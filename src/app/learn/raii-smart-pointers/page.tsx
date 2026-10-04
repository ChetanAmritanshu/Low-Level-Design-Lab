import type { Metadata } from "next";import { RaiiLesson } from "@/components/lesson/advanced-runtime-lessons";
export const metadata:Metadata={title:"RAII & Smart Pointers",description:"Make C++ ownership, deterministic cleanup, borrowing, and shared lifetime explicit."};export default function Page(){return <RaiiLesson/>}
