import { Tela } from '../../componente/layout/tela'
import { AdminOptionList } from '../admin-options'

const opcoesAdmin = [
  { nome: 'Inclusão de Estatístico', icone: 'account-plus-outline', rota: '/admin/estatistico/incluir-estatistico', disable: false },
]

export default function EstatisticoAdminScreen() {

    return (
        <Tela title="Estatísticos (Admin)">
            <AdminOptionList
                opcoes={opcoesAdmin}
            />
        </Tela>
    )
}
