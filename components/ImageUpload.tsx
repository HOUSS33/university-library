"use client"

import config from "@/lib/config";
import { IKImage, IKVideo, ImageKitProvider, IKUpload, ImageKitContext } from "imagekitio-next";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner"


//authentic the user in ImageKit returns signature, expire, token | related to ./api/auth/imagekit file
const authenticator = async() => {
    try{
        
        const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

        if(!response.ok){
            const errorText = await response.text();

            throw new Error(`Request failed with status ${response.status}: ${errorText}`)
        }

        const data = await response.json();

        const { signature, expire, token } = data;   //destructing the data

        return { signature, expire, token };

    }catch(error: any){
        throw new Error(`Authentication request failed: ${error.message}`);
    }
}



const {
    env: {
        imagekit: {publicKey, urlEndpoint},
    },
} = config;




const ImageUpload = ({ onFileChange }: {onFileChange :(filePath: string) => void;}) => {

    const ikUploadRef = useRef(null);
    const [file, setFile] = useState<{ filePath: string} | null>(null);


    //handlers for error and Success
    const onError= (error: any) => {
        console.log(error);

        toast("Image upload failed.");
    };

    const onSuccess= (res: any) => {
        setFile(res);
        onFileChange(res.filePath);

        toast("Image uploaded successfully", {
            description: `${res.filePath} uploaded successfully!`,
          })
    };



    return (
        <ImageKitProvider 
          publicKey={publicKey} 
          urlEndpoint={urlEndpoint} 
          authenticator={authenticator}
        >


            {/* We hide the default upload component and replace it with a styled button*/}
            <IKUpload className="hidden"
            ref={ikUploadRef}     
            onError={onError}
            onSuccess={onSuccess}
            fileName="test-upload.png"
            />

            <button className="upload-btn" onClick={(e) => {
                e.preventDefault();  // To Prevent the default behavior of the browser to reload on onClick
                if(ikUploadRef.current){  //Checks if the ref points to a valid DOM element/component instance.
                    // @ts-ignore
                    ikUploadRef.current?.click();
                } 

            }}>




                <Image 
                   src="/icons/upload.svg" 
                   alt="upload-icon" 
                   width={20} 
                   height={20} 
                   className="object-contain" 
                />
                <p className="text-basse text-light-100">Upload a File</p>

                {file && <p className="upload-filename">{file.filePath}</p>}  {/* if file exist */}
            </button>







            {/* Image of the uploaded file */}
            {file && (
                <IKImage 
                alt={file.filePath}
                path={file.filePath}
                width={500}
                height={300}
                />
            )}

        </ImageKitProvider>
    )
}

export default ImageUpload;