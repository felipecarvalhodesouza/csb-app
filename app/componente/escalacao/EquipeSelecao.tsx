import React from 'react'
import { YStack, Text, Theme } from 'tamagui'
import { Atleta } from '../../domain/atleta'
import { EquipeSelecaoHeader } from './EquipeSelecaoHeader'
import { AtletaRow } from './AtletaRow'

export type EquipeSelecaoProps = {
  atletas: Atleta[]
  onToggleTitular: (atletaId: number) => void
  onToggleCapitao: (atletaId: number) => void
  onToggleConvocado: (atletaId: number) => void
  onSetNumero: (atletaId: number, numero: string) => void
  onSetTodosConvocados: (valor: boolean) => void
  maxTitulares: number
  maxJogadores: number
  equipeNome: string
  modo?: string // novo
}

export function EquipeSelecao({
  atletas,
  onToggleTitular,
  onToggleConvocado,
  onToggleCapitao,
  onSetNumero,
  onSetTodosConvocados,
  maxTitulares,
  maxJogadores,
  modo // novo
}: EquipeSelecaoProps) {
  const titularesSelecionados = atletas.filter(a => a.titular).length
  const jogadoresSelecionados = atletas.filter(a => a.convocado).length
  const todosConvocados = atletas.length > 0 && atletas.every(a => a.convocado)
  const capitaoSelecionado = atletas.find(a => a.capitao)

  return (
    <Theme>
      <YStack>
        <EquipeSelecaoHeader
          todosConvocados={todosConvocados}
          onToggleTodosConvocados={() => onSetTodosConvocados(!todosConvocados)}
          modo={modo}
        />
        {atletas.map(atleta => (
          <AtletaRow
            key={atleta.id}
            atleta={atleta}
            titularesSelecionados={titularesSelecionados}
            jogadoresSelecionados={jogadoresSelecionados}
            maxTitulares={maxTitulares}
            maxJogadores={maxJogadores}
            onToggleTitular={onToggleTitular}
            onToggleConvocado={onToggleConvocado}
            onToggleCapitao={onToggleCapitao}
            onSetNumero={onSetNumero}
            modo={modo}
            capitaoSelecionado={capitaoSelecionado}
          />
        ))}
        {atletas.length === 0 && (
          <Text color="$gray10">Nenhum atleta encontrado</Text>
        )}
        <Text mt="$2" fontSize={12} color="$gray10">
          {titularesSelecionados}/{maxTitulares} titulares, {jogadoresSelecionados}/{maxJogadores} no jogo
        </Text>
        {!capitaoSelecionado && (
          <Text mt="$1" fontSize={12} color="$red10" fontWeight="bold">
            ⚠ Capitão obrigatório
          </Text>
        )}
      </YStack>
    </Theme>
  )
}
