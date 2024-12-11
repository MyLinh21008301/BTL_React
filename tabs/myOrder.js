import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MyOrder({ route, navigation }) {
    const { user } = route.params;
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});
    console.log("in my order:", user);
    useEffect(() => {
        // Lấy danh sách đơn hàng theo user_id từ API
        fetch(`http://localhost:3000/api/orders?user_id=${user.id}`)
            .then((response) => response.json())
            .then((data) => {
                setOrders(data);

                // Lấy thông tin chi tiết cho từng order_id
                data.forEach((order) => {
                    fetch(`http://localhost:3000/api/orders/foods?order_id=${order.id}`)
                        .then((response) => response.json())
                        .then((details) => {
                            setOrderDetails((prev) => ({
                                ...prev,
                                [order.id]: details, // Lưu thông tin chi tiết cho từng order_id
                            }));
                        })
                        .catch((error) =>
                            console.error(`Error fetching details for order ${order.id}:`, error)
                        );
                });
            })
            .catch((error) => console.error('Error fetching orders:', error));
    }, [user.id]);
    const renderOrderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order ID: {item.id}</Text>
            </View>

            <View style={styles.orderItemI}>
                <Text style={styles.orderId}>Store ID:</Text>
                <Text style={styles.orderStatus}>{item.store_id}</Text>
            </View>
            <View style={styles.orderItemI}>
                <Text style={styles.orderId}>Status:</Text>
                <Text style={styles.orderStatus}>{item.order_status}</Text>
            </View>
            <View style={styles.orderItemI}>
                <Text style={styles.orderId}>Date:</Text>
                <Text style={styles.orderStatus}>{item.created_at}</Text>
            </View>
            <View style={styles.orderItemI}>
                <Text style={styles.orderId}>Total price:</Text>
                <Text style={styles.orderStatus}>{item.total_price}</Text>
            </View>
            {/* Hiển thị danh sách sản phẩm trong đơn hàng */}
            {orderDetails[item.id] ? (
                <FlatList
                    data={orderDetails[item.id]}
                    keyExtractor={(detail) => detail.order_item_id.toString()}
                    renderItem={({ item: detail }) => (
                        <View style={styles.itemContainer}>
                            <Image
                                source={{ uri: detail.food_image }}
                                style={styles.itemImage}
                            />
                            <View style={styles.itemContent}>
                                <Text style={styles.itemName}>{detail.name}</Text>
                                <Text style={styles.itemDetails}>Toppings: {detail.topping}</Text>
                                <Text style={styles.itemDetails}>Quantity: {detail.quantity}</Text>
                                <Text style={styles.itemPrice}>Price: {detail.price}</Text>
                            </View>
                           


                        </View>
                    )}
                />
            ) : (
                <Text>Loading items...</Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={30} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>My Orders</Text>
            </View>
            {orders.length > 0 ? (
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No orders found.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00a7ad',
        padding: 15,
    },
    headerText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    orderItem: {
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        color: "#a00101"
    },
    orderItemI: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingLeft: 20
    },
    orderId: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    orderStatus: {
        fontSize: 14,
        color: '#00a7ad',
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    productQuantity: {
        fontSize: 14,
        color: '#777',
    },
    productPrice: {
        fontSize: 14,
        color: '#00a7ad',
        fontWeight: 'bold',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00a7ad',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#777',
    },
    itemContainer: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
    itemImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
    itemContent: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold' },
    itemDetails: { fontSize: 14, color: 'gray' },
    itemPrice: { fontSize: 14, color: '#e03a3a', fontWeight: 'bold' },
});
