import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function NotFound() {
  return (
    <section className="bg-gray-900 h-screen">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500 text-white">404</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold  md:text-4xl text-white">Something's missing.</p>
            <p className="mb-4 text-lg font-light text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <Link href="/">
                <Button className='bg-white text-black' variant="outline">Back to Home</Button>
            </Link>
        </div>   
    </div>
</section>
  )
}

export default NotFound