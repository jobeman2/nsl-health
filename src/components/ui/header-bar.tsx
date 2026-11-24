import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Fonts } from '@/constants/theme';

/**
 * Properties for the standardized municipal header bar.
 */
export interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  rightAction?: React.ReactNode;
  onNotificationPress?: () => void;
}

/**
 * Standardized, light surface header for the field operations screens.
 *
 * @param {HeaderBarProps} props Header properties.
 * @returns {React.ReactElement} The rendered header bar.
 */
export function HeaderBar({
  title = 'CBHI • የጤና መድህን',
  subtitle = 'ንፋስ ስልክ ላፍቶ • Nifas Silk Lafto',
  showBack = false,
  onBackPress,
  onMenuPress,
  rightAction,
  onNotificationPress,
}: HeaderBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLeftAction = () => {
    if (onBackPress) {
      onBackPress();
    } else if (showBack) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/');
      }
    } else if (onMenuPress) {
      onMenuPress();
    } else {
      router.push('/');
    }
  };

  const handleNotification = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  const paddingTop = Math.max(insets.top, Platform.OS === 'ios' ? 8 : 12);

  return (
    <View style={[styles.headerContainer, { paddingTop }]}>
      <StatusBar style="dark" />
      <View style={styles.innerRow}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleLeftAction}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={23} color={Palette.primaryDark} />
            </TouchableOpacity>
          ) : onMenuPress ? (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={handleLeftAction}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="menu-outline" size={23} color={Palette.primaryDark} />
            </TouchableOpacity>
          ) : null}

          <View style={styles.logoCircle}>
            <Image
              source={require('@/assets/images/nsl-emblem.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.titleWrap}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.rightSection}>
          {rightAction !== undefined ? (
            rightAction
          ) : (
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={handleNotification}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={21} color={Palette.primaryDark} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 10,
    paddingHorizontal: 24,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 42,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  backButton: {
    padding: 2,
    marginRight: 2,
  },
  menuButton: {
    padding: 2,
    marginRight: 2,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    overflow: 'hidden',
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  titleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    color: Palette.primaryDark,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#71808A',
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
