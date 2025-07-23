import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import React from 'react';
import { Appbar, Button, Dialog, List, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
import ScreenWrapper from './tools/ScreenWrapper';

import i18n from './i18n/i18n';

const SettingsScreen = ({ navigation }: { navigation: any }) => {
    const [keyDiaVisible, setKeyDiaVisible] = React.useState(false);
    const [key, setKey] = React.useState('');
    React.useEffect(() => {
        AsyncStorage.getItem('map_key').then((value) => {
            if(value){
                setKey(value);
            };
        });
    }, []);

    const [mapStyle, setMapStyle] = React.useState('streets-v2');
    const [mapStyleDiaVisible, setMapStyleDiaVisible] = React.useState(false);
    React.useEffect(() => {
        AsyncStorage.getItem('map_style').then((value) => {
            if(value){
                setMapStyle(value);
            };
        });
    }, []);

    const [showCopySB, setShowCopySB] = React.useState(false);

    const [importDiaVisible, setImportDiaVisible] = React.useState(false);
    const [importText, setImportText] = React.useState('');

    const router = useRouter();

    return (
        <ScreenWrapper>
            <Appbar.Header elevated={true}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content title={i18n.t("TITLE_SETTINGS")} />
            </Appbar.Header>
            
            <List.Section>

                <List.Subheader>{i18n.t("SETTINGS_MAP")}</List.Subheader>
                <List.Item
                    title={i18n.t("SETTINGS_MAP_KEY")}
                    left={(props) => (<List.Icon {...props} icon="key" />)}
                    onPress={()=>{setKeyDiaVisible(true);}} 
                />
                <List.Item
                    title={i18n.t("SETTINGS_MAP_STYLE")}
                    left={(props) => (<List.Icon {...props} icon="looks" />)}
                    description={mapStyle}
                    onPress={() => {setMapStyleDiaVisible(true);}}
                />

                <List.Subheader>{i18n.t("SETTINGS_DATA")}</List.Subheader>
                <List.Item
                    title={i18n.t("SETTINGS_DATA_CLEAR")}
                    left={(props) => (<List.Icon {...props} icon="delete-off" />)}
                    onPress={() => {
                        AsyncStorage.clear();
                        Updates.reloadAsync();
                    }}
                />
                <List.Item
                    title={i18n.t("SETTINGS_DATA_COPY")}
                    left={(props) => (<List.Icon {...props} icon="content-copy" />)}
                    onPress={() => {
                        AsyncStorage.getItem('routes').then((value) => {
                            if(value){
                                Clipboard.setStringAsync(JSON.stringify(value)).then(()=>{
                                    setShowCopySB(true);
                                });
                            };
                        });
                    }}
                />
                <List.Item
                    title={i18n.t("SETTINGS_DATA_IMPORT")}
                    left={(props) => (<List.Icon {...props} icon="content-paste" />)}
                    onPress={() => {setImportDiaVisible(true);}}
                />

                <List.Subheader>{i18n.t("SETTINGS_MAP_LICENSE")}</List.Subheader>
                {/* 很抱歉不小心挡住了右下角的按钮（虽然还点得到），就在这里补上吧 */}
                <List.Item
                    title="MapLibre React Native"
                    description="https://maplibre.org/maplibre-react-native"
                    left={(props) => (<List.Icon {...props} icon="map" />)}
                    onPress={() => {Linking.openURL('https://maplibre.org/maplibre-react-native')}}
                />
                <List.Item
                    title="MapTiler"
                    description="https://www.maptiler.com/copyright/"
                    left={(props) => (<List.Icon {...props} icon="copyright" />)}
                    onPress={() => {Linking.openURL('https://www.maptiler.com/copyright/')}}
                />
                <List.Item
                    title="OpenStreetMap contributors"
                    description="https://www.openstreetmap.org/copyright"
                    left={(props) => (<List.Icon {...props} icon="copyright" />)}
                    onPress={() => {Linking.openURL('https://www.openstreetmap.org/copyright')}}
                />

                <List.Subheader>{i18n.t("SETTINGS_MORE")}</List.Subheader>
                <List.Item
                    title={i18n.t("SETTINGS_ABOUT")}
                    left={(props) => (<List.Icon {...props} icon="information-outline" />)}
                    onPress={() => {
                        router.push({
                            pathname: '/subpages/info',
                        });
                    }}
                />
            </List.Section>

            <Portal>
                <Dialog visible={keyDiaVisible} onDismiss={() => {
                    setKeyDiaVisible(false);
                    AsyncStorage.getItem('map_key').then((value) => {
                        if(value){
                            setKey(value);
                        };
                    });
                }}>
                    <Dialog.Title>{i18n.t("SETTINGS_MAP_KEY")}</Dialog.Title>
                    <Dialog.Content>
                        <Text>{i18n.t("SETTINGS_MAP_KEY_DESC")}</Text>
                        <TextInput
                            value={key}
                            onChangeText={(text) => setKey(text)}
                            autoFocus={true}
                            style={{marginTop: 10}}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setKeyDiaVisible(false);
                            AsyncStorage.setItem('map_key', key);
                        }}>{i18n.t("DIALOG_CONFIRM")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Portal>
                <Dialog visible={mapStyleDiaVisible} onDismiss={() => {setMapStyleDiaVisible(false);}}>
                    <Dialog.Title>{i18n.t("SETTINGS_MAP_STYLE")}</Dialog.Title>
                    <Dialog.Content>
                        <Text>{i18n.t("SETTINGS_MAP_STYLE_DESC")}</Text>
                        <List.Section>
                            <List.Item
                                title={'aquarelle'}
                                onPress={() => {
                                    setMapStyle('aquarelle');
                                    setMapStyleDiaVisible(false);
                                    AsyncStorage.setItem('map_style', 'aquarelle');
                                }}
                            />
                            <List.Item
                                title={'backdrop'}
                                onPress={() => {
                                    setMapStyle('backdrop');
                                    setMapStyleDiaVisible(false);
                                    AsyncStorage.setItem('map_style', 'backdrop');
                                }}
                            />
                            <List.Item
                                title={'outdoor-v2'}
                                onPress={() => {
                                    setMapStyle('outdoor-v2');
                                    setMapStyleDiaVisible(false);
                                    AsyncStorage.setItem('map_style', 'outdoor-v2');
                                }}
                            />
                            <List.Item
                                title={'streets-v2'}
                                onPress={() => {
                                    setMapStyle('streets-v2');
                                    setMapStyleDiaVisible(false);
                                    AsyncStorage.setItem('map_style', 'streets-v2');
                                }}
                            />
                        </List.Section>
                    </Dialog.Content>
                </Dialog>
            </Portal>

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

            <Portal>
                <Dialog visible={importDiaVisible} onDismiss={() => {setImportDiaVisible(false);}}>
                    <Dialog.Title>{i18n.t("SETTINGS_DATA_IMPORT")}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            value={importText}
                            onChangeText={setImportText}
                            autoFocus={true}
                            style={{marginTop: 10}}
                            multiline={true}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setImportDiaVisible(false);
                            AsyncStorage.getItem('routes').then((oldValue)=>{
                                let importedValue = JSON.parse(importText);
                                if(oldValue){
                                    const newValue = [...importedValue,...JSON.parse(oldValue)];
                                    AsyncStorage.setItem('routes', JSON.stringify(newValue)).then(()=>{
                                        Updates.reloadAsync();
                                    });
                                } else {
                                    const newValue = importedValue;
                                    AsyncStorage.setItem('routes', JSON.stringify(newValue)).then(()=>{
                                        Updates.reloadAsync();
                                    });
                                };
                            });
                        }}>{i18n.t("DIALOG_CONFIRM")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </ScreenWrapper>
    );
};

export default SettingsScreen;