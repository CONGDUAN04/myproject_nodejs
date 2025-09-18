import { isEmailExist } from "services/client/auth.service";
import { z } from "zod";

const passwordSchema = z
    .string()
    .min(3, { message: "Password tối thiểu 3 kí tự" })
    .max(20, { message: "Password tối đa 20 kí tự" })
    .refine((password) => /[A-Z]/.test(password), {
        message: "Password bao gồm ít nhất 1 kí tự viết hoa"
    })
    .refine((password) => /[a-z]/.test(password), {
        message: "Password bao gồm ít nhất 1 kí tự viết thường"
    })
    .refine((password) => /[0-9]/.test(password), {
        message: "Password bao gồm ít nhất 1 chữ số"
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
        message: "Password bao gồm ít nhất 1 kí tự đặc biệt"
    });
const emailSchema =
    z.string().email("Email không đúng định dạng")
        .refine(async (email) => {
            const existingUser = await isEmailExist(email);
            return !existingUser;
        }, {
            message: "Email already exists",
            path: ["email"]
        });
export const RegisterSchema = z.object({
    fullName: z.string().trim().min(1, { message: "Tên không được để trống" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    })
.refine((data)=> data.password === data.confirmPassword,{
    message:"Password confirm khong chinh xacs",
    path:['confirmPassword']
});
export type TRegisterSchema = z.infer<typeof RegisterSchema>;