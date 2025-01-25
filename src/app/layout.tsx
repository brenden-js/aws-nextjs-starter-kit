import "@/app/globals.css";

import {ClerkProvider} from "@clerk/nextjs";
import {Toaster} from "@/components/ui/sonner"


export const metadata = {
    title: "Listing Lab",
    description: "Generate real estate content fast",
    icons: [{rel: "icon", url: "/favicon.ico"}],
};

export default function RootLayout({children}: { children: React.ReactNode; }) {
    return (
        <ClerkProvider>
            <html lang="en" className="h-full bg-white">
            <body className={"font-avenir-reg h-full"}>
            <main>{children}</main>
            <Toaster/>
            </body>
            </html>
        </ClerkProvider>
    );
}
