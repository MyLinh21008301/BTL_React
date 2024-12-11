import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { CartContext } from './cartContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios'; 

export default function Order({ navigation, route }) {
    const { selectedOffer, deliveryInfo, user } = route.params || {};
    const { cartItems, removeFromCart } = useContext(CartContext);

    const [deliveryFee, setDeliveryFee] = useState(2); // Phí giao hàng mặc định
    const [discount, setDiscount] = useState(0); // Giảm giá mặc định
    const [total, setTotal] = useState(0); // Tổng tiền

    console.log('User in Order:', user); 
    // Tính toán Subtotal
    const subtotal = cartItems.reduce((total, item) => total + item.finalPrice * item.quantity, 0);
    useEffect(() => {
        if (selectedOffer) {
            if (
                selectedOffer.title.includes("10%") ||
                selectedOffer.title.includes("-10% for E-wallet")
            ) {
                setDiscount(0.1);
            } else if (
                selectedOffer.title.includes("-30% for bill over $50") &&
                subtotal > 50
            ) {
                setDiscount(0.3);
            } else if (selectedOffer.title.includes("-$1 shipping free")) {
                setDeliveryFee(1);
            } else if (selectedOffer.title.includes("Freeship")) {
                setDeliveryFee(0);
            }
        }
    }, [selectedOffer, subtotal]);

    useEffect(() => {
        const newTotal = subtotal * (1 - discount) + deliveryFee;
        console.log(`Total Updated: ${newTotal}`);
        setTotal(newTotal);
    }, [subtotal, discount, deliveryFee]);
    const handleStores = (store) => {
        console.log("Selected store_id:", store);
        navigation.navigate('Store', { store, user });
    };

    const renderItem = ({ item }) => {
        const toppings = item.toppings.join(', ');

        return (
            <View>

                <View style={styles.itemContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                    />
                    <View style={styles.itemContent}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDetails}>Size: {item.size}</Text>
                        <Text style={styles.itemDetails}>Toppings: {toppings || 'None'}</Text>
                        <Text style={styles.itemDetails}>Spiciness: {item.spiciness || 'No'}</Text>
                        <Text style={styles.itemPrice}>${item.finalPrice}</Text>
                    </View>
                    <View style={styles.quantityControl}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => {
                                if (item.quantity > 1) {
                                    item.quantity -= 1;
                                    navigation.replace('Order', {user});
                                }
                            }}
                        >
                            <Text style={styles.quantityText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => {
                                item.quantity += 1;
                                navigation.replace('Order', {user});
                                // setCartItems([...cartItems]);
                            }}
                        >
                            <Text style={styles.quantityText}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.delete}
                            onPress={() => {
                                removeFromCart(item.id);

                                if (cartItems.length - 1 === 0) {
                                    handleStores(item.store_id);
                                }
                            }}
                        >
                            <Icon name='delete-outline' size={25} color="#bc2323" />
                        </TouchableOpacity>
                    </View>


                </View>
                <TouchableOpacity onPress={() => handleStores(item.store_id)}>
                    <Text style={styles.addMore}>Add more</Text>
                </TouchableOpacity>

            </View>
        );
    };


    // Hàm xử lý gửi đơn hàng
    const handleOrderNow = async () => {
        try {
            // Tạo dữ liệu đơn hàng
            const orderData = {
                user_id: user.id,  // Thay thế bằng ID người dùng thực tế
                store_id: cartItems[0].store_id,  // Giả sử tất cả món trong giỏ hàng đều từ cùng một cửa hàng
                total_price: total.toFixed(2),
                order_status: 'Pending',  // Trạng thái mặc định cho đơn hàng
                items: cartItems.map(item => ({
                    food_id: item.id,
                    quantity: item.quantity,
                    price: item.finalPrice,
                    topping: item.toppings.join(', ') || null,
                })),
            };
            console.log(orderData);
            // Gửi request API
            const response = await axios.post('http://localhost:3000/orders', orderData);
            console.log(response); 
            if (response.status === 201) {
                alert('Đơn hàng đã được tạo thành công!');
                
            } else {
                alert('Có lỗi khi tạo đơn hàng!');
            }
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            alert('Lỗi khi tạo đơn hàng!');
        }
    };

    const handleResult = () => {
        handleOrderNow();
        navigation.navigate('Success',{user});
    };



    return (
        <View style={styles.container}>
            <View style={styles.deliveryContainer}>
                <Text style={styles.sectionTitle}>Delivered to</Text>
                <Text style={styles.deliveryAddress}>
                    {deliveryInfo || 'No delivery address selected'}
                </Text>
                <Text style={styles.deliveryTime}>20 mins</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Address',{user})}>
                    <Text style={styles.changeAddress}>Change address</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Order details</Text>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
            <View style={styles.ggBox}>
                <Text style={styles.sectionTitle}>Payment details</Text>
                <TouchableOpacity
                    style={styles.gg}
                    onPress={() => navigation.navigate('Delivery', {user})}
                >
                    <Text>
                        {selectedOffer ? `Offer: ${selectedOffer.title}` : 'Select Offer'}
                    </Text>
                    <Icon name="chevron-right" size={25} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={styles.paymentDetails}>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentText}>Subtotal</Text>
                    <Text style={styles.paymentText}>${subtotal.toFixed(2)}</Text>
                </View>


                <View style={styles.paymentRow}>
                    <Text style={styles.paymentText}>Discount</Text>
                    <Text style={styles.paymentText}>-${(discount * subtotal).toFixed(2)}</Text>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentText}>Delivery fee</Text>
                    <Text style={styles.paymentText}>${deliveryFee}</Text>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentTextBold}>Total</Text>
                    <Text style={styles.paymentTextBold}>${total.toFixed(2)}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.checkoutButton} onPress={() => handleResult()}>
                <Text style={styles.checkoutText}>Order now</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    deliveryContainer: { marginBottom: 20 },
    ggBox: { marginTop: 30 },
    gg: { flexDirection: "row", justifyContent: "space-between" },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    deliveryAddress: {
        fontSize: 16,
        fontWeight: '500',
        color: '#495057',
    },
    deliveryTime: { fontSize: 14, color: 'gray', marginBottom: 5 },
    changeAddress: { fontSize: 14, color: '#00a7ad', textDecorationLine: 'underline' },
    itemContainer: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
    itemImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
    itemContent: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold' },
    itemDetails: { fontSize: 14, color: 'gray' },
    itemPrice: { fontSize: 14, color: '#e03a3a', fontWeight: 'bold' },
    quantityControl: { flexDirection: 'row', alignItems: 'center' },
    quantityButton: {
        width: 30, height: 30, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderRadius: 5
    },
    quantityText: { fontSize: 18, fontWeight: 'bold' },
    delete: { marginLeft: 5 },
    quantity: { marginHorizontal: 10, fontSize: 16 },
    addMore: { fontSize: 14, color: '#00a7ad', textDecorationLine: 'underline', textAlign: 'right', marginVertical: 10 },
    paymentDetails: { marginTop: 20 },
    paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    paymentText: { fontSize: 14 },
    promotionText: { fontSize: 14, color: '#e03a3a' },
    paymentTextBold: { fontSize: 16, fontWeight: 'bold' },
    checkoutButton: { backgroundColor: '#00a7ad', padding: 15, borderRadius: 5, marginTop: 20 },
    checkoutText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});
