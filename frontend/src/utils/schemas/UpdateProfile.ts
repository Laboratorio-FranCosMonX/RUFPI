import { z } from 'zod';

export const AtualizarPerfilSchema = z
  .object({
    nome: z.string({
      message: "Nesse campo deve conter obrigatoriamente uma string."
    }).max(50, { message: 'O campo não pode ultrapassar mais que 50 caracteres.' }),
    nutricionista: z.boolean(),
  })

export type AtualizarPerfilFormData = z.infer<typeof AtualizarPerfilSchema>