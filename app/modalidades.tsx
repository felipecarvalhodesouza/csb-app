import { useRouter } from 'expo-router'
import {
  YStack,
  XStack,
  Text,
  View,
  Button,
  Theme,
  useTheme,
  ScrollView,
} from 'tamagui'
import { setFavoriteModality } from '../utils/preferences'
import { MaterialIcons } from '@expo/vector-icons'
import Footer from './footer'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Header from './header'

const modalidades = [
  { nome: 'Basquete', icone: 'basketball' },
  { nome: 'Vôlei', icone: 'volleyball' },
  { nome: 'Futebol', icone: 'soccer' },
  { nome: 'Natação', icone: 'pool' },
]

export default function ModalidadesScreen() {
  const router = useRouter()
  const theme = useTheme()

  const handleSelecionar = async (mod: string) => {
    await setFavoriteModality(mod.toLowerCase())
    router.replace(`torneio-em-andamento?${mod.toLowerCase()}`)
  }

  return (
    <Theme name={theme}>
      <YStack f={1} bg="$background" jc="space-between" pb={"$9"} pt={"$6"}>
      <Header title="Selecione a Modalidade" />

        {/* Modalidades */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
          {modalidades.map((mod) => (
            <XStack
              key={mod.nome}
              bg="$color2"
              p="$4"
              br="$4"
              ai="center"
              onPress={() => handleSelecionar(mod.nome)}
              hoverStyle={{ bg: '$color3' }}
              pressStyle={{ bg: '$color4' }}
            >
              <View
                bg="$blue10"
                p="$3"
                br="$10"
                mr="$3"
                ai="center"
                jc="center"
              >
                <MaterialCommunityIcons name={mod.icone as any} size={24} color="white" />
              </View>
              <Text fontSize={16}>{mod.nome}</Text>
              <View f={1} />
              <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
            </XStack>
          ))}
        </ScrollView>
        <Footer />
      </YStack>
    </Theme>
  )
}
