import { ReactNode } from 'react'
import { Theme, YStack, ScrollView } from 'tamagui'
import Header from '../../header'
import Footer from '../../footer'
import { TelaContainer } from './tela-container'

type TelaProps = {
  title: string
  children: ReactNode
  scroll?: boolean
  paddingHorizontal?: number
}

export function Tela({
  title,
  children,
  scroll = true,
  paddingHorizontal = 16,
}: TelaProps) {
  return (
    <Theme>
        <TelaContainer>
        <Header title={title} />

        {scroll ? (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal,
              paddingBottom: 32,
            }}
            space="$4"
          >
            {children}
          </ScrollView>
        ) : (
          <YStack f={1} px={paddingHorizontal}>
            {children}
          </YStack>
        )}

        <Footer />
      </TelaContainer>
    </Theme>
  )
}