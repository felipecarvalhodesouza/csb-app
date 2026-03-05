import { XStack, YStack, Text, Image } from "tamagui"
import { BUCKET_BASE_URL } from "../../../utils/config"

interface Props {
  nome: string
  equipe: string
  numero?: number
  foto?: string
}

export function AthleteHeader({ nome, equipe, numero, foto }: Props) {
  return (
    <YStack jc="space-around" >
    <XStack ai="center" space="$4" p="$4" >
          <Image
              source={
                  foto
                      ? { uri: `${BUCKET_BASE_URL}${foto}` }
                      : require('../../../assets/default-avatar.png')
              }
              width={80}
              height={80}
              resizeMode="contain"
              style={{ width: 120, height: 120, borderRadius: 30, alignSelf: 'center' }}
          />

      <YStack space="$1" maxWidth="100%" flexShrink={1}>
        <Text fontSize={22} fontWeight="700" color="white" >
          {nome}
        </Text>

        <Text color="$gray10">
          {equipe} {numero ? `• #${numero}` : ""}
        </Text>
      </YStack>
    </XStack>
    </YStack>
  )
}