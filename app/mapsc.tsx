import { Camera, CameraRef, MapView, MapViewRef, PointAnnotation } from "@maplibre/maplibre-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Dialog, FAB, Icon, List, Portal, Searchbar, SegmentedButtons, Snackbar, Text, TextInput, Tooltip } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from './i18n/i18n';

type MapTilerMapProps = {
    camRef: React.RefObject<CameraRef | null>;
    userLocation?: [number, number] | null;
};
const MapTilerMap = React.forwardRef<MapViewRef, MapTilerMapProps>(
    ({ camRef, userLocation }, ref) => {
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
                    compassEnabled={true}
                    attributionPosition={{ bottom: 8, right: 8 }}
                >
                    <Camera
                        ref={camRef}
                        zoomLevel={14}
                        animationMode="flyTo"
                        animationDuration={1000}
                    />
                    {userLocation && (
                        <PointAnnotation id="user-location-marker" coordinate={userLocation}>
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
            //right: 35,
            right: 16,
            bottom: insets.bottom + 40,
        },
    });

    type RouteType = {
        name: string;
        points: any[];
        color: string;
    };
    const [isKeyMissing, setIsKeyMissing] = React.useState(false);
    const [apiKey, setApiKey] = React.useState('');
    const [routes, setRoutes] = React.useState<RouteType[]>([]);
    React.useEffect(() => {
        AsyncStorage.getItem('map_key').then(apiKey => {
            if (!apiKey) {
                setIsKeyMissing(true);
            } else {
                setApiKey(apiKey);
            };
        });
    }, []);
    const reflashRoutes = () => {
        AsyncStorage.getItem('routes').then((routesStr) => {
            if (routesStr && (typeof routesStr === 'string' && routesStr.length > 4)) {
                if(routesStr !== JSON.parse(routesStr)){
                    setRoutes(JSON.parse(routesStr));
                };
            } else {
                console.log('No routes found, creating default route');
                let defaultRoutes = [{ name: 'Default Route', points: [], color: '#0000FF' }];
                setRoutes(defaultRoutes);
                AsyncStorage.setItem('routes', JSON.stringify(defaultRoutes));
            };
        });
    };
    React.useEffect(() => {reflashRoutes();}, []);

    const cameraRef = React.useRef<CameraRef>(null);
    const [isLocating, setIsLocating] = React.useState(false);
    const [showLocationPmsSB, setShowLocationPmsSB] = React.useState(false);
    const [userLocationCoords, setUserLocationCoords] = React.useState<[number, number] | null>(null);
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
            const coords: [number, number] = [
                location.coords.longitude, 
                location.coords.latitude
            ];
            setUserLocationCoords(coords);
            setIsLocating(false);
            cameraRef.current?.setCamera({
                centerCoordinate: coords,
                zoomLevel: 15,
                animationMode: 'flyTo',
                animationDuration: 1000,
            });
        };
    };
    React.useEffect(() => {getUserLocation();}, []); // eslint-disable-line react-hooks/exhaustive-deps
    React.useEffect(() => {
        setTimeout(()=>{
            cameraRef.current?.setCamera({
                centerCoordinate: [116.397477, 39.908692],
                zoomLevel: 1,
                animationDuration: 0,
            });
        }, 100);
    }, []);

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

    const [showSearchDia, setShowSearchDia] = React.useState(false);
    const [searchMethod, setSearchMethod] = React.useState('name');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [searchResults, setSearchResults] = React.useState<any[]>([]);
    const [searchLatitude, setSearchLatitude] = React.useState('0');
    const [searchLongitude, setSearchLongitude] = React.useState('0');
    const searchPlaces = async (query: string) => {
        if(!query){return;};
        setSearchLoading(true);
        const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${apiKey}&limit=10`;
        try{
            let response = await fetch(url);
            let data = await response.json();
            if(data.features.length === 0){
                setSearchResults([]);
                setSearchLoading(false);
                return;
            };
            let results = data.features.map((feature: any) => ({
                full_name: feature.place_name,
                name: feature.text,
                coordinates: feature.center,
                relevance: feature.relevance,
            }));
            results.sort((a: any, b: any) => b.relevance - a.relevance);
            setSearchResults(results);
        }catch(error){console.error(error);};
        setSearchLoading(false);
    };
    const goToPosition = (longitude: number, latitude: number) => {
        const position = [longitude, latitude];
        try{
            cameraRef.current?.setCamera({
                centerCoordinate: position,
                animationMode: 'flyTo',
                animationDuration: 1000,
            });
        }catch(error){
            console.error(error);
        };
    };
    const [showSelectRouteDia, setShowSelectRouteDia] = React.useState(false);
    const [selectedRoute, setSelectedRoute] = React.useState(0); //TODO: display routes
    const [isSelectRouteAll, setIsSelectRouteAll] = React.useState(false);
    const add2Route = async() => {
        if(selectedRoute === -1){return;};
        const centerCoordinate = await mapRef.current?.getCenter();
        if(!centerCoordinate){return;};
        let new_routes = [...routes];
        new_routes[selectedRoute].points.push({
            latitude: centerCoordinate[1],
            longitude: centerCoordinate[0],
            name: await get_place_name([centerCoordinate[0], centerCoordinate[1]])
        });
        setRoutes(new_routes);
        AsyncStorage.setItem('routes', JSON.stringify(new_routes));
        cameraRef.current?.setCamera({
            centerCoordinate: [centerCoordinate[0], centerCoordinate[1]],
        });
    };
    const get_place_name = async(coordinates: [number, number]) => {
        const url = `https://api.maptiler.com/geocoding/${coordinates[0]},${coordinates[1]}.json?key=${apiKey}`;
        try{
            let response = await fetch(url);
            let data = await response.json();
            if(data.features.length !== 0){
                return data.features[0].text;
            } else {
                return 'Unknown';
            };
        }catch(error){
            console.error(error);
            return 'Unknown';
        };
    };

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
                        userLocation={userLocationCoords}
                    />
                )
            }

            <Appbar style={styles.bottom} elevated={true}>
                <Tooltip title={i18n.t("MAP_SELECTROUTE")}>
                    <Appbar.Action icon="map-marker-distance" onPress={() => {setShowSelectRouteDia(true)}} />
                </Tooltip>
                <Tooltip title={i18n.t("MAP_LOCATION")}>
                    <Appbar.Action icon={isLocating ? "crosshairs" : "crosshairs-gps"} onPress={getUserLocation} disabled={isLocating} />
                </Tooltip>
                <Tooltip title={i18n.t("MAP_SCREENSHOT")}>
                    <Appbar.Action icon="cellphone-screenshot" onPress={takeScreenshot} />
                </Tooltip>
                <Tooltip title={i18n.t("MAP_SEARCH")}>
                    <Appbar.Action icon="map-search-outline" onPress={() => {setShowSearchDia(true)}} />
                </Tooltip>
                <FAB icon='map-marker-plus-outline' style={styles.fab} disabled={isSelectRouteAll} onPress={add2Route} />
            </Appbar>

            {
                showSearchDia ? (
                    <Portal>
                        <Dialog visible={showSearchDia} onDismiss={() => setShowSearchDia(false)}>
                            <Dialog.Title>{i18n.t("MAP_SEARCH_TITLE")}</Dialog.Title>
                            <Dialog.ScrollArea>
                                <ScrollView>
                                <SegmentedButtons
                                    value={searchMethod}
                                    onValueChange={setSearchMethod}
                                    buttons={[
                                        {
                                            value: 'name',
                                            label: i18n.t("MAP_SEARCH_METHOD_NAME"),
                                        },
                                        {
                                            value: 'position',
                                            label: i18n.t("MAP_SEARCH_METHOD_POSITION"),
                                        },
                                    ]}
                                />
                                {
                                    searchMethod === 'name' ? (
                                        <View>
                                            <Searchbar
                                                placeholder="Search"
                                                onChangeText={(val) => {
                                                    setSearchQuery(val);
                                                    searchPlaces(val);
                                                }}
                                                value={searchQuery}
                                                onClearIconPress={() => {setSearchQuery('');}}
                                                loading={searchLoading}
                                            />
                                            {(searchResults.length > 0) ? (
                                                <List.Section>
                                                    {searchResults.map((result: any) => {return(
                                                        <List.Item
                                                            key={result.full_name}
                                                            title={result.name}
                                                            description={result.full_name}
                                                            onPress={() => {
                                                                setShowSearchDia(false);
                                                                goToPosition(result.coordinates[0], result.coordinates[1]);
                                                            }}
                                                        />
                                                    );})}
                                                </List.Section>
                                            ) : null}
                                        </View>
                                    ) : (
                                        <View>
                                            <View style={{
                                                flexDirection: 'row',
                                                gap: 10,
                                                margin: 10,
                                            }}>
                                                <TextInput
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                    label={i18n.t("MAP_SEARCH_POSITION_LONGITUDE")}
                                                    value={searchLongitude.toString()}
                                                    keyboardType="phone-pad"
                                                    onChangeText={(text) => {
                                                        if(!text){setSearchLongitude('0');return;};
                                                        if(!/^[0-9.-]*$/.test(text)){setSearchLongitude('0');return;};
                                                        if(text !== '0' && text.startsWith('0') && !text.startsWith('0.')){text = text.slice(1);};
                                                        if(parseFloat(text) < -180){setSearchLongitude('-180');};
                                                        if(parseFloat(text) > 180){setSearchLongitude('180');};
                                                        if(text.split('.').length > 2){
                                                            setSearchLongitude(text.split('.')[0]+'.'+text.split('.')[1]);
                                                            return;
                                                        };
                                                        setSearchLongitude(text);
                                                    }}
                                                />
                                                <TextInput
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                    label={i18n.t("MAP_SEARCH_POSITION_LATITUDE")}
                                                    value={searchLatitude.toString()}
                                                    keyboardType="phone-pad"
                                                    onChangeText={(text) => {
                                                        if(!text){setSearchLatitude('0');return;};
                                                        if(!/^[0-9.-]*$/.test(text)){setSearchLatitude('0');return;};
                                                        if(text !== '0' && text.startsWith('0') && !text.startsWith('0.')){text = text.slice(1);};
                                                        if(parseFloat(text) < -90){setSearchLatitude('-90');};
                                                        if(parseFloat(text) > 90){setSearchLatitude('90');};
                                                        if(text.split('.').length > 2){
                                                            setSearchLatitude(text.split('.')[0]+'.'+text.split('.')[1]);
                                                            return;
                                                        };
                                                        setSearchLatitude(text);
                                                    }}
                                                />
                                            </View>
                                            <Button onPress={() => {
                                                setShowSearchDia(false);
                                                goToPosition(parseFloat(searchLongitude), parseFloat(searchLatitude));
                                            }}>{i18n.t("MAP_SEARCH_POSITION_GO")}</Button>
                                        </View>
                                    )
                                }
                                </ScrollView>
                            </Dialog.ScrollArea>
                        </Dialog>
                    </Portal>
                ) : null
            }

            {showSelectRouteDia ? (
                <Portal>
                    <Dialog visible={showSelectRouteDia} onDismiss={() => setShowSelectRouteDia(false)}>
                        <Dialog.Title>{i18n.t("MAP_SELECTROUTE_TITLE")}</Dialog.Title>
                        <Dialog.ScrollArea>
                            <ScrollView>
                                <Button
                                    mode="elevated"
                                    onPress={reflashRoutes}
                                    style={{margin: 10, marginBottom: 0}}
                                >
                                    {i18n.t("MAP_SELECTROUTE_REFLASH")}
                                </Button>
                                <List.Section>
                                    <List.Item
                                        key='all'
                                        title={i18n.t("MAP_SELECTROUTE_ALL")}
                                        onPress={() => {
                                            setIsSelectRouteAll(true);
                                            setSelectedRoute(-1);
                                            setTimeout(() => {
                                                setShowSelectRouteDia(false);
                                            }, 500);
                                        }}
                                        right={()=>(isSelectRouteAll ? (
                                            <Icon source='check' size={20} />
                                        ) : null)}
                                    />
                                    {routes.map((route, index) => {
                                        return (
                                            <List.Item
                                                key={index}
                                                title={route.name}
                                                onPress={() => {
                                                    setIsSelectRouteAll(false);
                                                    setSelectedRoute(index);
                                                    setTimeout(() => {
                                                        setShowSelectRouteDia(false);
                                                    }, 500);
                                                }}
                                                right={()=>(selectedRoute === index ? (
                                                    <Icon source='check' size={20}/>
                                                ) : null)}
                                            />
                                        );
                                    })}
                                </List.Section>
                            </ScrollView>
                        </Dialog.ScrollArea>
                    </Dialog>
                </Portal>
            ) : null}

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