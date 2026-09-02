import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { LANGUAGES, LANGUAGE_NAMES, type Language } from '@/i18n/languages';
import { useLanguage } from '@/i18n/language-context';
import { spacing, radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type LanguageSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function LanguageSheet({ visible, onClose }: LanguageSheetProps) {
  const { colors } = useTheme();
  const { t, language, setLanguage } = useLanguage();

  const select = (lang: Language) => {
    setLanguage(lang);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('theme')}
          style={styles.backdrop}
        />
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <AppText variant="h2" color="primary">
            {t('chooseLanguage')}
          </AppText>

          {LANGUAGES.map((lang) => {
            const selected = lang === language;
            return (
              <Pressable
                key={lang}
                onPress={() => select(lang)}
                accessibilityRole="button"
                accessibilityLabel={LANGUAGE_NAMES[lang]}
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.row,
                  {
                    backgroundColor: selected ? colors['surface.warm'] : 'transparent',
                    borderColor: pressed ? colors['primary.dark'] : 'transparent',
                    borderWidth: pressed ? 2 : 0,
                  },
                ]}>
                <AppText
                  variant="bodyLarge"
                  color={selected ? 'primary' : 'secondary'}
                  fill>
                  {LANGUAGE_NAMES[lang]}
                </AppText>
                {selected ? <AppIcon name="check" color={colors.secondary} size={22} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
});