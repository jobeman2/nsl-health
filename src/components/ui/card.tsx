import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Palette, Radii, Shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  headerTitle?: string;
  headerRight?: React.ReactNode;
  noPadding?: boolean;
}

export function Card({
  children,
  style,
  headerTitle,
  headerRight,
  noPadding = false,
}: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {headerTitle ? (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          {headerRight}
        </View>
      ) : null}
      <View style={!noPadding ? styles.body : undefined}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Palette.zinc200,
    overflow: 'hidden',
    ...Shadows.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Palette.zinc50,
    borderBottomWidth: 1,
    borderBottomColor: Palette.zinc200,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.zinc600,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  body: {
    padding: 14,
  },
});
