import { z } from 'zod';

export const AtualizarSenhaSchema = z
  .object({
    senhaAntiga: z.string().max(30, { message: 'O campo não pode ultrapassar mais que 30 caracteres.' }),
    senha: z.string().min(6, { message: 'A senha deve conter, no mínimo, 6 caracteres.' })
      .max(30, { message: 'O campo não pode ultrapassar mais que 30 caracteres.' }),
    repetirSenha: z.string().min(6, { message: 'A senha deve conter, no mínimo, 6 caracteres.' })
      .max(30, { message: 'O campo não pode ultrapassar mais que 30 caracteres.' }),
  })
  .required()
  .refine(data => data.senha === data.repetirSenha, {
    message: 'As senhas devem ser iguais nos campos senha e repetir senha.',
    path: ['repeatPassword'],
  })

export type AtualizarSenhaFormData = z.infer<typeof AtualizarSenhaSchema>