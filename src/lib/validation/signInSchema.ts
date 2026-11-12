import {z} from 'zod';

export const signInSchema = z.object({
  username: z.string().min(1, 'validation.usernameRequired'),
  password: z.string().min(1, 'validation.passwordRequired'),
});

export const registerCustomerSchema = z.object({
  fullname: z.string().min(1, 'validation.nameRequired'),
  role:z.literal('CUSTOMER'),
  phoneNumber: z.string().min(10, 'validation.phoneMin'),
  password: z.string().min(6, 'validation.passwordMin'),
});