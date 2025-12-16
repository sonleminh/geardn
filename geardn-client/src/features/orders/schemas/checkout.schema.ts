import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z
  .string('Tên không được để trống')
  .min(5, { message: 'Tối thiểu 5 ký tự' }),
phoneNumber: z
  .string('Số điện thoại không được để trống')
  .trim()
  .min(10, { message: 'Tối thiểu 10 ký tự' }),
  email: z
  .string()
  .trim()
  .email({ message: 'Email không hợp lệ' })
  .min(4, { message: 'Tối thiểu 4 ký tự' }).optional(),
});
