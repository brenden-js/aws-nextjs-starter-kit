"use client"
import Image, {type StaticImageData} from 'next/image'
import Link from 'next/link'
import {Fragment, type ReactNode} from 'react'
import {Popover, Transition} from '@headlessui/react'
import clsx from 'clsx'
import {Button} from "@/components/ui/button"
import {Github, Twitter, Linkedin, Code2, Rocket, Shield, Zap, Database, Cloud, Sparkles, Scale, BookOpen, Puzzle, Workflow} from 'lucide-react'
import { motion } from 'framer-motion'

// Import all logos
import logoAWS from '@/images/logos/aws.svg'
import logoNext from '@/images/logos/next.svg'
import logoTurso from '@/images/logos/turso.svg'
import logoStripe from '@/images/logos/stripe.svg'
import logoClerk from '@/images/logos/clerk.svg'
import logoTRPC from '@/images/logos/trpc.svg'
import logoSST from '@/images/logos/sst.svg'
import logoInngest from '@/images/logos/inngest.png'

interface Company {
    name: string;
    logo: StaticImageData;
}

const companies = [
    [
        {name: 'AWS', logo: logoAWS as StaticImageData},
        {name: 'Next.js', logo: logoNext as StaticImageData},
        {name: 'SST', logo: logoSST as StaticImageData},
        {name: 'Turso', logo: logoTurso as StaticImageData},
    ] as Company[],
    [
        {name: 'Stripe', logo: logoStripe as StaticImageData},
        {name: 'Clerk', logo: logoClerk as StaticImageData},
        {name: 'tRPC', logo: logoTRPC as StaticImageData},
        {name: 'Inngest', logo: logoInngest as StaticImageData},
    ] as Company[],
]

function MobileNavLink({href, children}: { href: string, children: ReactNode }) {
    return (
        <Popover.Button as={Link} href={href} className="block w-full p-2 text-gray-300 hover:text-white transition-colors">
            {children}
        </Popover.Button>
    )
}

function MobileNavIcon({open}: { open: boolean }) {
    return (
        <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 overflow-visible stroke-gray-300"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
        >
            <path
                d="M0 1H14M0 7H14M0 13H14"
                className={clsx(
                    'origin-center transition',
                    open && 'scale-90 opacity-0'
                )}
            />
            <path
                d="M2 2L12 12M12 2L2 12"
                className={clsx(
                    'origin-center transition',
                    !open && 'scale-90 opacity-0'
                )}
            />
        </svg>
    )
}

function MobileNavigation() {
    return (
        <Popover>
            <Popover.Button
                className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
                aria-label="Toggle Navigation"
            >
                {({open}) => <MobileNavIcon open={open} />}
            </Popover.Button>
            <Transition.Root>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Popover.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-100 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel
                        as="div"
                        className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-slate-900/80 backdrop-blur-lg p-4 text-lg tracking-tight shadow-xl ring-1 ring-white/10"
                    >
                        <MobileNavLink href="#features">Features</MobileNavLink>
                        <hr className="m-2 border-white/10" />
                        <MobileNavLink href="https://github.com/yourusername/aws-nextjs-starter-kit">
                            GitHub
                        </MobileNavLink>
                    </Popover.Panel>
                </Transition.Child>
            </Transition.Root>
        </Popover>
    )
}

function Hero() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-40 pb-24">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-purple-500/5 to-transparent" />
            
            {/* Floating shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center animate-fade-in">
                    <span className="font-mono text-xl text-indigo-400 uppercase tracking-widest">
                        AWS Next.js Starter Kit
                    </span>
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                        Production-ready stack
                        <span className="block text-indigo-400">for modern web apps</span>
                    </h1>

                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
                        A complete starter template with authentication, payments, background jobs, and type-safe APIs.
                        Built with Next.js, AWS, and modern development practices.
                    </p>

                    <div className="mt-10 flex justify-center gap-4">
                        <Link href="https://github.com/brenden-js/aws-nextjs-starter-kit">
                            <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/10">
                                Clone Repository
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-24 relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-slate-900 px-4 text-base font-semibold text-gray-400">
                                Built with industry-leading technologies
                            </span>
                        </div>
                    </div>

                    <div className="mt-12">
                        <div className="flex flex-col gap-12">
                            {companies.map((group, groupIndex) => (
                                <div
                                    key={groupIndex}
                                    className="flex justify-center items-center"
                                >
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 md:gap-16 w-full max-w-4xl">
                                        {group.map((company) => (
                                            <div
                                                key={company.name}
                                                className="group flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110"
                                            >
                                                <div className="relative overflow-hidden rounded-2xl bg-white/[0.07] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[6px] border border-white/[0.18] transition-all duration-300 hover:bg-white/[0.1] hover:shadow-indigo-500/25">
                                                    {/* Gradient overlay */}
                                                    <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                                                    
                                                    {/* Logo container */}
                                                    <div className="relative flex h-24 w-56 items-center justify-center p-6">
                                                        <div className="relative h-full w-full">
                                                            <Image
                                                                src={company.logo}
                                                                alt={company.name}
                                                                className="object-contain brightness-150 contrast-150 transition-all duration-300 group-hover:brightness-125 group-hover:contrast-125"
                                                                fill
                                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                                style={{ 
                                                                    maxWidth: company.name === 'Clerk' ? '75%' : '100%', 
                                                                    maxHeight: company.name === 'Clerk' ? '75%' : '100%', 
                                                                    margin: 'auto' 
                                                                }}
                                                                unoptimized
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-sm text-gray-400 transition-colors duration-300 group-hover:text-white">
                                                    {company.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    }
}

const primaryFeatures = [
    {
        title: 'Full-Stack Type Safety',
        description:
            "End-to-end type safety from your database to your UI with TypeScript, tRPC, and Drizzle ORM. Catch errors at compile time.",
        icon: Code2,
        secondaryIcon: Shield,
    },
    {
        title: 'AWS + Next.js',
        description:
            'Deploy to AWS with zero configuration using SST. Leverage the power of Next.js App Router with serverless infrastructure.',
        icon: Cloud,
        secondaryIcon: Rocket,
    },
    {
        title: "Modern Auth & Payments",
        description:
            "Built-in authentication with Clerk and payment processing with Stripe. Start monetizing your app from day one.",
        icon: Shield,
        secondaryIcon: Sparkles,
    },
    {
        title: 'Background Jobs & Data',
        description:
            "Process background tasks with Inngest and store data with Turso's edge database. Built for modern web applications.",
        icon: Database,
        secondaryIcon: Zap,
    }
]

const secondaryFeatures = [
    {
        name: 'Example Implementation',
        summary: 'Learn from a real-world app',
        description:
            'Includes a complete example app showcasing authentication, payments, background jobs, and database patterns. Use it as a reference or starting point.',
        icon: BookOpen,
    },
    {
        name: 'Integration Patterns',
        summary: 'Best practices for service integration',
        description:
            'See how to integrate Clerk auth, Stripe payments, Inngest jobs, and Turso database with proper error handling and type safety.',
        icon: Puzzle,
    },
    {
        name: 'Developer Experience',
        summary: 'Optimized for productivity',
        description:
            'Type-safe APIs, hot reloading, local development with live Lambda, and comprehensive documentation to help you build faster.',
        icon: Workflow,
    },
]

function PrimaryFeatures() {
    return (
        <section
            id="features"
            aria-label="Primary features"
            className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-24 sm:py-32"
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-purple-500/5 to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto max-w-2xl lg:text-center"
                >
                    <h2 className="text-base font-semibold leading-7 text-indigo-400">Production Ready</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Everything you need to build modern apps
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Start with a fully configured development environment and production-ready infrastructure.
                        Focus on building your product, not setting up tooling.
                    </p>
                </motion.div>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
                >
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                        {primaryFeatures.map((feature) => (
                            <motion.div
                                key={feature.title}
                                variants={itemVariants}
                                className="group relative"
                            >
                                {/* Glassmorphism card */}
                                <div className="relative overflow-hidden rounded-2xl bg-white/[0.07] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[6px] border border-white/[0.18] transition-all duration-300 hover:bg-white/[0.1] hover:shadow-indigo-500/25">
                                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    
                                    {/* Content */}
                                    <div className="relative">
                                        <div className="mb-4 flex items-center gap-4">
                                            <div className="rounded-xl bg-indigo-600/20 p-2.5">
                                                <feature.icon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                                            </div>
                                            <div className="rounded-xl bg-gray-800/50 p-2">
                                                <feature.secondaryIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                        </div>
                                        <dt className="text-xl font-semibold leading-7 text-white">{feature.title}</dt>
                                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                                            <p className="flex-auto">{feature.description}</p>
                                        </dd>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </dl>
                </motion.div>
            </div>
        </section>
    )
}

function SecondaryFeatures() {
    return (
        <section
            id="secondary-features"
            aria-label="Features for building modern applications"
            className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 py-24 sm:py-32"
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-purple-500/5 to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-base font-semibold leading-7 text-indigo-400">Learn by Example</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Complete example application
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Includes a complete example application showcasing integration patterns and best practices.
                            Use it as a reference or starting point for your own projects.
                        </p>
                    </motion.div>
                </div>

                <div className="mx-auto mt-16 max-w-5xl">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {secondaryFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-white/[0.07] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[6px] border border-white/[0.18] transition-all duration-300 hover:bg-white/[0.1] hover:shadow-indigo-500/25">
                                    <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                                    
                                    <div className="relative">
                                        {/* Icon */}
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 backdrop-blur-sm">
                                            <feature.icon className="h-6 w-6 text-indigo-400" />
                                        </div>

                                        {/* Content */}
                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold leading-8 tracking-tight text-white">
                                                {feature.name}
                                            </h3>
                                            <p className="mt-2 text-base text-gray-300">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default function MarketingPage() {
    return (
        <>
            <main>
                <Hero />
                <PrimaryFeatures />
                <SecondaryFeatures />
            </main>
        </>
    )
}
