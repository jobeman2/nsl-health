import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Palette, Radii, Fonts } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'pending' | 'verified' | 'penalized' | 'paid' | 'appeal' | 'resolved' | 'dismissed' | 'outline' | 'default';
  showDot?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  mono?: boolean;
}

export function Badge({
  label,
  variant = 'default',
  showDot = false,
  style,
  textStyle,
  mono = false,
}: BadgeProps) {
  const token =
    variant in Palette.status
      ? Palette.status[variant as keyof typeof Palette.status]
      : {
          bg: Palette.zinc100,
          border: Palette.zinc200,
          text: Palette.zinc700,
          dot: Palette.zinc500,
        };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: token.bg,
          borderColor: token.border,
        },
        style,
      ]}
    >
      {showDot && <View style={[styles.dot, { backgroundColor: token.dot }]} />}
      <Text
        style={[
          styles.text,
          {
            color: token.text,
            fontFamily: mono ? Fonts.mono : Fonts.sans,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radii.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },
});
