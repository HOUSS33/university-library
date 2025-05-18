"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, ExternalLink, Trash2 } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner";
import { IKImage} from "imagekitio-next";
import config from "@/lib/config"
import { changeRole, deleteUser } from "@/lib/admin/user"

export type User = {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  password: string;
  universityCard: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  role: 'USER' | 'ADMIN' | null;
  lastActivityDate: string | null;
  createdAt: Date | null;
  dateJoined?: Date; // <-- make optional
  booksBorrowed?: number; // <-- make optional
  borrowedCount: number;
};



export function UsersTable({ users }: { users: User[] }) {

  const [listUsers, setUsers] = useState<User[]>(users)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [viewingIdCard, setViewingIdCard] = useState<User | null>(null)

  const handleRoleChange = async (userId: string, role: "USER" | "ADMIN" ) => {
    setLoading({ ...loading, [userId]: true })

    try {
        const result = await changeRole(userId, role)
        
              if (!result.success) {
                toast(`Error`, {
                  description: result.error || "Failed to change role",
                });
                return;
              }

      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)))

      toast(`Role updated`, {
        description: `User role has been updated to ${role}.`,
      })
    } catch (error) {
      toast(`Error`, {
        description: `Unexpected error occurred. Please try again.`,
      })
    } finally {
      setLoading({ ...loading, [userId]: false })
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    setLoading({ ...loading, [userId]: true })

    try {
      // Here you would call your API to delete the user
      // const result = await deleteUser(userId);
      const result = await deleteUser(userId)
        
              if (!result.success) {
                toast(`Error`, {
                  description: result.error || "Failed to change role",
                });
                return;
              }

      // For now, we'll just update the local state
      setUsers((prev) => prev.filter((user) => user.id !== userId))

      toast(`User deleted`, {
        description: `${userName} has been removed successfully.`,
      })
    } catch (error) {
      toast(`Error`, {
        description: `Unexpected error occurred. Please try again.`,
      })
    } finally {
      setLoading({ ...loading, [userId]: false })
    }
  }

  const handleViewIdCard = (user: User) => {
    setViewingIdCard(user)
  }

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case "ADMIN":
        return "text-green-600 bg-green-50"
      case "USER":
        return "text-purple-600 bg-purple-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const formatDate = (date: Date  | null) => {
    if (!date) return "N/A"; // or return an empty string if you prefer: ""

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }

  return (
    <>
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Date Joined</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Books Borrowed</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">University ID No</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">University ID Card</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>

            <tbody>
              {listUsers.map((user) => (
                <tr key={user.id} className="border-t">

                  {/* Name column */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">

                      <Avatar className="h-10 w-10 border">
                        {user.avatarUrl ? (
                          <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.fullName} />
                        ) : (
                          <AvatarFallback className="bg-blue-100 text-amber-100">
                            {getInitials((user.fullName || "IN"))}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>

                    </div>
                  </td>

                  {/* Date Joined column */}
                  <td className="px-4 py-4 text-sm">{formatDate(user.createdAt)}</td>

                  {/* Role column */}
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${getRoleColor(user.role)} border-0 font-medium`}
                        >
                          <span className="">{user.role}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">

                        <DropdownMenuItem
                          className="flex items-center gap-2 text-purple-600"
                          onClick={() => handleRoleChange(user.id, "USER")}
                        >
                          {user.role === "USER" && <Check className="h-4 w-4" />}
                          User
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2 text-green-600"
                          onClick={() => handleRoleChange(user.id, "ADMIN")}
                        >
                          {user.role === "ADMIN" && <Check className="h-4 w-4" />}
                          Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>

                  {/* Books Borrowed column */}
                  <td className="px-4 py-4 text-sm">{user.borrowedCount}</td>

                  {/* University ID No column */}
                  <td className="px-4 py-4 text-sm">{user.universityId}</td>

                  {/* University ID Card column */}
                  <td className="px-4 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 flex items-center gap-1.5"
                      onClick={() => handleViewIdCard(user)}
                    >
                      <span>View ID Card</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </td>

                  {/* Action column */}
                  <td className="px-4 py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full"
                      onClick={() => handleDeleteUser(user.id, user.fullName)}
                      disabled={loading[user.id]}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete user</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!viewingIdCard} onOpenChange={(open) => !open && setViewingIdCard(null)}>
        <DialogContent className="sm:max-w-md">

          <DialogHeader>
            <DialogTitle>University ID Card</DialogTitle>
          </DialogHeader>

          {viewingIdCard && (
            <div className="flex flex-col items-center space-y-4 p-4">
              <IKImage 
                  alt={"University Card"} //{file.filePath}
                  path={viewingIdCard.universityCard} //{file.filePath}
                  urlEndpoint={config.env.imagekit.urlEndpoint}
                  width={500}
                  height={300}
                  />
              <Avatar className="h-24 w-24 border">

                  <AvatarFallback className="text-xl">
                    {getInitials(viewingIdCard.fullName)}
                  </AvatarFallback>
              </Avatar>

              <div className="text-center">
                <h3 className="font-bold text-lg">{viewingIdCard.fullName}</h3>
                <p className="text-muted-foreground">{viewingIdCard.email}</p>
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <p className="text-sm font-medium">ID: {viewingIdCard.universityId}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
