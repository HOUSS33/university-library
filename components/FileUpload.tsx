"use client"

import config from "@/lib/config";
import { IKImage, IKVideo, ImageKitProvider, IKUpload, ImageKitContext } from "imagekitio-next";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner"
import { cn } from "@/lib/utils";


//authentic the user in ImageKit returns signature, expire, token | related to ./api/auth/imagekit file
const authenticator = async() => {
    try{
        
        const response = await fetch(`/api/auth/imagekit`);

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


interface Props {
    type: 'image' | 'video';
    accept: string;
    placeholder: string;
    folder: string;
    variant: 'dark' | 'light';
    onFileChange: (filePath: string) => void;
    value?: string;
}



const FileUpload = ({ type, accept, placeholder, folder, variant, onFileChange, value}: Props) => {

    const ikUploadRef = useRef(null);
    const [file, setFile] = useState<{ filePath: string | null } | null>({ filePath: value ?? null });
    const [progress, setProgress] = useState(0);
 
    //For admin vs User
    const styles = {
        button: variant === 'dark' ? 'bg-dark-300' : 'bg-light-600 border-gray-100 border',
        placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
        text: variant === 'dark' ? 'text-light-100' : 'text-dark-400',
    }


    //handlers for error and Success
    const onError= (error: any) => {
        console.log(error);

        toast(`${type} upload failed.`);
    };

    const onSuccess= (res: any) => {
        setFile(res);
        onFileChange(res.filePath);

        toast(`${type} uploaded successfully`, {
            description: `${res.filePath} uploaded successfully!`,
          })
    };

    const onValidate = (file: File) => {
        if(type === "image"){
            if(file.size > 20 * 1024 * 1024){
                toast("File size too large", {
                    description: "Please upload a file that is less than 20MB in size"
                  })
                return false;
            }
        }
        else if(type === "video"){
            if(file.size > 50 * 1024 * 1024){
                toast("File size too large", {
                    description: "Please upload a file that is less than 20MB in size"
                  })
                return false;
            }

        }

        return true;
        
    }

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
            useUniqueFileName={true}
            validateFile={onValidate}
            onUploadStart={()=> setProgress(0)}
            onUploadProgress={({ loaded, total }) => {
                const percent = Math.round((loaded / total * 100));
                setProgress(percent);
            }}
            folder={folder}
            accept={accept}
            />

            <button className={cn("upload-btn", styles.button)} onClick={(e) => {
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
                <p className={cn("text-basse", styles.placeholder)}>{placeholder}</p>

                {file && <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>}  {/* if file exist */}
            </button>


            {progress > 0 && progress != 100 &&(
                <div className="w-full rounded-full bg-green-200">
                    <div className="progress" style={{ width: `${progress}%`}}>
                        {progress}%
                    </div>
                </div>
            )}




            {/* Image of the uploaded file */}
            {file && (
                (type === 'image' ? (
                <IKImage 
                alt={file.filePath ?? ''} //{file.filePath}
                path={file.filePath ?? ''} //{file.filePath}
                width={500}
                height={300}
                />

                ): type === 'video' ? (
                    <IKVideo
                    path = {file.filePath ?? ''}//{file.filePath}
                    controls={true}
                    className="h-96 w-full rounded-xl"
                    />
                ): null)
                
            )}

        </ImageKitProvider>
    )
}

export default FileUpload;
