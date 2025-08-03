export default interface Torneio {
  id?: number;
  nome?: string;
  modalidade?: string;
  status?: string;
  ano?: number;
  categorias?: any[] | null;
  patrocinadores?: any[] | null;
}