import { MapView, MapViewRef } from "@maplibre/maplibre-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, Dialog, FAB, Portal, Text, Tooltip } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from './i18n/i18n';

const MapTilerMap = () => {
    const [apiKey, setApiKey] = React.useState('');
    const mapViewRef = React.useRef<MapViewRef>(null);

    React.useEffect(() => {
        const fetchApiKey = async () => {
            const key = await AsyncStorage.getItem('map_key');
            if(key){setApiKey(key)};
        };
        fetchApiKey();
    }, []);

    return (
        <MapView
            ref={mapViewRef}
            style={{ flex: 1 }}
            mapStyle={`https://api.maptiler.com/maps/019827ec-6d2f-77fc-9dce-19cb99a5851e/style.json?key=${apiKey}`}
            logoEnabled={false}
            attributionPosition={{ bottom: 8, right: 8 }}
        >
            
        </MapView>
    );
};

const TenCross = () => {
    return (
        <View style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 40,
            height: 40,
            transform: [{ translateX: -20 }, { translateY: -20 }],
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View style={{
                position: 'absolute',
                width: 40,
                height: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }} />
            <View style={{
                position: 'absolute',
                width: 2,
                height: 40,
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }} />
        </View>
    )
};

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

    const [isKeyMissing, setIsKeyMissing] = React.useState(false);
    React.useEffect(()=>{
        AsyncStorage.getItem('map_key').then(apiKey => {
            if(!apiKey) {
                setIsKeyMissing(true);
            };
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header elevated={true}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content title={i18n.t("TITLE_MAP")} />
            </Appbar.Header>
            
            {
                isKeyMissing ? (
                    <Portal>
                        <Dialog visible={isKeyMissing} onDismiss={()=>{
                            setIsKeyMissing(false);
                            navigation.navigate('Settings');
                        }}>
                            <Dialog.Title>{i18n.t("MAP_MISSING_API_KEY")}</Dialog.Title>
                            <Dialog.Content>
                                <Text variant="bodyMedium">{i18n.t("MAP_MISSING_API_KEY_DESC")}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => {
                                    setIsKeyMissing(false);
                                    navigation.navigate('Settings');
                                }}>{i18n.t("DIALOG_CONFIRM")}</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                ) : (
                    <MapTilerMap />
                )
            }

            <TenCross />

            <Appbar style={styles.bottom} elevated={true}>
                <Tooltip title={i18n.t("MAP_SELECTROUTE")}>
                    <Appbar.Action icon="map-marker-distance" onPress={() => { }} />
                </Tooltip>
                <Tooltip title={i18n.t("MAP_LOCATION")}>
                    <Appbar.Action icon="crosshairs-gps" onPress={() => {
                        // TODO:
                    }} />
                </Tooltip>
                <Tooltip title={i18n.t("MAP_SCREENSHOT")}>
                    <Appbar.Action icon="cellphone-screenshot" onPress={() => { }} />
                </Tooltip>
                <Tooltip title={i18n.t("MAP_SEARCH")}>
                    <Appbar.Action icon="map-search-outline" onPress={() => { }} />
                </Tooltip>
                <FAB icon='map-marker-plus-outline' style={styles.fab} onPress={() => { }} />
            </Appbar>
        </View>
    );
};

export default MapScreen;