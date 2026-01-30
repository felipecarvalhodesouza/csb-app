import { Stack } from 'expo-router'
import { TamaguiProvider, Theme } from 'tamagui'
import config from '../tamagui.config'
import { useColorScheme } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { GlobalErrorBoundary } from './error/globalErrorBoundary'

export default function Layout() {
  const colorScheme = useColorScheme()

  return (
    <GlobalErrorBoundary>
      <PaperProvider>
        <TamaguiProvider config={config}>
          <Theme name={colorScheme === 'dark' ? 'dark' : 'dark'}>
            <Stack screenOptions={{ headerShown: false }} />
          </Theme>
        </TamaguiProvider>
      </PaperProvider>
    </GlobalErrorBoundary>
  )
}