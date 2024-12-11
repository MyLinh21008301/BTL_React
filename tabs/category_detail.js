import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CategoryDetail({ route, navigation }) {
    const { category, user } = route.params;
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoresAndFoods = async () => {
            try {
                const response = await fetch(`http://localhost:3000/stores/category/${encodeURIComponent(category)}`);
                const storesData = await response.json();
                setStores(storesData);
            } catch (error) {
                console.error('Error fetching stores or foods:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoresAndFoods();
    }, [category]);

    const renderStore = ({ item }) => (
        <TouchableOpacity style={styles.store}  onPress={() => handleStores(item.store_id)}>
            <Image source={{ uri: item.store_image }} style={styles.storeImage} />
            <View style={styles.storeDetails}>
                <Text style={styles.storeName}>{item.store_name}</Text>
                <Text style={styles.storeAddress}>{item.address}</Text>
                <Text style={styles.storeTime}>15 min-25 min</Text>
                <Text style={styles.storeAddress}>
                    <Icon name='star' size={17} color="#f9c425" />
                    {item.rating}
                </Text>
                <View style={styles.tag}>
                <Text style={styles.storeTime}>FREESHIP</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
    const handleStores = (store) => {
        console.log("Selected store_id:", store);
        navigation.navigate('Store', { store, user });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>{category}</Text>
            </View>

            {loading ? (
                <Text>Loading...</Text>
            ) : stores.length === 0 ? (
                <Text>No stores found for this category.</Text>
            ) : (
                <FlatList
                    data={stores}
                    keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
                    renderItem={renderStore}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: "row"
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        marginLeft: 10
    },
    store: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    storeImage: {
        width: 130,
        height: 130,
        borderRadius: 10,
        marginRight: 10,
    },
    storeDetails: {
        flex: 1,
        flexDirection: 'column',
    },
    storeName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    storeAddress: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    storeTime:{
        fontSize: 14,
        color: '#13aec1',
        marginBottom: 10,
    },
    tag:{
        width: 70,
        height: 20,
        backgroundColor: '#d9f8fc',
        borderRadius: 5,
     
    },
  
});