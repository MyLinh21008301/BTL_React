import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';



const Stack = createNativeStackNavigator();

// Khai báo state để lưu giá trị của các ô input


export default function App({ navigation}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
        if (!username || !password) {
            window.alert("Error", "Please fill in all fields before signing in.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, password: password }), // gửi dữ liệu
            });

            const data = await response.json();

            if (response.ok) { // Kiểm tra status code
                if (data.success) {
                    // const user = data.user; // Lấy thông tin user từ API
                    console.log("user", data.user);
                    navigation.navigate("Home", { user: data.user });
                } else {
                    // Nếu không thành công, thông báo từ server
                    window.alert("Lỗi đăng nhập", data.message || "Đăng nhập thất bại");
                }
            } else {
                // Nếu response không ok (chẳng hạn như 404, 500)
                window.alert("Lỗi đăng nhập", data.message || "Có lỗi xảy ra trong quá trình đăng nhập");
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi kết nối đến server");
        }
    };
    const handleResult = () => {
        navigation.navigate('Register');
    };
    const handleResulttt = () => {
        navigation.navigate('ReSetPw');
    };


    return (
        <View style={styles.container}>

            <Image
                source={require('../assets/img/noodle.png')}
                style={styles.banner}
            />

            <View style={styles.inputContent}>
                <View style={styles.formBox}>
                    <Text style={styles.title} >Welcome!</Text>
                    <Text style={styles.lable}>Username</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person" size={20} color="#000" />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Username "
                            placeholderTextColor="#C0C0C0"
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>
                    <Text style={styles.lable}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="key-sharp" size={20} color="#000" />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Password"
                            placeholderTextColor="#C0C0C0"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Ionicons name="eye-off" size={20} color="#000" />
                    </View>
                    <TouchableOpacity
                        onPress={() => handleResulttt()}
                    >
                        <Text style={styles.btnReset}> Reset you password!</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}
                        onPress={handleLogin}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                   
                    <TouchableOpacity
                        onPress={() => handleResult()}
                    >
                        <Text style={styles.btnRis}> Register an account</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    banner: {
        width: 400,
        height: 200
    },
    inputContent: {
        flex: 1,
        width: 400,
        backgroundColor: '#fff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'center',
        marginTop: -20
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 70,
    },
    lable: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5
    },
    btn: {
        backgroundColor: '#5CC1D6',
        padding: 15,
        marginTop: 20,
        borderRadius: 20,
        width: 350,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,

    },
    input: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
    inputIcon: {
        width: 20,
        height: 19,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    btnRis:{
        color: '#5CC1D6',
        fontSize: 18,
        marginLeft: 90,
        marginTop: 10
    },
    btnReset:{
        color: '#000',
        fontSize: 14,
        marginLeft: 190,
        marginBottom: 10
    },
    backButton: {
        marginRight: 300,
        marginTop: 200

    },
    backArrow: {
        width: 30,
        height: 30
    }
});
