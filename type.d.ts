/*

The type.d.ts file is a TypeScript declaration file. It helps define types globally without needing to import them in every file. It is especially useful in Next.js projects when dealing with custom types, module declarations, or extending default types.

*/


interface Book{
    id:number
    title: string;
    author: string; 
    genre: string; 
    rating: number;
    total_copies: number;
    available_copies: number;
    description: string; 
    color: string; 
    cover: string; 
    video: string;
    summary: string;
    isLoanedBook?: boolean;
}


interface AuthCredentials {
    fullName: string;
    email: string;
    password: string;
    universityId: number;
    universityCard: string; //of type string as it will be a url to an upload image
}