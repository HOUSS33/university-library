"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Eye, X } from "lucide-react"
import { approveStudent, rejectStudent, viewIdCard } from "@/lib/actions/user"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { getInitials } from "@/lib/utils"
import { IKImage} from "imagekitio-next";
import config from "@/lib/config"






export function StudentTable({ students }: { students: User[] }) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [viewingIdCard, setViewingIdCard] = useState<User | null>(null)


  const handleApprove = async (student: User) => {
    setLoading({ ...loading, [student.id]: true })
    try {
      await approveStudent(student.id)

      toast(`Account approved`, {
        description: `${student.fullName}'s account has been approved successfully.`,
      })

      
    } catch (error) {

        toast(`Error`, {
            description: `Failed to approve account. Please try again.`,
          })

    } finally {
      setLoading({ ...loading, [student.id]: false })
    }
  }

  const handleReject = async (student: User) => {
    setLoading({ ...loading, [student.id]: true })
    try {
      await rejectStudent(student.id)
      
      toast(`Account rejected`, {
        description: `${student.fullName}'s account has been rejected.`,
      })

    } catch (error) {

        toast(`"Error"`, {
            description: `Failed to reject account. Please try again.`,
          })

    } finally {
      setLoading({ ...loading, [student.id]: false })
    }
  }

  const handleViewIdCard = async (student: User) => {
    setViewingIdCard(student)
    try {
      await viewIdCard(student.id)
    } catch (error) {
      
        toast(`"Error"`, {
            description: "Failed to load ID card. Please try again.",
          })
    }
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
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">University ID No</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">University ID Card</th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (

                <tr key={student.id} className="border-t">

                  {/*    Name column / Avatar icon     */}  
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                     
                      <Avatar className="h-10 w-10 border">
                        {student.avatarUrl ? (
                          <AvatarImage src={student.avatarUrl || "/placeholder.svg"} alt={student.fullName} />
                        ) : (
                          <AvatarFallback className="bg-blue-100 text-amber-100">
                            {getInitials((student.fullName || "IN"))}
                            </AvatarFallback>
                        )}
                      </Avatar>

                      <div>
                        <div className="font-medium">{student.fullName}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>

                    </div>
                  </td>

                  {/*    Date Joined column + University ID No column     */} 
                  <td className="px-4 py-4 text-sm">{student.createdAt.toISOString().slice(0, 10)} {/* YYYY-MM-DD */}</td>
                  <td className="px-4 py-4 text-sm">{student.universityId}</td>

                  {/*    University ID Card column    */} 
                  <td className="px-4 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 flex items-center gap-1.5"
                      onClick={() => handleViewIdCard(student)}
                    >
                      <Eye className="h-4 w-4" />
                      View ID Card
                    </Button>
                  </td>


                  {/*    Actions column    */} 
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                        onClick={() => handleApprove(student)}
                        disabled={loading[student.id]}
                      >
                        Approve Account
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full"
                        onClick={() => handleReject(student)}
                        disabled={loading[student.id]}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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

                  <AvatarFallback className="bg-blue-100 text-amber-100 text-xl">
                    {getInitials((viewingIdCard.fullName || "IN"))}
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
