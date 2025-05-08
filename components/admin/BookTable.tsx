"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import BookCover from "../BookCover"
import { deleteBook } from "@/lib/actions/book"
import { toast } from "sonner"
import { useRouter } from "next/navigation"



interface Props{
  listBooks: Book[];
}


const BookTable = ( { listBooks }: Props) => {

  
  
  // Sample data - replace with your actual data fetching logic
  const [books, setBooks] = useState<Book[]>(listBooks)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()


  const handleEdit = (id: string) => {
    console.log(`Editing book with id: ${id}`)
    // Implement your edit logic here
    router.push(`/admin/books/${id}/edit`)
  }



  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id) // Set loading state for this specific book

      // Call the server action to delete from database
      const result = await deleteBook(id)

      if (result.success) {
        // Update local state only after successful deletion
        setBooks(books.filter((book) => book.id !== id))

        // You can add toast notification here if you have it set up
        toast(`Success`, {
          description: result.message,
        })

      } else {
        // You can add toast notification here if you have it set up
        toast(`Error`, {
          description: result.error,
        })

      }
    } catch (error) {
      console.error("Error deleting book:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  // Format date to a readable string
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }


  return (
    <div className="w-full overflow-auto">
      <Table>

        <TableHeader className="bg-gray-200 p-4">
          <TableRow>
            <TableHead className="w-[300px]">Book Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="relative h-[60px] w-[40px] overflow-hidden rounded-sm border">
                    <BookCover coverColor={book.coverColor} coverImage={book.coverUrl} left="3%" width="25%" height="26.3%" coverheight="60" coverwidth="40"/>
                  </div>
                  <span>{book.title}</span>
                </div>
              </TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>{formatDate(book.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(book.id)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(book.id)}
                    disabled={isDeleting === book.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    {isDeleting === book.id ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}

                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </div>
  )
}


export default BookTable;
