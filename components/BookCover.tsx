'use client'

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import BookCoverSvg from "./BookCoverSvg";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";



type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide" | "default";


interface Props{
    className?: string;
    variant?: BookCoverVariant;
    coverColor?: string;
    coverImage?: string;
    left?: string;
    width?: string;
    height?: string;
    coverwidth?: string;  // Optional prop with a default value
    coverheight?: string; // Optional prop with a default value
}


const variantStyles: Record<BookCoverVariant, string> = {
    extraSmall:'book-cover_extra_small',
    small:'book-cover_small',
    medium:'book-cover_medium',
    regular:'book-cover_regular',
    wide:'book-cover_wide',
    default:'book-cover',
}



const BookCover = ({
    className, 
    variant ="medium", 
    coverColor="#012B48", 
    coverImage='https://placehold.co/400x600.png',
    left= '12%',
    width= '87.5%',
    height= '88%',
    coverwidth = "100%", 
    coverheight = "100%",
}: Props) =>{
    return(
        <div 
          className={cn(
            "relative transition-all duration-300", 
            variantStyles[variant],
            className,
            )} >

                {/*BOOK SIDE SVG*/}
                <BookCoverSvg coverColor={coverColor} coverwidth={coverwidth} coverheight={coverheight}/>
                
                <div className="absolute z-10" 
                     style={{ left: `${left}`, width:`${width}`, height:`${height}` }}
                >
                    <IKImage
                      path={coverImage} 
                      urlEndpoint={config.env.imagekit.urlEndpoint}
                      alt="Book cover" 
                      fill 
                      className="rounded-sm object-fill"
                      loading="lazy"
                      lqip={{ active: true }}
                    />
                </div>

        </div>
    );
}


export default BookCover;