import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Checkbox, RadioButton } from 'react-native-paper';
import { ScrollView } from 'react-native-web';
import { Ionicons } from '@expo/vector-icons';
import {CartContext} from './cartContext';


export default function ProductDetails({ route, navigation }) {
    const { addToCart } = useContext(CartContext);
    const { food_id, user } = route.params; 
    const [food, setFood] = useState();
    const [size, setSize] = useState('L');
    const [toppings, setToppings] = useState({ Corn: true, Cheese: true, SaltedEgg: false }); 
    const [spiciness, setSpiciness] = useState('Hot'); 
    const [note, setNote] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    

    console.log('User in Food:', user); 
    const handleAddToCart = () => {
        if (addToCart) {
            const foodItem = {
                id: food_id,
                name: food.product_name,
                store_id: food.store_id,
                image: food.product_image,
                basePrice: food.price,
                discount: discount || 0,
                finalPrice: totalPrice.toFixed(2),
                size,
                toppings: Object.keys(toppings).filter((key) => toppings[key]),
                quantity,
                note,
            };
    
            addToCart(foodItem);
            console.log('Added to cart:', foodItem);
            console.log('store_id', food.store_id);
            navigation.navigate('Order', {user});
        } else {
            console.error('addToCart function is not defined in CartContext!');
        }
    };
    const toppingPrices = { Corn: 2, Cheese: 5, SaltedEgg: 10 };
    console.log(food_id)
    // Gọi API để lấy thông tin món ăn
    useEffect(() => {
        async function fetchFoodDetails() {
            try {
                const response = await fetch(`http://localhost:3000/foods/${food_id}`);
                const data = await response.json();

                setFood(data); 
                setLoading(false);
            } catch (error) {
                console.error("Error fetching food details:", error);
                setLoading(false);
            }
        }

        fetchFoodDetails();
    }, [food_id]);
 
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#59ddf2" />
            </View>
        );
    }

    if (!food) {
        return (
            <View style={styles.errorContainer}>
                <Text>Unable to fetch food details. Please try again later.</Text>
            </View>
        );
    }

    // Tính giá sau khi giảm giá (nếu có)
    const basePrice = parseFloat(food.price);
    const discount = food.discount_percentage ? parseFloat(food.discount_percentage) : 0;
    const discountedPrice = basePrice * (1 - discount / 100);

    // Tính tổng giá dựa trên size và toppings
    const sizePrice = size === 'M' ? 5 : size === 'L' ? 10 : 0;
    const toppingsPrice = Object.keys(toppings).reduce((total, key) => {
        return toppings[key] ? total + toppingPrices[key] : total;
    }, 0);
    const totalPrice = discountedPrice + sizePrice + toppingsPrice;

    const fainalPrice = totalPrice*quantity;
    return (
        <View style={styles.container}>
            <ScrollView style={styles.detailsContainer}>
                <View style={styles.header}>
                    <Image source={{ uri: food.product_image }} style={styles.image} />
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>{food.product_name}</Text>
                <Text style={styles.price}>${food.price}</Text>
                <Text style={styles.discount}> - {discount}%</Text>
                <Text style={styles.FainalPrice}>${discountedPrice.toFixed(2)}</Text>
                <Text style={styles.description}>{food.description}</Text>
                <Text style={styles.storeInfo}>
                    Sold by: {food.store_name}, {food.store_address}
                </Text>

                {/* Size */}
                <Text style={styles.sectionTitle}>Size (Pick 1)</Text>
                <RadioButton.Group onValueChange={setSize} value={size}>
                    {['S', 'M', 'L'].map((s, index) => (
                        <View style={styles.optionRow} key={index}>
                            <RadioButton value={s} />
                            <Text>{s}</Text>
                            {s === 'M' && <Text style={styles.extraPrice}>+ $5</Text>}
                            {s === 'L' && <Text style={styles.extraPrice}>+ $10</Text>}
                        </View>
                    ))}
                </RadioButton.Group>

                {/* Toppings */}
                <Text style={styles.sectionTitle}>Topping (Optional)</Text>
                {Object.keys(toppings).map((topping, index) => (
                    <View style={styles.optionRow} key={index}>
                        <Checkbox
                            status={toppings[topping] ? 'checked' : 'unchecked'}
                            onPress={() =>
                                setToppings({ ...toppings, [topping]: !toppings[topping] })
                            }
                        />
                        <Text>{topping}</Text>
                        <Text style={styles.extraPrice}>
                            + ${toppingPrices[topping]}
                        </Text>
                    </View>
                ))}

                {/* Spiciness */}
                <Text style={styles.sectionTitle}>Spiciness (Pick 1)</Text>
                <RadioButton.Group onValueChange={setSpiciness} value={spiciness}>
                    {['No', 'Hot', 'Very hot'].map((level, index) => (
                        <View style={styles.optionRow} key={index}>
                            <RadioButton value={level} />
                            <Text>{level}</Text>
                        </View>
                    ))}
                </RadioButton.Group>

                {/* Special Note */}
                <Text style={styles.sectionTitle}>Note for restaurant</Text>
                <TextInput
                    style={styles.noteInput}
                    placeholder="Special note"
                    value={note}
                    onChangeText={setNote}
                />
                {/* Quantity & Add to Cart */}
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <Text>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <Text>+</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                <Text style={styles.addToCartText}  >Add to cart (${(totalPrice * quantity).toFixed(2)})</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        position: "relative"
    },
    backButton: {
        marginRight: 8,
        position: 'absolute',
        top: 10,
        left: 5
    },

    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    detailsContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        color: '#555',
        marginVertical: 5,
        textDecorationLine: 'line-through',
        
    },
    FainalPrice:{
        fontSize: 19,
        color: '#ff0000',
        marginVertical: 5,
        fontWeight: "bold",
    },
    discount:{
        fontSize: 14,
        color: '#058ebc',
        marginVertical: 5,
    },
    description: {
        fontSize: 14,
        color: '#777',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    extraPrice: {
        marginLeft: 'auto',
        color: '#888',
    },
    noteInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    quantityText: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    addToCartButton: {
        backgroundColor: '#59ddf2',
        marginHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        height: 50,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 14
    },
});