import {z} from 'zod';

export const usernameValidation=z
                                .string()
                                .min(2,"Username atleast 2 characters")
                                .max(20,'Must be not more than 20 characters')
export const signupSchema=z.object({
    username:usernameValidation,
    email_id: z.string().email({message:'Invalid email'}),
    password:z.string().min(6,{message:'Passowrd should be more that 6 characters'})

}) 