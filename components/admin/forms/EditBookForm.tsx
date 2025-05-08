"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function EditBookForm() {
  const [bookImage, setBookImage] = useState<string | null>("jayne-castle.png")
  const [bookVideo, setBookVideo] = useState<string | null>("jayne-castle-intro.mp4")

  const handleRemoveImage = () => {
    setBookImage(null)
  }

  const handleRemoveVideo = () => {
    setBookVideo(null)
  }

  return (
    <div className="max-w-md  p-4">
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Book Title</Label>
          <Input id="title" defaultValue="Jayne Castle - People in Glass Houses" className="bg-slate-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" defaultValue="Jayne Ann Krentz" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input id="genre" defaultValue="Strategic, Fantasy" className="bg-slate-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookCount">Total number of books</Label>
          <Input id="bookCount" defaultValue="564" className="bg-slate-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookImage">Book Image</Label>
          <div className="relative">
            <Input id="bookImage" type="file" className="hidden" />
            <div className="flex items-center border rounded-md p-2 bg-slate-50">
              {bookImage ? (
                <div className="flex items-center gap-2 bg-blue-50 rounded px-2 py-1 text-sm text-blue-700">
                  <span>{bookImage}</span>
                  <button type="button" onClick={handleRemoveImage} className="text-blue-700 hover:text-blue-900">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label htmlFor="bookImage" className="cursor-pointer text-gray-500 w-full">
                  Choose file...
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryColor">Book Primary Color</Label>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#C4214C]"></div>
            <Input id="primaryColor" defaultValue="#C4214C" className="bg-slate-50" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookVideo">Book Video</Label>
          <div className="relative">
            <Input id="bookVideo" type="file" className="hidden" />
            <div className="flex items-center border rounded-md p-2 bg-slate-50">
              {bookVideo ? (
                <div className="flex items-center gap-2 bg-blue-50 rounded px-2 py-1 text-sm text-blue-700">
                  <span>{bookVideo}</span>
                  <button type="button" onClick={handleRemoveVideo} className="text-blue-700 hover:text-blue-900">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label htmlFor="bookVideo" className="cursor-pointer text-gray-500 w-full">
                  Choose file...
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Book Summary</Label>
          <Textarea
            id="summary"
            className="min-h-[100px] bg-slate-50"
            defaultValue="People in Glass Houses by Jayne Castle (a pseudonym for Jayne Ann Krentz) is a science fiction romance set in a future world where people with psychic abilities live in harmony with advanced technology. The story follows the main character, Harriet, who are brought together under unusual circumstances.

Harriet, a talented psychic, works for a company that offers psychic services in a futuristic society. When she finds herself tangled in a dangerous situation involving a nefarious conspiracy, she enlists the help of Sam, a former investigator with a dark past. As they uncover the secrets surrounding a glass house—a mysterious structure tied to their..."
          />
        </div>

        <Button className="w-full bg-blue-700 hover:bg-blue-800">Update Book</Button>
      </form>
    </div>
  )
}
