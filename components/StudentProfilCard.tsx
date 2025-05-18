"use client"

import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { IKImage} from "imagekitio-next";
import config from "@/lib/config"

interface StudentProfileCardProps {
  name: string
  email: string
  university: string
  studentId: string
  verified: boolean
  profileImage?: string
  universityCard:string
}

export default function StudentProfileCard({
  name,
  email,
  university,
  studentId,
  verified,
  profileImage,
  universityCard,
}: StudentProfileCardProps) {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-dark-300 shadow-xl">
      {/* Card handle/tab at top */}
      <div className="absolute left-1/2 top-0 h-14 w-20 -translate-x-1/2 rounded-b-xl bg-dark-600">
        <div className="absolute bottom-3 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-dark-500"></div>
      </div>

      <div className="px-8 pt-20 pb-8">
        <div className="flex flex-col items-center">

          {/* Profile image */}
          <div className="relative  overflow-hidden rounded-full border-4 border-dark-300">
            <Avatar className="h-32 w-32">
                        {profileImage ? (
                          <AvatarImage src={profileImage || "/placeholder.svg"} alt={profileImage} />
                        ) : (
                          <AvatarFallback className="bg-blue-100 text-amber-100 text-5xl">
                            {getInitials((name || "IN"))}
                          </AvatarFallback>
                        )}
            </Avatar>
          </div>

          {/* Verified badge */}
          <div className="mt-4 flex items-center gap-1.5 text-primary">
            { verified && (<CheckCircle size={16} className="fill-primary text-dark-300" />)}
            <span className="text-sm font-medium">Verified Student</span>
          </div>

          {/* Name */}
          <h1 className="mt-2 text-3xl font-bold text-white">{name}</h1>

          {/* Email */}
          <p className="mt-1 text-light-500">{email}</p>

          {/* University section */}
          <div className="mt-8 w-full">
            <p className="text-sm text-light-500">University</p>
            <p className="mt-1 text-xl font-bold text-white">{university}</p>
          </div>

          {/* Student ID section */}
          <div className="mt-6 w-full">
            <p className="text-sm text-light-500">Student ID</p>
            <p className="mt-1 text-xl font-bold text-white">{studentId}</p>
          </div>

           <div className="mt-8 w-full">
           <IKImage 
                  alt={"University Card"} //{file.filePath}
                  path={universityCard} //{file.filePath}
                  urlEndpoint={config.env.imagekit.urlEndpoint}
                  width={500}
                  height={300}
          />
          </div>
           

        </div>
      </div>
    </div>
  )
}
