"use client"
import {Fragment, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {UserButton} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  Cross2Icon,
  DotsHorizontalIcon,
  HomeIcon,
  LightningBoltIcon,
  MagicWandIcon,
  PersonIcon
} from "@radix-ui/react-icons";
import PremiumAccountButton from "./premium-account-button";
import {usePathname} from "next/navigation";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function MobileSidebar() {
  const path = usePathname()


  const navigation = [
    {name: 'Subscriptions', href: '/dashboard/subscriptions', icon: LightningBoltIcon, current: path === '/dashboard/subscriptions'},
    {name: 'Listings', href: '/dashboard', icon: HomeIcon, current: path === '/dashboard'},
    {name: 'About', href: '/dashboard/about', icon: PersonIcon, current: path === '/dashboard/about'}
  ]
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <Cross2Icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                  <div className="flex flex-shrink-0 items-center px-4">
                    <Link href={'/'}>
                      <Image src={'/logo.png'} alt={'homeverse logo'} height={42} width={42}/>
                    </Link>
                  </div>
                  <nav aria-label="Sidebar" className="mt-5">
                    <div className="space-y-1 px-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                              'mr-4 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
                <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                  <div className="flex flex-col">
                    <div className="my-1 h-8 inline-block">
                      <UserButton />
                    </div>
                    <PremiumAccountButton />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="md:hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-1.5">
          <div>
            <button
              type="button"
              className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <DotsHorizontalIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}