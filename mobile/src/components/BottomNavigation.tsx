import { useState, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { useLanguage, type Translator } from '@/i18n/language-context';
import { spacing, radius, type ThemeColors } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type NavItem = {
  key: string;
  icon: string;
  labelKey: 'nav.home' | 'nav.games' | 'nav.reminders' | 'nav.more';
};

const NAV_ITEMS: NavItem[] = [
  { key: 'home', icon: 'home', labelKey: 'nav.home' },
  { key: 'games', icon: 'gamepad', labelKey: 'nav.games' },
  { key: 'reminders', icon: 'bell', labelKey: 'nav.reminders' },
  { key: 'more', icon: 'ellipsis-h', labelKey: 'nav.more' },
];

type BottomNavigationProps = {
  active?: string;
  onNavigate?: (key: string) => void;
};

export function BottomNavigation({ active = 'home', onNavigate }: BottomNavigationProps) {
  const { t } = useLanguage();
  const { colors } = useTheme();

  return (
    <View
      style={[styles.bar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
      accessibilityRole="tablist"
      accessibilityLabel={t('nav.home')}>
      {NAV_ITEMS.map((item) => {
        return (
          <NavItemButton
            key={item.key}
            item={item}
            isActive={active === item.key}
            colors={colors}
            onNavigate={onNavigate}
            t={t}
          />
        );
      })}
    </View>
  );
}

function NavItemButton({
  item,
  isActive,
  colors,
  onNavigate,
  t,
}: {
  item: NavItem;
  isActive: boolean;
  colors: ThemeColors;
  onNavigate?: (key: string) => void;
  t: Translator;
}) {
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={t(item.labelKey)}
      accessibilityState={{ selected: isActive }}
      onPress={() => onNavigate?.(item.key)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      hitSlop={8}
      style={({ pressed: p }) => [
        styles.item,
        p && styles.pressed,
        focused && { borderColor: colors['primary.dark'], borderWidth: 3 },
      ]}>
      <View style={[styles.iconWrap, isActive && { backgroundColor: colors.primary }]}>
        <AppIcon
          name={item.icon}
          color={isActive ? colors.onPrimary : colors['text.muted']}
          size={22}
        />
      </View>
      <AppText variant="captionMedium" color={isActive ? 'primary' : 'muted'} numberOfLines={1}>
        {t(item.labelKey)}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minWidth: 60,
    paddingVertical: spacing.xs,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});