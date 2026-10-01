import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Delete, Check } from 'lucide-react-native';
import { themeTokens } from '../../theme/tokens';

interface UpayKeypadProps {
  onKeyPress: (digit: string) => void;
  onBackspace: () => void;
  onConfirm?: () => void;
  disableConfirm?: boolean;
}

export const UpayKeypad: React.FC<UpayKeypadProps> = ({
  onKeyPress,
  onBackspace,
  onConfirm,
  disableConfirm = false,
}) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <View style={styles.keypadContainer}>
      <View style={styles.gridRow}>
        {keys.slice(0, 3).map((k) => (
          <TouchableOpacity key={k} style={styles.keyButton} onPress={() => onKeyPress(k)}>
            <Text style={styles.keyText}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.gridRow}>
        {keys.slice(3, 6).map((k) => (
          <TouchableOpacity key={k} style={styles.keyButton} onPress={() => onKeyPress(k)}>
            <Text style={styles.keyText}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.gridRow}>
        {keys.slice(6, 9).map((k) => (
          <TouchableOpacity key={k} style={styles.keyButton} onPress={() => onKeyPress(k)}>
            <Text style={styles.keyText}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.gridRow}>
        {/* Backspace */}
        <TouchableOpacity style={styles.keyButton} onPress={onBackspace}>
          <Delete size={22} color={themeTokens.colors.textSecondary} />
        </TouchableOpacity>

        {/* Zero */}
        <TouchableOpacity style={styles.keyButton} onPress={() => onKeyPress('0')}>
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>

        {/* Yellow Check Button */}
        <TouchableOpacity
          style={[styles.keyButton, styles.checkButton, disableConfirm && styles.disabledCheck]}
          onPress={onConfirm}
          disabled={disableConfirm}
        >
          <Check size={26} color={themeTokens.brand.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keypadContainer: {
    backgroundColor: '#EAEFF5',
    borderTopLeftRadius: themeTokens.radius.xl,
    borderTopRightRadius: themeTokens.radius.xl,
    padding: 16,
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  keyButton: {
    flex: 1,
    height: 54,
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  keyText: {
    fontSize: 22,
    fontWeight: '700',
    color: themeTokens.colors.textPrimary,
  },
  checkButton: {
    backgroundColor: themeTokens.brand.yellow,
  },
  disabledCheck: {
    opacity: 0.4,
  },
});
