import { useEffect, useState } from "react"
import { YStack, Text, Button} from "tamagui"
import { useLocalSearchParams, useRouter } from "expo-router"
import { EventoAuditoriaItem } from  "../componente/evento-auditoria/EventoAuditoriaItem"
import { Tela } from "../componente/layout/tela"
import { ChevronLeft } from '@tamagui/lucide-icons'
import { apiDelete, apiFetch } from "../utils/api"
import { API_BASE_URL } from "../../utils/config"

export default function AuditoriaEventos() {
  const { jogoId } = useLocalSearchParams()
  const [eventos, setEventos] = useState([])
  const router = useRouter()

  useEffect(() => {
    carregarEventos()
  }, [])

  async function carregarEventos() {
    const eventos = await apiFetch<any>(`${API_BASE_URL}/jogos/${jogoId}/eventos`)
    setEventos(eventos)
  }

  async function apagarEvento(id: number) {
    setEventos(eventos.filter(e => e.id !== id))

      try {
        await apiDelete(`${API_BASE_URL}/jogos/${jogoId}/eventos/${id}`)
      } catch (e) {
        alert('Erro ao apagar evento')
      }
    }

  function voltar() {
       return (<Button icon={ChevronLeft} chromeless onPress={() => router.back()} />)
  }

  return (
    <Tela title="Auditoria de Eventos" button={voltar()}>
      <YStack p="$4" space="$3">
        {eventos.length === 0 ? (
          <YStack ai="center" jc="center" mt="$6" space="$3">
            <Text color="$gray10" fontSize={16}>
              Nenhum evento registrado
            </Text>
            <Text color="$gray9" fontSize={13}>
              Os eventos do jogo aparecerão aqui.
            </Text>
          </YStack>
        ) : (
          eventos.map((evento) => (
            <EventoAuditoriaItem
              key={evento.id}
              evento={evento}
              onDelete={apagarEvento}
            />
          ))
        )}
      </YStack>
    </Tela>
  )
}