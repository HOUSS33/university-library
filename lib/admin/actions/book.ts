'use server';

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";

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