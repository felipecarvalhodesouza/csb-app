import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function apiFetch<T = any>(url: string, options: RequestInit = {}) {
  const user = await AsyncStorage.getItem('session_user')

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: user ? `Bearer ${JSON.parse(user).token}` : '',
      'Content-Type': 'application/json',
    },
  })

  if (response.status === 403) {
    await AsyncStorage.removeItem('session_user')
    router.replace('/login')
    throw new Error('Sessão expirada')
  }

  let responseBody: any = null
  const hasBody = response.headers.get('content-length') !== '0' &&
                  response.status !== 204 &&
                  response.headers.get('content-type')?.includes('application/json')

    
  if (hasBody) {
    try {
      responseBody = await response.json()
    } catch (e) {
      console.warn('Erro ao fazer parse do JSON:', e)
    }
  }

  if (!response.ok) {
    const message = responseBody?.message || `Erro ${response.status}`
    throw new Error(message)
  }

  if (responseBody === null && Array.isArray([] as T)) {
    return [] as T
  }

  return responseBody as T
}

export async function apiPut<T = any>(url: string, body: any, options: RequestInit = {}) {
  const user = await AsyncStorage.getItem('session_user')

  const response = await fetch(url, {
    method: 'PUT',
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: user ? `Bearer ${JSON.parse(user).token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (response.status === 403) {
    await AsyncStorage.removeItem('session_user')
    router.replace('/login')
    throw new Error('Sessão expirada')
  }

  let responseBody: any = null
  const hasBody = response.headers.get('content-length') !== '0' &&
                  response.status !== 204 &&
                  response.headers.get('content-type')?.includes('application/json')

  if (hasBody) {
    try {
      responseBody = await response.json()
    } catch (e) {
      console.warn('Erro ao fazer parse do JSON:', e)
    }
  }

  if (!response.ok) {
    const message = responseBody?.message || `Erro ${response.status}`
    throw new Error(message)
  }

  if (responseBody === null && Array.isArray([] as T)) {
    return [] as T
  }

  return responseBody as T
}

export async function apiPost<T = any>(url: string, body: any, options: RequestInit = {}) {
  const user = await AsyncStorage.getItem('session_user')

  const response = await fetch(url, {
    method: 'POST',
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: user ? `Bearer ${JSON.parse(user).token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (response.status === 403) {
    await AsyncStorage.removeItem('session_user')
    router.replace('/login')
    throw new Error('Sessão expirada')
  }

  let responseBody: any = null
  const hasBody = response.headers.get('content-length') !== '0' &&
                  response.status !== 204 &&
                  response.headers.get('content-type')?.includes('application/json')

  if (hasBody) {
    try {
      responseBody = await response.json()
    } catch (e) {
      console.warn('Erro ao fazer parse do JSON:', e)
    }
  }

  if (!response.ok) {
    const message = responseBody?.message || `Erro ${response.status}`
    throw new Error(message)
  }

  if (responseBody === null && Array.isArray([] as T)) {
    return [] as T
  }

  return responseBody as T
}