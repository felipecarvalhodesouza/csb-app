import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { Platform, TextStyle } from 'react-native'
import { YStack } from 'tamagui'

interface GenericPickerProps<T> {
  items: T[]
  value: any
  onChange: (value: any) => void
  getLabel: (item: T) => string
  getValue: (item: T) => any
  placeholder?: string
  filter?: (item: T) => boolean
  enabled?: boolean
}

export function GenericPicker<T>({
  items,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = 'Selecione uma opção',
  filter,
  enabled = true,
}: GenericPickerProps<T>) {

const filteredItems = filter ? items.filter(filter) : items

const webStyle: TextStyle = {
  height: 40,
  padding: 8,
}

const nativeStyle: TextStyle = {
  height: 50,
  padding: 8,
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: '500',
}

const pickerStyle = Platform.OS === 'web' ? webStyle : nativeStyle

  return (
    <YStack
      borderRadius="$3"
      borderWidth={1}
      borderColor="$color4"
      bg="$color2"
      overflow="hidden"
    >
      <Picker
        enabled={enabled}
        selectedValue={value}
        onValueChange={(itemValue) => onChange(itemValue)}
        style={pickerStyle}
      >
        <Picker.Item label={placeholder} value={null} />
        {filteredItems && filteredItems.map((item, index) => (
          <Picker.Item
            key={index}
            label={getLabel(item)}
            value={getValue(item)}
          />
        ))}
      </Picker>
    </YStack>
  )
}