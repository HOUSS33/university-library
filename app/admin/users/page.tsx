import { UsersTable } from "@/components/admin/allUsers/table"
import { getAllUsersWithBorrowCount } from "@/lib/admin/actions/book"

// This would typically come from your database


export default async function UsersPage() {


    const usersWithCounts = await getAllUsersWithBorrowCount();

    console.log(usersWithCounts)

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <UsersTable users={usersWithCounts} />
    </div>
  )
}
