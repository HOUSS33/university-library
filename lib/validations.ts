//This code defines a validation schema using Zod, a TypeScript-first library for validating data. The schema ensures that user-provided data for signing up meets specific requirements.
//Zod is a TypeScript-first validation library that helps validate and sanitize data at runtime, ensuring that the input data matches the expected format.


//This brings in the z object from the Zod library, which allows us to define and enforce validation rules.
import {z} from "zod";



//The z.object({...}) is used to define an object schema in Zod.
//z.object({...}) → Defines an object schema (like a form structure).
//Inside {...} → We define the fields and their validation rules.

export const signUpSchema = z.object({
    fullName: z.string().min(3),          //fullName → Must be a string with at least 3 characters.
    email: z.string().email(),            //email → Must be a valid email format.
    universityId: z.coerce.number(),      //→Converts input to a number (coerce means it will convert "123" to 123).  
    //universityCard → Must be a non-empty string. If empty, it will show the error: "University card is required"
    universityCard: z.string().nonempty('University card is required'),  
    password: z.string().min(8),          //convert a string like "123" to 123).

});
 

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),

});

export const bookSchema = z.object({
    title: z.string().trim().min(2).max(100),
    description: z.string().trim().min(10).max(1000),
    author: z.string().trim().min(2).max(100),
    genre: z.string().trim().min(2).max(50),
    rating: z.coerce.number().min(1).max(5),
    totalCopies: z.coerce.number().int().positive().lte(10000), // coerce turn it into a number, lte lower than
    coverUrl: z.string().nonempty(),
    coverColor: z.string().trim().regex(/^#[0-9A-F]{6}$/i),
    videoUrl: z.string().nonempty(),
    summary: z.string().trim().min(10),  // trim removes white spaces
});


/*

🔥 What This Does:
When someone fills out the sign-up form, this schema automatically checks if the data follows these rules.
If not, it returns an error.

*/