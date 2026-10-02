// Global React Error Boundary Component
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI Exception caught by ErrorBoundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <AlertTriangle size={48} color={themeTokens.colors.danger} />
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              An unexpected application error occurred. Don't worry, your wallet funds and transactions are safe.
            </Text>

            {this.state.error?.message ? (
              <Text style={styles.errorText}>{this.state.error.message}</Text>
            ) : null}

            <TouchableOpacity style={styles.retryBtn} onPress={this.handleRetry}>
              <RefreshCw size={16} color={themeTokens.brand.primaryDark} />
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeTokens.colors.creamBg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: themeTokens.colors.surface,
    padding: 24,
    borderRadius: themeTokens.radius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: themeTokens.colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: themeTokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  errorText: {
    fontSize: 11,
    color: themeTokens.colors.danger,
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: themeTokens.radius.sm,
    width: '100%',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: themeTokens.brand.yellow,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: themeTokens.radius.lg,
    marginTop: 8,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: themeTokens.brand.primaryDark,
  },
});
