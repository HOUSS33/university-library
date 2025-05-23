"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn, SubmitHandler, DefaultValues, FieldValues, Path } from "react-hook-form"
import { z, ZodType } from "zod";


/*shadcn*/
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants.ts";
import { University } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import ColorPicker from "./ColorPicker";
import { editBook } from "@/lib/admin/actions/book";





interface Props extends Partial<Book> {
    type?: 'create' | 'update';
}





const BookForm = ({ type, ...book }: Props) => {

  const router = useRouter();




  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
        ...book,
    }
  });

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const result = await editBook(book.id,values);

    if(result.success) {

      toast(`Success`, {
        description: `Book updates successfully!`,
      })

      router.push(`/admin/books`);

    } else {

      toast(`Error`, {
        description: result.message,
      })
    }
  };





  return (  
   
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name={"title"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">

                    <FormLabel className="text-base font-normal text-dark-500">
                        Book Title
                    </FormLabel>

                    <FormControl>

                            <Input 
                                required
                                placeholder="Book title"
                                {...field} 
                                className="book-form_input"
                                
                         />
                        

                    </FormControl>

                    <FormMessage />
                  </FormItem>
                  )}
                />

                <FormField
                control={form.control}
                name={"author"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">

                    <FormLabel className="text-base font-normal text-dark-500">
                        Author
                    </FormLabel>

                    <FormControl>

                            <Input 
                                required
                                placeholder="Book author"
                                {...field} 
                                className="book-form_input"
                                
                         />
                        

                    </FormControl>

                    <FormMessage />
                  </FormItem>
                 )}
                />


                <FormField
                control={form.control}
                name={"genre"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">

                    <FormLabel className="text-base font-normal text-dark-500">
                        Genre
                    </FormLabel>

                    <FormControl>

                            <Input 
                                required
                                placeholder="Book genre"
                                {...field} 
                                className="book-form_input"
                                
                         />
                        

                    </FormControl>

                    <FormMessage />
                  </FormItem>
                 )}
                />


                <FormField
                control={form.control}
                name={"rating"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">

                    <FormLabel className="text-base font-normal text-dark-500">
                        Rating
                    </FormLabel>

                    <FormControl>

                            <Input 
                                required
                                type="number"
                                min={1}
                                max={5}
                                placeholder="Book rating"
                                {...field} 
                                className="book-form_input"
                                step="any"// allows decimal
                         />
                        

                    </FormControl>

                    <FormMessage />
                  </FormItem>
                 )}
                />

                <FormField
                control={form.control}
                name={"totalCopies"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">

                    <FormLabel className="text-base font-normal text-dark-500">
                        Total Copies
                    </FormLabel>

                    <FormControl>

                            <Input 
                                required
                                type="number"
                                min={1}
                                max={10000}
                                placeholder="Total copies"
                                {...field} 
                                className="book-form_input"
                                
                         />
                        

                    </FormControl>

                    <FormMessage />
                  </FormItem>
                 )}
                />

                <FormField
                control={form.control}
                name={"coverUrl"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">

                    <FormLabel className="text-base font-normal text-dark-500">
                        Book Image
                    </FormLabel>

                    <FormControl>

                            <FileUpload 
                            type="image" 
                            accept="image/*" 
                            placeholder="Upload a book cover" 
                            folder="books/covers" 
                            variant="light" 
                            onFileChange={field.onChange}
                            value={field.value} 
                            />

                    </FormControl>

                    <FormMessage />
                  </FormItem>
                 )}
                />

                <FormField
                control={form.control}
                name={"coverColor"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">

                    <FormLabel className="text-base font-normal text-dark-500">
                        Primary Color
                    </FormLabel>

                    <FormControl>

                            <ColorPicker onPickerChange={field.onChange} value={field.value}/>
                        

                    </FormControl>

                    <FormMessage />
                  </FormItem>
                 )}
                />

                <FormField
                control={form.control}
                name={"description"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">

                    <FormLabel className="text-base font-normal text-dark-500">
                        Book Description
                    </FormLabel>

                    <FormControl>

                            <Textarea
                            placeholder="Book description"
                            {...field}
                            rows={10}
                            className="book-form_input"
                            />
                        

                    </FormControl>

                    <FormMessage />
                  </FormItem>
                 )}
                />

                <FormField
                control={form.control}
                name={"videoUrl"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">

                    <FormLabel className="text-base font-normal text-dark-500">
                        Book Trailer
                    </FormLabel>

                    <FormControl>

                           <FileUpload 
                            type="video" 
                            accept="video/*" 
                            placeholder="Upload a book trailer" 
                            folder="books/videos" 
                            variant="light" 
                            onFileChange={field.onChange}
                            value={field.value} 
                            />
                        

                    </FormControl>

                    <FormMessage />
                  </FormItem>
                 )}
                />

                <FormField
                control={form.control}
                name={"summary"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">

                    <FormLabel className="text-base font-normal text-dark-500">
                        Book Summary
                    </FormLabel>

                    <FormControl>

                            <Textarea
                            placeholder="Book summary"
                            {...field}
                            rows={5}
                            className="book-form_input"
                            />
                        

                    </FormControl>

                    <FormMessage />
                  </FormItem>
                 )}
                />

                <Button type="submit" className="book-form_btn text-white">
                    Update Book
                </Button>
        </form>
        </Form>

  
    )
};

export default BookForm;


