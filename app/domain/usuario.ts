export default interface Usuario {
  id: string
  nome: string
  email: string
  role: 'ADMIN' | 'ESTATISTICO' | 'USER'
}