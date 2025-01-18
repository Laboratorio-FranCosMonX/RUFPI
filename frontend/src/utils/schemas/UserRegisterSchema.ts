import { z } from 'zod';

export const userRegisterSchema = z
  .object({
    nome: z.string({
      message: "Nesse campo deve conter obrigatoriamente uma string."
    }).min(1, { message: 'O nome não pode estar vazio.' })
      .max(50, { message: 'O campo não pode ultrapassar mais que 50 caracteres.' }),
    cpf: z.number({ message: "Campo obrigatório" }).positive(),
    id: z.number({ message: "Campo obrigatório" }).positive(),
    tipo: z.number(),
    nutricionista: z.boolean(),
    email: z.string().email({ message: "O email é inválido." })
      .max(50, { message: 'O campo não pode ultrapassar mais que 50 caracteres.' }),
    senha: z.string().min(6, { message: 'A senha deve conter, no mínimo, 6 caracteres.' })
      .max(30, { message: 'O campo não pode ultrapassar mais que 30 caracteres.' }),
    repetirSenha: z.string().min(1, { message: 'A senha não pode estar vazia.' })
      .max(30, { message: 'O campo não pode ultrapassar mais que 30 caracteres.' }),
  })
  .required()
  .refine(data => data.senha === data.repetirSenha, {
    message: 'As senhas devem ser iguais nos campos senha e repetir senha.',
    path: ['repeatPassword'],
  })

export type userRegisterFormData = z.infer<typeof userRegisterSchema>