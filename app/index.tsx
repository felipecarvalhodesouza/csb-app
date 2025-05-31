import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { getFavoriteModality } from '../utils/preferences'
import { View, Text } from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Index() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSessionAndRedirect() {
      const user = await AsyncStorage.getItem('session_user') // ou 'user_token', etc.

      if (!user) {
        router.replace('/login')
        return
      }

      const modality = await getFavoriteModality()

      if (modality) {
        router.replace(`/modalidades?mod=${modality}`)
      } else {
        router.replace('/modalidades')
      }
    }

    checkSessionAndRedirect().finally(() => setLoading(false))
  }, [])

  return (
    <View f={1} jc="center" ai="center">
      <Text>{loading ? 'Carregando...' : ''}</Text>
    </View>
  )
}
