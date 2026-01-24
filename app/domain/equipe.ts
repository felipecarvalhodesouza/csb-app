import Categoria from "./categoria";

export default interface Equipe {
  id: number;
  nome: string;
  modalidade: string;
  imagemPath: string | null;
  categorias: Categoria[] | null;
}