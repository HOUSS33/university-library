"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, FileText } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import BookCover from "@/components/BookCover"
import { updateBookStatus } from "@/lib/admin/actions/book"
import { generateReceipt } from "@/lib/admin/actions/generate-receipt"

interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  coverColor?: string
}

interface User {
  id: string
  fullName: string
  email: string
  avatarUrl?: string
}

interface BorrowedBook {
  id: string
  book: Book | null;  
  user: User | null;  
  status: "BORROWED" | "RETURNED" | "LATE RETURN"
  borrowedDate: Date
  returnDate: Date | null;
  dueDate: Date
}

// Safe date formatter that handles potential null/undefined dates
const formatDate = (date: Date | null | undefined) => {
  if (!date) return "N/A"
  try {
    return date
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-")
  } catch (error) {
    return "Invalid date"
  }
}

export function BorrowedBooksTable({ borrowedBooks }: { borrowedBooks: BorrowedBook[] }) {

  const [books, setBooks] = useState<BorrowedBook[]>(borrowedBooks)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [generatingReceipt, setGeneratingReceipt] = useState<Record<string, boolean>>({})


  const handleStatusChange = async (bookId: string, status: "BORROWED" | "RETURNED" | "LATE RETURN") => {
    setLoading({ ...loading, [bookId]: true })

    try {
      // Here you would call your API to update the status
      const response = await updateBookStatus(bookId, status)

      if (!response.success) {
      throw new Error(response.message)
    }

  
      // For now, we'll just update the local state
      setBooks((prev) =>
        prev.map((book) =>
          book.id === bookId
          ? {
          ...book,
          status,
          returnDate: status === "RETURNED" || status === "LATE RETURN" ? new Date() : null
        }
      : book
  )
)


      toast(`Status updated`, {
        description: `Book status has been updated to ${status}.`,
      })

    } catch (error) {
      toast(`Error`, {
        description: `Unexpected error occurred. Please try again.`,
      })
    } finally {
      setLoading({ ...loading, [bookId]: false })
    }
  }


  const handleGenerateReceipt = async (borrowedBook: BorrowedBook) => {

    setGeneratingReceipt({ ...generatingReceipt, [borrowedBook.id]: true })

    try {
      toast(`Generating receipt`, {
        description: `Receipt is being generated for ${borrowedBook.book?.title}.`,
      })

      // Generate a unique receipt ID
      const receiptId = `R${Math.floor(10000 + Math.random() * 90000)}`

      await generateReceipt({
        receiptId,
        book: borrowedBook.book,
        borrowedDate: borrowedBook.borrowedDate,
        dueDate: borrowedBook.dueDate,
        userName: borrowedBook.user?.fullName,
      })

      toast(`Receipt generated`, {
        description: `Receipt has been downloaded for ${borrowedBook.book?.title}.`,
      })
    } catch (error) {
      console.error("Error generating receipt:", error)
      toast(`Error`, {
        description: `Failed to generate receipt. Please try again.`,
      })
    } finally {
      setGeneratingReceipt({ ...generatingReceipt, [borrowedBook.id]: false })
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case "BORROWED":
        return "text-purple-600 bg-purple-50"
      case "RETURNED":
        return "text-blue-600 bg-blue-50"
      case "LATE RETURN":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Book</th>
              <th className="px-4 py-3 text-sm font-medium text-muted-foreground">User Requested</th>
              <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Borrowed date</th>
              <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Return date</th>
              <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Due Date</th>
              <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Receipt</th>
            </tr>
          </thead>

          <tbody>
            {books.map((borrowedBook) => (
              <tr key={borrowedBook.id} className="border-t">
                {/* Book column */}
                <td className="px-4 py-4">
                  
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-10 flex-shrink-0 overflow-hidden rounded-sm border bg-muted">
                        <BookCover coverColor={borrowedBook.book?.coverColor} coverImage={borrowedBook.book?.coverUrl} left="3%" width="25%" height="26.3%" coverheight="60" coverwidth="40"/>
                    </div>
                    <div className="font-medium line-clamp-1">{borrowedBook.book?.title}</div>
                  </div>
                </td>

                {/* User Requested column */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border">
                      {borrowedBook.user?.avatarUrl ? (
                        <AvatarImage
                          src={borrowedBook.user.avatarUrl || "/placeholder.svg"}
                          alt={borrowedBook.user.fullName}
                        />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-amber-100">
                          {getInitials(borrowedBook.user?.fullName ?? "Unknown User")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">{borrowedBook.user?.fullName}</div>
                      <div className="text-sm text-muted-foreground">{borrowedBook.user?.email}</div>
                    </div>
                  </div>
                </td>

                {/* Status column */}
                <td className="px-4 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${getStatusColor(borrowedBook.status)} border-0 font-medium`}
                      >
                        {borrowedBook.status}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-purple-600"
                        onClick={() => handleStatusChange(borrowedBook.id, "BORROWED")}
                      >
                        {borrowedBook.status === "BORROWED" && <Check className="h-4 w-4" />}
                        Borrowed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-blue-600"
                        onClick={() => handleStatusChange(borrowedBook.id, "RETURNED")}
                      >
                        {borrowedBook.status === "RETURNED" && <Check className="h-4 w-4" />}
                        Returned
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600"
                        onClick={() => handleStatusChange(borrowedBook.id, "LATE RETURN")}
                      >
                        {borrowedBook.status === "LATE RETURN" && <Check className="h-4 w-4" />}
                        Late Return
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>

                {/* Borrowed date column */}
                <td className="px-4 py-4 text-sm">{formatDate(borrowedBook.borrowedDate)}</td>

                {/* Return date column */}
                <td className="px-4 py-4 text-sm">{formatDate(borrowedBook.returnDate)}</td>

                {/* Due Date column */}
                <td className="px-4 py-4 text-sm">{formatDate(borrowedBook.dueDate)}</td>

                {/* Receipt column */}
                <td className="px-4 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 flex items-center gap-1.5"
                    onClick={() => handleGenerateReceipt(borrowedBook)}
                  >
                    <FileText className="h-4 w-4" />
                    Generate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
