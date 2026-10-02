import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
const display=Manrope({subsets:["latin"],variable:"--font-display"});
const mono=IBM_Plex_Mono({subsets:["latin"],weight:["400","500","600"],variable:"--font-mono"});
export const metadata:Metadata={title:{default:"Low-Level Design From First Principles",template:"%s · LLD Lab"},description:"An interactive laboratory for learning why maintainable object models and abstractions exist."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en" className={`${display.variable} ${mono.variable}`}><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader/><main id="main-content">{children}</main><SiteFooter/></body></html>}
