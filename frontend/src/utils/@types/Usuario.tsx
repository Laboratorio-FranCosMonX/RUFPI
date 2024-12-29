export interface RegisterUsuario {
  nome: string
  email: string
  cpf: number
  senha: string
  tipo: "administrador" | "discente"
  id: number
}