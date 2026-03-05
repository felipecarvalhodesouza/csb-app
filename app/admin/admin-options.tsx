import { XStack, YStack, View, Text } from 'tamagui'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

interface AdminOption {
  nome: string
  icone: string
  rota?: string
  disable?: boolean
}

interface AdminOptionListProps {
  opcoes: AdminOption[]
}

const router = useRouter()

const onSelect = (rota: string, disable: boolean) => {
  if (disable) return
  router.push(rota)
}

export function AdminOptionList({ opcoes }: AdminOptionListProps) {
  return (
    <YStack space="$3">
      {opcoes.map((opcao) => {
        const isDisabled = !!opcao.disable

        return (
          <XStack
            key={opcao.nome}
            bg={isDisabled ? "$gray5" : "$color2"}
            p="$4"
            br="$4"
            ai="center"
            onPress={() => onSelect(opcao.rota, opcao.disable)}
            hoverStyle={isDisabled ? {} : { bg: "$color3" }}
            pressStyle={isDisabled ? {} : { bg: "$color4" }}
          >
            <View
              bg={isDisabled ? "$gray7" : "$blue10"}
              p="$3"
              br="$10"
              mr="$3"
              ai="center"
              jc="center"
            >
              <MaterialCommunityIcons name={opcao.icone as any} size={24} color="white" />
            </View>

            <Text fontSize={16} color={isDisabled ? "$gray8" : "white"}>
              {opcao.nome}
            </Text>

            <View f={1} />

            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={isDisabled ? "$gray6" : "#ccc"}
            />
          </XStack>
        )
      })}
    </YStack>
  )
}