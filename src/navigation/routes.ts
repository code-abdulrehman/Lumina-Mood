import { Activity, History, Flame, Smile, Bolt } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { StreakScreen } from '../screens/StreakScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type RouteConfig = {
    name: string;
    path: string;
    component: React.ComponentType<any>;
    icon: React.ComponentType<any>;
    label: string;
};

export const APP_ROUTES: RouteConfig[] = [
    {
        name: 'Insights',
        path: 'insights',
        component: InsightsScreen,
        icon: Activity,
        label: 'Insights',
    },
    {
        name: 'Streak',
        path: 'streak',
        component: StreakScreen,
        icon: Flame,
        label: 'Streak',
    },
    {
        name: 'Mood',
        path: 'mood',
        component: HomeScreen,
        icon: Smile,
        label: 'Mood',
    },
    {
        name: 'History',
        path: 'history',
        component: HistoryScreen,
        icon: History,
        label: 'History',
    },
    {
        name: 'Settings',
        path: 'settings',
        component: SettingsScreen,
        icon: Bolt,
        label: 'Settings',
    },
];

