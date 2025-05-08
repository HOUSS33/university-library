import { StudentTable } from "@/components/admin/accountRequests/studentTable"
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";


export default async function StudentApprovalPage () {

  /*const listUsers = (await db.select().from(users).orderBy(desc(users.createdAt))) as User[];*/
  const listUsers = (await db
    .select()
    .from(users)
    .where(eq(users.status, 'PENDING'))
    .orderBy(desc(users.createdAt))) as User[];
  


    

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Student Account Approval</h1>
      <StudentTable students={listUsers} />
    </div>
  )
}

