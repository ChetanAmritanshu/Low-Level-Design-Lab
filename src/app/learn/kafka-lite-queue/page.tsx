import type {Metadata} from "next";import {KafkaLiteLesson} from "@/components/lesson/advanced-system-lessons";
export const metadata:Metadata={title:"Kafka-lite Queue",description:"Build an in-memory partitioned log with offsets and consumer groups."};export default function Page(){return <KafkaLiteLesson/>}
