import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-blue-500/5 to-purple-500/5" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="text-xl font-bold text-white hover:text-indigo-400 transition-colors">
            AWS Next.js Kit
          </Link>

          <nav className="text-sm" aria-label="quick links">
            <ul className="flex gap-x-8">
              <li><Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
            </ul>
          </nav>

          <div className="flex gap-x-6">
            <Link 
              href="https://github.com/brenden-js/aws-nextjs-starter-kit" 
              aria-label="AWS Next.js Kit on GitHub"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} AWS Next.js Kit. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}