import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SelectCard } from './SelectCard';
import { MultiSelectCard } from './MultiSelectCard';
import { OptionChip } from './OptionChip';

export interface ChoiceOption<T extends string | number> {
  value: T;
  title: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface SingleChoiceGroupProps<T extends string | number> {
  options: ChoiceOption<T>[];
  selected: T;
  onChange: (value: T) => void;
  multiple?: false;
  layout?: 'cards' | 'chips';
  style?: ViewStyle;
}

export interface MultiChoiceGroupProps<T extends string | number> {
  options: ChoiceOption<T>[];
  selected: T[];
  onChange: (value: T[]) => void;
  multiple: true;
  layout?: 'cards' | 'chips';
  style?: ViewStyle;
}

export type ChoiceGroupProps<T extends string | number> =
  | SingleChoiceGroupProps<T>
  | MultiChoiceGroupProps<T>;

export function ChoiceGroup<T extends string | number>(props: ChoiceGroupProps<T>) {
  const { options, layout = 'cards', style } = props;

  if (props.multiple) {
    const { selected, onChange } = props;

    const handleToggle = (value: T) => {
      if (selected.includes(value)) {
        onChange(selected.filter((item) => item !== value));
      } else {
        onChange([...selected, value]);
      }
    };

    if (layout === 'chips') {
      return (
        <View style={[styles.chipsContainer, style]}>
          {options.map((option) => (
            <OptionChip
              key={String(option.value)}
              label={option.title}
              selected={selected.includes(option.value)}
              onToggle={() => handleToggle(option.value)}
              icon={option.icon}
            />
          ))}
        </View>
      );
    }

    return (
      <View style={[styles.cardsContainer, style]}>
        {options.map((option) => (
          <MultiSelectCard
            key={String(option.value)}
            title={option.title}
            description={option.description}
            badge={option.badge}
            icon={option.icon}
            selected={selected.includes(option.value)}
            onToggle={() => handleToggle(option.value)}
          />
        ))}
      </View>
    );
  }

  // Single choice
  const { selected, onChange } = props;

  if (layout === 'chips') {
    return (
      <View style={[styles.chipsContainer, style]}>
        {options.map((option) => (
          <OptionChip
            key={String(option.value)}
            label={option.title}
            selected={selected === option.value}
            onToggle={() => onChange(option.value)}
            icon={option.icon}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.cardsContainer, style]}>
      {options.map((option) => (
        <SelectCard
          key={String(option.value)}
          title={option.title}
          description={option.description}
          badge={option.badge}
          icon={option.icon}
          selected={selected === option.value}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    width: '100%',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default ChoiceGroup;
