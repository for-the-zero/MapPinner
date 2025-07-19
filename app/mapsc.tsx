import { StyleSheet, View } from 'react-native';
import { Appbar, FAB, Tooltip } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import i18n from '../assets/i18n';
const texts = i18n['zh-CN']; //TODO:

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
                <Appbar.Content title={texts.TITLE_MAP} />
            </Appbar.Header>
            <Appbar style={styles.bottom} elevated={true}>
                <Tooltip title={texts.MAP_SELECTROUTE}>
                    <Appbar.Action icon="map-marker-distance" onPress={() => { }} />
                </Tooltip>
                <Tooltip title={texts.MAP_LOCATION}>
                    <Appbar.Action icon="crosshairs-gps" onPress={() => { }} />
                </Tooltip>
                <Tooltip title={texts.MAP_SCREENSHOT}>
                    <Appbar.Action icon="cellphone-screenshot" onPress={() => { }} />
                </Tooltip>
                <Tooltip title={texts.MAP_SEARCH}>
                    <Appbar.Action icon="map-search-outline" onPress={() => { }} />
                </Tooltip>
                <FAB icon='map-marker-plus-outline' style={styles.fab} onPress={() => { }} />
            </Appbar>
        </View>
    );
};

export default MapScreen;