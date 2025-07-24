import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Appbar, Button, Dialog, Icon, List, Portal, Text, TextInput, TouchableRipple } from 'react-native-paper';
import i18n from './i18n/i18n';
import ScreenWrapper from './tools/ScreenWrapper';

type RouteType = {
    name: string;
    points: any[];
    color: string;
};

const IconButton = ({ icon, onPress=(()=>{}), GangnamStyle={} }: { icon: string, onPress: ()=>void, GangnamStyle?: object }) => {
    // 欸我操我才看到组件库有IconButton，我眼真瞎了
    return (
        <TouchableRipple
            onPress={onPress}
            borderless={true}
            style={{padding: 7, borderRadius: 100, ...GangnamStyle/*AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA*/}}
        >
            <Icon 
                source={icon}
                size={21}
            />
        </TouchableRipple>
    );
};

const RouteScreen = ({ navigation }: { navigation: any }) => {
    const [routes, setRoutes] = React.useState<RouteType[]>([]);
    React.useEffect(() => {
        AsyncStorage.getItem('routes').then(data => {
            if (data) {
                setRoutes(JSON.parse(data));
            };
        });
    }, []);

    const [openAddDia, setOpenAddDia] = React.useState(false);
    const [routeNameAdding, setRouteNameAdding] = React.useState('');
    const [routeRenaming, setRouteRenaming] = React.useState(0);
    const [openRouteRenameDia, setOpenRouteRenameDia] = React.useState(false);
    const [newRouteName, setNewRouteName] = React.useState('');

    const deleteRoute = (index: number) => {
        let new_routes = [...routes];
        new_routes.splice(index, 1);
        if(new_routes.length === 0){
            new_routes = [{name: 'Default Route', points: [], color: '#0000FF'}, ...new_routes];
        };
        setRoutes(new_routes);
        AsyncStorage.setItem('routes', JSON.stringify(new_routes));
    };

    const router = useRouter();

    return (
        <ScreenWrapper style={{ flex: 1 }} withScrollView={false}>
            <Appbar.Header elevated={true}>
                <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                <Appbar.Content title={i18n.t("TITLE_ROUTE")} />
            </Appbar.Header>

            <ScreenWrapper>
                <Button mode="elevated" onPress={() => {
                    setRouteNameAdding('');
                    setOpenAddDia(true);
                }} style={{margin: 15, marginBottom: 0}}>{i18n.t("ROUTE_ADD")}</Button>
                <Portal>
                    <Dialog visible={openAddDia} onDismiss={() => { setOpenAddDia(false); }}>
                        <Dialog.Title>{i18n.t("ROUTE_ADD")}</Dialog.Title>
                        <Dialog.Content>
                            <Text>{i18n.t("ROUTE_ADD_DISC")}</Text>
                            <TextInput
                                style={{marginTop: 10}}
                                value={routeNameAdding}
                                onChangeText={setRouteNameAdding}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                onPress={() => {
                                    setOpenAddDia(false);
                                    if(routeNameAdding.trim() !== ''){
                                        let new_routes = [...routes];
                                        new_routes = [{name: routeNameAdding, points: [], color: '#0000FF'}, ...new_routes];
                                        setRoutes(new_routes);
                                        AsyncStorage.setItem('routes', JSON.stringify(new_routes));
                                    };
                                }}
                                disabled={routeNameAdding.trim() === ''}
                            >{i18n.t("DIALOG_CONFIRM")}</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                
                {routes ? (<List.Section>
                    {routes.map((route, index) => {return(
                        <List.Item 
                            key={index}
                            title={route.name}
                            onPress={async() => {
                                router.push({
                                    pathname: '/subpages/routeedit',
                                    params: {
                                        index: index,
                                    }
                                });
                            }}
                            right={() => (
                                <View style={{flexDirection: 'row', gap: 5}}>
                                    <IconButton icon={'square-edit-outline'} onPress={() => {
                                        setRouteRenaming(index);
                                        setOpenRouteRenameDia(true);
                                        setNewRouteName(route.name);
                                    }} />
                                    <IconButton icon={'delete'} onPress={() => {deleteRoute(index)}} />
                                    <IconButton icon='arrow-right' onPress={() => {
                                        router.push({
                                            pathname: '/subpages/routeedit',
                                            params: {
                                                index_str: index.toString(),
                                            }
                                        });
                                    }} />
                                </View>
                            )}
                        />
                    );})}
                </List.Section>) : null}

                <Portal>
                    <Dialog visible={openRouteRenameDia} onDismiss={() => { setOpenRouteRenameDia(false); }}>
                        <Dialog.Title>{i18n.t("ROUTE_RENAME")}</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                value={newRouteName}
                                onChangeText={setNewRouteName}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                onPress={() => {
                                    setOpenRouteRenameDia(false);
                                    if(newRouteName.trim() !== ''){
                                        let new_routes = [...routes];
                                        new_routes[routeRenaming].name = newRouteName;
                                        setRoutes(new_routes);
                                        AsyncStorage.setItem('routes', JSON.stringify(new_routes));
                                    };
                                }}
                                disabled={newRouteName.trim() === ''}
                            >{i18n.t("DIALOG_CONFIRM")}</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

            </ScreenWrapper>
            <View style={{
                height: 35,
                padding: 5,
                margin: 5,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#4a4a4a',
                borderWidth: 3,
                borderRadius: 100,
            }}>
                <Text>{i18n.t("ROUTE_TIP")}</Text>
            </View>
        </ScreenWrapper>
    );
};

export default RouteScreen;