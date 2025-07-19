import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import 'react-native-gesture-handler';
import {
    Drawer,
    MD3DarkTheme, MD3LightTheme, PaperProvider,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import i18n from '../assets/i18n';
import MapScreen from './mapsc';
import RoutesScreen from './routessc';
import SettingsScreen from './setsc';
const texts = i18n['zh-CN']; //TODO:

const DrawerNav = createDrawerNavigator();

export default function App() {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();
    const paperTheme = React.useMemo(
        () =>
            colorScheme === 'dark' ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light },
        [colorScheme, theme]
    );
    const insets = useSafeAreaInsets();
    const styles = StyleSheet.create({
        drawer: {
            paddingTop: insets.top,
        }
    });
    return (
        <PaperProvider theme={paperTheme}>
            <DrawerNav.Navigator
                drawerContent={({ navigation, state }) => {
                    const currentRoute = state.routes[state.index].name;
                    return(
                        <Drawer.Section title={texts.WELCOME} style={styles.drawer}>
                            <Drawer.Item
                                label={texts.TITLE_MAP}
                                icon='map'
                                active={currentRoute === 'Map'}
                                onPress={() => {
                                    navigation.navigate('Map');
                                }}
                            />
                            <Drawer.Item
                                label={texts.TITLE_ROUTE}
                                icon='map-marker-distance'
                                active={currentRoute === 'Routes'}
                                onPress={() => {
                                    navigation.navigate('Routes');
                                }}
                            />
                            <Drawer.Item
                                label={texts.TITLE_SETTINGS}
                                icon='cog-outline'
                                active={currentRoute === 'Settings'}
                                onPress={() => {
                                    navigation.navigate('Settings');
                                }}
                            />
                        </Drawer.Section>
                    )
                }}
                screenOptions={{ headerShown: false }}
            >
                <DrawerNav.Screen name="Map" component={MapScreen} />
                <DrawerNav.Screen name="Routes" component={RoutesScreen} />
                <DrawerNav.Screen name="Settings" component={SettingsScreen} />
            </DrawerNav.Navigator>
        </PaperProvider>
    );
};