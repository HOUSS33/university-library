'use server';

import { db } from "@/database/drizzle";
import { borrowRecords, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function changeRole(
  userId: string,
  role: "USER" | "ADMIN"
): Promise<{ success: boolean; error?: string }> {
  try {
    const updated = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId));

    if (updated.rowCount === 0) {
      return { success: false, error: "User not found or not updated." };
    }

    return { success: true };
  } catch (e) {
    console.error("Error changing role:", e);
    return { success: false, error: "Database error." };
  }
}


export async function deleteUser(userId: string) {
  try {

    const borrowed = await db
            .select()
            .from(borrowRecords)
            .where(
              and(
                eq(borrowRecords.userId, userId),
                eq(borrowRecords.status, 'BORROWED')
              )
            );
    if(borrowed.length !== 0) return {
      success: false,
      error: "User has Active Borrow !!!",
    };
            
    const result = await db.delete(users).where(eq(users.id, userId));
    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return {
      success: false,
      error: "An error occurred while deleting the user.",
    };
  }
}