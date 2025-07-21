// 文件: app/testlocation.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const TestLocationScreen = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetLocation = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        setLocation(null);

        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setIsLoading(false);
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Location Test</Text>
            <Button title="Get Current Location" onPress={handleGetLocation} />
            {isLoading && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}
            {errorMsg && <Text style={styles.errorText}>Error: {errorMsg}</Text>}
            {location && (
                <View style={styles.locationContainer}>
                    <Text>Latitude: {location.coords.latitude}</Text>
                    <Text>Longitude: {location.coords.longitude}</Text>
                    <Text>Timestamp: {new Date(location.timestamp).toLocaleTimeString()}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        marginTop: 20,
        textAlign: 'center',
    },
    locationContainer: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default TestLocationScreen;