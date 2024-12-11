import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CartContext } from './cartContext';

export default function App({ navigation, route }) {
    const { store, user } = route.params || {};
    const [foods, setFoods] = useState([]);
    const [storeInfo, setStoreInfo] = useState({});
    const [loading, setLoading] = useState(true);
 

    const context = useContext(CartContext);
    console.log('Context:', context); // Kiểm tra giá trị trả về từ useContext

    console.log('User in Store:', user); 

    const { getCartQuantity } = context || {}; // Destructure nếu context hợp lệ
    const cartQuantity = getCartQuantity ? getCartQuantity() : 0; // Tránh lỗi nếu getCartQuantity không tồn tại


    // Gọi API để lấy thông tin của store theo ID
    useEffect(() => {
        const fetchStoreInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3000/store/${store}`);
                const storeData = await response.json();
                setStoreInfo(storeData);
            } catch (error) {
                console.error('Error fetching store info:', error);
            }
        };

        // Gọi API lấy danh sách món ăn của cửa hàng theo ID
        const fetchFoods = async () => {
            try {
                const response = await fetch(`http://localhost:3000/store/${store}/foods`);
                const foodData = await response.json();
                setFoods(foodData);
            } catch (error) {
                console.error('Error fetching foods:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreInfo();
        fetchFoods();
    }, [store]);

    const handleFood = (food_id) => {
        console.log("Selected food_id:", food_id);
        navigation.navigate('FoodDetail', { food_id, user });
    };

    const renderForYou = ({ item }) => {
        // Tính giá sau khi giảm giá
        const basePrice = parseFloat(item.price);
        const discount = item.discount_percentage ? parseFloat(item.discount_percentage) : 0;
        const discountedPrice = basePrice * (1 - discount / 100);

        return (
            <TouchableOpacity style={styles.card}
                onPress={() => handleFood(item.product_id)}
            >
                <Image source={{ uri: item.product_image }} style={styles.image} />
                <View style={styles.disBox}>
                    <Text style={styles.cardTitle}>{item.product_name}</Text>
                    <Text style={styles.cardDiscount}>-{discount}%</Text>
                </View>
                <Text style={styles.cardRating}>
                    <Icon name="star-border" size={20} color="#ffd400" />
                    {storeInfo.rating}
                </Text>
                <Text style={styles.cardPrice}>${discountedPrice.toFixed(2)}</Text>
            </TouchableOpacity>
        );
    };
    const renderMenu = ({ item }) => {
        const basePrice = parseFloat(item.price);
        const discount = item.discount_percentage ? parseFloat(item.discount_percentage) : 0;
        const discountedPrice = basePrice * (1 - discount / 100);
        return (
            <TouchableOpacity key={item.product_id} style={styles.comboCard}
                onPress={() => handleFood(item.product_id)}
            >
                <Image source={{ uri: item.product_image }} style={styles.comboImage} />
                <View style={styles.discountTag}>
                    <Text style={styles.discountText}>
                        -{discount}%
                    </Text>
                </View>
                <View>
                    <Text style={styles.cardTitle}>{item.product_name}</Text>
                    <Text style={styles.comboDetails}
                    >{item.description}</Text>

                    <View style={styles.priceAndHeart}>
                        <Text style={styles.cardRating}>
                            <Icon name="star-border" size={20} color="#ffd400" />
                            {storeInfo.rating}
                        </Text>
                        <TouchableOpacity>
                            <Ionicons name="heart-outline" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.priceAndHeart}>
                        <Text style={styles.cardPrice}>${discountedPrice.toFixed(2)}</Text>
                        <TouchableOpacity onPress={() => handleFood(item.product_id)
                        }>
                            <Ionicons name="add-circle" size={30} color="#e03a3a" />
                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={styles.container}>
            <ScrollView style={styles.con}>
                <View style={styles.bannerContainer}>
                    <Image source={{ uri: storeInfo.image }} style={styles.banner} />
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    {/* Thông tin cửa hàng */}
                    <View style={styles.restaurantInfo}>
                        <Text style={styles.deal}>Deal $1 Near you</Text>
                        <Text style={styles.title}>{storeInfo.name || 'Restaurant Name'}</Text>
                        <View style={styles.itemTBox}>
                            <View style={styles.itemT}>
                                <Ionicons name="timer" size={20} color="#00a7ad" />
                                <Text style={styles.subtitle}>{storeInfo.hours || '6am - 9pm'}</Text>
                            </View>
                            <View style={styles.itemT}>
                                <Icon name="place" size={20} color="#00a7ad" />
                                <Text style={styles.subtitle}>{storeInfo.distance || '2 km'}</Text>
                            </View>
                            <View style={styles.itemT}>
                                <Icon name="discount" size={20} color="#00a7ad" />
                                <Text style={styles.subtitle}>{storeInfo.priceRange || '$5 - $50'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.content}>

                    <View style={styles.section}>
                        <TouchableOpacity style={styles.btnBox} >
                            <Text style={styles.detail}>
                                <Icon name="star-border" size={20} color="#ffd400" />
                                {storeInfo.rating} (289 reviews)</Text>
                            <Icon name="chevron-right" size={25} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnBox} >
                            <Text style={styles.detail}>
                                <Icon name="discount" size={20} color="#000" />
                                2 discount vouchers for restaurant</Text>
                            <Icon name="chevron-right" size={25} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnBox} >
                            <Text style={styles.detail}>
                                <Icon name="delivery-dining" size={20} color="#000" />
                                Delivery on 20 mins</Text>
                            <Icon name="chevron-right" size={25} color="#000" />
                        </TouchableOpacity>

                    </View>


                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>For you</Text>
                        <FlatList
                            horizontal
                            data={foods
                                .sort((a, b) => a.price - b.price)
                                .slice(0, 3)}
                            keyExtractor={(item) => item.product_id.toString()}
                            renderItem={renderForYou}
                        />
                    </View>



                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Menu</Text>
                        <FlatList
                            data={foods}
                            keyExtractor={(item) => item.product_id.toString()}
                            renderItem={renderMenu}
                        />
                    </View>



                </View>
            </ScrollView>
            <TouchableOpacity style={styles.myCart} onPress={() => navigation.navigate('Order',{user})}>
                <View style={styles.quantityBox} >
                    <Text style={styles.quantity}>{cartQuantity}</Text>
                </View>
                <Ionicons name="bag-add" size={25} color={"#fff"} style={styles.cart} />

            </TouchableOpacity>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerItem}>
                    <Ionicons name="home" size={24} color="#00a7ad" />
                    <Text style={styles.footerText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem}>
                    <Ionicons name="clipboard-sharp" size={24} color="gray" />
                    <Text style={styles.footerText}>My order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem}>
                    <Ionicons name="heart" size={24} color="gray" />
                    <Text style={styles.footerText}>Favorites</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem}>
                    <Ionicons name="chatbubble-ellipses" size={24} color="gray" />
                    <Text style={styles.footerText}>Inbox</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem}>
                    <Ionicons name="person" size={24} color="gray" />
                    <Text style={styles.footerText}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bannerContainer: {
        position: 'relative', // Làm gốc tham chiếu

    },
    restaurantInfo: {
        alignItems: 'center',
        position: 'absolute',
        left: 25,
        top: 120,
        backgroundColor: '#fff',
        padding: 10,
        width: 340,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

    },
    banner: {
        width: '100%',
        height: 200,

    },
    backButton: {
        marginRight: 8,
        position: 'absolute',
        top: 10,
        left: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    },
    itemTBox: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10

    },
    itemT: {
        flexDirection: "row",
        marginHorizontal: 10
    },
    subtitle: {
        fontSize: 16,
        color: '#666',

    },
    deal: {
        backgroundColor: '#ffdb99',
        padding: 8,
        borderRadius: 5,
        marginVertical: 8,
        fontWeight: 'bold',
    },
    detail: {
        fontSize: 14,
        // marginVertical: 4,
    },
    content: {
        top: 60
    },
    section: {
        marginVertical: 16,
        paddingHorizontal: 16,
    },
    btnBox: {
        width: "100%",
        height: 40,
        elevation: 5, // Tạo hiệu ứng đổ bóng trên Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
        // shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    card: {
        width: 150,
        marginRight: 16,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    disBox: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    cardTitle: {
        fontSize: 16,
        marginTop: 8,
        fontWeight: "500"
    },
    cardDiscount: {
        fontSize: 16,
        marginTop: 8,
        color: "#13aec1"
    },
    cardRating: {
        fontSize: 14,
        color: '#666',
    },
    priceAndHeart: {
        width: 250,
        height: "auto",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    comboCard: {
        flexDirection: 'row',
        marginVertical: 8,
        alignItems: 'center',
        position: "relative"
    },
    comboImage: {
        width: 90,
        height: 90,
        borderRadius: 10,
        marginRight: 16,
    },
    discountTag: {
        position: 'absolute',  // Đặt tag giảm giá nổi trên ảnh
        top: 15,
        backgroundColor: '#00bfff',  // Màu nền xanh da trời
        paddingVertical: 5,
        borderRadius: 20,  // Làm cho tag có hình tròn góc
    },
    discountText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    comboDetails: {

        fontSize: 13,
        color: '#666',
        flexWrap: 'wrap', // Cho phép tự động xuống dòng
        width: 250,
        marginVertical: 5
    },

    con: {
        marginBottom: 50
    },
    myCart: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor: "#13aec1",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        bottom: 70,
        flexDirection: "column"
    },
    quantityBox: {
        width: 20,
        height: 20,
        backgroundColor: "#ff0000",
        borderRadius: "50%",
        top: -10,
        left: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"

    },
    quantity: {
        fontSize: 12,
        color: "#fff"
    },
    cart: {
        top: -10
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        height: 70,
        paddingBottom: 10,
    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        marginTop: 4,
        color: 'gray',
    },
});
