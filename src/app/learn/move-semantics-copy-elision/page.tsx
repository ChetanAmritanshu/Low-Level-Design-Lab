import type { Metadata } from "next";import { MoveLesson } from "@/components/lesson/advanced-runtime-lessons";
export const metadata:Metadata={title:"Move Semantics & Copy Elision",description:"Distinguish copying, ownership transfer, moved-from contracts, and direct construction."};export default function Page(){return <MoveLesson/>}
