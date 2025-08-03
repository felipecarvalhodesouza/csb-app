import {
  YStack,
  XStack,
  Text,
  Button,
  ScrollView,
  Theme,
} from 'tamagui'
import { useState } from 'react'
import YoutubePlayer from 'react-native-youtube-iframe'
import Footer from './footer'
import Header from './header'
import { Pressable } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router'
import { apiFetch } from './utils/api'
import Jogo from './domain/jogo'
import ResumoJogo from './componente/resumo-jogo'

const mockJogo = {
  id: '1',
  status: 'live',
  periodo: 'Q1',
  placar: {
    CHI: 30,
    DAL: 25,
  },
  transmissaoYoutubeId: 'dQw4w9WgXcQ',
  estatisticas: {
    CHI: [
      { nome: 'J. Tatum', pos: 'SF', fault: '1', pts: 10, reb: 5, ast: 1 , titular: true},
      { nome: 'A. Horford', pos: 'PF', fault: '0', pts: 2, reb: 1, ast: 1, titular: true },
      { nome: 'J. Brown', pos: 'SG', fault: '0', pts: 8, reb: 2, ast: 3, titular: true },
      { nome: 'D. White', pos: 'PG', fault: '0', pts: 5, reb: 1, ast: 4, titular: true },
      { nome: 'K. Porzingis', pos: 'C', fault: '0', pts: 6, reb: 6, ast: 0, titular: true },
      { nome: 'S. Hauser', pos: 'SF', fault: '0', pts: 3, reb: 2, ast: 1 },
      { nome: 'P. Pritchard', pos: 'PG', fault: '0', pts: 4, reb: 1, ast: 2 },
      { nome: 'L. Kornet', pos: 'C', fault: '0', pts: 2, reb: 3, ast: 0 },
      { nome: 'O. Brissett', pos: 'PF', fault: '0', pts: 1, reb: 2, ast: 1 },
      { nome: 'D. Banton', pos: 'SG', fault: '0', pts: 3, reb: 1, ast: 0 },
      { nome: 'J. Walsh', pos: 'SF', fault: '0', pts: 2, reb: 0, ast: 0 },
      { nome: 'N. Queta', pos: 'C', fault: '0', pts: 0, reb: 1, ast: 0 },
    ],
    DAL: [
      { nome: 'F. Wagner', pos: 'SF', fault: '1', pts: 6, reb: 3, ast: 2 , titular: true},
      { nome: 'P. Banchero', pos: 'PF', fault: '1', pts: 5, reb: 4, ast: 1, titular: true },
      { nome: 'C. Anthony', pos: 'PG', fault: '1', pts: 7, reb: 2, ast: 3, titular: true },
      { nome: 'M. Fultz', pos: 'SG', fault: '0', pts: 4, reb: 1, ast: 2, titular: true},
      { nome: 'W. Carter Jr.', pos: 'C', fault: '0', pts: 6, reb: 5, ast: 1, titular: true },
      { nome: 'J. Isaac', pos: 'PF', fault: '0', pts: 2, reb: 3, ast: 0 },
      { nome: 'G. Harris', pos: 'SG', fault: '0', pts: 3, reb: 1, ast: 1 },
      { nome: 'J. Suggs', pos: 'PG', fault: '0', pts: 5, reb: 1, ast: 3 },
      { nome: 'M. Schofield', pos: 'SF', fault: '0', pts: 1, reb: 2, ast: 0 },
      { nome: 'B. Bitadze', pos: 'C', fault: '0', pts: 2, reb: 2, ast: 1 },
      { nome: 'K. Black', pos: 'PG', fault: '0', pts: 0, reb: 0, ast: 1 },
      { nome: 'A. Inglis', pos: 'PF', fault: '0', pts: 1, reb: 1, ast: 0 },
    ],
  },
}

export default function TelaJogo() {

  const { jogoId } = useLocalSearchParams<{jogoId:string}>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeSelecionado, setTimeSelecionado] = useState<'CHI' | 'DAL'>('CHI')
  const [aba, setAba] = useState<'Resumo' | 'Estatísticas' | 'Lance a Lance' | 'Líderes'>('Resumo')

  return (
    <Theme>
      <YStack f={1} bg="$background" jc="space-between" pb={"$9"} pt={"$6"}>
      <ScrollView bg="$background" pr="$4" pl="$4">
        <Header title='Jogo' />
        {/* Header com placar */}
        <XStack jc="space-between" ai="center" mb="$2">
          <Text fontSize={20} fontWeight="700">
            {mockJogo.placar.CHI}
          </Text>
          <Text fontSize={14} color="$gray10">
            {mockJogo.periodo}
          </Text>
          <Text fontSize={20} fontWeight="700">
            {mockJogo.placar.DAL}
          </Text>
        </XStack>

        <XStack jc="space-between" mb="$4">
          <Text fontSize={12} color="$gray10">BOS</Text>
          <Text fontSize={12} color="$gray10">ORL</Text>
        </XStack>

        {/* YouTube ao vivo */}
        {mockJogo.transmissaoYoutubeId && (
          <YStack mb="$4">
            <YoutubePlayer height={200} play={false} videoId={mockJogo.transmissaoYoutubeId} />
            <Text color="$red10" fontSize={12} mt="$1">Ao vivo</Text>
          </YStack>
        )}

        {/* Carrossel de abas */}
        <XStack jc="center" mb="$3" width="100%" bg="$background" borderRadius="$4" overflow="hidden">
          {['Resumo', 'Estatísticas', 'Lances', 'Líderes'].map((tab) => (
            <Pressable
              key={tab}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                backgroundColor: aba === tab ? '$background ' : '$color',
                borderBottomWidth: aba === tab ? 0 : 1,
                borderBottomColor: '$gray6',
              }}
              onPress={() => setAba(tab as typeof aba)}
            >
              <Text
                fontWeight={aba === tab ? '700' : '400'}
                color={aba === tab ? '$gray1 ' : '$color'}
                fontSize={14}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </XStack>

        {/* Conteúdo das abas */}
        {aba === 'Resumo' && (
          <ResumoJogo jogo={mockJogo} />
        )}

        {aba === 'Estatísticas' && (
          <>
            {/* Botões para alternar time */}
            <XStack jc="center" mb="$3" space>
              <Button
                size="$2"
                variant="outlined"
                backgroundColor={timeSelecionado === 'CHI' ? '$blue8' : undefined}
                color={timeSelecionado === 'CHI' ? '$color' : undefined}
                onPress={() => setTimeSelecionado('CHI')}
              >
                BOS
              </Button>
              <Button
                size="$2"
                variant="outlined"
                backgroundColor={timeSelecionado === 'DAL' ? '$blue8' : undefined}
                color={timeSelecionado === 'DAL' ? '$color' : undefined}
                onPress={() => setTimeSelecionado('DAL')}
              >
                ORL
              </Button>
            </XStack>

            {/* Tabela de estatísticas */}
            <YStack borderWidth={1} borderColor="$gray6" br="$3" >
              {/* Cabeçalho */}
              <XStack bg="$gray5" p="$2">
                <Text flex={2} fontWeight="600">Titulares</Text>
                <Text flex={1} textAlign="center" fontWeight="600">PTS</Text>
                <Text flex={1} textAlign="center" fontWeight="600">REB</Text>
                <Text flex={1} textAlign="center" fontWeight="600">AST</Text>
                <Text flex={1} textAlign="center" fontWeight="600">F</Text>
              </XStack>

              {/* Linhas */}
              {mockJogo.estatisticas[timeSelecionado].filter((jogador) => jogador.titular).map((jogador, i) => (
                <XStack key={i} p="$2" bg={i % 2 === 0 ? '$background' : '$gray2'}>
                  <Text flex={2}>{jogador.nome} <Text fontSize={10} color="$gray10">{jogador.pos}</Text></Text>
                  <Text flex={1} textAlign="center">{jogador.pts}</Text>
                  <Text flex={1} textAlign="center">{jogador.reb}</Text>
                  <Text flex={1} textAlign="center">{jogador.ast}</Text>
                  <Text flex={1} textAlign="center">{jogador.fault}</Text>
                </XStack>
              ))}

              <XStack bg="$gray5" p="$2">
                <Text flex={2} fontWeight="600">Reservas</Text>
                <Text flex={1} textAlign="center" fontWeight="600">PTS</Text>
                <Text flex={1} textAlign="center" fontWeight="600">REB</Text>
                <Text flex={1} textAlign="center" fontWeight="600">AST</Text>
                <Text flex={1} textAlign="center" fontWeight="600">F</Text>
              </XStack>
              {mockJogo.estatisticas[timeSelecionado].filter((jogador) => !jogador.titular).map((jogador, i) => (
                <XStack key={i} p="$2" bg={i % 2 === 0 ? '$background' : '$gray2'}>
                  <Text flex={2}>{jogador.nome} <Text fontSize={10} color="$gray10">{jogador.pos}</Text></Text>
                  <Text flex={1} textAlign="center">{jogador.pts}</Text>
                  <Text flex={1} textAlign="center">{jogador.reb}</Text>
                  <Text flex={1} textAlign="center">{jogador.ast}</Text>
                  <Text flex={1} textAlign="center">{jogador.fault}</Text>
                </XStack>
              ))}
            </YStack>
          </>
        )}

        {aba === 'Lance a Lance' && (
          <YStack ai="center" mt="$4" mb="$4">
            <Text fontSize={16} color="$gray10">Lance a Lance (adicione conteúdo aqui)</Text>
          </YStack>
        )}

        {aba === 'Líderes' && (
          <YStack ai="center" mt="$4" mb="$4">
            <Text fontSize={16} color="$gray10">Líderes do jogo (adicione conteúdo aqui)</Text>
          </YStack>
        )}
      </ScrollView>
      <Footer/>
    </YStack>
    </Theme>
  )
}
