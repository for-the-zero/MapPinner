import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useMemo } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import 'react-native-gesture-handler';
import {
    Appbar,
    Drawer,
    FAB,
    MD3DarkTheme, MD3LightTheme, PaperProvider,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MapScreen = ({ navigation }: { navigation: any }) => {
    const insets = useSafeAreaInsets();
    const styles = StyleSheet.create({
        bottom: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 80,
            paddingBottom: insets.bottom,
        },
        fab: {
            position: 'absolute',
            right: 16,
            bottom: insets.bottom + 40,
        },
    });

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header elevated={true}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content title="Map" />
            </Appbar.Header>
            <Appbar style={styles.bottom} elevated={true}>
                <Appbar.Action icon="map-marker-distance" onPress={() => { }} />
                <Appbar.Action icon="crosshairs-gps" onPress={() => { }} />
                <Appbar.Action icon="cellphone-screenshot" onPress={() => { }} />
                <Appbar.Action icon="map-search-outline" onPress={() => { }} />
                <FAB icon='map-marker-plus-outline' style={styles.fab} onPress={() => { }} />
            </Appbar>
        </View>
    );
};

const DrawerNav = createDrawerNavigator();

export default function App() {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();
    const paperTheme = useMemo(
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
                drawerContent={() => (
                    <Drawer.Section title="Welcome to MapPinner" style={styles.drawer}>
                        <Drawer.Item
                            label="Map"
                            active={true}
                            onPress={() => { }}
                        />
                        <Drawer.Item
                            label="Routes"
                            onPress={() => { }}
                        />
                        <Drawer.Item
                            label="Settings"
                            onPress={() => { }}
                        />
                    </Drawer.Section>
                )}
                screenOptions={{ headerShown: false }}
            >
                <DrawerNav.Screen name="Home" component={MapScreen} />
            </DrawerNav.Navigator>
        </PaperProvider>
    );
};