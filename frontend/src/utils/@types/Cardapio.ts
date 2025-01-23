export interface IngredienteType {
  id: number
  nome: string
}

export interface PratoType {
  id: number
  preferencia_alimentar: "geral" | "vegetariano"
  ingredientes: [IngredienteType]
}

export interface RefeicaoType {
  id: number
  tipo: "almoço" | "jantar" | "Café da manhã"
  anotacao: string
  pratos: [PratoType]
}

export interface CardapioType {
  id?: number
  data: Date
  createdAt: Date
  updatedAt: Date
  refeicoes: RefeicaoType[]
}