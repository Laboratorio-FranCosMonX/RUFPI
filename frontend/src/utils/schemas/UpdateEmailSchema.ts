import { z } from 'zod';

export const AtualizarEmailSchema = z
  .object({
    senhaAntiga: z.string().max(30, { message: 'O campo não pode ultrapassar mais que 30 caracteres.' }),
    email: z.string().email({ message: "O email é inválido." })
      .max(50, { message: 'O campo não pode ultrapassar mais que 50 caracteres.' }),
  })
  .required()

export type AtualizarEmailFormData = z.infer<typeof AtualizarEmailSchema>