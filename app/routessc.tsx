import React from 'react';
import { Appbar } from 'react-native-paper';
import ScreenWrapper from './tools/ScreenWrapper';

import i18n from './i18n/i18n';

const RouteScreen = ({ navigation }: { navigation: any }) => {
    return (
        <ScreenWrapper style={{ flex: 1 }}>
            <Appbar.Header elevated={true}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content title={i18n.t("TITLE_ROUTE")} />
            </Appbar.Header>
        </ScreenWrapper>
    );
};

export default RouteScreen;