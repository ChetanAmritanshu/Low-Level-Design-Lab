import type {Metadata} from "next";import {BookMyShowLesson} from "@/components/lesson/system-lessons";
export const metadata:Metadata={title:"BookMyShow Machine Coding",description:"Design show-scoped seat holds, expiry, payment, and atomic booking."};export default function Page(){return <BookMyShowLesson/>}
