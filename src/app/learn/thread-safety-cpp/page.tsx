import type { Metadata } from "next";import { ThreadSafetyLesson } from "@/components/lesson/advanced-runtime-lessons";
export const metadata:Metadata={title:"Thread Safety in C++",description:"Design explicit class-level synchronization, lifetime, callback, and atomicity contracts."};export default function Page(){return <ThreadSafetyLesson/>}
