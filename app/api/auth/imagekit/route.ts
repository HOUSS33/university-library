import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";


//destructures config.env.imagekit and extracts publicKey, privateKey, urlEndpoint
const {
    env: {
        imagekit: {publicKey, privateKey, urlEndpoint},
    },
} = config;



//Create an object instance of ImageKit class coming from import ImageKit from "imagekit";
const imagekit = new ImageKit({publicKey, privateKey, urlEndpoint,}); 

export async function GET() {

    //imagekit.getAuthenticationParameters() generates temporary credentials: signature, expire, token
    return NextResponse.json(imagekit.getAuthenticationParameters());
}




/*
Final Explanation
✅ Purpose of this code:

It sets up a Next.js API route (GET /api/auth/imagekit) that returns temporary authentication parameters for secure ImageKit uploads.

The frontend will call this route before uploading an image.

Example API Response
If you visit /api/auth/imagekit, you'll get:


{
  "token": "abc123",
  "expire": 1711234567,
  "signature": "f5a7c9e8..."
}

 Each time a user makes a request to /api/auth/imagekit, they receive a new token, but all tokens are signed using the same private key (privateKey
*/