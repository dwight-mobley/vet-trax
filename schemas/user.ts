import {z} from "zod";

export const UserSchema = z.object({
    id: z.uuid({message: "Invalid user id format."}),
    email: z.string().email({message: "Invalid email address."}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long."}),
    name: z.string().min(2, {message: "Name must be at least 2 characters long."}),
    role: z.enum(["admin", "user"]),
    updatedAt: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, {message: "Invalid date format."}),
    createdAt: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, {message: "Invalid date format."}),
});

export type User = z.infer<typeof UserSchema>;