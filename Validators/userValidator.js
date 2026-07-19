import {z} from "zod";

export const userSchema = z.object({
    nom: z.string({
        required_error:"nom must be passed",
        invalid_type_error:"the nom must be a string"
    }),
    prenom: z.string({
        required_error:"nom must be passed",
        invalid_type_error:"the nom must be a string"
    }),
    email: z.email({
        required_error:"must pass the email",
        invalid_type_error:"problem in the format of the email"
    }),
    password: z.string().min(8),
    sexe: z.enum(["male","female"]),
    username: z.string()

    

})