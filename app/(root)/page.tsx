import { auth } from "@/auth";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constants.ts";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";

const Home = async() =>{
  const result = await db.select().from(users);

  console.log("all Users:",JSON.stringify(result, null, 2));  // to create space between the results 2
  console.log("session object:", await auth());

  return (
    <>
    <BookOverview {...sampleBooks[0]}/>

    <BookList 
      title="Latest Books" 
      books={sampleBooks} 
      containerClassName="mt-28"
    />
    </>
  );
}



export default Home;