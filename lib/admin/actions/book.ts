'use server';

import { db } from "@/database/drizzle";
import { users ,books, borrowRecords } from "@/database/schema";
import { eq, and } from "drizzle-orm";


export async function getAllUsersWithBorrowCount() {
  const allUsers = await db.select().from(users);

  const userData = await Promise.all(
    allUsers.map(async (user) => {
      const borrowed = await db
        .select()
        .from(borrowRecords)
        .where(
          and(
            eq(borrowRecords.userId, user.id),
            eq(borrowRecords.status, 'BORROWED')
          )
        );

      return {
        ...user,
        borrowedCount: borrowed.length,
      };
    })
  );

  return userData;
}



export const createBook = async (params: BookParams) =>  {
    try{
        const newBook = await db.insert(books).values({
            ...params,
            availableCopies: params.totalCopies,
        }).returning();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newBook[0])),
        }

    } catch(error){
        console.log(error);

        return {
            success: false,
            message: 'An error occured while creating the book'
        }
    }
}



export const editBook = async (id: string | undefined, params: Partial<BookParams>) => {
  
  if(id === undefined) return {
        success: false,
        message: 'Book not found',
      };

  try {
    const updatedBook = await db
      .update(books)
      .set({
        ...params,
      })
      .where(eq(books.id, id))
      .returning();

    if (updatedBook.length === 0) {
      return {
        success: false,
        message: 'Book not found',
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedBook[0])),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'An error occurred while updating the book',
    };
  }
};



export const updateBookStatus = async (bookId: string, status: "BORROWED" | "RETURNED" | "LATE RETURN") => {
  try {

    const updateData: any = { status };

    if (status === "RETURNED" || status === "LATE RETURN") {
      updateData.returnDate = new Date(); // or new Date().toISOString().split("T")[0] if your DB expects YYYY-MM-DD
    }
    else{
        updateData.returnDate = null;
    }

    await db
    .update(borrowRecords)
    .set(updateData)
    .where(eq(borrowRecords.id, bookId));

    // Update the status of the book in the borrow_records table
    await db
      .update(borrowRecords)
      .set({ status }) // Set the new status
     .where(eq(borrowRecords.id, bookId));// Match by the bookId

    // If successful, you can handle any additional logic if necessary
    return { 
        success: true, 
        message: "Status updated successfully" 
    }

  } catch (error) {
    console.error("Error updating status:", error);
    return { 
        success: false, 
        message: "An error occurred while updating the status" 
    }
  }
};