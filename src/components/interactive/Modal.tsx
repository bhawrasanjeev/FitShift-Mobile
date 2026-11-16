import React, { ReactNode } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Icon } from '../common/Icon';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  description,
  subtitle,
  children,
  footer,
  style,
}) => {
  const displayDescription = description || subtitle;
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View
            style={[styles.dialogContainer, style]}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            {title ? (
              <View style={styles.headerRow}>
                <View style={styles.titleWrapper}>
                  <Text style={styles.title}>{title}</Text>
                  {displayDescription ? (
                    <Text style={styles.description}>{displayDescription}</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <Icon name="x" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Body */}
            <View style={styles.body}>{children}</View>

            {/* Footer */}
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  keyboardAvoid: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  dialogContainer: {
    width: '100%',
    maxHeight: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleWrapper: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  description: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: typography.lineHeights.xs,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: typography.weights.bold,
  },
  body: {
    marginVertical: spacing.xs,
  },
  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
});

export default Modal;
