import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Share, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMood } from '../context/MoodContext';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth } from 'date-fns';
import { Flame, Share2, Award, Zap, ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { getMonthlyPixelData } from '../utils/patternAnalyzer';
import { MOOD_CONFIGS } from '../data/moods';
import MoodIcon from '../components/MoodIcon';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const StreakScreen = () => {
    const insets = useSafeAreaInsets();
    const { moods, theme, primaryColor } = useMood();
    const viewShotRef = useRef(null);
    const shareRef = useRef(null);
    const [viewDate, setViewDate] = React.useState(new Date());

    const pixelData = React.useMemo(() => {
        return getMonthlyPixelData(moods, viewDate.getMonth(), viewDate.getFullYear());
    }, [moods, viewDate]);

    const changeMonth = (offset: number) => {
        setViewDate(prev => offset > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
    };

    const monthMoods = React.useMemo(() => {
        return moods.filter(m => isSameMonth(new Date(m.timestamp), viewDate));
    }, [moods, viewDate]);

    const stats = React.useMemo(() => {
        const totalLogs = monthMoods.length;
        const level = Math.ceil(totalLogs / 5) || 1;
        const counts = monthMoods.reduce((acc, m) => {
            acc[m.level] = (acc[m.level] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const sortedMoods = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const topMoodConfigs = sortedMoods.slice(0, 3).map(m => MOOD_CONFIGS.find(c => c.level === m[0])).filter(Boolean);
        const topConfig = topMoodConfigs[0];

        const daysInMonth = eachDayOfInterval({
            start: startOfMonth(viewDate),
            end: endOfMonth(viewDate)
        });

        let maxStreak = 0;
        let currentStreak = 0;
        daysInMonth.forEach(day => {
            const hasActivity = moods.some(m => isSameDay(new Date(m.timestamp), day));
            if (hasActivity) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });

        return { totalLogs, level, maxStreak, topConfig, topMoodConfigs };
    }, [monthMoods, viewDate, moods]);

    const handleShareStreak = async () => {
        try {
            const uri = await captureRef(viewShotRef, { format: 'png', quality: 1.0 });
            if (Platform.OS === 'web') {
                const text = `🔥 I achieved a ${stats.maxStreak}-day streak in ${format(viewDate, 'MMMM')} on Feeling! 🧘‍♂️✨`;
                await Share.share({ message: text });
                return;
            }
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share Achievement Card', UTI: 'public.png' });
            }
        } catch (e) {
            Alert.alert("Share Error", "Failed to capture streak card.");
        }
    };

    return (
        <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
            <ScrollView
                contentContainerStyle={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Streak</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your daily emotional persistence.</Text>
                </View>

                {/* SMALL, MINIMAL 3D ACHIEVMENT CARD */}
                <View style={styles.cardContainer3D}>
                    <View style={{ borderRadius: 24, overflow: 'hidden' }}>
                        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
                            <View style={[styles.streakCard, { backgroundColor: primaryColor }]} ref={shareRef}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.miniBadge}>
                                        <Award size={12} color="#FFF" />
                                        <Text style={styles.miniBadgeText}>VERIFIED</Text>
                                    </View>
                                    <Text style={styles.cardMonthLabel}>{format(viewDate, 'MMM yyyy')}</Text>
                                </View>

                                <View style={styles.heroSection}>
                                    <View style={styles.streakDisplay}>
                                        <Text style={styles.streakValue}>{stats.maxStreak}</Text>
                                        <Flame size={24} color="#FFF" fill="#FFF" style={styles.flameIcon} />
                                    </View>
                                    <Text style={styles.heroLabel}>STREAK FOCUS</Text>
                                </View>

                                <View style={styles.bottomSection}>
                                    <View style={styles.moodStack}>
                                        {stats.topMoodConfigs.slice(0, 3).map((cfg, i) => (
                                            <View key={i} style={[styles.stackedIcon, { marginLeft: i === 0 ? 0 : -10, zIndex: 10 - i }]}>
                                                <MoodIcon iconName={cfg?.icon || ''} size={28} color="#FFF" customImage={cfg?.customImage} />
                                            </View>
                                        ))}
                                    </View>
                                    <View style={styles.brandBadge}>
                                        <Zap size={12} color="#FFF" fill="#FFF" />
                                        <Text style={styles.brandText}>FEELING</Text>
                                    </View>
                                </View>
                            </View>
                        </ViewShot>
                    </View>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        onPress={handleShareStreak}
                        style={[styles.actionBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                    >
                        <Share2 size={18} color={primaryColor} />
                        <Text style={[styles.actionBtnText, { color: primaryColor }]}>Share Result</Text>
                    </TouchableOpacity>
                </View>

                {/* INTERACTIVE MONTHLY PIXEL CHART */}
                <View style={styles.pixelSection}>
                    <View style={styles.sectionHeader}>
                        <Calendar size={18} color={primaryColor} />
                        <View style={styles.headerTitleRow}>
                            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Monthly Pixels</Text>
                            <View style={styles.monthControls}>
                                <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navBtn}>
                                    <ChevronLeft size={16} color={theme.textSecondary} />
                                </TouchableOpacity>
                                <Text style={[styles.monthLabel, { color: theme.text }]}>{format(viewDate, 'MMM yyyy')}</Text>
                                <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navBtn}>
                                    <ChevronRight size={16} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.pixelGrid, { backgroundColor: theme.card, borderRadius: 24 }]}>
                        {pixelData.map((day, idx) => {
                            const config = day.mood ? MOOD_CONFIGS.find(c => c.level === day.mood?.level) : null;
                            return (
                                <View key={idx} style={[styles.pixelBox, !config && { backgroundColor: theme.primary + '15' }, config && { backgroundColor: config.color + '65', borderRadius: 10 }]}>
                                    {config ? (
                                        <MoodIcon iconName={config.icon} size={22} color={config.color} customImage={config.customImage} strokeWidth={2} />
                                    ) : (
                                        <Text style={[styles.pixelDateNum, { color: theme.textSecondary + '40' }]}>{format(day.date, 'd')}</Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { backgroundColor: theme.card, borderRadius: 20 }]}>
                        <Text style={[styles.statValue, { color: theme.text }]}>{stats.totalLogs}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Logs</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: theme.card, borderRadius: 20 }]}>
                        <Text style={[styles.statValue, { color: theme.text }]}>Lv. {stats.level}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Score</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1 },
    container: { paddingHorizontal: 20 },
    header: { marginBottom: 24 },
    title: { fontSize: 32, fontWeight: '900' },
    subtitle: { fontSize: 15, fontWeight: '500' },

    // 3D EFFECT CONTAINER
    cardContainer3D: {
        marginBottom: 30,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 15,
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 4,
    },
    streakCard: {
        padding: 20,
        minHeight: 200,
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 1,
        borderBottomWidth: 4,
        borderRightWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    miniBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniBadgeText: {
        fontSize: 8,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 1.5,
        marginLeft: 4,
    },
    cardMonthLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FFF',
        textTransform: 'uppercase',
        opacity: 0.8,
        letterSpacing: 0.5,
    },

    heroSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    streakDisplay: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    streakValue: {
        fontSize: 72,
        fontWeight: '900',
        color: '#FFF',
        lineHeight: 72,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
    },
    flameIcon: {
        marginTop: 8,
        marginLeft: 4,
    },
    heroLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 6,
        marginTop: -2,
        opacity: 0.9,
    },

    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    moodStack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stackedIcon: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 6,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    brandBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    brandText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 2,
        marginLeft: 4,
    },

    actionRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 20, borderWidth: 1 },
    actionBtnText: { fontSize: 14, fontWeight: '800', marginLeft: 10 },

    pixelSection: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingLeft: 4 },
    sectionTitle: { fontSize: 12, fontWeight: '900', marginLeft: 8, textTransform: 'uppercase', letterSpacing: 1 },
    headerTitleRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 8 },
    monthControls: { flexDirection: 'row', alignItems: 'center' },
    navBtn: { padding: 4 },
    monthLabel: { fontSize: 13, fontWeight: '800', marginHorizontal: 12, textTransform: 'uppercase', letterSpacing: 1 },
    pixelGrid: { padding: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
    pixelBox: { width: (SCREEN_WIDTH - 70) / 7 - 4, height: (SCREEN_WIDTH - 70) / 7 - 4, margin: 2, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    pixelDateNum: { fontSize: 9, fontWeight: '700' },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    statBox: { flex: 1, paddingVertical: 20, marginHorizontal: 5, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)' },
    statValue: { fontSize: 22, fontWeight: '900', marginBottom: 2 },
    statLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }
});
