import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useColorScheme, View } from 'react-native';
import { Appbar, Button, Dialog, Icon, List, MD3DarkTheme, MD3LightTheme, PaperProvider, Portal, Snackbar, TextInput, TouchableRipple } from 'react-native-paper';
import ColorPicker, { HueSlider, OpacitySlider, Panel1, Preview } from 'reanimated-color-picker';
import i18n from '../i18n/i18n';
import ScreenWrapper from '../tools/ScreenWrapper';

const IconButton = ({ icon, onPress, GangnamStyle={} }: { icon: string, onPress: () => void, GangnamStyle?: object }) => {
    return (
        <TouchableRipple onPress={onPress} borderless={true} style={{padding: 7, borderRadius: 100, ...GangnamStyle}} >
            <Icon source={icon} size={21} />
        </TouchableRipple>
    );
};

const RouteEditScreen = () => {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();
    const paperTheme = React.useMemo(() => colorScheme === 'dark' ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light }, [colorScheme, theme]);

    const { index: index_param } = useLocalSearchParams();
    let index = 0;
    if (typeof index_param === 'string') {
        index = parseInt(index_param, 10);
    } else if (Array.isArray(index_param) && index_param.length > 0) {
        index = parseInt(index_param[0], 10);
    };

    type RouteType = {
        name: string;
        points: any[];
        color: string;
    };
    const router = useRouter();
    const [routes, setRoutes] = React.useState<RouteType[]>([]);
    const [route, setRoute] = React.useState<RouteType>({name: '', points: [], color: ''});
    React.useEffect(() => {
        AsyncStorage.getItem('routes').then(data => {
            if(data){
                setRoutes(JSON.parse(data));
                if(typeof index === 'number' && index >= 0){
                    let route = JSON.parse(data)[index];
                    if(route){
                        setRoute(JSON.parse(data)[index]);
                        setColor(JSON.parse(data)[index].color);
                    } else {
                        router.back();
                    };
                } else {
                    router.back();
                };
            } else {
                router.back();
            };
        });
    }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

    const [color, setColor] = React.useState<string>('#0000FF');
    const [showColorDia, setShowColorDia] = React.useState(false);
    const rgbaToHex8 = (rgba: string): string => {
        const [r, g, b, a] = rgba.match(/\d+\.?\d*/g)!.map(Number);
        const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a * 255)}`;
    };

    const [showCopySB, setShowCopySB] = React.useState(false);
    const [showRenameDia, setShowRenameDia] = React.useState(false);
    const [renaming, setRenaming] = React.useState(0);
    const [newName, setNewName] = React.useState(route.name);

    return (
        <PaperProvider theme={paperTheme}>
            <Appbar.Header elevated={true}>
                <Appbar.BackAction onPress={() => {router.back();}} />
                <Appbar.Content title={i18n.t("ROUTEEDIT_TITLE")} />
            </Appbar.Header>
            <ScreenWrapper>
                <Button mode='elevated' style={{margin: 15, marginBottom: 0}} onPress={()=>{
                    setColor(route?.color);
                    setShowColorDia(true);
                }}>
                    {i18n.t("ROUTEEDIT_COLORSELECT")}
                </Button>
                <Portal>
                    <Dialog visible={showColorDia} onDismiss={() => {setShowColorDia(false)}} style={{padding: 20, paddingTop: 0}}>
                        <Dialog.Title>{i18n.t("ROUTEEDIT_COLORSELECT")}</Dialog.Title>
                        <ColorPicker
                            value={route?.color}
                            style={{gap: 10}}
                            onCompleteJS={({rgba})=>{
                                let hex8 = rgbaToHex8(rgba);
                                setColor(hex8);
                            }}
                        >
                            <Preview />
                            <Panel1 />
                            <HueSlider />
                            <OpacitySlider />
                        </ColorPicker>
                        <Button mode='outlined' onPress={()=>{
                            setShowColorDia(false);
                            setRoute({name: route.name, points: route.points, color: color});
                            let new_routes = [...routes];
                            new_routes[index] = {name: route.name, points: route.points, color: color};
                            AsyncStorage.setItem('routes', JSON.stringify(new_routes));
                        }} style={{marginTop: 10}}>
                            {i18n.t("DIALOG_CONFIRM")}
                        </Button>
                    </Dialog>
                </Portal>
                
                {route ? (
                    <List.Section>
                        {route.points.map((point, index) => {return (
                            <List.Item
                                key={point.name}
                                title={point.name}
                                onPress={async()=>{
                                    await Clipboard.setStringAsync([point.longitude, point.latitude].join(', '));
                                    setShowCopySB(true);
                                }}
                                right={()=>(
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <IconButton icon='square-edit-outline' onPress={()=>{
                                            setRenaming(index);
                                            setNewName(point.name);
                                            setShowRenameDia(true);
                                        }} />
                                        <IconButton icon='delete' onPress={()=>{
                                            let new_points = [...route.points];
                                            new_points.splice(index, 1);
                                            setRoute({name: route.name, points: new_points, color: route.color});
                                            let new_routes = [...routes];
                                            new_routes[index] = {name: route.name, points: new_points, color: route.color};
                                            AsyncStorage.setItem('routes', JSON.stringify(new_routes));
                                        }} />
                                    </View>
                                )}
                            />
                        );})}
                    </List.Section>
                ) : null}

                <Portal>
                    <Dialog visible={showRenameDia} onDismiss={() => {setShowRenameDia(false)}}>
                        <Dialog.Title>{i18n.t("ROUTEEDIT_RENAME")}</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                value={newName}
                                onChangeText={setNewName}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>{
                                setShowRenameDia(false);
                                let new_points = [...route.points];
                                new_points[renaming] = {name: newName, longitude: new_points[renaming].longitude, latitude: new_points[renaming].latitude};
                                setRoute({name: route.name, points: new_points, color: route.color});
                                let new_routes = [...routes];
                                new_routes[index] = {name: route.name, points: new_points, color: route.color};
                                AsyncStorage.setItem('routes', JSON.stringify(new_routes));
                            }}>{i18n.t("DIALOG_CONFIRM")}</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

            </ScreenWrapper>

            <Snackbar
                visible={showCopySB}
                onDismiss={() => {setShowCopySB(false);}}
                action={{
                    label: i18n.t("GLOBAL_SB_OK"),
                    onPress: () => {setShowCopySB(false);}
                }}
            >
                {i18n.t("GLOBAL_COPIED")}
            </Snackbar>
        </PaperProvider>
    );
};

export default RouteEditScreen;