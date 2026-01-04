import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMood } from '../context/MoodContext';
import { MeshBackground } from '../components/MeshBackground';
import { ChevronRight, Sparkles, Key, ExternalLink, AlertCircle, X, PlayCircle } from 'lucide-react-native';
import { validateApiKey } from '../utils/GeminiService';
import { Alert, Linking, ActivityIndicator, Keyboard } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { BlurView } from 'expo-blur';
import { INTEREST_OPTIONS } from '../data/interests';

const { width } = Dimensions.get('window');

export const OnboardingScreen = () => {
    const insets = useSafeAreaInsets();
    const { completeOnboarding, theme } = useMood();

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [apiKey, setApiKey] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggleInterest = (id: string) => {
        if (selectedInterests.includes(id)) {
            setSelectedInterests(selectedInterests.filter(i => i !== id));
        } else if (selectedInterests.length < 5) {
            setSelectedInterests([...selectedInterests, id]);
        }
    };

    const handleNext = async () => {
        Keyboard.dismiss();
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            if (name.trim()) setStep(3);
        } else if (step === 3) {
            if (selectedInterests.length > 0) setStep(4);
        } else if (step === 4) {
            if (!apiKey.trim()) {
                setError("Please enter an API key.");
                return;
            }

            setIsValidating(true);
            setError(null);

            try {
                const result = await validateApiKey(apiKey);
                if (result.valid) {
                    await completeOnboarding(name, selectedInterests, apiKey);
                } else {
                    setError(result.error || "Invalid API Key. Please check and try again.");
                }
            } catch (err) {
                setError("An error occurred during validation. Please try again.");
            } finally {
                setIsValidating(false);
            }
        }
    };

    const handlePaste = async () => {
        const text = await Clipboard.getStringAsync();
        if (text) {
            setApiKey(text);
            setError(null);
        }
    };

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/branding_logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Welcome to Lumina Mood</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                A private space to track your moods and understand your emotions with AI companionship.
            </Text>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary, borderRadius: theme.radiusLarge }]}
                onPress={handleNext}
            >
                <Text style={styles.buttonText}>Get Started</Text>
                <ChevronRight color="#fff" size={20} />
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={styles.stepContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <View style={styles.iconCircle}>
                <Sparkles color={theme.primary} size={32} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>What should we call you?</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Setting up your profile helps me personalize your experience.
            </Text>

            <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.card, borderRadius: theme.radius }]}>
                <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.textSecondary}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={handleNext}
                />
                {name.length > 0 && (
                    <TouchableOpacity onPress={() => setName('')} style={styles.clearBtn}>
                        <X size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: name.trim() ? theme.primary : '#E5E7EB', borderRadius: theme.radiusLarge }
                ]}
                onPress={handleNext}
                disabled={!name.trim()}
            >
                <Text style={styles.buttonText}>Continue</Text>
                <ChevronRight color="#fff" size={20} />
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
                <Sparkles color={theme.primary} size={32} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Pick your interests</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Choose up to 5 things you love. This helps me verify what resonates with you.
            </Text>

            <View style={styles.interestsContainer}>
                {INTEREST_OPTIONS.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    const Icon = item.icon;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => handleToggleInterest(item.id)}
                            activeOpacity={0.7}
                            style={[
                                styles.interestBadge,
                                styles.boxShadow,
                                {
                                    backgroundColor: isSelected ? theme.primary : theme.card,
                                    borderColor: isSelected ? theme.primary : theme.border,
                                    shadowColor: isSelected ? theme.primary : '#000',
                                    shadowOpacity: isSelected ? 0.3 : 0.05,
                                    shadowRadius: isSelected ? 2 : 1,
                                    elevation: isSelected ? 2 : 1,
                                }
                            ]}
                        >
                            <Icon
                                color={isSelected ? '#fff' : item.color}
                                size={18}
                                style={{ marginRight: 6 }}
                            />
                            <Text
                                style={[
                                    styles.interestLabel,
                                    {
                                        color: isSelected ? '#fff' : theme.text,
                                        fontWeight: isSelected ? '700' : '600'
                                    }
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.footer}>
                <Text style={[styles.selectionCount, { color: theme.textSecondary }]}>
                    {selectedInterests.length}/5 selected
                </Text>
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: selectedInterests.length > 0 ? theme.primary : '#E5E7EB', borderRadius: theme.radiusLarge }
                    ]}
                    onPress={handleNext}
                    disabled={selectedInterests.length === 0}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                    <ChevronRight color="#fff" size={20} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep4 = () => (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={styles.stepContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <View style={[styles.iconCircle, { backgroundColor: `${theme.primary}15` }]}>
                <Key color={theme.primary} size={32} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Google Gemini API Key</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                To enable AI emotional support, please provide your free Gemini API key.
            </Text>

            <View style={[
                styles.inputWrapper,
                {
                    borderColor: error ? '#EF4444' : theme.border,
                    backgroundColor: theme.card,
                    borderRadius: theme.radius,
                    marginBottom: 10
                }
            ]}>
                <Key size={18} color={theme.textSecondary} style={{ marginRight: 12 }} />
                <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Paste API Key here..."
                    placeholderTextColor={theme.textSecondary}
                    value={apiKey}
                    onChangeText={(val) => {
                        setApiKey(val);
                        if (error) setError(null);
                    }}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleNext}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {apiKey.length > 0 && (
                        <TouchableOpacity onPress={() => setApiKey('')} style={styles.clearBtn}>
                            <X size={18} color={theme.textSecondary} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={handlePaste} style={styles.pasteBtn}>
                        <Sparkles size={14} color={theme.primary} />
                        <Text style={[styles.pasteBtnText, { color: theme.primary }]}>Paste</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <AlertCircle size={14} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <TouchableOpacity
                style={[styles.linkButton, { marginBottom: 10 }]}
                onPress={() => Linking.openURL('https://aistudio.google.com/app/apikey')}
            >
                <Text style={[styles.linkText, { color: theme.primary }]}>Get a free key here</Text>
                <ExternalLink size={14} color={theme.primary} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => Linking.openURL('https://www.youtube.com/shorts/7_HFmLrfZHg')}
            >
                <Text style={[styles.linkText, { color: theme.primary }]}>Watch Tutorial Video</Text>
                <PlayCircle size={14} color={theme.primary} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: apiKey.trim() && !isValidating ? theme.primary : '#E5E7EB',
                        borderRadius: theme.radiusLarge,
                        marginTop: 20
                    }
                ]}
                onPress={handleNext}
                disabled={!apiKey.trim() || isValidating}
            >
                {isValidating ? (
                    <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
                ) : (
                    <Text style={styles.buttonText}>Finish Setup</Text>
                )}
                {!isValidating && <ChevronRight color="#fff" size={20} />}
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );

    return (
        <MeshBackground>
            <View style={[styles.container, { backgroundColor: 'transparent', paddingTop: insets.top }]}>
                <View style={styles.progressContainer}>
                    {[1, 2, 3, 4].map((s) => (
                        <View
                            key={s}
                            style={[
                                styles.progressBar,
                                {
                                    backgroundColor: s <= step ? theme.primary : theme.border,
                                    flex: 1,
                                    height: 4,
                                    marginHorizontal: 2,
                                    borderRadius: 2
                                }
                            ]}
                        />
                    ))}
                </View>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </ScrollView>
            </View>
        </MeshBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    progressContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginTop: 16,
    },
    progressBar: {
        flex: 1,
        height: 4,
        marginHorizontal: 2,
        borderRadius: 2,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    stepContainer: {
        alignItems: 'center',
    },
    logoContainer: {
        width: 120,
        height: 120,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f0ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    inputWrapper: {
        width: '100%',
        borderWidth: 2,
        paddingHorizontal: 20,
        marginBottom: 32,
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearBtn: {
        padding: 10,
        marginRight: -10,
    },
    pasteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        marginLeft: 8,
    },
    pasteBtnText: {
        fontSize: 11,
        fontWeight: '800',
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    input: {
        flex: 1,
        height: 60,
        fontSize: 14,
        fontWeight: '600',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    linkText: {
        fontSize: 14,
        fontWeight: '700',
        marginRight: 6,
    },
    button: {
        flexDirection: 'row',
        height: 64,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 8,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 3,
        width: '100%',
        paddingHorizontal: 10,
    },

    footer: {
        width: '100%',
        marginTop: 40,
        alignItems: 'center',
    },
    selectionCount: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 16,
    },
    interestBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 30,
        elevation: 2,
    },
    interestLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    boxShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 1,
        elevation: 1,
    },
});
