'use client'
import config from "@/lib/config";
import { IKVideo, ImageKitProvider } from "imagekitio-next";
import React from "react";


/*const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
    return(
        <ImageKitProvider 
        publicKey={config.env.imagekit.publicKey}
        urlEndpoint={config.env.imagekit.urlEndpoint}
        >
            <IKVideo path={videoUrl} controls={true} className="w-full rounded-xl"/>
        </ImageKitProvider>
    );
};*/


const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
    return (
        <video controls className="w-full rounded-xl">
            <source src={`https://ik.imagekit.io/kh2nbykiq/${videoUrl}`} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};

export default BookVideo;