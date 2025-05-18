import BookForm from "@/components/admin/forms/EditBookForm"
import { eq } from "drizzle-orm";
import { books } from "@/database/schema";
import { db } from "@/database/drizzle";





export default async function Home({ params }: { params: Promise<{ id: string}>}) {
  const  id  =  (await params).id; // gets the id from the dynamic route

  const result = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  const book = result[0] as Book | undefined;
  console.log(book)

  return (
    <main className="min-h-screen py-8">
       <p>ID: {id}</p>
      <BookForm {...book}/>
    </main>
  )
}
