"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn, SubmitHandler, DefaultValues, FieldValues, Path } from "react-hook-form"
import { ZodType } from "zod";


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
import ImageUpload from "./ImageUpload";
import { toast } from "sonner"
import { useRouter } from "next/navigation";




//<T extends FieldValues> defines a generic type T that extends FieldValues. This means that T can be any type that is a subtype of FieldValues.
/*

interface FieldValues {
  [key: string]: any;
}
This means T must be an object type where keys are strings and values can be of any type (e.g., string, number, boolean, etc.).

*/
interface Props<T extends FieldValues> {
    schema: ZodType<T>;   /*ZodType<T> means a Zod validation object schema that validates an object of type T.*/
    defaultValues: T;     //defaultValues should match whatever type T is
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>; //The function receives data of type T
    type: 'SIGN_IN' | 'SIGN_UP';
}




//Defining the AuthForm To be Used later

//FieldValues is an object type with string keys and values of any type (any in this case, though it could be more specific like string | number | boolean | null | undefined in practice).  { [key: string]: any }
const AuthForm =   <T extends FieldValues>( 
  { type, schema, defaultValues, onSubmit}: Props<T>  
) => {

  const router = useRouter();
  const isSignIn = (type === 'SIGN_IN');



  const form: UseFormReturn<T>= useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });
 
  const handleSubmit: SubmitHandler<T>= async (data) => {
    const result = await onSubmit(data);

    if(result.success){
      toast("Success", {
        description: isSignIn ? 
        'You have successfully signed in.'
        :'You have successfully signed up',
      });

      router.push('/');

    } else {
      toast(`Error ${isSignIn ? "signing in": "siging up"}`, {
        description: result.error ?? "An error occured.",
      });
    }


  };






  return (  
    <div className="flex flex-col gap-4">


        <h1 className="text-2xl font-semibold text-white">
            {isSignIn ? 'Welcome back to BookWise' : 'Create your library account'}
        </h1>
        <p className="text-light-100">
            {isSignIn 
              ? 'Access the vast collection of ressources, and stay updated' 
              : 'Please complete all fields and upload a valid university ID to gain access to the library'}
        </p>



        <Form {...form}>
        <form 
            onSubmit={form.handleSubmit(handleSubmit)} 
            className="space-y-6 w-full"
            >
            {Object.keys(defaultValues).map((field)=>(

                <FormField
                key={field}
                control={form.control}
                name={field as Path<T>}
                render={({ field }) => (
                  <FormItem>

                    <FormLabel className="capitalize">
                        {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                    </FormLabel>

                    <FormControl>

                        {field.name === "universityCard" ? 
                            <ImageUpload onFileChange={field.onChange} />:
                            <Input 
                                required
                                type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]} 
                                {...field} 
                                className="form-input"
                                value={field.value === 0 ? '' : field.value}
                         />
                        }

                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

            ))}

        

          <Button type="submit" className="form-btn" size="default">{isSignIn ? 'Sign In' : 'Sign Up'}</Button>
        </form>
        </Form>





        <p className="text-center text-base font-medium">
            {isSignIn ? 'New to BookWise? ' : 'Already have an account? '}

            <Link href={isSignIn ? '/sign-up' : '/sign-in'} className="font-bold text-primary">
              {isSignIn ? 'Create an account' : 'Sign in'}
            </Link>
        </p>


    </div>  
    )
};

export default AuthForm;


