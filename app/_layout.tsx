import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { Stack } from 'expo-router';
import React from 'react';
import { View, useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export default function DetailLayout() {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();
    const paperTheme = React.useMemo(() => colorScheme === 'dark' ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light }, [colorScheme, theme]);
    return (
        <View style={{ flex: 1, backgroundColor: paperTheme.colors.background }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </View>
    );
};