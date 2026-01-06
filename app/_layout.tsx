import { Stack } from 'expo-router'
import { TamaguiProvider, Theme } from 'tamagui'
import config from '../tamagui.config'
import { useColorScheme } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'

export default function Layout() {
  const colorScheme = useColorScheme()

  return (
    <PaperProvider>
      <TamaguiProvider config={config}>
        <Theme name={colorScheme === 'dark' ? 'dark' : 'dark'}>
          <Stack screenOptions={{ headerShown: false }} />
        </Theme>
      </TamaguiProvider>
    </PaperProvider>
  )
}