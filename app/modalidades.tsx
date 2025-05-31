import { useRouter } from 'expo-router'
import { YStack, XStack, Text, ListItem, View, useTheme, Theme } from 'tamagui'
import { setFavoriteModality } from '../utils/preferences'
import { useLocalSearchParams } from 'expo-router'

const modalidades = [
  { nome: 'Basquete', icone: '🏀' },
  { nome: 'Vôlei', icone: '🏐' },
  { nome: 'Futebol', icone: '⚽' },
  { nome: 'Natação', icone: '🏊' },
]

export default function ModalidadesScreen() {
  const router = useRouter()
  const theme = useTheme()

  const handleSelecionar = async (mod: string) => {
    await setFavoriteModality(mod.toLowerCase())
    router.replace(`torneios?${mod.toLowerCase()}`)
  }

  return (
    <Theme name={theme}>
      <YStack f={1} bg="$background" p="$4" space="$3">
        <Text fontSize={20} fontWeight="600" ta="center">
          Selecione a Modalidade
        </Text>

        {modalidades.map((mod) => (
          <ListItem
            key={mod.nome}
            title={mod.nome}
            icon={
              <View w={40} h={40} bg="$blue10" br={20} ai="center" jc="center">
                <Text fontSize={20}>{mod.icone}</Text>
              </View>
            }
            onPress={() => handleSelecionar(mod.nome)}
            borderBottomWidth={1}
            borderColor="$color4"
            pressTheme
          />
        ))}
      </YStack>
    </Theme>
  )
}
