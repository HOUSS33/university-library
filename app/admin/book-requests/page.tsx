

import { BorrowedBooksTable } from "@/components/admin/borrowRequests/borrowed-books-table"
import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { books, users } from "@/database/schema"; 



export default  async function BorrowedBooksPage() {


  
  const records = await db
    .select({
      id: borrowRecords.id,
      status: borrowRecords.status,
      borrowedDate: borrowRecords.borrowDate,
      returnDate: borrowRecords.returnDate,
      dueDate: borrowRecords.dueDate,
      book: {
        id: books.id,
        title: books.title,
        author: books.author,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
      },
      user: {
        id: users.id,
        fullName: users.fullName,
        email: users.email,
      },
    })
    .from(borrowRecords)
    .leftJoin(books, eq(borrowRecords.bookId, books.id))
    .leftJoin(users, eq(borrowRecords.userId, users.id));


console.log(records);

const transformedBooks = records.map((book) => ({
  ...book,
  returnDate: book.returnDate ? new Date(book.returnDate) : null, // Ensure returnDate is a Date object or null
  borrowedDate: new Date(book.borrowedDate), // If borrowedDate is not a Date object, ensure it is converted
  dueDate: new Date(book.dueDate), // Similarly, ensure dueDate is a Date object
}));


  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Borrowed Books</h1>
      <BorrowedBooksTable borrowedBooks={transformedBooks} />
    </div>
  )
}
