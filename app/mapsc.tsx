import { Camera, CameraRef, MapView, MapViewRef, PointAnnotation } from "@maplibre/maplibre-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, Dialog, FAB, Portal, Snackbar, Text, Tooltip } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from './i18n/i18n';

type MapTilerMapProps = {
    camRef: React.RefObject<CameraRef | null>;
    centerCoordinate?: [number, number];
};
const MapTilerMap = React.forwardRef<MapViewRef, MapTilerMapProps>(
    ({ camRef, centerCoordinate }, ref) => {
        const [apiKey, setApiKey] = React.useState('');
        React.useEffect(() => {
            const fetchApiKey = async () => {
                const key = await AsyncStorage.getItem('map_key');
                if (key) setApiKey(key);
            };
            fetchApiKey();
        }, []);

        return (
            <View style={{ flex: 1, marginBottom: 80 }}>
                <MapView
                    ref={ref}
                    style={{ flex: 1 }}
                    mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`}
                    logoEnabled={false}
                    attributionPosition={{ bottom: 8, right: 8 }}
                >
                    <Camera
                        ref={camRef}
                        zoomLevel={14}
                        centerCoordinate={centerCoordinate}
                        animationMode="flyTo"
                        animationDuration={1000}
                    />
                    {centerCoordinate && (
                        <PointAnnotation id="user-location-marker" coordinate={centerCoordinate}>
                            <View
                                style={{
                                    width: 15,
                                    height: 15,
                                    borderRadius: 7.5,
                                    backgroundColor: '#007aff',
                                    borderWidth: 2,
                                    borderColor: 'white',
                                }}
                            />
                        </PointAnnotation>
                    )}
                </MapView>
                <TenCross />
            </View>
        );
    }
);
MapTilerMap.displayName = 'MapTilerMap';

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
    React.useEffect(() => {
        AsyncStorage.getItem('map_key').then(apiKey => {
            if (!apiKey) {
                setIsKeyMissing(true);
            };
        });
    }, []);

    const cameraRef = React.useRef<CameraRef>(null);
    const [location, setLocation] = React.useState<Location.LocationObject | null>(null);
    const [isLocating, setIsLocating] = React.useState(false);
    const getUserLocation = async () => {
        if (isLocating) {
            return;
        };
        setIsLocating(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setShowLocationPmsSB(true);
            return;
        };
        console.log('Getting user location...');
        let location: Location.LocationObject | null = null;
        try {
            location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            console.log(location);
        } catch (error) {
            console.error('Highest:' + error);
            try {
                location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
            } catch (error) {
                console.error('High:' + error);
                try {
                    location = await Location.getLastKnownPositionAsync({});
                } catch (error) {
                    console.error('Last known:' + error);
                    setShowLocationPmsSB(true);
                    return;
                };
            };
        };
        if (location) {
            setLocation(location);
            setIsLocating(false);
            cameraRef.current?.setCamera({
                centerCoordinate: [location.coords.longitude, location.coords.latitude],
                zoomLevel: 32,
                animationMode: 'flyTo',
                animationDuration: 1000,
            });
        };
    };
    React.useEffect(() => {
        cameraRef.current?.setCamera({
            centerCoordinate: [116.397477, 39.908692],
            zoomLevel: 1,
            animationDuration: 0,
        });
        getUserLocation();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    //  暴   力   解   决   (别删上面那个哦，小心eslint给你报个错，看起来可不舒服了)

    const [showShotSB, setShowShotSB] = React.useState(false);
    const mapRef = React.useRef<MapViewRef>(null);
    const takeScreenshot = async () => {
        if (!mapRef.current) return;
        try {
            const uri = await mapRef.current.takeSnap(true);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                await MediaLibrary.saveToLibraryAsync(uri);
                setShowShotSB(true);
            };
        } catch (error) {
            console.error('Screenshot failed:', error);
        };
    };

    const [showLocationPmsSB, setShowLocationPmsSB] = React.useState(false);

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header elevated={true}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content title={i18n.t("TITLE_MAP")} />
            </Appbar.Header>

            {
                isKeyMissing ? (
                    <Portal>
                        <Dialog visible={isKeyMissing} onDismiss={() => {
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
                    <MapTilerMap
                        ref={mapRef}
                        camRef={cameraRef}
                        centerCoordinate={
                        location
                            ? [location.coords.longitude, location.coords.latitude]
                            : [116.397477, 39.908692]
                    } />
                )
            }

            <Appbar style={styles.bottom} elevated={true}>
                <Tooltip title={i18n.t("MAP_SELECTROUTE")}>
                    <Appbar.Action icon="map-marker-distance" onPress={() => { }} />
                </Tooltip>
                <Tooltip title={i18n.t("MAP_LOCATION")}>
                    <Appbar.Action icon={isLocating ? "crosshairs" : "crosshairs-gps"} onPress={getUserLocation} />
                </Tooltip>
                <Tooltip title={i18n.t("MAP_SCREENSHOT")}>
                    <Appbar.Action icon="cellphone-screenshot" onPress={takeScreenshot} />
                </Tooltip>
                <Tooltip title={i18n.t("MAP_SEARCH")}>
                    <Appbar.Action icon="map-search-outline" onPress={() => { }} />
                </Tooltip>
                <FAB icon='map-marker-plus-outline' style={styles.fab} onPress={() => { }} />
            </Appbar>

            <Snackbar
                visible={showLocationPmsSB}
                onDismiss={() => setShowLocationPmsSB(false)}
                action={{
                    label: i18n.t("GLOBAL_SB_OK"),
                    onPress: () => {
                        setShowLocationPmsSB(false);
                    },
                }}
            >
                {i18n.t("MAP_NO_LOCATION")}
            </Snackbar>

            <Snackbar
                visible={showShotSB}
                onDismiss={() => setShowShotSB(false)}
                action={{
                    label: i18n.t("GLOBAL_SB_OK"),
                    onPress: () => {
                        setShowShotSB(false);
                    },
                }}
            >
                {i18n.t("MAP_SCREENSHOT_DONE")}
            </Snackbar>

        </View>
    );
};

export default MapScreen;