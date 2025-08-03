import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import { YStack, XStack, Text, Button, Input, Checkbox, Separator, Spinner, Theme, Tabs  } from 'tamagui'
import Jogo from './domain/jogo'
import { Atleta } from './domain/atleta'
import { apiFetch } from './utils/api'
import { useLocalSearchParams } from 'expo-router'
import Footer from './footer'
import Header from './header'
import { Check } from '@tamagui/lucide-icons'

type GameEditScreenProps = {
  onSalvar: (jogoEditado: Jogo) => void
  onIniciar: () => void
}

type EquipeSelecaoProps = {
  atletas: Atleta[]
  onToggleTitular: (atletaId: number) => void
  onToggleConvocado: (atletaId: number) => void
  onSetNumero: (atletaId: number, numero: string) => void
  maxTitulares: number
  maxJogadores: number
  equipeNome: string
}

function EquipeSelecao({
  atletas,
  onToggleTitular,
  onToggleConvocado,
  onSetNumero,
  maxTitulares,
  maxJogadores,
}: EquipeSelecaoProps) {
  const titularesSelecionados = atletas.filter(a => a.titular).length
  const jogadoresSelecionados = atletas.filter(a => a.convocado).length

  return (
    <Theme>
    <YStack>
      <XStack ai="center" jc="space-between" mb="$2" px="$2">
        <Text width={150} fontWeight="700">Nome</Text>
        <Text width={20} fontWeight="700">Nº</Text>
        <Text width={15} fontWeight="700">T</Text>
        <Text width={15} fontWeight="700">E</Text>
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
            width={20}
            placeholder="Nº"
            value={atleta.numero || ''}
            keyboardType="numeric"
            onChangeText={num => onSetNumero(atleta.id, num)}
            disabled={!atleta.convocado} // só pode definir número se convocado
            backgroundColor="$backgroundStrong" // cor de fundo mais forte
            color="$white" // cor do texto (ajuste conforme seu tema)
            borderColor="$gray8" // opcional: borda para destacar
            placeholderTextColor="#888"
          />
          <Checkbox
            checked={!!atleta.titular}
            onCheckedChange={() => onToggleTitular(atleta.id)}
            disabled={
              (!atleta.titular && titularesSelecionados >= maxTitulares) ||
              !atleta.convocado // só pode ser titular se vai para o jogo
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
  onSalvar,
  onIniciar
}: GameEditScreenProps) {
  const { jogoId, torneioId } = useLocalSearchParams()
  const [jogo, setJogo] = useState<Jogo | null>(null)
  const [mandante, setMandante] = useState<Atleta[]>([])
  const [visitante, setVisitante] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'mandante' | 'visitante'>('mandante')

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
      if(!jogo) return
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

  function handleSalvar() {
    onSalvar({
      ...jogo,
      atletasMandante: { ...mandante },
      atletasVisitante: { ...visitante },
    })
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
      <Header title='Edição do Jogo' />
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
              maxTitulares={5}
              maxJogadores={12}
              equipeNome={jogo.visitante.nome}
            />
          )}
          <Separator />
          <Button theme="active" onPress={onIniciar}>
            Iniciar Jogo
          </Button>
        </YStack>
      </ScrollView>
      <Footer />
    </YStack>
    </Theme>
  )
}