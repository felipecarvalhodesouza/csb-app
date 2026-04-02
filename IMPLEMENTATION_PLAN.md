# CSB App - Plano de Implementacao de Melhorias

> Guia completo e autossuficiente para refatorar o CSB App.
> Pode ser executado em qualquer maquina com o repositorio clonado.
> Cada fase inclui comandos, codigo-fonte completo e instrucoes passo a passo.

---

## Indice

1. [Diagnostico Atual](#diagnostico-atual)
2. [Fase 1 - Tooling e Infraestrutura](#fase-1---tooling-e-infraestrutura)
3. [Fase 2 - Remocao de Duplicidade](#fase-2---remocao-de-duplicidade)
4. [Fase 3 - Componentizacao e Organizacao](#fase-3---componentizacao-e-organizacao)
5. [Fase 4 - Tipagem e Seguranca de Tipos](#fase-4---tipagem-e-seguranca-de-tipos)
6. [Fase 5 - Testes Unitarios com Jest](#fase-5---testes-unitarios-com-jest)
7. [Fase 6 - Seguranca](#fase-6---seguranca)
8. [Fase 7 - Documentacao e Limpeza](#fase-7---documentacao-e-limpeza)

---

## Diagnostico Atual

**Stack:** Expo SDK 54 + React Native 0.81 + React 19 + expo-router + Tamagui + React Native Paper

### Problemas Encontrados

| Problema | Detalhes |
|----------|----------|
| Duplicacao em `app/utils/api.ts` | 4 funcoes (`apiFetch`, `apiPut`, `apiPost`, `apiDelete`) com logica quase identica. 194 linhas que poderiam ser ~60 |
| Raw `fetch` espalhado | 8 arquivos usam `fetch` direto em vez do client centralizado |
| `any` excessivo | ~70+ usos de `: any`; tipos de dominio existem mas nao sao usados |
| Formularios duplicados | `incluir-jogo.tsx` (541 linhas) e `editar-jogo.tsx` (481 linhas) compartilham ~80% do state/logica |
| Sem testes | Zero arquivos de teste, nenhuma config de Jest |
| Sem linter/formatter | Nao ha ESLint, Prettier ou qualquer config de qualidade |
| Bug de tema | `_layout.tsx` L15: `colorScheme === 'dark' ? 'dark' : 'dark'` (nunca aplica tema claro) |
| Deps desnecessarias | `date-fns` E `dayjs` (redundante), `react-icons` (web-only), webview sem uso |
| Token inseguro | Token em AsyncStorage; `JSON.parse(user)` sem null check em 8 arquivos |
| README/LICENSE errados | Pertencem a outro projeto (withRouter / Charles Stover) |
| Import morto | `editar-jogo.tsx` importa `id` de `react-native-paper-dates` |
| Bug `getFavoriteModality` | `incluir-jogo.tsx` e `editar-jogo.tsx` usam `getFavoriteModality()` (retorna Promise) como se fosse sincrono |

### Arquivos que usam raw `fetch` (devem migrar para api client):

- `app/selecionar-equipe.tsx` - GET equipes com token manual
- `app/categorias.tsx` - GET categorias com token manual
- `app/detalhes-equipe.tsx` - GET atletas com token manual
- `app/admin/vincular-equipe.tsx` - 2x fetch paralelo (equipes disponveis/vinculadas)
- `app/admin/incluir-jogo.tsx` - POST /jogos com token manual
- `app/admin/editar-jogo.tsx` - PUT /jogos com token manual
- `app/admin/editar-equipe.tsx` - POST multipart upload com token manual
- `app/admin/incluir-local.tsx` - fetch ViaCEP (este pode manter fetch direto, e externo)

### Arquivos com `JSON.parse(user)` sem null check:

- `app/utils/api.ts` (4 ocorrencias)
- `app/selecionar-equipe.tsx`
- `app/categorias.tsx`
- `app/admin/vincular-equipe.tsx`
- `app/admin/incluir-jogo.tsx`
- `app/admin/editar-jogo.tsx`
- `app/componente/FloatingActionButton.tsx`
- `app/detalhes-equipe.tsx` (este tem guard parcial)

---

## Fase 1 - Tooling e Infraestrutura

### 1.1 Instalar ESLint + Prettier

```bash
npm install --save-dev \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  prettier \
  eslint-config-prettier
```

### Criar `.eslintrc.js`

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['node_modules/', 'android/', '.expo/', 'dist/'],
}
```

### Criar `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### Adicionar scripts ao `package.json`

Adicionar dentro de `"scripts"`:

```json
"lint": "eslint . --ext .ts,.tsx --max-warnings 0",
"lint:fix": "eslint . --ext .ts,.tsx --fix",
"format": "prettier --write '**/*.{ts,tsx,json,md}'",
"format:check": "prettier --check '**/*.{ts,tsx,json,md}'"
```

---

### 1.2 Instalar Jest + React Native Testing Library

```bash
npm install --save-dev \
  jest \
  jest-expo \
  @testing-library/react-native \
  @testing-library/jest-native \
  @types/jest
```

### Criar `jest.config.js`

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/.expo/'],
  setupFilesAfterSetup: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|tamagui|@tamagui/.*)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}
```

### Adicionar script ao `package.json`

```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

---

### 1.3 Limpar dependencias

#### Verificar uso de `date-fns` antes de remover:

Arquivos que importam `date-fns`:
- `app/admin/incluir-jogo.tsx` - usa `format` e `set`
- `app/admin/editar-jogo.tsx` - usa `format`

Acao: substituir por `dayjs` (ja usado em `app/utils/date-formatter.ts`):

```typescript
// Substituir: import { format } from 'date-fns'
// Por: import dayjs from 'dayjs'
// E usar: dayjs(date).format('DD/MM/YYYY') em vez de format(date, 'dd/MM/yyyy')
// E usar: dayjs(date).format('HH:mm') em vez de format(date, 'HH:mm')
// E usar: dayjs(date).format("YYYY-MM-DD'T'HH:mm:ss") em vez de format(data, "yyyy-MM-dd'T'HH:mm:ss")
```

Depois remover:
```bash
npm uninstall date-fns
```

#### Verificar `react-icons`:

```bash
# Verificar se react-icons e usado em algum arquivo:
grep -r "react-icons" app/ --include="*.tsx" --include="*.ts"
```

Se nao houver resultado, remover:
```bash
npm uninstall react-icons
```

#### Verificar webview:

```bash
grep -r "react-native-webview\|react-native-web-webview" app/ --include="*.tsx" --include="*.ts"
```

Se nao houver resultado, remover:
```bash
npm uninstall react-native-webview react-native-web-webview
```

#### Mover `@types/react` para devDependencies:

No `package.json`, mover `"@types/react": "~19.1.10"` de `dependencies` para `devDependencies`.

---

## Fase 2 - Remocao de Duplicidade

### 2.1 Refatorar `app/utils/api.ts`

#### ANTES (194 linhas, 4 funcoes quase identicas):

O arquivo atual tem `apiFetch`, `apiPut`, `apiPost`, `apiDelete` cada uma repetindo:
- Ler session do AsyncStorage
- Construir headers com Bearer token
- Tratar 403
- Parse JSON
- Tratar erros

#### DEPOIS - Substituir conteudo COMPLETO de `app/utils/api.ts` por:

```typescript
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

async function getAuthToken(): Promise<string | null> {
  try {
    const user = await AsyncStorage.getItem('session_user')
    if (!user) return null
    const parsed = JSON.parse(user)
    return parsed?.token ?? null
  } catch {
    return null
  }
}

async function handleExpiredSession(): Promise<never> {
  await AsyncStorage.removeItem('session_user')
  router.replace('/login')
  throw new Error('Sessao expirada')
}

type ApiRequestOptions = RequestInit & {
  responseType?: 'json' | 'blob' | 'html'
}

async function apiRequest<T = unknown>(
  url: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { responseType = 'json', ...fetchOptions } = options
  const token = await getAuthToken()

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (responseType === 'json' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (response.status === 403) {
    return handleExpiredSession()
  }

  if (responseType === 'blob') {
    return response.blob() as unknown as T
  }

  if (responseType === 'html') {
    return response.text() as unknown as T
  }

  let responseBody: unknown = null
  const contentType = response.headers.get('content-type')
  const contentLength = response.headers.get('content-length')
  const hasBody =
    contentLength !== '0' &&
    response.status !== 204 &&
    contentType?.includes('application/json')

  if (hasBody) {
    try {
      responseBody = await response.json()
    } catch (e) {
      console.warn('Erro ao fazer parse do JSON:', e)
    }
  }

  if (!response.ok) {
    const message =
      (responseBody as { message?: string })?.message || `Erro ${response.status}`
    throw new Error(message)
  }

  return responseBody as T
}

export function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
  responseType: 'json' | 'blob' | 'html' = 'json',
): Promise<T> {
  return apiRequest<T>(url, { ...options, responseType })
}

export function apiPost<T = unknown>(
  url: string,
  body: unknown,
  options: RequestInit = {},
): Promise<T> {
  return apiRequest<T>(url, {
    method: 'POST',
    ...options,
    body: JSON.stringify(body),
  })
}

export function apiPut<T = unknown>(
  url: string,
  body: unknown,
  options: RequestInit = {},
): Promise<T> {
  return apiRequest<T>(url, {
    method: 'PUT',
    ...options,
    body: JSON.stringify(body),
  })
}

export function apiDelete<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  return apiRequest<T>(url, {
    method: 'DELETE',
    ...options,
  })
}

export function apiUpload<T = unknown>(
  url: string,
  formData: FormData,
  options: RequestInit = {},
): Promise<T> {
  return apiRequest<T>(url, {
    method: 'POST',
    ...options,
    body: formData as unknown as BodyInit,
    headers: {}, // Nao setar Content-Type; o browser define com boundary
  })
}

export { getAuthToken }
```

**Nota:** A assinatura publica de `apiFetch`, `apiPost`, `apiPut`, `apiDelete` permanece compativel - nenhum arquivo que ja usa essas funcoes vai quebrar.

Adicionamos `apiUpload` para o caso de multipart em `editar-equipe.tsx` e `getAuthToken` exportado para uso em hooks.

---

### 2.2 Migrar arquivos com raw `fetch`

Para cada arquivo abaixo, substituir o padrao de fetch manual pelo client centralizado.

#### 2.2.1 `app/selecionar-equipe.tsx`

**ANTES** (dentro do useEffect):
```typescript
const user = await AsyncStorage.getItem('session_user');
const headers = {
  'Authorization': `Bearer ${JSON.parse(user).token}`,
  'Content-Type': 'application/json',
};
const response = await fetch(`${API_BASE_URL}/torneios/${torneio}/equipes`, { headers })
const data = await response.json() as Equipe[];
setEquipes(data)
```

**DEPOIS:**
```typescript
import { apiFetch } from './utils/api'
// Remover: import AsyncStorage from '@react-native-async-storage/async-storage'

// Dentro do useEffect:
const data = await apiFetch<Equipe[]>(`${API_BASE_URL}/torneios/${torneio}/equipes`)
setEquipes(data)
```

#### 2.2.2 `app/categorias.tsx`

**ANTES:**
```typescript
const user = await AsyncStorage.getItem('session_user')
const headers = {
  'Authorization': `Bearer ${JSON.parse(user).token}`,
  'Content-Type': 'application/json',
}
const response = await fetch(`${API_BASE_URL}/torneios/${torneio}/categorias`, { headers })
if (!response.ok) throw new Error('Erro ao carregar categorias.')
const data = await response.json()
setCategorias(data)
```

**DEPOIS:**
```typescript
import { apiFetch } from './utils/api'
import Categoria from './domain/categoria'
// Remover: import AsyncStorage from '@react-native-async-storage/async-storage'

// Trocar useState<any[]> por useState<Categoria[]>
const [categorias, setCategorias] = useState<Categoria[]>([])

// Dentro do useEffect:
const data = await apiFetch<Categoria[]>(`${API_BASE_URL}/torneios/${torneio}/categorias`)
setCategorias(data)
```

#### 2.2.3 `app/detalhes-equipe.tsx`

**ANTES:**
```typescript
const user = await AsyncStorage.getItem('session_user')
if (!user) { ... return }
const token = JSON.parse(user).token
const response = await fetch(`${API_BASE_URL}/equipes/${id}/atletas`, {
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
})
if (!response.ok) throw new Error('Erro ao carregar equipe.')
const data: Atleta[] = await response.json()
```

**DEPOIS:**
```typescript
import { apiFetch } from './utils/api'
// Remover: import AsyncStorage  (manter apenas para o perfil useEffect)

const data = await apiFetch<Atleta[]>(`${API_BASE_URL}/equipes/${id}/atletas`)
setAtletas(data)
```

Tambem no `fetchPerfil`, usar `getAuthToken` ou manter AsyncStorage diretamente para ler role (nao e um fetch HTTP).

#### 2.2.4 `app/admin/vincular-equipe.tsx`

**ANTES** (funcao `loadEquipes`):
```typescript
const user = await AsyncStorage.getItem('session_user')
const headers = {
  'Authorization': `Bearer ${JSON.parse(user).token}`,
  'Content-Type': 'application/json',
}
const [disponiveisRes, vinculadasRes] = await Promise.all([
  fetch(`${API_BASE_URL}/equipes?codigoModalidade=${modalidade}`, { headers }),
  fetch(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/equipes`, { headers })
])
// ... manual status checks ...
```

**DEPOIS:**
```typescript
const [equipesDisponiveisData, equipesVinculadasData] = await Promise.all([
  apiFetch<Equipe[]>(`${API_BASE_URL}/equipes?codigoModalidade=${modalidade}`),
  apiFetch<Equipe[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/equipes`),
])
```

Remover o import de AsyncStorage (nao e mais necessario neste arquivo).

#### 2.2.5 `app/admin/incluir-jogo.tsx` (funcao `handleSalvar`)

**ANTES:**
```typescript
const user = await AsyncStorage.getItem('session_user')
const headers = {
  'Authorization': `Bearer ${JSON.parse(user).token}`,
  'Content-Type': 'application/json',
}
const response = await fetch(`${API_BASE_URL}/jogos`, {
  method: 'POST', headers, body: JSON.stringify(novoJogo),
})
```

**DEPOIS:**
```typescript
import { apiPost } from '../utils/api' // ja importado
// Remover: import AsyncStorage

await apiPost(`${API_BASE_URL}/jogos`, novoJogo)
setError(false)
setMessage('Jogo criado com sucesso!')
setShowDialog(true)
```

**IMPORTANTE:** Tambem corrigir o bug de `getFavoriteModality()`:

```typescript
// ANTES (bug - modalidade e uma Promise):
const modalidade = getFavoriteModality()

// DEPOIS:
const [modalidadeId, setModalidadeId] = useState<string | null>(null)

useEffect(() => {
  getFavoriteModality().then(setModalidadeId)
}, [])
```

#### 2.2.6 `app/admin/editar-jogo.tsx` (funcao `handleSalvar`)

Mesma mudanca que incluir-jogo:

```typescript
// ANTES:
const response = await fetch(`${API_BASE_URL}/jogos`, {
  method: 'PUT', headers, body: JSON.stringify(jogoAtualizado)
})

// DEPOIS:
await apiPut(`${API_BASE_URL}/jogos`, jogoAtualizado)
```

Tambem:
- Remover import morto `id` de `react-native-paper-dates` (linha 15)
- Corrigir bug de `getFavoriteModality()` (mesmo padrao do incluir-jogo)
- Substituir `import { format } from 'date-fns'` por `dayjs`

#### 2.2.7 `app/admin/editar-equipe.tsx` (funcao `handleUploadImagem`)

**ANTES:**
```typescript
const session = await AsyncStorage.getItem('session_user')
const { token } = JSON.parse(session)
const formData = new FormData()
formData.append('file', imagemFile)
const response = await fetch(`${API_BASE_URL}/equipes/${id}/upload`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
})
```

**DEPOIS:**
```typescript
import { apiUpload } from '../utils/api'

const formData = new FormData()
formData.append('file', imagemFile)
await apiUpload(`${API_BASE_URL}/equipes/${id}/upload`, formData)
```

---

### 2.3 Extrair formulario de Jogo compartilhado

Os arquivos `incluir-jogo.tsx` (541 linhas) e `editar-jogo.tsx` (481 linhas) compartilham:
- ~20 useState identicos (locais, arbitros, mesarios, estatisticos, data/hora, dialog, etc.)
- Funcoes `loadLocais`, `loadArbitros`, `loadEstatisticos`, `loadMesarios`, `loadTecnicos` identicas
- JSX dos pickers, date/time pickers, youtube link, dialog identicos
- Funcao `isValidYoutubeUrl` duplicada

#### Criar `app/hooks/useJogoForm.ts`:

```typescript
import { useState, useEffect } from 'react'
import { apiFetch } from '../utils/api'
import { API_BASE_URL } from '../../utils/config'
import { getFavoriteModality } from '../../utils/preferences'
import Torneio from '../domain/torneio'
import Categoria from '../domain/categoria'
import Equipe from '../domain/equipe'
import type { Arbitro, Tecnico, Mesario, Estatistico } from '../domain/staff'
import Local from '../domain/local'

export interface JogoFormState {
  modalidadeId: string | null

  torneios: Torneio[]
  torneioSelecionado: string | null
  categorias: Categoria[]
  categoriaSelecionada: string | null
  equipes: Equipe[]
  equipeMandante: string | null
  equipeVisitante: string | null

  tecnicosMandante: Tecnico[]
  tecnicosVisitante: Tecnico[]
  tecnicoMandante: string | null
  tecnicoVisitante: string | null

  locais: Local[]
  localSelecionado: string | null

  arbitros: Arbitro[]
  arbitroSelecionado: string | null
  arbitroAuxiliar: string | null

  estatisticos: Estatistico[]
  estatisticoSelecionado: string | null

  mesarios: Mesario[]
  mesarioSelecionado: string | null

  dataJogo: Date | null
  horaJogo: Date | null
  showDatePicker: boolean
  showTimePicker: boolean
  youtubeLink: string
  erroLink: string | null

  showDialog: boolean
  message: string | null
  error: boolean | null
}

export function useJogoForm() {
  const [modalidadeId, setModalidadeId] = useState<string | null>(null)

  const [torneios, setTorneios] = useState<Torneio[]>([])
  const [torneioSelecionado, setTorneioSelecionado] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null)
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [equipeMandante, setEquipeMandante] = useState<string | null>(null)
  const [equipeVisitante, setEquipeVisitante] = useState<string | null>(null)

  const [tecnicosMandante, setTecnicosMandante] = useState<Tecnico[]>([])
  const [tecnicosVisitante, setTecnicosVisitante] = useState<Tecnico[]>([])
  const [tecnicoMandante, setTecnicoMandante] = useState<string | null>(null)
  const [tecnicoVisitante, setTecnicoVisitante] = useState<string | null>(null)

  const [locais, setLocais] = useState<Local[]>([])
  const [localSelecionado, setLocalSelecionado] = useState<string | null>(null)

  const [arbitros, setArbitros] = useState<Arbitro[]>([])
  const [arbitroSelecionado, setArbitroSelecionado] = useState<string | null>(null)
  const [arbitroAuxiliar, setArbitroAuxiliar] = useState<string | null>(null)

  const [estatisticos, setEstatisticos] = useState<Estatistico[]>([])
  const [estatisticoSelecionado, setEstatisticoSelecionado] = useState<string | null>(null)

  const [mesarios, setMesarios] = useState<Mesario[]>([])
  const [mesarioSelecionado, setMesarioSelecionado] = useState<string | null>(null)

  const [dataJogo, setDataJogo] = useState<Date | null>(null)
  const [horaJogo, setHoraJogo] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [youtubeLink, setYoutubeLink] = useState('')
  const [erroLink, setErroLink] = useState<string | null>(null)

  const [showDialog, setShowDialog] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<boolean | null>(null)

  // Carregar modalidade favorita
  useEffect(() => {
    getFavoriteModality().then(setModalidadeId)
  }, [])

  // Carregar dados auxiliares quando modalidade muda
  useEffect(() => {
    if (!modalidadeId) return
    loadTorneios(modalidadeId)
    loadLocais()
    loadArbitros(modalidadeId)
    loadEstatisticos(modalidadeId)
    loadMesarios(modalidadeId)
  }, [modalidadeId])

  useEffect(() => {
    if (torneioSelecionado) loadCategorias(torneioSelecionado)
  }, [torneioSelecionado])

  useEffect(() => {
    if (categoriaSelecionada && torneioSelecionado) {
      loadEquipes(torneioSelecionado, categoriaSelecionada)
    }
  }, [categoriaSelecionada, torneioSelecionado])

  useEffect(() => {
    if (equipeMandante) loadTecnicos(equipeMandante, true)
  }, [equipeMandante])

  useEffect(() => {
    if (equipeVisitante) loadTecnicos(equipeVisitante, false)
  }, [equipeVisitante])

  const showError = (msg: string) => {
    setError(true)
    setMessage(msg)
    setShowDialog(true)
  }

  const showSuccess = (msg: string) => {
    setError(false)
    setMessage(msg)
    setShowDialog(true)
  }

  const handleCloseDialog = (onSuccessCallback?: () => void) => {
    setShowDialog(false)
    setMessage(null)
    if (!error && onSuccessCallback) onSuccessCallback()
    setError(null)
  }

  async function loadTorneios(mod: string) {
    try {
      const data = await apiFetch<Torneio[]>(`${API_BASE_URL}/torneios/modalidade/${mod}`)
      setTorneios(data)
      setTorneioSelecionado(null)
      setCategorias([])
      setEquipes([])
    } catch (e: unknown) {
      showError((e as Error).message || 'Erro ao carregar torneios.')
    }
  }

  async function loadCategorias(torneioId: string) {
    try {
      const data = await apiFetch<Categoria[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias`)
      setCategorias(data)
      setCategoriaSelecionada(null)
      setEquipes([])
    } catch (e: unknown) {
      showError((e as Error).message || 'Erro ao carregar categorias.')
    }
  }

  async function loadEquipes(torneioId: string, categoriaId: string) {
    try {
      const data = await apiFetch<Equipe[]>(
        `${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/equipes`,
      )
      setEquipes(data)
    } catch (e: unknown) {
      showError((e as Error).message || 'Erro ao carregar equipes.')
    }
  }

  async function loadLocais() {
    try {
      const data = await apiFetch<Local[]>(`${API_BASE_URL}/locais`)
      setLocais(data)
    } catch (e: unknown) {
      showError((e as Error).message || 'Erro ao carregar locais.')
    }
  }

  async function loadArbitros(mod: string) {
    try {
      const data = await apiFetch<Arbitro[]>(`${API_BASE_URL}/arbitros/modalidade/${mod}`)
      setArbitros(data)
    } catch (e: unknown) {
      showError((e as Error).message || 'Erro ao carregar arbitros.')
    }
  }

  async function loadEstatisticos(mod: string) {
    try {
      const data = await apiFetch<Estatistico[]>(`${API_BASE_URL}/estatisticos/modalidade/${mod}`)
      setEstatisticos(data)
    } catch (e: unknown) {
      showError((e as Error).message || 'Erro ao carregar estatisticos.')
    }
  }

  async function loadMesarios(mod: string) {
    try {
      const data = await apiFetch<Mesario[]>(`${API_BASE_URL}/mesarios/modalidade/${mod}`)
      setMesarios(data)
    } catch (e: unknown) {
      showError((e as Error).message || 'Erro ao carregar mesarios.')
    }
  }

  async function loadTecnicos(equipeId: string, isMandante: boolean) {
    try {
      const data = await apiFetch<Tecnico[]>(`${API_BASE_URL}/equipes/${equipeId}/tecnicos`)
      if (isMandante) setTecnicosMandante(data)
      else setTecnicosVisitante(data)
    } catch (e: unknown) {
      showError((e as Error).message || 'Erro ao carregar tecnicos.')
    }
  }

  function getDataHoraString(): string | null {
    if (!dataJogo || !horaJogo) return null
    const combined = new Date(
      dataJogo.getFullYear(), dataJogo.getMonth(), dataJogo.getDate(),
      horaJogo.getHours(), horaJogo.getMinutes(),
    )
    // dayjs import needed: import dayjs from 'dayjs'
    // return dayjs(combined).format('YYYY-MM-DDTHH:mm:ss')
    // Or manual:
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${combined.getFullYear()}-${pad(combined.getMonth() + 1)}-${pad(combined.getDate())}T${pad(combined.getHours())}:${pad(combined.getMinutes())}:00`
  }

  function validateYoutubeLink(): boolean {
    if (!youtubeLink) return true
    try {
      const parsed = new URL(youtubeLink)
      return parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')
    } catch {
      return false
    }
  }

  const isFormValid = !!(
    modalidadeId && torneioSelecionado && equipeMandante && equipeVisitante && dataJogo && horaJogo
  )

  return {
    // State
    modalidadeId, torneios, torneioSelecionado, categorias, categoriaSelecionada,
    equipes, equipeMandante, equipeVisitante,
    tecnicosMandante, tecnicosVisitante, tecnicoMandante, tecnicoVisitante,
    locais, localSelecionado,
    arbitros, arbitroSelecionado, arbitroAuxiliar,
    estatisticos, estatisticoSelecionado,
    mesarios, mesarioSelecionado,
    dataJogo, horaJogo, showDatePicker, showTimePicker, youtubeLink, erroLink,
    showDialog, message, error, isFormValid,

    // Setters
    setTorneioSelecionado, setCategoriaSelecionada,
    setEquipeMandante, setEquipeVisitante,
    setTecnicoMandante, setTecnicoVisitante,
    setLocalSelecionado,
    setArbitroSelecionado, setArbitroAuxiliar,
    setEstatisticoSelecionado, setMesarioSelecionado,
    setDataJogo, setHoraJogo, setShowDatePicker, setShowTimePicker,
    setYoutubeLink, setErroLink,

    // Actions
    showError, showSuccess, handleCloseDialog,
    getDataHoraString, validateYoutubeLink,

    // Para pre-preencher no modo edicao
    setTecnicosMandante, setTecnicosVisitante,
    setLocais, setArbitros, setEstatisticos, setMesarios,
    loadTecnicos,
  }
}
```

#### Uso simplificado em `incluir-jogo.tsx` (~50 linhas em vez de 541):

```typescript
import { useJogoForm } from '../hooks/useJogoForm'
import { apiPost } from '../utils/api'

export default function IncluirJogoScreen() {
  const router = useRouter()
  const form = useJogoForm()

  const handleSalvar = async () => {
    if (!form.validateYoutubeLink()) {
      form.showError('Link invalido.')
      return
    }
    const dataHora = form.getDataHoraString()
    if (!dataHora) {
      form.showError('Data e hora sao obrigatorias.')
      return
    }
    try {
      await apiPost(`${API_BASE_URL}/jogos`, {
        data: dataHora,
        mandante: { id: Number(form.equipeMandante) },
        visitante: { id: Number(form.equipeVisitante) },
        // ... demais campos
      })
      form.showSuccess('Jogo criado com sucesso!')
    } catch (e: unknown) {
      form.showError((e as Error).message || 'Erro desconhecido.')
    }
  }

  return (
    <JogoFormFields form={form} onSave={handleSalvar} saveLabel="Salvar Jogo" />
  )
}
```

---

## Fase 3 - Componentizacao e Organizacao

### 3.1 Criar nova estrutura de pastas

```bash
# Criar novos diretorios
mkdir -p app/hooks
mkdir -p app/services
mkdir -p app/components/ui

# Os diretorios abaixo ja existem (renomear depois):
# app/componente/ -> app/components/
# Os subdiretorios jogo/, atleta/, escalacao/, layout/ ja existem
```

**Nota sobre renomear `componente` -> `components`:**
Como expo-router usa file-based routing e `componente/` nao e uma rota (nao tem default export de screen), a renomeacao e segura. Porem, sera necessario atualizar todos os imports. Use find-and-replace global:

```bash
# Substituir em todos os arquivos:
# '../componente/' -> '../components/'
# './componente/' -> './components/'
```

### 3.2 Extrair hooks reutilizaveis

#### `app/hooks/useAuth.ts`

```typescript
import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import Usuario from '../domain/usuario'

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadSession()
  }, [])

  const loadSession = useCallback(async () => {
    try {
      const session = await AsyncStorage.getItem('session_user')
      if (session) {
        const parsed = JSON.parse(session)
        setUser(parsed)
        setToken(parsed.token)
      }
    } catch {
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('session_user')
    await AsyncStorage.removeItem('equipe_favorita')
    setUser(null)
    setToken(null)
    router.replace('/login')
  }, [router])

  const isAdmin = user?.role === 'ADMIN'
  const isEstatistico = user?.role === 'ESTATISTICO'

  return { user, token, loading, isAdmin, isEstatistico, logout, loadSession }
}
```

#### `app/hooks/useDialog.ts`

```typescript
import { useState, useCallback } from 'react'

interface DialogState {
  open: boolean
  message: string | null
  type: 'error' | 'success'
}

export function useDialog() {
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    message: null,
    type: 'success',
  })

  const showError = useCallback((message: string) => {
    setDialog({ open: true, message, type: 'error' })
  }, [])

  const showSuccess = useCallback((message: string) => {
    setDialog({ open: true, message, type: 'success' })
  }, [])

  const closeDialog = useCallback((onCloseCallback?: () => void) => {
    setDialog((prev) => {
      if (prev.type !== 'error' && onCloseCallback) onCloseCallback()
      return { open: false, message: null, type: 'success' }
    })
  }, [])

  return { dialog, showError, showSuccess, closeDialog }
}
```

**Uso em qualquer screen (substitui padrao repetido em 10+ telas):**

```typescript
const { dialog, showError, showSuccess, closeDialog } = useDialog()

// Em vez de:
// const [message, setMessage] = useState<string | null>(null)
// const [showDialog, setShowDialog] = useState(false)
// const [error, setError] = useState<boolean | null>(null)
// const handleCloseDialog = () => { ... }
```

#### `app/hooks/useFetchData.ts`

```typescript
import { useState, useEffect, useCallback } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useFetchData<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = [],
) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await fetchFn()
      setState({ data, loading: false, error: null })
    } catch (e) {
      setState({ data: null, loading: false, error: (e as Error).message })
    }
  }, deps)

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}
```

### 3.3 Criar camada de servicos

#### `app/services/api-client.ts`

Mover o conteudo de `app/utils/api.ts` para `app/services/api-client.ts` e re-exportar de `app/utils/api.ts` para manter compatibilidade:

```typescript
// app/utils/api.ts (compatibilidade)
export { apiFetch, apiPost, apiPut, apiDelete, apiUpload, getAuthToken } from '../services/api-client'
```

#### `app/services/jogo.service.ts`

```typescript
import { apiFetch, apiPost, apiPut } from './api-client'
import { API_BASE_URL } from '../../utils/config'
import type Jogo from '../domain/jogo'

export interface CriarJogoDTO {
  data: string
  mandante: { id: number }
  visitante: { id: number }
  torneio: { id: number }
  categoria: { id: number }
  tecnicoMandante?: { id: number } | null
  tecnicoVisitante?: { id: number } | null
  local?: { id: number } | null
  arbitroPrincipal?: { id: number } | null
  arbitroAuxiliar?: { id: number } | null
  estatistico?: { id: number } | null
  mesario?: { id: number } | null
  streamUrl?: string | null
}

export const jogoService = {
  buscar: (id: number) =>
    apiFetch<Jogo>(`${API_BASE_URL}/jogos/${id}`),

  criar: (dto: CriarJogoDTO) =>
    apiPost<Jogo>(`${API_BASE_URL}/jogos`, dto),

  atualizar: (dto: CriarJogoDTO & { id: number }) =>
    apiPut<Jogo>(`${API_BASE_URL}/jogos`, dto),
}
```

#### `app/services/equipe.service.ts`

```typescript
import { apiFetch, apiPut, apiUpload } from './api-client'
import { API_BASE_URL } from '../../utils/config'
import type Equipe from '../domain/equipe'
import type { Atleta } from '../domain/atleta'

export const equipeService = {
  buscar: (id: number) =>
    apiFetch<Equipe>(`${API_BASE_URL}/equipes/${id}`),

  listarPorModalidade: (codigoModalidade: string) =>
    apiFetch<Equipe[]>(`${API_BASE_URL}/equipes?codigoModalidade=${codigoModalidade}`),

  atualizar: (id: number, data: { nome: string }) =>
    apiPut(`${API_BASE_URL}/equipes/${id}`, data),

  uploadImagem: (id: number, formData: FormData) =>
    apiUpload(`${API_BASE_URL}/equipes/${id}/upload`, formData),

  listarAtletas: (id: number) =>
    apiFetch<Atleta[]>(`${API_BASE_URL}/equipes/${id}/atletas`),
}
```

---

## Fase 4 - Tipagem e Seguranca de Tipos

### 4.1 Fortalecer tipos de dominio

#### Criar `app/domain/staff.ts` (tipos que faltam):

```typescript
export interface Tecnico {
  id: number
  nome: string
  equipeId?: number
}

export interface Arbitro {
  id: number
  nome: string
}

export interface Mesario {
  id: number
  nome: string
}

export interface Estatistico {
  id: number
  nome: string
  usuarioId?: string
}
```

#### Corrigir `app/domain/jogo.ts`:

```typescript
import { Atleta } from './atleta'
import Categoria from './categoria'
import Equipe from './equipe'
import Evento from './evento'
import Local from './local'
import Parcial from './parcial'
import { Tecnico, Arbitro, Mesario, Estatistico } from './staff'

export default interface Jogo {
  id: number
  data: string
  categoria: Categoria
  mandante: Equipe
  visitante: Equipe
  local: Local
  eventos: Evento[]
  streamUrl: string
  placarMandante: number
  placarVisitante: number
  periodo: string
  status: string
  atletasMandante: Atleta[]
  tecnicoMandante: Tecnico | null
  tecnicoVisitante: Tecnico | null
  atletasVisitante: Atleta[]
  arbitroPrincipal: Arbitro | null
  arbitroAuxiliar: Arbitro | null
  mesario: Mesario | null
  estatistico: Estatistico | null
  parciais: Parcial[]
}
```

#### Corrigir `app/domain/fase.ts`:

```typescript
export type TipoFase = 'FASE_GRUPOS' | 'ELIMINATORIA' | 'FINAL' | string

export interface ChaveFase {
  id: number
  nome: string
  equipes: { id: number; nome: string }[]
}

export default interface Fase {
  id?: number
  nome?: string | null
  tipoFase?: TipoFase | null
  serie?: string | null
  numeroClassificados?: number | null
  idaVolta?: boolean | null
  melhorDe?: number | null
  ordem?: number | null
  status?: string | null
  chaves?: ChaveFase[] | null
}
```

#### Corrigir `app/domain/torneio.ts`:

```typescript
import Categoria from './categoria'

export interface Patrocinador {
  id: number
  nome: string
  imagemPath?: string
}

export default interface Torneio {
  id?: number
  nome?: string
  modalidade?: string
  status?: string
  ano?: number
  categorias?: Categoria[] | null
  patrocinadores?: Patrocinador[] | null
}
```

#### Corrigir `app/domain/categoria.ts`:

```typescript
import Torneio from './torneio'
import Equipe from './equipe'

export default interface Categoria {
  id?: number
  nome?: string | null
  torneio?: Torneio | null
  equipes?: Equipe[] | null
}
```

#### Renomear conflito `EstatisticaTipo`:

O tipo em `app/types/estatisticas.ts` conflita com o de `app/domain/estatistica.ts`.

Renomear em `app/types/estatisticas.ts`:

```typescript
export type EstatisticaRankingTipo = typeof ESTATISTICA_TIPOS[keyof typeof ESTATISTICA_TIPOS]

export interface EstatisticaGrupo {
  tipo: EstatisticaRankingTipo  // antes: EstatisticaTipo
  titulo: string
  itens: EstatisticaItem[]
}
```

Atualizar todos os imports que usam `EstatisticaTipo` de `app/types/estatisticas.ts`.

### 4.2 Habilitar strict mode no TypeScript

Atualizar `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  },
  "extends": "expo/tsconfig.base",
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

**Nota:** Isso vai gerar MUITOS erros inicialmente. Abordagem incremental:
1. Ativar `strict: true`
2. Corrigir erros arquivo por arquivo
3. Para arquivos que demandam mais trabalho, usar `// @ts-expect-error` temporariamente com TODO

---

## Fase 5 - Testes Unitarios com Jest

### 5.1 Estrutura de testes

```
__tests__/
  services/
    api-client.test.ts
  hooks/
    useAuth.test.ts
    useDialog.test.ts
  utils/
    date-formatter.test.ts
    preferences.test.ts
  components/
    GenericPicker.test.tsx
    Modal.test.tsx
    dialog-error.test.tsx
```

### 5.2 Teste do API Client

Criar `__tests__/services/api-client.test.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

// Mock expo-router
jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}))

import { apiFetch, apiPost, apiPut, apiDelete } from '../../app/services/api-client'
import { router } from 'expo-router'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('apiRequest', () => {
  it('deve adicionar Authorization header quando session existe', async () => {
    const session = JSON.stringify({ token: 'test-token', role: 'USER' })
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(session)

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json', 'content-length': '2' }),
      json: () => Promise.resolve({ id: 1 }),
    })

    await apiFetch('https://api.test.com/data')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.test.com/data',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    )
  })

  it('deve redirecionar para login quando recebe 403', async () => {
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
      headers: new Headers(),
    })

    await expect(apiFetch('https://api.test.com/data')).rejects.toThrow('Sessao expirada')
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('session_user')
    expect(router.replace).toHaveBeenCalledWith('/login')
  })

  it('deve lançar erro com mensagem do servidor', async () => {
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      headers: new Headers({ 'content-type': 'application/json', 'content-length': '50' }),
      json: () => Promise.resolve({ message: 'Campo obrigatorio' }),
    })

    await expect(apiFetch('https://api.test.com/data')).rejects.toThrow('Campo obrigatorio')
  })

  it('apiPost deve enviar body como JSON', async () => {
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

    mockFetch.mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json', 'content-length': '10' }),
      json: () => Promise.resolve({ id: 1 }),
    })

    await apiPost('https://api.test.com/items', { nome: 'Teste' })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.test.com/items',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ nome: 'Teste' }),
      }),
    )
  })
})
```

### 5.3 Teste do date-formatter

Criar `__tests__/utils/date-formatter.test.ts`:

```typescript
import format, { formatHour, getBrazilLocalDateTimeString } from '../../app/utils/date-formatter'

describe('format', () => {
  it('deve formatar data ISO para dd/MM/yyyy', () => {
    expect(format('2025-03-15T10:30:00')).toBe('15/03/2025')
  })

  it('deve retornar string vazia para input vazio', () => {
    expect(format('')).toBe('')
  })

  it('deve retornar input original para data invalida', () => {
    expect(format('nao-e-uma-data')).toBe('nao-e-uma-data')
  })
})

describe('formatHour', () => {
  it('deve formatar hora corretamente', () => {
    const result = formatHour('2025-03-15T14:30:00')
    expect(result).toBe('14h30')
  })

  it('deve retornar vazio para meia-noite', () => {
    expect(formatHour('2025-03-15T00:00:00')).toBe('')
  })

  it('deve retornar vazio para input vazio', () => {
    expect(formatHour('')).toBe('')
  })
})

describe('getBrazilLocalDateTimeString', () => {
  it('deve retornar formato YYYY-MM-DDTHH:mm:ss', () => {
    const result = getBrazilLocalDateTimeString()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
  })
})
```

### 5.4 Teste do preferences

Criar `__tests__/utils/preferences.test.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  setFavoriteModality,
  removeFavoriteModality,
  getFavoriteModality,
} from '../../utils/preferences'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

beforeEach(() => jest.clearAllMocks())

describe('preferences', () => {
  it('setFavoriteModality deve salvar no AsyncStorage', async () => {
    await setFavoriteModality('BASQUETE')
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('favorite_modality', 'BASQUETE')
  })

  it('getFavoriteModality deve ler do AsyncStorage', async () => {
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue('BASQUETE')
    const result = await getFavoriteModality()
    expect(result).toBe('BASQUETE')
  })

  it('removeFavoriteModality deve remover do AsyncStorage', async () => {
    await removeFavoriteModality()
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('favorite_modality')
  })
})
```

### 5.5 Teste do useDialog hook

Criar `__tests__/hooks/useDialog.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react-native'
import { useDialog } from '../../app/hooks/useDialog'

describe('useDialog', () => {
  it('deve iniciar fechado', () => {
    const { result } = renderHook(() => useDialog())
    expect(result.current.dialog.open).toBe(false)
    expect(result.current.dialog.message).toBeNull()
  })

  it('showError deve abrir dialog com tipo error', () => {
    const { result } = renderHook(() => useDialog())
    act(() => result.current.showError('Deu ruim'))
    expect(result.current.dialog.open).toBe(true)
    expect(result.current.dialog.message).toBe('Deu ruim')
    expect(result.current.dialog.type).toBe('error')
  })

  it('showSuccess deve abrir dialog com tipo success', () => {
    const { result } = renderHook(() => useDialog())
    act(() => result.current.showSuccess('Funcionou'))
    expect(result.current.dialog.open).toBe(true)
    expect(result.current.dialog.message).toBe('Funcionou')
    expect(result.current.dialog.type).toBe('success')
  })

  it('closeDialog deve fechar o dialog', () => {
    const { result } = renderHook(() => useDialog())
    act(() => result.current.showError('Erro'))
    act(() => result.current.closeDialog())
    expect(result.current.dialog.open).toBe(false)
  })
})
```

---

## Fase 6 - Seguranca

### 6.1 Instalar expo-secure-store

```bash
npx expo install expo-secure-store
```

### 6.2 Criar storage seguro para token

Criar `app/services/secure-storage.ts`:

```typescript
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SESSION_KEY = 'session_user'

// SecureStore nao funciona na web, usar AsyncStorage como fallback
const isWeb = Platform.OS === 'web'

export async function saveSession(session: object): Promise<void> {
  const value = JSON.stringify(session)
  if (isWeb) {
    await AsyncStorage.setItem(SESSION_KEY, value)
  } else {
    await SecureStore.setItemAsync(SESSION_KEY, value)
  }
}

export async function getSession<T = unknown>(): Promise<T | null> {
  try {
    const value = isWeb
      ? await AsyncStorage.getItem(SESSION_KEY)
      : await SecureStore.getItemAsync(SESSION_KEY)

    if (!value) return null
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export async function clearSession(): Promise<void> {
  if (isWeb) {
    await AsyncStorage.removeItem(SESSION_KEY)
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY)
  }
}
```

### 6.3 Atualizar api-client para usar secure storage

No `apiRequest`, trocar:

```typescript
// ANTES:
const user = await AsyncStorage.getItem('session_user')
if (!user) return null
const parsed = JSON.parse(user)
return parsed?.token ?? null

// DEPOIS:
import { getSession } from './secure-storage'

async function getAuthToken(): Promise<string | null> {
  const session = await getSession<{ token: string }>()
  return session?.token ?? null
}
```

### 6.4 Atualizar login para usar secure storage

Em `app/login.tsx`, trocar:

```typescript
// ANTES:
await AsyncStorage.setItem('session_user', JSON.stringify(data))

// DEPOIS:
import { saveSession } from '../services/secure-storage'
await saveSession(data)
```

### 6.5 Corrigir bug de tema no `_layout.tsx`

Trocar linha 15:

```typescript
// ANTES:
<Theme name={colorScheme === 'dark' ? 'dark' : 'dark'}>

// DEPOIS:
<Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
```

### 6.6 Validacao de inputs

Criar `app/utils/validators.ts`:

```typescript
export function isValidYoutubeUrl(url: string): boolean {
  if (!url) return true
  try {
    const parsed = new URL(url)
    return parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')
  } catch {
    return false
  }
}

export function isValidCep(cep: string): boolean {
  return /^\d{5}-?\d{3}$/.test(cep)
}

export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}
```

---

## Fase 7 - Documentacao e Limpeza

### 7.1 Reescrever `README.md`

```markdown
# CSB App - Campeonato Santista de Basquete

Aplicativo mobile e web para acompanhamento de campeonatos de basquete.

## Stack

- **Expo SDK 54** + React Native 0.81 + React 19
- **expo-router** (file-based routing)
- **Tamagui** + React Native Paper (UI)
- **TypeScript** com strict mode
- **Jest** + React Native Testing Library (testes)
- **ESLint** + Prettier (qualidade de codigo)

## Setup

### Requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)

### Instalacao

\`\`\`bash
git clone <repo-url>
cd csb-app
npm install
\`\`\`

### Scripts

| Comando | Descricao |
|---------|-----------|
| `npm start` | Inicia o Expo dev server |
| `npm run android` | Roda no Android |
| `npm run ios` | Roda no iOS |
| `npm run web` | Roda no browser |
| `npm test` | Roda testes |
| `npm run lint` | Verifica linting |
| `npm run format` | Formata codigo |

### Estrutura

\`\`\`
app/
  _layout.tsx          # Root layout
  (auth)/              # Rotas publicas
  (main)/              # Rotas autenticadas
  admin/               # Telas administrativas
  components/          # Componentes reutilizaveis
  domain/              # Tipos de dominio
  hooks/               # Custom hooks
  services/            # Camada de servicos (API)
  types/               # Tipos auxiliares
  utils/               # Helpers puros
utils/                 # Config e preferencias
assets/                # Imagens e icones
\`\`\`

### API

Backend: `https://api.csb.app.br`

### Deploy Web

Deploy automatico via Vercel (static export).
```

### 7.2 Limpeza

1. **Remover import morto** em `app/admin/editar-jogo.tsx` linha 15:
   - Trocar `import { DatePickerModal, id, TimePickerModal }` por `import { DatePickerModal, TimePickerModal }`

2. **Adicionar ao `.gitignore`**:
   ```
   # Keystores
   *.keystore
   *.jks
   !android/app/debug.keystore
   ```

3. **Atualizar LICENSE** com informacoes corretas do projeto CSB.

---

## Checklist de Execucao

Use este checklist para acompanhar o progresso:

- [ ] **Fase 1.1** - ESLint + Prettier instalados e configurados
- [ ] **Fase 1.2** - Jest + Testing Library instalados e configurados
- [ ] **Fase 1.3** - Dependencias desnecessarias removidas
- [ ] **Fase 2.1** - `api.ts` refatorado (194 -> ~90 linhas)
- [ ] **Fase 2.2** - 7 arquivos migrados de raw fetch para api client
- [ ] **Fase 2.3** - `useJogoForm` extraido; incluir/editar-jogo simplificados
- [ ] **Fase 3.1** - Pastas reorganizadas (hooks/, services/, components/)
- [ ] **Fase 3.2** - Hooks extraidos (useAuth, useDialog, useFetchData)
- [ ] **Fase 3.3** - Servicos criados (jogo.service, equipe.service)
- [ ] **Fase 4.1** - Tipos de dominio fortalecidos (zero `any` em domain/)
- [ ] **Fase 4.2** - `any` eliminado dos screens; strict mode ativado
- [ ] **Fase 5.1** - Testes de services e utils escritos e passando
- [ ] **Fase 5.2** - Testes de componentes escritos e passando
- [ ] **Fase 5.3** - Smoke tests de screens escritos e passando
- [ ] **Fase 6.1** - Token migrado para expo-secure-store
- [ ] **Fase 6.2** - Parsing de sessao centralizado e seguro
- [ ] **Fase 6.3** - Validacao de inputs adicionada
- [ ] **Fase 6.4** - Bug de tema corrigido
- [ ] **Fase 7** - README, LICENSE, imports mortos, keystores

---

## Notas Importantes

1. **Ordem de execucao**: As fases devem ser executadas em ordem. Cada uma depende da anterior.

2. **Testes apos cada fase**: Rode `npm start` e verifique que o app ainda funciona apos cada mudanca. Rode `npm test` apos a Fase 5.

3. **Commits**: Faca um commit ao final de cada sub-fase (ex: "feat: configure eslint and prettier", "refactor: consolidate api client").

4. **Conflito de nomes**: `EstatisticaTipo` existe em 2 arquivos com significados diferentes. Renomear o de `app/types/estatisticas.ts` para `EstatisticaRankingTipo`.

5. **`getFavoriteModality()` retorna Promise**: Em `incluir-jogo.tsx` e `editar-jogo.tsx`, a funcao e chamada como sincrona mas retorna `Promise<string | null>`. Corrigir usando `useState` + `useEffect` (ver Fase 2.2.5).

6. **Multipart upload**: O `editar-equipe.tsx` usa `fetch` direto para upload de imagem com `FormData`. O novo `apiUpload` do api-client resolve isso, mas NAO deve setar `Content-Type` (o browser define automaticamente com boundary).

7. **ViaCEP**: O `incluir-local.tsx` faz fetch para `viacep.com.br`. Este pode continuar com fetch direto pois e uma API externa sem auth. Nao migrar para api client.
