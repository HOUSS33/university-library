'use server';

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import dayjs from "dayjs";


export const borrowBook = async (params: BorrowBookParams) => {
    const { userId, bookId } = params;

    try {
        const book = await db
        .select({ availableCopies: books.availableCopies })
        .from(books)
        .where(eq(books.id, bookId))
        .limit(1);

        if(!book.length || book[0].availableCopies <= 0){
            return {
                success: false,
                error: 'Book is not available for borrowing',
            }
        }

        const dueDate = dayjs().add(7, 'day').toDate().toDateString();

        const record = await db.insert(borrowRecords).values({
            userId,
            bookId,
            dueDate,
            status: "BORROWED",
        });

        await db
        .update(books)
        .set({ availableCopies: book[0].availableCopies -1})
        .where(eq(books.id, bookId));

        return{
            success: true,
            data: JSON.parse(JSON.stringify(record)),
        }

    } catch (error) {
        console.log(error);

        return { 
            success: false, 
            error: 'An error occurred while borrowing the book'
        };
    }
}


export const deleteBook = async (id: string) => {
    try {
      // First check if the book exists
      const bookExists = await db.select({ id: books.id }).from(books).where(eq(books.id, id)).limit(1)
  
      if (!bookExists.length) {
        return {
          success: false,
          error: "Book not found",
        }
      }
  
      // Check if there are any active borrow records for this book
      const activeBorrows = await db
        .select({ id: borrowRecords.id })
        .from(borrowRecords)
        .where(and(eq(borrowRecords.bookId, id), eq(borrowRecords.status, "BORROWED")))
        .limit(1)
  
      if (activeBorrows.length) {
        return {
          success: false,
          error: "Cannot delete book with active borrows",
        }
      }
  
      // Delete the book
      await db.delete(books).where(eq(books.id, id))
  
      return {
        success: true,
        message: "Book deleted successfully",
      }
    } catch (error) {
      console.log(error)
  
      return {
        success: false,
        error: "An error occurred while deleting the book",
      }
    }
  }




  // Add this interface for the update parameters with all fields
interface BookUpdateParams {
    id: string
    title?: string
    author?: string
    genre?: string
    totalCopies?: number
    coverUrl?: string
    coverColor?: string
    videoUrl?: string
    summary?: string
    // Add any other fields you need to update
  }
  
  export const updateBook = async (params: BookUpdateParams) => {
    const { id, ...updateData } = params
  
    try {
      // Check if the book exists
      const bookExists = await db.select({ id: books.id }).from(books).where(eq(books.id, id)).limit(1)
  
      if (!bookExists.length) {
        return {
          success: false,
          error: "Book not found",
        }
      }
  
      // Update the book with all the provided fields
      await db.update(books).set(updateData).where(eq(books.id, id))
  
      return {
        success: true,
        message: "Book updated successfully",
      }
    } catch (error) {
      console.log(error)
  
      return {
        success: false,
        error: "An error occurred while updating the book",
      }
    }
  }
  




