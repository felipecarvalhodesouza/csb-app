import { useRouter } from 'expo-router'
import {
  YStack,
  XStack,
  Text,
  View,
  Theme,
  ScrollView,
} from 'tamagui'
import { setFavoriteModality } from '../utils/preferences'
import Footer from './footer'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Header from './header'
import { modalidades } from './utils/modalidades'
import { Tela } from './componente/layout/tela'



export default function ModalidadesScreen() {
  const router = useRouter()

  const handleSelecionar = async (mod: string, id: number, disable: boolean) => {
    if (disable) {
      return
    }
    await setFavoriteModality("" + id);
    router.replace(`torneio-em-andamento?id=${id}`)
  }

  return (
    <Tela title="Campeonato Santista">
        {/* Modalidades */}
          {modalidades.map((mod) => (
            <XStack
              key={mod.nome}
              bg={mod.disable ? "$gray5" : "$color2"} 
              p="$4"
              br="$4"
              ai="center"
              onPress={mod.disable ? null : () => handleSelecionar(mod.nome, mod.id, mod.disable)}
              hoverStyle={mod.disable ? {} : { bg: '$color3' }} 
              pressStyle={mod.disable ? {} : { bg: '$color4' }} 
            >
              <View
                bg={mod.disable ? "$gray7" : "$blue10"}
                p="$3"
                br="$10"
                mr="$3"
                ai="center"
                jc="center"
              >
                <MaterialCommunityIcons name={mod.icone as any} size={24} color="white" />
              </View>
              <Text fontSize={16} color={mod.disable ? "$gray8" : "white"}> {/* Texto desabilitado */}
                {mod.nome}
              </Text>
              <View f={1} />
              <MaterialCommunityIcons name="chevron-right" size={24} color={mod.disable ? "$gray6" : "#ccc"} />
            </XStack>
          ))}
    </Tela>
  )
}
