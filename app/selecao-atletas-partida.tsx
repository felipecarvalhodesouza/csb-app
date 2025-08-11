import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import { YStack, XStack, Text, Button, Input, Checkbox, Separator, Spinner, Theme, Tabs } from 'tamagui'
import Jogo from './domain/jogo'
import { Atleta } from './domain/atleta'
import { apiFetch } from './utils/api'
import { useLocalSearchParams } from 'expo-router'
import Footer from './footer'
import Header from './header'
import { Check } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

type GameEditScreenProps = {
  onIniciar: (jogoEditado: Jogo) => void
}

type EquipeSelecaoProps = {
  atletas: Atleta[]
  onToggleTitular: (atletaId: number) => void
  onToggleConvocado: (atletaId: number) => void
  onSetNumero: (atletaId: number, numero: string) => void
  onSetTodosConvocados: (valor: boolean) => void
  maxTitulares: number
  maxJogadores: number
  equipeNome: string
}

function EquipeSelecao({
  atletas,
  onToggleTitular,
  onToggleConvocado,
  onSetNumero,
  onSetTodosConvocados,
  maxTitulares,
  maxJogadores,
}: EquipeSelecaoProps) {
  const titularesSelecionados = atletas.filter(a => a.titular).length
  const jogadoresSelecionados = atletas.filter(a => a.convocado).length

  const todosConvocados = atletas.length > 0 && atletas.every(a => a.convocado)

  function handleToggleTodosConvocados() {
    onSetTodosConvocados(!todosConvocados)
  }

  return (
    <Theme>
      <YStack>
        <XStack justifyContent="space-between" mb="$2" px="$2" ai="center"
          jc="space-between"
          py="$1"
          borderRadius={8}>
          <Text width={150} fontWeight="700"></Text>
          <Text width={50} fontWeight="700" style={{ textAlign: 'center' }}></Text>
          <Text width={15} fontWeight="700"></Text>
          <Checkbox
            checked={todosConvocados}
            onCheckedChange={handleToggleTodosConvocados}
            backgroundColor="$backgroundStrong"
            borderColor="$gray8"
          >
            <Checkbox.Indicator>
              <Check size={12} />
            </Checkbox.Indicator>
          </Checkbox>
        </XStack>
        <XStack justifyContent="space-between" mb="$2" px="$2" ai="center">
          <Text width={150} fontWeight="700">Nome</Text>
          <Text width={50} fontWeight="700" style={{ textAlign: 'center' }}>Nº</Text>
          <Text width={15} fontWeight="700">T</Text>
          <Text width={15} fontWeight="700" fontSize={12}>E</Text>
        </XStack>
        {atletas.map(atleta => (
          <XStack
            key={atleta.id}
            ai="center"
            jc="space-between"
            mb="$1"
            px="$2"
            py="$1"
            borderRadius={8}
            backgroundColor={atleta.titular ? "$green5" : "transparent"}
          >
            <Text width={150} numberOfLines={1} ellipsizeMode="tail">
              {atleta.nome}
            </Text>
            <Input
              width={50}
              placeholder="Nº"
              value={atleta.numero || ''}
              keyboardType="numeric"
              onChangeText={num => onSetNumero(atleta.id, num)}
              disabled={!atleta.convocado}
              backgroundColor="$backgroundStrong"
              color="$white"
              borderColor="$gray8"
              placeholderTextColor="#888"
              maxLength={2}
              style={{ textAlign: 'center' }}
            />
            <Checkbox ai='center'
              checked={!!atleta.titular}
              onCheckedChange={() =>
                onToggleTitular(atleta.id)
              }
              disabled={
                (!atleta.titular && titularesSelecionados >= maxTitulares) ||
                !atleta.convocado
              }
              backgroundColor="$backgroundStrong"
              borderColor="$gray8"
            >
              <Checkbox.Indicator>
                <Check />
              </Checkbox.Indicator>
            </Checkbox>
            <Checkbox
              checked={!!atleta.convocado}
              onCheckedChange={() => onToggleConvocado(atleta.id)}
              disabled={!atleta.convocado && jogadoresSelecionados >= maxJogadores}
              backgroundColor="$backgroundStrong"
              borderColor="$gray8"
            >
              <Checkbox.Indicator>
                <Check />
              </Checkbox.Indicator>
            </Checkbox>
          </XStack>
        ))}
        {atletas.length === 0 && (
          <Text color="$gray10">Nenhum atleta encontrado</Text>
        )}
        <Text mt="$2" fontSize={12} color="$gray10">
          {titularesSelecionados}/{maxTitulares} titulares, {jogadoresSelecionados}/{maxJogadores} no jogo
        </Text>
      </YStack>
    </Theme>
  )
}

export default function GameEditScreen({
  onIniciar
}: GameEditScreenProps) {
  const { jogoId, torneioId } = useLocalSearchParams()
  const [jogo, setJogo] = useState<Jogo | null>(null)
  const [mandante, setMandante] = useState<Atleta[]>([])
  const [visitante, setVisitante] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'mandante' | 'visitante'>('mandante')
  const router = useRouter()

  useEffect(() => {
    async function fetchJogo() {
      setLoading(true)
      try {
        const jogoData = await apiFetch<Jogo>(`http://192.168.1.13:8080/jogos/${jogoId}`)
        setJogo(jogoData)
      } finally {
        setLoading(false)
      }
    }
    fetchJogo()
  }, [jogoId])

  useEffect(() => {
    async function fetchAtletas() {
      setLoading(true)
      if (!jogo) return
      try {
        const [mandanteAtletas, visitanteAtletas] = await Promise.all([
          apiFetch<Atleta[]>(`http://192.168.1.13:8080/torneios/${torneioId}/categorias/${jogo.categoria.id}/equipes/${jogo.mandante.id}/atletas`),
          apiFetch<Atleta[]>(`http://192.168.1.13:8080/torneios/${torneioId}/categorias/${jogo.categoria.id}/equipes/${jogo.visitante.id}/atletas`),
        ])
        setMandante(mandanteAtletas)
        setVisitante(visitanteAtletas)
      } finally {
        setLoading(false)
      }
    }
    fetchAtletas()
  }, [jogo])

  function toggleTitular(equipe: 'mandante' | 'visitante', atletaId: number) {
    const setter = equipe === 'mandante' ? setMandante : setVisitante
    const lista = equipe === 'mandante' ? mandante : visitante
    setter(
      lista.map(a =>
        a.id === atletaId ? { ...a, titular: !a.titular } : a
      )
    )
  }

  function toggleConvocado(equipe: 'mandante' | 'visitante', atletaId: number) {
    const setter = equipe === 'mandante' ? setMandante : setVisitante
    const lista = equipe === 'mandante' ? mandante : visitante
    setter(
      lista.map(a =>
        a.id === atletaId ? { ...a, convocado: !a.convocado } : a
      )
    )
  }

  function setNumero(equipe: 'mandante' | 'visitante', atletaId: number, numero: string) {
    const setter = equipe === 'mandante' ? setMandante : setVisitante
    const lista = equipe === 'mandante' ? mandante : visitante
    setter(
      lista.map(a =>
        a.id === atletaId ? { ...a, numero } : a
      )
    )
  }

  function setTodosConvocados(equipe: 'mandante' | 'visitante', valor: boolean) {
    const setter = equipe === 'mandante' ? setMandante : setVisitante
    const lista = equipe === 'mandante' ? mandante : visitante
    setter(
      lista.map(a => {
        // Se for para desmarcar (valor === false) e o atleta é titular, mantém convocado como true
        if (!valor && a.titular) {
          return { ...a, convocado: true }
        }
        // Caso contrário, aplica normalmente
        return { ...a, convocado: valor }
      })
    )
  }

  async function handleIniciar() {
    if (!jogo) return
    setLoading(true)
    try {

      var jogoEditado: any = {
        jogoId: jogo.id,
        atletasMandante: mandante.filter(a => a.convocado).map(a => ({
          atletaId: a.id,
          titular: !!a.titular,
          numero: a.numero,
        })),
        atletasVisitante: visitante.filter(a => a.convocado).map(a => ({
          atletaId: a.id,
          titular: !!a.titular,
          numero: a.numero,
        })),
      }

      console.log(JSON.stringify({ jogoEditado }))


      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(`http://192.168.1.13:8080/jogos/${jogo.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(jogoEditado),
      })

      if (!response.ok) {
        throw new Error('Erro ao iniciar o jogo')
      }
      // Sucesso: navega para a tela de estatísticas ao vivo
      router.replace(`/estatisticas-ao-vivo?jogoId=${jogo.id}`)
    } catch (e) {
      alert('Erro ao iniciar o jogo')
    } finally {
      setLoading(false)
    }
  }

  function isButtonDisabled() {
    // 5 titulares em cada time
    const mandanteTitulares = mandante.filter(a => a.titular).length
    const visitanteTitulares = visitante.filter(a => a.titular).length

    // Números de camiseta únicos entre convocados
    const hasNumeroRepetido = (lista: Atleta[]) => {
      const numeros = lista.filter(a => a.convocado && a.numero).map(a => a.numero)
      return numeros.some((num, idx, arr) => arr.indexOf(num) !== idx)
    }

    return (
      loading ||
      mandanteTitulares !== 5 ||
      visitanteTitulares !== 5 ||
      hasNumeroRepetido(mandante) ||
      hasNumeroRepetido(visitante)
    )
  }

  if (loading || !jogo) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  return (
    <Theme>
      <YStack f={1} bg="$background" jc="space-between" pb="$9" pt="$6">
        <Header title='Seleção de Atletas' />
        <ScrollView>
          <YStack p="$4" space="$4">
            <Tabs
              value={tab}
              onValueChange={v => setTab(v as 'mandante' | 'visitante')}
              orientation="horizontal"
              width={'100%'}
            >
              <Tabs.List width="100%" justifyContent="space-between" alignItems="center" mb="$2">
                <Tabs.Tab value="mandante" flex={1}>
                  <Text>{String(jogo.mandante.nome)}</Text>
                </Tabs.Tab>
                <Tabs.Tab value="visitante" flex={1}>
                  <Text>{String(jogo.visitante.nome)}</Text>
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <Separator />
            {tab === 'mandante' && (
              <EquipeSelecao
                atletas={mandante}
                onToggleTitular={id => toggleTitular('mandante', id)}
                onToggleConvocado={id => toggleConvocado('mandante', id)}
                onSetNumero={(id, num) => setNumero('mandante', id, num)}
                onSetTodosConvocados={valor => setTodosConvocados('mandante', valor)}
                maxTitulares={5}
                maxJogadores={12}
                equipeNome={jogo.mandante.nome}
              />
            )}
            {tab === 'visitante' && (
              <EquipeSelecao
                atletas={visitante}
                onToggleTitular={id => toggleTitular('visitante', id)}
                onToggleConvocado={id => toggleConvocado('visitante', id)}
                onSetNumero={(id, num) => setNumero('visitante', id, num)}
                onSetTodosConvocados={valor => setTodosConvocados('visitante', valor)}
                maxTitulares={5}
                maxJogadores={12}
                equipeNome={jogo.visitante.nome}
              />
            )}
            <Separator />
            <Button theme="active" onPress={handleIniciar} disabled={isButtonDisabled()}>
              Iniciar Jogo
            </Button>
          </YStack>
        </ScrollView>
        <Footer />
      </YStack>
    </Theme>
  )
}