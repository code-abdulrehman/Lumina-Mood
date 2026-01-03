import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AlertTriangle, RefreshCcw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    children: ReactNode;
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
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        <AlertTriangle size={64} color="#EF4444" style={styles.icon} />
                        <Text style={styles.title}>Oops! Something went wrong.</Text>
                        <Text style={styles.subtitle}>
                            We encountered an unexpected error.
                        </Text>
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>
                                {this.state.error?.message || 'Unknown error occurred'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
                            <RefreshCcw size={20} color="#FFF" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 30,
        textAlign: 'center',
    },
    errorBox: {
        backgroundColor: '#FEE2E2',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    errorText: {
        color: '#B91C1C',
        fontSize: 14,
        fontFamily: 'Courier',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#4B5563',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 50,
        alignItems: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
