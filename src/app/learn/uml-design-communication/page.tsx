import type { Metadata } from "next";
import { UmlLesson } from "@/components/lesson/runtime-lessons";
export const metadata:Metadata={title:"UML & Design Communication",description:"Use focused class, sequence, state, activity, and component views to communicate design intent."};
export default function Page(){return <UmlLesson/>}
