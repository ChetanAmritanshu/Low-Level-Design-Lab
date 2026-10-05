import type {Metadata} from "next";import {DistributedCacheLesson} from "@/components/lesson/advanced-system-lessons";
export const metadata:Metadata={title:"Distributed Cache",description:"Design LRU nodes, TTL, consistent routing, and explicit failure semantics."};export default function Page(){return <DistributedCacheLesson/>}
