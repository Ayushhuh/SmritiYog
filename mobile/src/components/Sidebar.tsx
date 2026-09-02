import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
} from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { useLanguage } from '@/i18n/language-context';
import { useAuth } from '@/lib/auth-context';
import { spacing, radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
};

const SIDEBAR_WIDTH = Math.min(Dimensions.get('window').width * 0.72, 300);
const ANIM_DURATION = 250;

export function Sidebar({ visible, onClose }: SidebarProps) {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const { logout } = useAuth();
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);

  useEffect(() => {
    if (visible && !isOpen.current) {
      isOpen.current = true;
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!visible && isOpen.current) {
      isOpen.current = false;
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -SIDEBAR_WIDTH,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateX, overlayOpacity]);

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  const handleOverlayPress = (_e: GestureResponderEvent) => {
    onClose();
  };

  return (
    <View style={styles.container} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: '#000',
            opacity: overlayOpacity,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleOverlayPress} />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          {
            backgroundColor: colors.surface,
            borderRightColor: colors.border,
            width: SIDEBAR_WIDTH,
            transform: [{ translateX }],
          },
        ]}>
        <View style={styles.panelHeader}>
          <AppIcon name="user-circle" color={colors.primary} size={40} />
          <AppText variant="h3" color="primary" style={styles.appTitle}>
            {t('appName')}
          </AppText>
        </View>

        <View style={styles.separator} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('logout')}
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.menuItem,
            { borderColor: colors.border },
            pressed && { backgroundColor: colors['surface.warm'] },
          ]}>
          <AppIcon name="sign-out-alt" color={colors.danger} size={20} />
          <AppText variant="label" color="primary" style={styles.menuLabel}>
            {t('logout')}
          </AppText>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRightWidth: 1,
    paddingTop: spacing['4xl'],
    paddingBottom: spacing.xl,
  },
  panelHeader: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  appTitle: {
    marginTop: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: '#E4D8C6',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  menuLabel: {
    flex: 1,
  },
});
