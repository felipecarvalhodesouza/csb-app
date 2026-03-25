import {
  YStack,
  XStack,
  Text,
  ScrollView,
  Theme,
  Spinner
} from 'tamagui'
import FloatingActionButton from './componente/FloatingActionButton'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import YoutubePlayer from 'react-native-youtube-iframe'
import { Pressable } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { apiFetch } from './utils/api'
import Jogo from './domain/jogo'
import ResumoJogo from './componente/resumo-jogo'
import EstatisticasJogo from './componente/estatisticas-jogo'
import { useEffect } from 'react'
import { API_BASE_URL } from '../utils/config'
import LanceALance from './componente/lance-a-lance'
import { TeamScore } from './componente/team-score'
import { Tela } from './componente/layout/tela'

function extractYouTubeVideoId(videoUrl: string | null | undefined): string | null {
  if (!videoUrl) return null

  // Se já for apenas ID
  const idOnly = videoUrl.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(idOnly)) {
    return idOnly
  }

  try {
    const u = new URL(videoUrl)

    if ((u.hostname.includes('youtube.com') || u.hostname.includes('www.youtube.com')) && u.searchParams.get('v')) {
      return u.searchParams.get('v')
    }

    // Verificar para lives do YouTube
    if ((u.hostname.includes('youtube.com') || u.hostname.includes('www.youtube.com')) && u.pathname.includes('/live/')) {
      const liveMatch = u.pathname.match(/\/live\/([a-zA-Z0-9_-]{11})/)
      if (liveMatch) return liveMatch[1]
    }

    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1)
    }

    if (u.pathname.includes('/embed/')) {
      return u.pathname.split('/embed/')[1]
    }
  } catch {

    const fallback = videoUrl.match(/(?:v=|youtu\.be\/|embed\/|\/live\/)([a-zA-Z0-9_-]{11})/)
    if (fallback) return fallback[1]
  }

  return null
}

export default function TelaJogo() {

  const { jogoId } = useLocalSearchParams<{jogoId:string}>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeSelecionado, setTimeSelecionado] = useState<'MAN' | 'VIS'>('MAN')
  const [jogo, setJogo] = useState<Jogo>()
  const [aba, setAba] = useState<'Resumo' | 'Estatísticas' | 'Lances' | 'Líderes'>('Resumo')

  const fetchJogo = useCallback(async () => {
    try {
      const data = await apiFetch<Jogo>(`${API_BASE_URL}/jogos/${jogoId}`)
      setJogo(data)
    } catch (error) {
      console.error('Error fetching jogo:', error)
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }, [jogoId])

  useFocusEffect(
    useCallback(() => {
      fetchJogo()
    }, [fetchJogo])
  )

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (!jogo) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Text>Jogo não encontrado.</Text>
      </YStack>
    )
  }

  return (
    <Tela title={jogo.mandante.nome + ' vs ' + jogo.visitante.nome}>
      {/* Botão flutuante de edição, apenas para ADM */}

      <XStack jc="space-between" ai="center" m="$3">
        <TeamScore
          team={jogo.mandante}
          score={jogo.placarMandante}
          align="left"
        />

        <YStack ai="center" space="$1">
          <Text fontSize={16} fontWeight="700" color="$gray10">
              {jogo.status === 'EM_ANDAMENTO' ? 'Em andamento' : jogo.status === 'ENCERRADO' ? 'Jogo encerrado' : 'Jogo não iniciado'}
          </Text>
          {jogo.status !== 'ENCERRADO' && (
          <>
            <Text fontSize={16} fontWeight="700" color="$gray10">
                Período
            </Text>
            <Text fontSize={14} color="$gray10">
              {(jogo.periodo && (Number(jogo.periodo) + 1 > 4 ? 'OT ' + (Number(jogo.periodo) - 4) : jogo.periodo + 1)) || 'Não iniciado'}
            </Text>
          </>
          )}
        </YStack>

        <TeamScore
          team={jogo.visitante}
          score={jogo.placarVisitante}
          align="right"
        />
      </XStack>

        {/* YouTube ao vivo */}
        {jogo.streamUrl && (
          <YStack mb="$4">
            {extractYouTubeVideoId(jogo.streamUrl) ? (
              <YoutubePlayer height={200} play={true} videoId={extractYouTubeVideoId(jogo.streamUrl)!} />
            ) : (
              <Text color="$red10" fontSize={12} mt="$1">URL do stream inválida</Text>
            )}
            { jogo.status === 'EM_ANDAMENTO' && (
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
          <LanceALance eventos={jogo.eventos} mandanteId={jogo.mandante.id} />
        )}

        {aba === 'Líderes' && (
          <YStack ai="center" mt="$4" mb="$4">
            <Text fontSize={16} color="$gray10">Líderes do jogo (adicione conteúdo aqui)</Text>
          </YStack>
        )}

      <FloatingActionButton
        actions={[{
          icon: <MaterialCommunityIcons name="pencil" size={28} color="$gray12" />,
          label: 'Editar Jogo',
          onPress: () => router.push(`/admin/editar-jogo?jogoId=${jogoId}`)
        }]}
        adminOnly={true}
        position={{ bottom: 30, right: 24 }}
      />
    </Tela>
  )
}
