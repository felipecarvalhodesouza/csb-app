import { YStack, XStack, Text, Button, Tabs } from 'tamagui'
import Jogo from '../domain/jogo'
import PlayerStats from './player-stats'
import { Atleta } from '../domain/atleta'

type EstatisticasJogoProps = {
  timeSelecionado: 'MAN' | 'VIS'
  setTimeSelecionado: (time: 'MAN' | 'VIS') => void
  jogo: Jogo | null
}

export default function EstatisticasJogo({ timeSelecionado, setTimeSelecionado, jogo }: EstatisticasJogoProps) {
  const atletasMandante = jogo?.atletasMandante ?? []
  const atletasVisitante = jogo?.atletasVisitante ?? []
  const atletasTitularesMandante = atletasMandante.filter((a: any) => a.titular)
  const atletasTitularesVisitante = atletasVisitante.filter((a: any) => a.titular)
  const atletasReservasMandante = atletasMandante.filter((a: any) => !a.titular)
  const atletasReservasVisitante = atletasVisitante.filter((a: any) => !a.titular)

  function convertToEstatisticaAtleta(atleta: Atleta) {
    return {
      id: String(atleta.id),
      nome: atleta.nome ?? 'Sem nome',
      pontos: atleta.pontos ?? 0,
      rebotes: atleta.rebotes ?? 0,
      assistencias: atleta.assistencias ?? 0,
      faltas: atleta.faltas ?? 0,
      roubos: atleta.roubos ?? 0,
      tocos: atleta.tocos ?? 0,
    }
  }

  return (
    <>
      {/* Team Tabs */}
      <Tabs value={timeSelecionado} onValueChange={v => setTimeSelecionado(v as 'MAN' | 'VIS')} ml={"$4"} mr={"$4"}>

        <Tabs.List width="100%" justifyContent="space-between" alignItems="center" mb="$2">
          <Tabs.Tab value="MAN" flex={1}>
            <Text>{String(jogo.mandante.nome)}</Text>
          </Tabs.Tab>
          <Tabs.Tab value="VIS" flex={1}>
            <Text>{String(jogo.visitante.nome)}</Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <YStack borderWidth={1} borderColor="$gray6" br="$3" >
      <PlayerStats atletas={timeSelecionado === 'MAN' ? atletasTitularesMandante.map((j: any) => convertToEstatisticaAtleta(j.atleta)) : atletasTitularesVisitante.map((j: any) => convertToEstatisticaAtleta(j.atleta))}
                   titulares={true} />
      

      <PlayerStats atletas={timeSelecionado === 'MAN' ? atletasReservasMandante.map((j: any) => convertToEstatisticaAtleta(j.atleta)) : atletasReservasVisitante.map((j: any) => convertToEstatisticaAtleta(j.atleta))}
                   titulares={false} />

      </YStack>



    </>
  )
}