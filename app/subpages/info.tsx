import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, useColorScheme } from 'react-native';
import { Appbar, List, MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import i18n from '../i18n/i18n';
import ScreenWrapper from '../tools/ScreenWrapper';

const RouteEditScreen = () => {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();
    const paperTheme = React.useMemo(() => colorScheme === 'dark' ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light }, [colorScheme, theme]);
    const router = useRouter();

    const [showLib, setShowLib] = React.useState(false);

    return (
        <PaperProvider theme={paperTheme}>
            <ScreenWrapper>
                <Appbar.Header elevated={true}>
                    <Appbar.BackAction onPress={() => {router.back();}} />
                    <Appbar.Content title={i18n.t("SETTINGS_ABOUT")} />
                </Appbar.Header>

                <List.Section>

                    <List.Subheader>APP</List.Subheader>
                    <List.Item
                        title="MapPinner"
                        description="1.0.0"
                        left={() => (<Image source={require('../../assets/images/icon.png')} style={{ width: 100, height: 100, marginLeft: 16 }} />)}
                    />
                    <List.Item
                        title="Version"
                        description="1.0.0"
                        onPress={() => {}}
                        left={(props) => (<List.Icon {...props} icon="update" />)}
                    />

                    <List.Subheader>{i18n.t('INFO_CODE')}</List.Subheader>
                    <List.Item
                        title="GitHub"
                        description="https://github.com/for-the-zero/MapPinner"
                        onPress={() => {Linking.openURL('https://github.com/for-the-zero/MapPinner');}}
                        left={(props) => (<List.Icon {...props} icon="github" />)}
                    />
                    <List.Item
                        title="Issues"
                        description="Github Issues"
                        onPress={() => {Linking.openURL('https://github.com/for-the-zero/MapPinner/issues');}}
                        left={(props) => (<List.Icon {...props} icon="bug-outline" />)}
                    />
                    <List.Item
                        title="Releases" 
                        description="Github Releases"
                        onPress={() => {Linking.openURL('https://github.com/for-the-zero/MapPinner/releases');}}
                        left={(props) => (<List.Icon {...props} icon="download" />)}
                    />
                    <List.Item
                        title="Open Source License"
                        description="MIT"
                        onPress={() => {Linking.openURL('https://github.com/for-the-zero/MapPinner/blob/master/LICENSE');}}
                        left={(props) => (<List.Icon {...props} icon="open-source-initiative" />)}
                    />
                    <List.Item
                        title="Author"
                        description="for_the_zero"
                        onPress={() => {}}
                        left={(props) => (<List.Icon {...props} icon="account" />)}
                    />
                    <List.Item
                        title="Copyright"
                        description="2025 for_the_zero"
                        onPress={() => {}}
                        left={(props) => (<List.Icon {...props} icon="copyright" />)}
                    />
                    
                    <List.Accordion
                        title={i18n.t('INFO_LIBS')}
                        left={(props) => (<List.Icon {...props} icon="code-array" />)}
                        expanded={showLib}
                        onPress={() => setShowLib(!showLib)}
                    >
                        <List.Item title="maplibre-react-native" onPress={() => {}} />
                        <List.Item title="expo-material3-theme" onPress={() => {}} />
                        <List.Item title="async-storage" onPress={() => {}} />
                        <List.Item title="react-navigation" onPress={() => {}} />
                        <List.Item title="expo" onPress={() => {}} />
                        <List.Item title="expo-clipboard" onPress={() => {}} />
                        <List.Item title="expo-linking" onPress={() => {}} />
                        <List.Item title="expo-localization" onPress={() => {}} />
                        <List.Item title="expo-location" onPress={() => {}} />
                        <List.Item title="expo-media-library" onPress={() => {}} />
                        <List.Item title="expo-router" onPress={() => {}} />
                        <List.Item title="expo-splash-screen" onPress={() => {}} />
                        <List.Item title="i18n-js" onPress={() => {}} />
                        <List.Item title="react" onPress={() => {}} />
                        <List.Item title="react-native" onPress={() => {}} />
                        <List.Item title="react-native-paper" onPress={() => {}} />
                        <List.Item title="react-native-safe-area-context" onPress={() => {}} />
                        <List.Item title="reanimated-color-picker" onPress={() => {}} />
                    </List.Accordion>
                </List.Section>
            </ScreenWrapper>
        </PaperProvider>
    );
};

export default RouteEditScreen;