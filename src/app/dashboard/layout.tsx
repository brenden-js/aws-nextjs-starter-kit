import {UserButton} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {headers} from "next/headers";
import {SideNavigation} from "./components/side-navigation";
import MobileSidebar from "./components/sidebar";
import {TRPCReactProvider} from "@/trpc/react";
import {PromptsProvider} from "@/app/dashboard/contexts/prompts";


export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <TRPCReactProvider headers={headers()}>
            <PromptsProvider>

                    <div className="flex min-h-[100vh]">
                        <div className="hidden lg:flex lg:flex-shrink-0">
                            <div className="flex w-52 flex-col">
                                <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200">
                                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                                        <div className="flex flex-shrink-0 items-center px-4">
                                            <Link href={'/'}>
                                                <Image src={'/logo.png'} alt={'listing lab logo'} height={42}
                                                       width={42}/>
                                            </Link>

                                        </div>
                                        <SideNavigation />
                                    </div>
                                    <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                                        <div className="flex items-center">
                                            <div className="flex flex-col">
                                                <div className="mb-4 h-8 inline-block">
                                                    <UserButton showName={true} userProfileMode={"navigation"}
                                                                userProfileUrl={"/dashboard/profile"}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                            <MobileSidebar/>
                            <div className="relative z-0 flex flex-1 overflow-hidden">
                                <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
                                    {children}
                                </main>
                            </div>
                        </div>
                    </div>
            </PromptsProvider>
        </TRPCReactProvider>
    )
}