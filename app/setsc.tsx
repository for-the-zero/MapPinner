import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Appbar, Button, Dialog, List, Portal, Text, TextInput } from 'react-native-paper';
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

    return (
        <ScreenWrapper>
            <Appbar.Header elevated={true}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content title={i18n.t("TITLE_SETTINGS")} />
            </Appbar.Header>
            
            <List.Section>
                <List.Subheader>{i18n.t("SETTINGS_MAP")}</List.Subheader>
                <List.Item title={i18n.t("SETTINGS_MAP_KEY")} left={(props) => <List.Icon {...props} icon="key" />} onPress={()=>{
                    setKeyDiaVisible(true);
                }} />
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

        </ScreenWrapper>
    );
};

export default SettingsScreen;