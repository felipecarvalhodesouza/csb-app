import { useRouter } from 'expo-router'

const torneioEmAndamento = 'CBS 2025'

export default function TorneiosScreen() {
  const router = useRouter()

  const handleSelecionar = (torneioId: string) => {
    router.replace(`/selecionar-equipe?torneio=${torneioId}`)
  }

  return (
    handleSelecionar(torneioEmAndamento)
  )
}
