import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InfoUser({ route, navigation }) {
    const { user } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Information</Text>
            </View>

            <View style={styles.profileContainer}>
                <Image
                    source={require('../assets/img/avt4.png')}
                    style={styles.avatar}
                />
                <Text style={styles.username}>Username: {user.username}</Text>
                <Text style={styles.email}>Email: {user.email}</Text>
                <Text style={styles.address}>Address: {user.address}</Text>
            </View>
            <TouchableOpacity style={styles.btn}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Log out</Text>
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
        backgroundColor: '#00a7ad',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 18,
        color: '#666',
        marginTop: 10,
    },
    address: {
        fontSize: 16,
        color: '#888',
        marginTop: 5,
    },
    editButton: {
        marginTop: 40,
        backgroundColor: '#00a7ad',
        paddingVertical: 15,
        marginHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    btn: {
        backgroundColor: '#5CC1D6',
        padding: 15,
        marginTop: 20,
        borderRadius: 20,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 150
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});