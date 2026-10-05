import type {Metadata} from "next";import {ParkingLotLesson} from "@/components/lesson/system-lessons";
export const metadata:Metadata={title:"Parking Lot Machine Coding",description:"Design allocation, pricing, ticket state, and atomic parking flows."};export default function Page(){return <ParkingLotLesson/>}
