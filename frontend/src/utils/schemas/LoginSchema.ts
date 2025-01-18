import { z } from 'zod';

export const LoginSchema = z
  .object({
    email: z.string().min(1, { message: 'Este campo não pode estar vazio.' })
      .email("Este campo deve conter um email válido."),
    senha: z.string().min(6, { message: 'A senha deve conter, no mínimo, 6 caracteres.' })
      .max(30, { message: 'O campo não pode ultrapassar mais que 30 caracteres.' })
  })
  .required()

export type LoginFormData = z.infer<typeof LoginSchema>