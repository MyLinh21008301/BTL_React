import React, { useState, useEffect,useContext } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
    const route = useRoute();
    const navigation = useNavigation(); 
    const initialQuery = route.params?.query || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    const [foodList, setFoodList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchQuery.length > 0) {
            setIsLoading(true);
            fetch(`http://localhost:3000/foods/search?search=${searchQuery}`)
                .then(response => response.json())
                .then(data => {
                    setFoodList(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching food list:', error);
                    setIsLoading(false);
                });
        } else {
            setFoodList([]);
        }
    }, [searchQuery]);
    const handleStores = (store) => {
        console.log("Selected store_id:", store);
        navigation.navigate('Store', { store });
    };   
    const renderFoodItem = ({ item }) => (
        <TouchableOpacity style={styles.foodItem} onPress={() => handleStores(item.store_id)}>
            <Image source={{ uri: item.product_image }} style={styles.foodImage} />
            <View style={styles.foodDetails}>
                <Text style={styles.productName}>{item.product_name}</Text>
                <Text style={styles.storeName}>{item.store_name}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>${item.price}</Text>
                    {item.discount_percentage ? (
                        <Text style={styles.discountText}>
                            -{Math.round(item.discount_percentage)}%
                        </Text>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <View style={styles.searchBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for food..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={foodList}
                    renderItem={renderFoodItem}
                    keyExtractor={item => item.product_id.toString()}
                    ListEmptyComponent={<Text>No foods found</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchBox:{
        flexDirection: 'row',
        width:"100%",
        height: 100,
        backgroundColor: "#00a7ad",
        alignItems:"center",
        justifyContent:"center",
        paddingTop:30,
        marginBottom: 20
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        height: 50,
        width: "90%",
        padding:10
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    backButton: {
        marginRight: 8,
    },
    clearButton: {
        marginLeft: 8,
    },
    foodItem: {
        flexDirection: 'row',
        marginBottom: 16,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor:"#e8e8e9"
    },
    foodImage: {
        width: 100,
        height: 100,
        marginRight: 16,
        borderRadius: 10
    },
    foodDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    storeName: {
        fontSize: 14,
        color: '#888',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 14,
        color: '#000',
        marginRight: 8,
    },
    discountText: {
        fontSize: 14,
        color: 'red',
    },
});

// export default SearchScreen;