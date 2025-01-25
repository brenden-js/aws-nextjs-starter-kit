import {Header} from "@/app/(marketing)/components/header";
import {Footer} from "@/app/(marketing)/components/footer";

export default function MarketingLayout({children}: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}