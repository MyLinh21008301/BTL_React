import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function App({ navigation, route }) {
    const { user } = route.params; 
    console.log("user in success:", user);
    return (

        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapContainer center={[10.835576, 106.666832]} zoom={17} style={styles.map}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>
            </View>
            <View style={styles.modal}>
                <View style={styles.radioGroup}>
                    <Text style={styles.tb}>Order Success!</Text>

                    <View style={styles.driver}>
                        <View style={styles.avtBox}> <View style={styles.avt}><Text style={styles.name} >J</Text></View>
                            <View>
                                <Text style={styles.driverName}>Join Copper</Text>
                                <Text>Food Delivery </Text>
                            </View></View>
                        <View style={styles.connect}>
                            <TouchableOpacity>
                                <Icon name="phone-in-talk" size={27} color="#00C1D4" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon name="message" size={27} color="#00C1D4" />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
                <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Home',{user})}>
                    <Text style={styles.checkoutText}>Return to Home page</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    mapContainer: { height: 450, width: '100%' },
    map: { height: '100%', width: '100%' },
    modal: { padding: 20, backgroundColor: '#fff', marginBottom: 20 },
    title: { fontSize: 20, marginBottom: 10, fontWeight: "500" },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, color: "#7b7c7c" },
    radioGroup: { marginBottom: 20 },
    tb: { marginLeft: 5, fontSize: 20, color: "#13aec1", fontWeight: "bold" },
    name: { fontSize: 20, color: "#fff" },
    driverName: { fontSize: 17, color: "#13aec1", fontWeight: "500" },
    connect: { flexDirection: "row", width: 70, justifyContent: "space-between" },
    driver: { flexDirection: "row", marginTop: 30, justifyContent:"space-between" },
    avtBox: { flexDirection: "row" },
    checkoutButton: { backgroundColor: '#00a7ad', padding: 15, borderRadius: 5, marginTop: 20 },
    checkoutText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
    avt: { width: 50, height: 50, borderRadius: "50%", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#13aec1", marginRight: 20 },
});
