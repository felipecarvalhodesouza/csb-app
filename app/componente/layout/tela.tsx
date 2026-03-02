import { ReactNode } from 'react'
import { Theme, YStack, ScrollView } from 'tamagui'
import Header from '../../header'
import Footer from '../../footer'
import { TelaContainer } from './tela-container'

type TelaProps = {
  title: string
  subtitle?: string
  equipe?: any
  button?: React.ReactNode
  button2?: React.ReactNode
  children: ReactNode
  scroll?: boolean
  paddingHorizontal?: number
}

export function Tela({
  title,
  subtitle,
  equipe,
  button,
  button2,
  children,
  scroll = true,
  paddingHorizontal = 16,
}: TelaProps) {
  return (
    <Theme>
        <TelaContainer>
        <Header title={title} subtitle={subtitle} equipe={equipe} button={button} button2={button2} />

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
          <YStack f={1}>
            {children}
          </YStack>
        )}

        <Footer />
      </TelaContainer>
    </Theme>
  )
}