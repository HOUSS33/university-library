import { signOut, auth } from "@/auth";
import BookList from "@/components/BookList";
import StudentProfileCard from "@/components/StudentProfilCard";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants.ts";
import React from "react";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";


const Page = async () => {
  const session = await auth();
  console.log(session)

  const universityId = session?.user?.id

  if (!universityId) {
  throw new Error("User ID not found in session");
  }

  // Fetch the user status using universityId
  const userStatusResult = await db
    .select({ status: users.status })
    .from(users)
    .where(eq(users.id, universityId))
    .limit(1);

  // It's an array, so check the first item
const isApproved = userStatusResult[0]?.status === "APPROVED";



  
if (!universityId) {
  throw new Error("User ID is undefined");
}

const userDataResult = await db
  .select({
    status: users.status,
    universityCard: users.universityCard,
  })
  .from(users)
  .where(eq(users.id, universityId))
  .limit(1);

  const universityCardLink = userDataResult[0]?.universityCard;



const borrowedBooks = (await db
  .select({
    id: books.id,
    title: books.title,
    author: books.author,
    genre: books.genre,
    rating: books.rating,
    coverUrl: books.coverUrl,
    coverColor: books.coverColor,
    description: books.description,
    totalCopies: books.totalCopies,
    availableCopies: books.availableCopies,
    videoUrl: books.videoUrl,
    summary: books.summary,
    createdAt: books.createdAt
  })
  .from(borrowRecords)
  .innerJoin(books, eq(borrowRecords.bookId, books.id))
  .where(
    and(
      eq(borrowRecords.userId, universityId),
      eq(borrowRecords.status, 'BORROWED')
    )
  )
) as Book[];


console.log(borrowedBooks)


  

  return (
    <>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      <div className="flex gap-6">
        <StudentProfileCard
          name={session?.user?.name || "Unknown"}
          email={session?.user?.email || "No email"}
          university="EMSI"
          studentId={session?.user?.id || "No email"}
          verified={isApproved}
          universityCard= {universityCardLink}
        />
      
      
      
      <div className="w-[808px] h-[694px]">
        <BookList title="Borrowed Books" books={borrowedBooks} />
     </div>

      </div>

      
    </>
  );
};

export default Page;
