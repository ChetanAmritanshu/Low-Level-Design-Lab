import type { Metadata } from "next";import { DispatchLesson } from "@/components/lesson/advanced-runtime-lessons";
export const metadata:Metadata={title:"Virtual Dispatch Internals",description:"Understand C++ runtime polymorphism, virtual destruction, object slicing, and alternatives."};export default function Page(){return <DispatchLesson/>}
