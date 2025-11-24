import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  name: z.string().min(5, { message: 'Tên không hợp lệ' }),
  password: z.string().min(6, { message: 'Tối thiểu 6 ký tự' }),
});
