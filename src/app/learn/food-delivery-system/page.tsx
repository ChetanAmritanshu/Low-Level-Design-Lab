import type {Metadata} from "next";import {FoodDeliveryLesson} from "@/components/lesson/advanced-system-lessons";
export const metadata:Metadata={title:"Food Delivery System",description:"Design order snapshots, multi-actor state, pricing, and delivery assignment."};export default function Page(){return <FoodDeliveryLesson/>}
