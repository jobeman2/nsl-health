import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Palette, Radii } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryBtn;
      case 'secondary':
        return styles.secondaryBtn;
      case 'outline':
        return styles.outlineBtn;
      case 'destructive':
        return styles.destructiveBtn;
      case 'ghost':
        return styles.ghostBtn;
      default:
        return styles.primaryBtn;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'destructive':
        return styles.destructiveText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        getContainerStyle(),
        getSizeStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Palette.white : Palette.zinc900}
        />
      ) : (
        <View style={styles.innerContent}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text style={[styles.baseText, getTextStyle(), textStyle]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.lg,
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    marginRight: 2,
  },
  sizeSm: {
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  sizeMd: {
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  sizeLg: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  primaryBtn: {
    backgroundColor: Palette.primary,
  },
  secondaryBtn: {
    backgroundColor: Palette.primarySoft,
    borderWidth: 1,
    borderColor: 'rgba(18, 60, 116, 0.2)',
  },
  outlineBtn: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.zinc200,
  },
  destructiveBtn: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.3)',
  },
  ghostBtn: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  baseText: {
    fontWeight: '600',
    fontSize: 14,
  },
  primaryText: {
    color: Palette.white,
  },
  secondaryText: {
    color: Palette.primary,
  },
  outlineText: {
    color: Palette.zinc800,
  },
  destructiveText: {
    color: '#be123c',
  },
  ghostText: {
    color: Palette.zinc600,
  },
});
