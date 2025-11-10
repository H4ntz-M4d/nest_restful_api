import { z, ZodType } from "zod";

export class ContactValidation {
    static readonly CREATE: ZodType = z.object({
        first_name: z.string().min(3).max(100),
        last_name: z.string().min(3).max(100).optional(),
        email: z.email().optional(),
        phone: z.string().min(3).max(20).optional(),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        first_name: z.string().min(3).max(100),
        last_name: z.string().min(3).max(100).optional(),
        email: z.email().optional(),
        phone: z.string().min(3).max(20).optional(),
    })
}