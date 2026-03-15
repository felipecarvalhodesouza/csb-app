import { ScrollView, YStack } from "tamagui"
import { AthleteHeader } from "../componente/atleta/AthleteHeader"
import { AthleteInfoCard } from "../componente/atleta/AthleteInfoCard"
import { AthleteStatsTable } from "../componente/atleta/AthleteStatsTable"
import { useLocalSearchParams } from "expo-router"
import { Tela } from "../componente/layout/tela"
import { PersonalRecordsCard } from "../componente/atleta/PersonalRecordsCard"

export default function AthleteProfileScreen() {
  const { id } = useLocalSearchParams()

    // const loadAtleta = async () => {
    //     try {

    //         const atleta = await apiFetch<>(`${API_BASE_URL}/atletas/${id}`)

    //     } catch (e: any) {
    //         setError(true)
    //         setMessage(e.message)
    //         setShowDialog(true)
    //     } finally {
    //         setLoading(false)
    //     }
    // }


  return (
    <Tela title="Detalhes do Atleta">
        <AthleteHeader
          nome="Rafael Frias da Costa"
          equipe="Flamengo"
          numero={7}
        />

        <AthleteInfoCard
          altura="1.95"
          peso="90kg"
          posicao="Armador"
          idade={28}
        />

        <AthleteStatsTable
          stats={[
            { label: "Pontos", valor: 18 },
            { label: "Rebotes", valor: 6 },
            { label: "Assistências", valor: 5 },
            { label: "Roubos", valor: 2 },
          ]}
        />

        <PersonalRecordsCard
          records={[
            {
              label: "Pontos",
              value: 32,
              jogo: "Flamengo x Franca",
              data: "12/02/2026"
            },
            {
              label: "Rebotes",
              value: 14
            },
            {
              label: "Assistências",
              value: 11
            },
            {
              label: "Roubos",
              value: 5
            }
          ]}
        />
    </Tela>
  )
}