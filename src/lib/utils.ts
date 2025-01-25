import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  console.log('Public url:', process.env.NEXT_PUBLIC_APP_URL)
  return `${process.env.NEXT_PUBLIC_APP_URL!}${path}`
}
