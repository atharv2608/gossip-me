import { theme } from "@/components/theme";
import { LayoutDashboardIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className={`h-screen flex flex-col items-center justify-center ${theme.bgColor}`}>
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <Link href="/sign-up" className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-white bg-gray-800 rounded-full hover:bg-gray-700" role="alert">
            <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">New here?</span> 
            <span className="text-sm font-medium">Signup now!</span> 
            
        </Link>
        <h1 className={`mb-4 text-3xl font-extrabold tracking-tight leading-none text-white md:text-4xl lg:text-5xl bg-gradient-to-r from-[${theme.primary}] via-[${theme.accent}] to-[${theme.secondary}] inline-block text-transparent bg-clip-text`}>People love to say at your back. Let them say</h1>
        <p className="mb-8 text-lg font-normal text-gray-400 lg:text-xl sm:px-16 xl:px-48">Why let whispers go to waste? Give them a platform. Whether it&apos;s a compliment or a little secret, let the gossip flow because who doesn&apos;t love a good behind-the-back chat?</p>
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            
            <Link href="/dashboard" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-gray-700 hover:bg-gray-700 focus:ring-4 focus:ring-gray-800">
                <LayoutDashboardIcon className="mr-3"/>
                Dashboard
            </Link>  
        </div>
    </div>
</section>

  );
}
