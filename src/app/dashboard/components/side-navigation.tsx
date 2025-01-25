"use client"
import {usePathname} from "next/navigation";
import Link from "next/link";
import {HomeIcon, LightningBoltIcon, MagicWandIcon, PersonIcon} from "@radix-ui/react-icons";
import { motion } from 'framer-motion';

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}




export const SideNavigation = () => {

  const path = usePathname()


  const navigation = [
    {name: 'Subscriptions', href: '/dashboard/subscriptions', icon: LightningBoltIcon, current: path === '/dashboard/subscriptions'},
    {name: 'Listings', href: '/dashboard', icon: HomeIcon, current: path === '/dashboard'},
    {name: 'About', href: '/dashboard/about', icon: PersonIcon, current: path === '/dashboard/about'}
  ]

  return (
    <div className="mt-5 flex-1" aria-label="Sidebar">
      <div className="space-y-1 px-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={classNames(
              item.current
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
            )}
          >
            <item.icon
              className={classNames(
                item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                'mr-3 h-6 w-6'
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}