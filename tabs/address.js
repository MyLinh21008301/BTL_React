import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function App({navigation, route}) {
  const [locationType, setLocationType] = useState('Home'); 
  const { user } = route.params; 
  const [address, setAddress] = useState('');

  const handleConfirm = () => {
    const deliveryInfo = `${locationType}: ${address}`;
    navigation.navigate('Order', { deliveryInfo, user });
  };
  return (

    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapContainer center={[10.835576, 106.666832]} zoom={13} style={styles.map}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </View>
      <View style={styles.modal}>
        <Text style={styles.title}>Select location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />
        <View style={styles.radioGroup}>
          <View style={styles.radioOption}>
            <RadioButton
              value="Home"
              status={locationType === 'Home' ? 'checked' : 'unchecked'}
              onPress={() => setLocationType('Home')}
            />
            <Text style={styles.radioText}>Home</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton
              value="Work"
              status={locationType === 'Work' ? 'checked' : 'unchecked'}
              onPress={() => setLocationType('Work')}
            />
            <Text style={styles.radioText}>Work</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton
              value="Other"
              status={locationType === 'Other' ? 'checked' : 'unchecked'}
              onPress={() => setLocationType('Other')}
            />
            <Text style={styles.radioText}>Other</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { height: 370, width: '100%' },
  map: { height: '100%', width: '100%' },
  modal: { padding: 20, backgroundColor: '#fff', marginBottom: 20 },
  title: { fontSize: 20, marginBottom: 10, fontWeight: "500" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, color:"#7b7c7c" },
  radioGroup: { marginBottom: 20 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  radioText: { marginLeft: 5 },
  confirmButton: { padding: 10, backgroundColor: '#13aec1', borderRadius: 5 },
  confirmText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
