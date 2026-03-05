import { useRouter } from 'expo-router'
import { Tela } from '../../componente/layout/tela'
import { AdminOptionList } from '../admin-options'

const opcoesAdmin = [
    { nome: 'Inclusão de Atleta', icone: 'account-plus-outline', rota: '/admin/atletas/incluir-atleta', disable: false },
    { nome: 'Vincular Atleta à Categoria', icone: 'account-plus-outline', rota: '/admin/atletas/vincular-atleta', disable: false },
    { nome: 'Editar Atleta', icone: 'account-plus-outline', rota: '/admin/atletas/editar-atleta', disable: true },
]

export default function AtletasAdminScreen() {
    const router = useRouter()

    return (
        <Tela title="Atletas (Admin)">
            <AdminOptionList
                opcoes={opcoesAdmin}
            />
        </Tela>
    )
}
