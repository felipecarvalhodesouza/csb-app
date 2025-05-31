import AsyncStorage from '@react-native-async-storage/async-storage'

const FAVORITE_MODALITY_KEY = 'favorite_modality'

export async function setFavoriteModality(modality: string) {
  await AsyncStorage.setItem(FAVORITE_MODALITY_KEY, modality)
}

export async function getFavoriteModality(): Promise<string | null> {
  return AsyncStorage.getItem(FAVORITE_MODALITY_KEY)
}