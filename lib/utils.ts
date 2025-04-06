import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


//inputs is an array of infinite argument 
export function cn(...inputs: ClassValue[]) { //ClassValue types that include tailwindCSS logic
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string): string => 
  name
  .split(" ")
  .map((part)=> part[0])
  .join("")
  .toUpperCase()
  .slice(0,2);



export function getFirstNameCapitalized(fullName: string | undefined | null): string {
    // Handle undefined/null cases by returning an empty string or default value
    if (!fullName) return '';
    
    // Split the string by space and take the first element
    const firstName = fullName.split(' ')[0];
    
    // Capitalize first letter and add rest of the letters
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}





/*
clsx(inputs):

clsx is a utility function (often used in React projects) that combines class names and conditionally applies them.

*/
/*
twMerge(clsx(inputs)):

twMerge is typically a utility that merges Tailwind CSS class names and removes conflicting or redundant ones. This is particularly useful when you have multiple conditional Tailwind CSS classes and want to avoid duplication or conflicts.

For example, if you have 'bg-red-500 bg-blue-500' in your class names, twMerge would resolve the conflict and only keep 'bg-blue-500'.
*/