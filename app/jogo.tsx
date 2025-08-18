import {
  YStack,
  XStack,
  Text,
  Button,
  ScrollView,
  Theme,
  Spinner
} from 'tamagui'
import { useState } from 'react'
import YoutubePlayer from 'react-native-youtube-iframe'
import Footer from './footer'
import Header from './header'
import { Pressable } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { apiFetch } from './utils/api'
import Jogo from './domain/jogo'
import ResumoJogo from './componente/resumo-jogo'
import EstatisticasJogo from './componente/estatisticas-jogo'
import { useEffect } from 'react'
import { API_BASE_URL } from '../utils/config'

export default function TelaJogo() {

  const { jogoId } = useLocalSearchParams<{jogoId:string}>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeSelecionado, setTimeSelecionado] = useState<'CHI' | 'DAL'>('CHI')
  const [jogo, setJogo] = useState<Jogo>()
  const [aba, setAba] = useState<'Resumo' | 'Estatísticas' | 'Lances' | 'Líderes'>('Resumo')

    useEffect(() => {
      const fetchJogos = async (options: RequestInit = {}) => {
        try {
          const data = await apiFetch<Jogo>(`${API_BASE_URL}/jogos/${jogoId}`, options)
          setJogo(data)
        } catch (error) {
          console.error('Error fetching jogos:', error)
          setError((error as Error).message)
        } finally {
          setLoading(false)
        }
      }
  
      fetchJogos()
    }, [])

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  return (
    <Theme>
      <YStack f={1} bg="$background" jc="space-between" pb={"$9"} pt={"$6"}>
      <ScrollView bg="$background" pr="$4" pl="$4">
        <Header title='Jogo' />
        {/* Header com placar */}
        <XStack jc="space-between" ai="center" m="$3">
          <Text fontSize={20} fontWeight="700">
            {jogo.placarMandante | 0}
          </Text>
          <Text fontSize={14} color="$gray10">
            {jogo.periodo || 'Não iniciado'}
          </Text>
          <Text fontSize={20} fontWeight="700">
            {jogo.placarVisitante | 0}
          </Text>
        </XStack>

        <XStack jc="space-between" mb="$4" ml={"$3"} mr={"$3"}>
          <Text fontSize={12} color="$gray10">BOS</Text>
          <Text fontSize={12} color="$gray10">ORL</Text>
        </XStack>

        {/* YouTube ao vivo */}
        {jogo.streamUrl && (
          <YStack mb="$4">
            <YoutubePlayer height={200} play={false} videoId={jogo.streamUrl} />
            { jogo.status === 'Em andamento' && (
              <Text color="$red10" fontSize={12} mt="$1">Ao vivo</Text>
            )}
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
          <ResumoJogo jogo={jogo} />
        )}

        {aba === 'Estatísticas' && (
          <EstatisticasJogo
            timeSelecionado={timeSelecionado}
            setTimeSelecionado={setTimeSelecionado}
            jogo={jogo}
          />
        )}

        {aba === 'Lances' && (
  <YStack ai="center" mt="$4" mb="$4" width="100%">
    {jogo.eventos.length === 0 ? (
      <Text color="$gray10">Nenhum evento registrado</Text>
    ) : (
      jogo.eventos
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .map(ev => {
          const isMandante = ev.equipe.id === jogo.mandante.id
          return (
            <XStack
              key={ev.id || ev.timestamp}
              width="100%"
              jc={isMandante ? "flex-start" : "flex-end"}
              mb="$2"
            >
              <YStack
                bg={isMandante ? "$yellow2" : "$blue2"}
                p="$3"
                borderRadius={12}
                elevation={2}
                maxWidth="80%"
                minWidth={180}
                ai={isMandante ? "flex-start" : "flex-end"}
                borderWidth={1}
                borderColor={isMandante ? "$yellow6" : "$blue6"}
                gap="$2"
              >
                <Text
                  fontWeight="700"
                  fontSize={16}
                  color={isMandante ? "$yellow10" : "$blue10"}
                  textAlign={isMandante ? "left" : "right"}
                >
                  {ev.tipo}
                </Text>
                <Text
                  fontSize={15}
                  color="$gray12"
                  fontWeight="500"
                  textAlign={isMandante ? "left" : "right"}
                >
                  {ev.descricao}
                </Text>
                <Text
                  fontSize={12}
                  color="$gray8"
                  fontWeight="400"
                  textAlign={isMandante ? "left" : "right"}
                >
                  {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </YStack>
            </XStack>
          )
        })
    )}
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
