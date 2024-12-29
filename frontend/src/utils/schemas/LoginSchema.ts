import { z } from 'zod';

export const LoginSchema = z
  .object({
    id: z.string().min(1, { message: 'Este campo não pode estar vazio.' })
      .max(20, { message: 'O campo não pode ultrapassar mais que 20 digitos.' }),
    senha: z.string().min(6, { message: 'A senha deve conter, no mínimo, 6 caracteres.' })
      .max(30, { message: 'O campo não pode ultrapassar mais que 30 caracteres.' })
  })
  .required()

export type LoginFormData = z.infer<typeof LoginSchema>