import type {Metadata} from "next";import {TradingExchangeLesson} from "@/components/lesson/advanced-system-lessons";
export const metadata:Metadata={title:"Trading Exchange",description:"Build a deterministic price-time-priority matching engine."};export default function Page(){return <TradingExchangeLesson/>}
