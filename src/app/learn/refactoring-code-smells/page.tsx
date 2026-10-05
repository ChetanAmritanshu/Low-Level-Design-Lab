import type {Metadata} from "next";import {RefactoringLesson} from "@/components/lesson/mastery-lessons";
export const metadata:Metadata={title:"Refactoring & Code Smells",description:"Improve working legacy systems safely through characterization and small refactors."};export default function Page(){return <RefactoringLesson/>}
