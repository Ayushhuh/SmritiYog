import { FontAwesome5 } from '@expo/vector-icons';

type AppIconProps = {
  name: string;
  color: string;
  size?: number;
  solid?: boolean;
};

export function AppIcon({ name, color, size = 24, solid = true }: AppIconProps) {
  return (
    <FontAwesome5
      name={name}
      size={size}
      color={color}
      solid={solid}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}