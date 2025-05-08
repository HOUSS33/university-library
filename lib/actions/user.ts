"use server"

import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";


export async function approveStudent(studentId: string) {

  try {
    // 1. Check if the student exists
    const student = await db
      .select({ id: users.id, status: users.status })
      .from(users)
      .where(eq(users.id, studentId))
      .limit(1);

    if (!student.length) {
      return {
        success: false,
        error: "Student not found",
      };
    }

    if (student[0].status === "APPROVED") {
      return {
        success: false,
        error: "Student is already approved",
      };
    }

    // 2. Update the student's status to APPROVED
    await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, studentId));

    // 3. Optionally: send email confirmation (not implemented here)

    return {
      success: true,
      message: "Student approved successfully",
    };

  } catch (error) {

    console.error("Error approving student:", error);
    return {
      success: false,
      error: "An error occurred while approving the student",
    };

  }
}



export async function rejectStudent(studentId: string) {
  try {
    // 1. Check if the student exists
    const student = await db
      .select({ id: users.id, status: users.status })
      .from(users)
      .where(eq(users.id, studentId))
      .limit(1);

    if (!student.length) {
      return {
        success: false,
        error: "Student not found",
      };
    }

    if (student[0].status === "REJECTED") {
      return {
        success: false,
        error: "Student is already rejected",
      };
    }

    // 2. Update the student's status to REJECTED
    await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, studentId));

    // 3. Optionally: send email confirmation (not implemented here)

    return {
      success: true,
      message: "Student rejected successfully",
    };

  } catch (error) {

    console.error("Error rejecting student:", error);
    return {
      success: false,
      error: "An error occurred while rejecting the student",
    };

  }
}


