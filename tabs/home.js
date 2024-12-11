
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const collections = [
    { id: '1', title: 'FREESHIP', image: require('../assets/img/noodle.png') },
    { id: '2', title: 'DEAL $1', image: require('../assets/img/ice-cream.png') },
    { id: '3', title: 'NEAR YOU', image: require('../assets/img/salad.png') },
    { id: '4', title: 'POPULAR', image: require('../assets/img/hamberger1.png') },
];

export default function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();  // Hook để sử dụng navigation

    const route = useRoute(); // Nhận route để lấy params
    const { user } = route.params || {}; // Sử dụng giá trị mặc định để tránh lỗi undefined
    if (!user) {
        console.error("User param is missing.");
        // Xử lý hợp lý khi user không tồn tại, ví dụ điều hướng về màn hình trước
    }

    console.log("User login:", user);
    const handleSearch = () => {
        navigation.navigate("Search", { query: searchQuery });
    };

    const handleCategory = (category) => {
        console.log("Selected category:", category);
        navigation.navigate('ListStores', { category, user });
    };
    const handleStores = (store) => {
        console.log("Selected store_id:", store);
        navigation.navigate('Store', { store, user });
    };


    const [categories, setCategories] = useState([]);
    const [recommended, setRecommend] = useState([]);
    const [discount, setDiscount] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/categories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const renderCategory = ({ item }) => (

        <TouchableOpacity
            style={styles.category}
            onPress={() => handleCategory(item.name)}
        >
            <Image source={{ uri: item.image }} style={styles.categoryIcon} />
            <Text style={styles.categoryText}>{item.name}</Text>
        </TouchableOpacity>



    );

    useEffect(() => {
        fetch("http://localhost:3000/promotions/discount-50")
            .then(response => response.json())
            .then(data => setDiscount(data))
            .catch(error => console.error('Error fetching Discount:', error));
    }, []);

    const renderProduct = ({ item }) => (
        <TouchableOpacity style={styles.disItem}
            onPress={() => handleStores(item.store_id)}
        >
            <Image
                source={{ uri: item.product_image }}
                style={styles.disImage}
            />
            <View style={styles.discountTag}>
                <Text style={styles.discountText}>
                    -{Math.round(item.discount_percentage)}%
                </Text>
            </View>
            <Text style={styles.disproductName}>{`${item.product_name}`}</Text>
            <Text style={styles.details}>30 mins • ⭐ 4.2</Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        fetch('http://localhost:3000/recommended')
            .then(response => response.json())
            .then(data => setRecommend(data))
            .catch(error => console.error('Error fetching recommended:', error));
    }, []);

    const renderRecommend = ({ item }) => (
        <TouchableOpacity style={styles.recommendedItem} onPress={() => handleStores(item.id)}>
            <Image source={{ uri: item.image }} style={styles.recommendedImage} />
            <Text style={styles.recommendedTitle}>{item.name}</Text>
            <View style={styles.recommendedBox}>
                <Text style={styles.recommendedSubtitle}>15 mins· </Text>
                <Icon name='star' size={17} color="#f9c425" />
                <Text style={styles.recommendedSubtitle}>{item.rating}</Text>
            </View>
        </TouchableOpacity>
    );
    const banners = [
        { id: 1, image: require('../assets/img/banner1.png') },
        { id: 2, image: require('../assets/img/banner2.png') },
        { id: 3, image: require('../assets/img/banner3.png') },
    ];

    const renderCollectionItem = ({ item }) => (
        <View style={styles.collectionItem}>
            <Image source={item.image} style={styles.collectionImage} />
            <Text style={styles.collectionTitle}>{item.title}</Text>
        </View>
    );
    console.log(user.address);
    const renderUser = ({ item }) => (
        <Text style={styles.headerText}>{item.address}</Text>
    );
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Icon name="place" size={30} color="#fff" />

                    <FlatList
                        data={[user]}
                        renderItem={renderUser}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
                <View style={styles.headerDown}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        value={searchQuery}
                        onChangeText={setSearchQuery}  // Cập nhật searchQuery
                    />
                    <TouchableOpacity onPress={handleSearch}>
                        <Ionicons name="search" size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                {/* Banner */}
                <View style={styles.banner}>
                    <Swiper autoplay={true} autoplayTimeout={3} showsPagination={true} height={150} loop={true}>
                        {banners.map((banner) => (
                            <TouchableOpacity
                                key={banner.id}

                            >
                                <Image source={banner.image} style={styles.bannerImage} />
                            </TouchableOpacity>
                        ))}
                    </Swiper>
                </View>

                {/* Categories */}
                <View style={styles.categories}>

                    <FlatList
                        data={categories}
                        renderItem={renderCategory}
                        keyExtractor={item => item.id.toString()}
                        numColumns={4}
                        columnWrapperStyle={styles.row}
                        showsVerticalScrollIndicator={false}
                    />

                </View>

                {/* Voucher */}
                <TouchableOpacity style={styles.voucher}>
                    <Ionicons name="gift-outline" size={20} color="#00a7ad" />
                    <Text style={styles.voucherText}>You have 5 vouchers here</Text>
                    <Icon name='chevron-right' size={20} color="#00a7ad" style={styles.iconVoucher} />
                </TouchableOpacity>

                {/* Collections */}
                <Text style={styles.sectionTitle}>Collections</Text>
                <FlatList
                    data={collections}
                    renderItem={renderCollectionItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.collectionList}
                    showsVerticalScrollIndicator={false}
                />
                {/* Recommended */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recommended for you</Text>
                    <FlatList
                        horizontal
                        data={recommended}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderRecommend}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                {/* Discount 50% */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Discount 50%</Text>
                    <FlatList
                        horizontal
                        data={discount} // Dữ liệu lấy từ API
                        renderItem={renderProduct} // Hàm render từng item
                        keyExtractor={(item) => item.product_id.toString()}

                    />
                </View>

            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerItem}>
                    <Ionicons name="home" size={24} color="#00a7ad" />
                    <Text style={styles.footerText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('MyOrder', { user })}>
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
                <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Account', { user })}>
                    <Ionicons name="person" size={24} color="gray" />
                    <Text style={styles.footerText}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        height: 130,
        alignItems: 'center',
        backgroundColor: '#00a7ad',
        paddingVertical: 10,
    },
    headerTop: {
        width: '90%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    headerText: {
        color: '#fff',
        marginLeft: 10,
        fontWeight: '600',
    },
    headerDown: {
        marginTop: 10,
        width: '90%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    conttent: {
        width: "100%",
        height: 1000,
        overflow: "scroll",
    },
    banner: {
        margin: 15,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: 150,
    },
    categories: {
        width: "100%",
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
        alignItems: "center"
    },
    category: {
        alignItems: 'center',
        width: "20%",

    },
    categoryIcon: {
        width: 40,
        height: 40,
        marginBottom: 10
    },
    categoryText: {
        marginTop: 5,
        fontSize: 14,
    },
    voucher: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        padding: 10,
        margin: 15,
        borderRadius: 8,
    },
    voucherText: {
        marginLeft: 10,
        color: '#00a7ad',
    },
    iconVoucher: {
        marginLeft: 110
    },
    collections: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    collection: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
    },
    collectionText: {
        fontSize: 14,
    },
    section: {
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        marginBottom: 20
    },
    collectionImage: {
        width: 80,
        height: 80,
        marginRight: 10,
        borderRadius: 10
    },
    collectionTitle: {
        fontSize: 13,
        fontWeight: "500"
    },
    collectionList: {
        paddingHorizontal: 10,
    },
    row: {
        justifyContent: 'space-between', 
        marginBottom: 16, 
    },
    collectionItem: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 8,
        flexDirection: "row",
        backgroundColor: "#f9f9f9",
        borderRadius: 10
    },
    recommendedItem: {
        margin: 15,
        alignItems: 'center',
    },
    recommendedImage: {
        width: width / 3,
        height: 100,
        borderRadius: 8,
    },
    recommendedTitle: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
    },
    recommendedSubtitle: {
        fontSize: 12,
        color: '#888',
    },
    recommendedBox: {
        flexDirection: "row"
    },
    start: {
        marginHorizontal: 3
    },

    haffDiscount: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
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
    disItem: {
        marginBottom: 70,
        marginLeft: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        position: 'relative',
        alignItems: 'center',
    },
    disImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    discountTag: {
        position: 'absolute',  // Đặt tag giảm giá nổi trên ảnh
        top: 10,
        left: 10,
        backgroundColor: '#00bfff',  // Màu nền xanh da trời
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,  // Làm cho tag có hình tròn góc
    },
    discountText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    disproductName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    details: {
        fontSize: 14,
        color: '#888',
    },
});