import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  YStack,
  Text,
  Theme,
  useTheme,
  ScrollView,
  Image,
  Button
} from 'tamagui'
import { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Footer from './footer'
import Header from './header'
import { Dimensions } from 'react-native'

const equipes = [
  {
    id: '1',
    nome: 'Chicago Bulls',
    logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA4CAMAAABuU5ChAAAA/FBMVEX///8AAADSFTrYFDsAJiLVFToADQsAAwDQ0dGgGzOkGzP4+Pj7+/vcEzzT1NR2ennj5OTr6+vy8vLd3t66u7tscHC9GDeyGTXKy8s3PT0MGRikpqYqMTBeYmKanJwDFRNCSEeHiorVADKMHTDIFjmVHDEdJiVOU1KQk5KvsbEVHx6soqTT3dzRACp7Hy5cISpxICxeS01rUFN+AACjYmqfgIOWhYeuAAuYAB60AByKRE3GAB/fACt8ND5QAAB8Y2acc3jJABCZAAiLXWNQYmCzACVNIimfSVWrlJY+IycAHBmmQU+bMkInJCWWUltkAABoABOBAB1ofnwzAACJrmbdAAAFG0lEQVRIiaWVa3uaSBSAzzCAgCJ3uQoogmIiul1zsbbb1GxM0m2y293//1/2DEZjYtu4z54Pzjicd84dANppVGoWaJpWWo7m6Ab+tAFGhVP2ANi5xlaIi66t4aqPtJItJCCEeJCKJLbEJLH0cdLwQCMiIT4+98VA7OLaYwdjAI+QggzxvsQHCTmDiAAOCQFC4rB/IXQj1PeKiKD5JklGyOKKuj6qRWKM+hbaFfVml+CfGDm7QUyQHOScUY+gnxIhOjoHNrMZNlIo8GKo/S0ISZInrhTFZn0MxGqToHbPbIehHjfQR68xRv9RVWJcYpnDxtYeqoFhALQx+IBYbDXKhNhlA4O2GxH0xBQP7U183W18JmnY0C0wHY5hOGQELRZwSHSdXeg0esyOjzjmRyytIkgNIw2iNuYz8EkJdjJsNYdB4cGIJGmdRzIcMRakiKTokB8VPS+IRMsSo8Bmz9EKxGPRNMRojBUbiaTLYsY11evQnzLwSloHJ81X6/8R209TfyhBO0ojPfYjXWIb1md+ysoI7YL0UvOA84pkqGGxrShJTTtJDbbBsDHfjRHzmiTdMavNPiQZrMVizAXLG5YisllDlvXDBmG/FkmQNaG3z/2C9h1Rk/yotc/VjdTacE0y9j1c3+nP2OmvjAuw31m6v89hB4kEx2h+9sydX5gbP4fYUC84y9pwdhPMppbgYMwvn+uTL57iY2MUs+7HvsMLSnC0Or4W0U1iQITH75f2zs2L5SnYQVAUIl6IDeikqNQeJ3533AOtkQyHjCN+gHnJPuwcDd9/tMHrMmF3SSlhbraH7CCEHluGhumUUdoG47dP0y3XM5svsvsziS0ot22Gl3vWcZiButa2Esy5WP+Z+lYkVhlra6NOUBlLZqtp6G3JK0/uzq7m88fHx/n86urs/O4kLG0UVKnVt026aSew8JFnhZ8nk0n/pXx4j+XflS3cbrz9Lr/qcwcirPZm0Sx323iPuxSe1Xe7pfSssJd6a9cCcLpg2kKNuMJ2N3m20dt3zgq3NSknDFOUzoDSjA46SjbAg/759vG+a3WSSq9GzzfhdeSsqqZVJndqg/1rfNT0wvBw3sH07NHv3Y+U2cuUDkfVXOUGbt5hB/nVOz82DiEM7GSe33B9lQo7e2u05w5YkFTt9+nk5vbk9JWtu3wx6aNLNJsqFK/PctftVB1XyStFUJX1fZ0jOllm9gsumwibzPNf+CnlKDro5vfIclRQZ3iYsVs5urx+abB5tcA2Wd48XmoBv2Yqgirztc+IBVr1x/XlYrnIQ3gtenl3IoF5UYoBfz+gAh0UfKVSyk35MQlXNrROvdMDaie3X8teMS4qJX/geX5dzQp+nI4+rX5MbMRGX4uCZzJz66X4cv11cv4WB2s5n/FKNZ0plA6yWeZWfC7/+fZ0ntxw2b3ibupIqao8ZJn76U0Mmn/lQlbJu1mQeY5bSW9z2KFCZ61sR0l2H1T19ggMzJVACzWjNdZx3Sld2m9TtUH1Qe3kOHo4T9St1K9HYWhQXasCpygymyI32xvan0v8YYr9goJJFQa5fCQGrTwb5FkteUf9dqw5gL8rBecAReXk6p/vzPj3xV6pg9zFhFJ5JquKczQ34bAvMyrkuMhqdSx3uhjwY/5BpTPk3P4RTfYkl6oyzWQq4KvCPbbqTM76VFW5Tmcg4OB+OxoD/cLNc8XFV0yWLw9fDT+WcIWfJEr7/cni3X/A8Ltans1vb+dn4Q9fKf8C1yGFVphGioUAAAAASUVORK5CYII=',
  },
  {
    id: '2',
    nome: 'Detroit Pistons',
    logo: 'data:image/png;base64,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',
  },
  {
    id: '3',
    nome: 'Dallas Mavericks',
    logo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIADgAOAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAABwUGAgMIBAH/xAA4EAACAQMCBAMEBwgDAAAAAAABAgMEBREABhIhMUETUWEHFHGBFSIjMmKRoUJDUnJzorLRFjNE/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAUB/8QAIhEAAgIBAgcBAAAAAAAAAAAAAAECEQMEIRIxQXGh0fAF/9oADAMBAAIRAxEAPwB46NajMAxHC3I40tt4bgue5LjU7e2vO0FLSg/SVbCftO+Y4+nPkR1HPPQA5Asu4faDtjb0pgr7kjVIPCYIAZHB8jjkp9CRqEX2t24kH/jm5vCP733FeHHnnj6airFQ2rb5t7WakijmNNx1NLVRg1YLFQhdv3YzkYA55wB5RdN7RKTKUeLnO9LUs6TxvGfFQZAB4iCwwe4z0OtjFydRVsOkrbGTt3fe3NxSeDbrinvGceBKDG5PkAep+GdWTSWuFbYtz+/yV0JqKkhTRwQweDVx46hXP/Zz59SPTVj2fuK42W6R7a3POakTLm3Vx+9KBj6j/iGR5/E5GjTi6aCaatDG0awSTjOOEjl3181gI3dt0ay7YulyjGZKamd4we74+r+uNKy01T7Y2VbaOhz9LXdDVVFS55wI/MyMe7BRgeoz8WF7TadqrYN8jQElaVpMDyTDH9F0lqm7S3m2SyIjKI46WkQKuWCeGUPIdftSx/LQ1DE2hQU9gsyV5gZqy5DjCs2W4SCUVmPcnGSf2m+GlQ8dDPG1TTOySxeKISgIMmBlMjsQCPjg6dNvctZaCWqYw1NEi8TRPkMFAz8UYAHn6dCNJ2+v7vuqvWNYYjHO7OFU8LEc+PHbIxkDl189YazwU78UagjxMEZZXyc9jk8wdWt7pLe9p1dPVykXS0qK+jqc5cqh+sf5guf7TqqwUatEPAk+3UBuLGA4Pn6ayWtaCnklUEO0ctO6f1EaMg/Ngflq7nxLLpuKSqSVrsufTwTMeTgzUuTe50zYLh9K2O33DHCamnSVl/hJUEj5HRrxbGgem2fZopVKv7pGxU9VyM4+WdfNQyiTU0STQvFIMo6lWHmD11zJRwTWee62GclKijmyWIOZI1OH5DnnhPGMc+h8tdMmUhiPDbrjOlv7TdlVF4njv9gR47rABxxgYMwHQj8Q6Y7jl2GgMbVS1NVFT1lS8LTPT+7zywSBo6qLqkgOBzGe4H3j5DS/3lSJRX6iqZIJIKitpC80UkgbDRlR25c0T89bdv7qe2JPRTxtFA5KyUTymFoX7+DIccJz+w2MHoe2oyotkD3F6xLncZmkH/toJZZMeXiRkq3yxrcbqaYnvFowZEgqabhOECNH8uRGtS0LXe/U1ppss9bLGG4eqjoT8uR+AJ1oqHq5atIOKFCrcKFQWdi3bh7HsOLHpnTb9lWxZdvs15vETtcZRiJCDmMHqT+I9PQZ8yBY1n6GOUHjxdfVE/T6WcZKU/txoKoRQqjAAwBo1ijljgqRo1GKBno0aNAQl/2lYtw/Wutuillxw+MpKSY8uNcHHpnGqq3sa2sZi4NaEJ5xB4+H/DP66NGgLNt/Zm39usJLXbo0mGcTSEyOM9cFs8I9Bgan9GjQFeu26qK236mtss0S8QHjlm5oW+5/s57Y0aNGlA//2Q==',
  },
]

const { width: screenWidth } = Dimensions.get('window')

export default function SelecionarEquipe() {
  const { torneio } = useLocalSearchParams()
  const router = useRouter()
  const theme = useTheme()

  const [selected, setSelected] = useState<string | null>(null)

  const handleConfirmar = async () => {
    const equipe = equipes.find((e) => e.id === selected)
    if (!equipe) return

    await AsyncStorage.setItem('equipe_favorita', JSON.stringify(equipe))
    router.replace(`/equipe?eq=${equipe.id}`) // ou equipe.slug se tiver
  }

  return (
    <Theme name={theme}>
      <YStack f={1} bg="$background" jc="space-between" pb={"$9"} pt={"$6"}>
        <Header title=" Selecione a sua equipe favorita" />

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {equipes.map((equipe) => (
            <YStack
              key={equipe.id}
              w={screenWidth}
              ai="center"
              jc="center"
              onPress={() => setSelected(equipe.id)}
              opacity={selected === equipe.id ? 1 : 0.6}
            >
              <Image
                source={{ uri: equipe.logo }}
                width={200}
                height={200}
                resizeMode="contain"
                br="$10"
              />
              <Text mt="$2" fontSize={18} fontWeight="500">
                {equipe.nome}
              </Text>
            </YStack>
          ))}
        </ScrollView>

        <Button
          mt="$4"
          mb="$4"
          w="100%"
          disabled={!selected}
          backgroundColor="black"
          color="white"
          onPress={handleConfirmar}
        >
          Confirmar seleção
        </Button>
        <Footer />
      </YStack>
    </Theme>
  )
}
