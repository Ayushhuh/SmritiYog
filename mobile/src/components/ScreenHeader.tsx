import { useState } from 'react';
import { StyleSheet, View, Pressable, type ViewStyle, type StyleProp } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { LanguageSheet } from '@/components/LanguageSheet';
import { useFocusable } from '@/components/use-focusable';
import { LANGUAGE_NAMES, LANGUAGE_SHORT } from '@/i18n/languages';
import { useLanguage } from '@/i18n/language-context';
import { spacing, radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type ScreenHeaderProps = {
  style?: StyleProp<ViewStyle>;
  onMenuPress?: () => void;
};

export function ScreenHeader({ style, onMenuPress }: ScreenHeaderProps) {
  const { t, language } = useLanguage();
  const { colors, scheme, toggleScheme } = useTheme();
  const menuFocus = useFocusable();
  const langFocus = useFocusable();
  const themeFocus = useFocusable();
  const [langSheetOpen, setLangSheetOpen] = useState(false);

  return (
    <View style={[styles.header, { backgroundColor: colors.background }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('menu')}
        onPress={onMenuPress}
        onFocus={menuFocus.onFocus}
        onBlur={menuFocus.onBlur}
        hitSlop={10}
        style={[
          styles.headerAction,
          menuFocus.focused && { backgroundColor: colors['surface.warm'] },
        ]}>
        <AppIcon name="bars" color={colors['text.primary']} size={24} />
      </Pressable>

      <AppText variant="h3" color="primary" fill style={styles.title}>
        {t('appName')}
      </AppText>

      <View style={styles.rightActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={LANGUAGE_NAMES[language]}
          onPress={() => setLangSheetOpen(true)}
          onFocus={langFocus.onFocus}
          onBlur={langFocus.onBlur}
          hitSlop={10}
          style={[
            styles.headerAction,
            langFocus.focused && { backgroundColor: colors['surface.warm'] },
          ]}>
          <AppIcon name="globe" color={colors['text.primary']} size={20} />
          <AppText variant="captionMedium" color="primary">
            {LANGUAGE_SHORT[language]}
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('theme')}
          onPress={toggleScheme}
          onFocus={themeFocus.onFocus}
          onBlur={themeFocus.onBlur}
          hitSlop={10}
          style={[
            styles.headerAction,
            themeFocus.focused && { backgroundColor: colors['surface.warm'] },
          ]}>
          <AppIcon
            name={scheme === 'dark' ? 'sun' : 'moon'}
            color={colors['text.primary']}
            size={22}
          />
        </Pressable>
      </View>

      <LanguageSheet visible={langSheetOpen} onClose={() => setLangSheetOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    minHeight: 64,
  },
  headerAction: {
    minWidth: 44,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: radius.md,
  },
  title: {
    flexShrink: 1,
    marginHorizontal: spacing.md,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});