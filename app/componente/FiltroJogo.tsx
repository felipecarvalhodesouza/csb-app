import { Dispatch, SetStateAction } from 'react'
import {
  XStack,
  YStack,
  Text
} from 'tamagui'
import { GenericPicker } from './GenericPicker'
import { TextStyle } from 'tamagui'

type Equipe = {
  id: string | number
  nome: string
}

type Ordenacao = {
    value: string
    label : string
}


const opcoesOrdenacao: Ordenacao[] = [
  {
    value: 'desc',
    label: 'Data ↓'
  },
  {
    value: 'asc',
    label: 'Data ↑'
  }
]

const style: TextStyle = {
  color: '#ffffff',
  backgroundColor : '#000000',
  height: 35,
  padding: 8,
}

type Props = {
  equipes: Equipe[]
  equipeId: string
  setEquipeId: Dispatch<SetStateAction<string>>
  ordenacao: 'desc' | 'asc'
  setOrdenacao: Dispatch<SetStateAction<'desc' | 'asc'>>
}

export default function FiltroJogos({
  equipes,
  equipeId,
  setEquipeId,
  ordenacao,
  setOrdenacao,
}: Props) {
  return (
    <XStack gap="$2">
    <YStack flex={1} space="$1">
        <Text fontSize={12} color="$gray10">
        Equipe
        </Text>

        <GenericPicker
        items={equipes}
        value={equipeId}
        onChange={setEquipeId}
        getLabel={(e) => e.nome}
        getValue={(e) => e.id}
        overrideStyle={style}
        />
    </YStack>

    <YStack flex={1} space="$1">
        <Text fontSize={12} color="$gray10">
        Ordenação
        </Text>

        <GenericPicker
        items={opcoesOrdenacao}
        value={ordenacao}
        onChange={setOrdenacao}
        getLabel={(e) => e.label}
        getValue={(e) => e.value}
        overrideStyle={style}
        />
    </YStack>
    </XStack>
  )
}