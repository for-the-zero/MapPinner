import React from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';

import i18n from '../assets/i18n';
const texts = i18n['zh-CN']; //TODO:

const RouteScreen = ({ navigation }: { navigation: any }) => {
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header elevated={true}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content title={texts.TITLE_ROUTE} />
            </Appbar.Header>
        </View>
    );
};

export default RouteScreen;