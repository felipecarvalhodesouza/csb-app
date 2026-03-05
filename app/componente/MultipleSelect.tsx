import React, { useMemo } from 'react'
import MultiSelect from 'react-native-multiple-select'
import { YStack, Text } from 'tamagui'

interface MultipleSelectProps<T> {
  label?: string
  items: T[]
  value: any[]
  onChange: (value: any[]) => void
  getLabel: (item: T) => string
  getValue: (item: T) => any
  placeholder?: string
  filter?: (item: T) => boolean
  enabled?: boolean
}

export function MultipleSelect<T>({
  label,
  items,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = 'Selecione uma opção',
  filter,
  enabled = true,
}: MultipleSelectProps<T>) {

  const filteredItems = useMemo(
    () => (filter ? items.filter(filter) : items),
    [items, filter]
  )

  const mappedItems = useMemo(
    () =>
      filteredItems.map((item) => ({
        id: getValue(item),
        name: getLabel(item),
      })),
    [filteredItems, getLabel, getValue]
  )

  return (
    <YStack space="$1">
      {label && (
        <Text fontSize={14} color="$gray10">
          {label}
        </Text>
      )}

      <YStack
        borderRadius="$3"
        borderWidth={1}
        borderColor="$color4"
        bg="$color2"
        overflow="hidden"
        p={8}
      >
        {mappedItems.length === 0 ? (
          <Text color="$gray10" fontStyle="italic">
            Nenhuma opção disponível
          </Text>
        ) : (
        <MultiSelect
          items={mappedItems}
          uniqueKey="id"
          selectedItems={value}
          onSelectedItemsChange={onChange}
          selectText={placeholder}
          searchInputPlaceholderText="Buscar..."
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#333"
          selectedItemTextColor="#000"
          selectedItemIconColor="#000"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#000' }}
          submitButtonColor="#000"
          submitButtonText="OK"
          styleMainWrapper={{ backgroundColor: 'transparent' }}
          styleDropdownMenuSubsection={{ backgroundColor: 'transparent' }}
        />)}
      </YStack>
    </YStack>
  )
}