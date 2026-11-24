import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Palette, Radii, Typography } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
}

export function Input({
  label,
  error,
  containerStyle,
  rightElement,
  style,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <TextInput
          placeholderTextColor={Palette.zinc400}
          style={[styles.input, style]}
          {...props}
        />
        {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    ...Typography.overline,
    color: Palette.zinc600,
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.zinc200,
    borderRadius: Radii.md,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#e11d48',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: Palette.zinc900,
  },
  right: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 11,
    color: '#e11d48',
    marginTop: 4,
  },
});
