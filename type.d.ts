/*

The type.d.ts file is a TypeScript declaration file. It helps define types globally without needing to import them in every file. It is especially useful in Next.js projects when dealing with custom types, module declarations, or extending default types.

*/


interface Book{
    id:string;
    title: string;
    author: string; 
    genre: string; 
    rating: number;
    totalCopies: number;
    availableCopies: number;
    description: string; 
    coverColor: string; 
    coverUrl: string; 
    videoUrl: string;
    summary: string;
    createdAt: Date | null;
}


interface AuthCredentials {
    fullName: string;
    email: string;
    password: string;
    universityId: number;
    universityCard: string; //of type string as it will be a url to an upload image
}

interface BookParams {
    title: string;
    author: string;
    genre: string;
    rating: number;
    coverUrl: string;
    coverColor: string;
    description: string;
    totalCopies: number;
    videoUrl: string;
    summary: string;
}


interface BorrowBookParams{
    bookId: string;
    userId: string;
}