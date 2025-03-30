'use client'
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from 'next-auth';


const Header = ({session}: {session: Session}) => {

    //It returns the path of the current page (e.g., /home, /about, /products/123
    let pathname = usePathname();


    return (
        <header className='my-10 flex justify-between gap-5'>

            {/*Top Left */}
            <Link href="/">
              <Image src="/icons/logo.svg" alt='logo' width={40} height={40}/>
            </Link>




            {/*Top Right */}
            <ul className='flex flex-row items-center gap-8'>

                {/*Library Link*/}
                <li>
                    {/*Check /lib/utils.ts for cn()*/}
                    <Link href="/library" className={cn(  
                        'text-base cursor-pointer capitalize', 
                        pathname === "/library" ? "text-light-200" : "text-light-100",
                        )}>
                    Library
                    </Link>
                </li>


                {/*Initial Icon*/}
                <li>
                    <Link href="/my-profile">
                       <Avatar>
                           {/*<AvatarImage src="https://github.com/shadcn.png" />*/}
                           <AvatarFallback className='bg-amber-100'>
                            {getInitials((session?.user?.name || "IN"))}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </li>
            </ul>

        </header>
    )
}

export default Header;