import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function App({ navigation, userData, setUserData }) {
    const [userName, setUserName] = useState('');
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [address, setAddress] = useState('');

    const handleCheckboxPress = () => {
        setIsChecked(!isChecked);
    };

    const handleSignUp = async () => {
        if (!userName || !gmail || !password || !address) {
            Alert.alert("Lỗi", "Hãy điền vào đầy đủ các mục!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName,
                    gmail,
                    password,
                    address
                }),
            });
                const data = await response.json();

                if(response.ok) {
                    Alert.alert("Thành công", data.message);
            navigation.navigate("Login");
        } else {
            Alert.alert("Lỗi", data.message || "Đăng ký thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi kết nối đến server");
    }
};

return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.content}>
            <Image source={require('../assets/img/iconHealthyFood.png')} style={styles.logo} />
            <Text style={styles.title}>Nice to see you!</Text>
            <Text style={styles.subtitle}>Create your account</Text>

            {/* Input tên người dùng */}
            <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#000" />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#C0C0C0"
                    value={userName}
                    onChangeText={setUserName}
                />
            </View>

            {/* Input gmail */}
            <View style={styles.inputContainer}>
                <Icon name="gmail" size={20} color="#000" />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your gmail address"
                    placeholderTextColor="#C0C0C0"
                    value={gmail}
                    onChangeText={setGmail}
                />
            </View>

            {/* Input mật khẩu */}
            <View style={styles.inputContainer}>
                <Ionicons name="key-sharp" size={20} color="#000" />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your Password"
                    placeholderTextColor="#C0C0C0"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <Ionicons name="eye-off" size={20} color="#000" />
            </View>

            {/* Input địa chỉ */}
            <View style={styles.inputContainer}>
                <Icon name="place" size={20} color="#000" />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your Address"
                    placeholderTextColor="#C0C0C0"
                    value={address}
                    onChangeText={setAddress}
                />
            </View>

            {/* Checkbox điều khoản */}
            <TouchableOpacity style={styles.checkboxContainer} onPress={handleCheckboxPress}>
                <MaterialIcons
                    name={isChecked ? "check-box" : "check-box-outline-blank"}
                    size={24}
                    color={isChecked ? "#06b6d4" : "#64748b"}
                />
                <Text style={styles.checkboxText}>
                    I agree with <Text style={styles.link}>Terms & Conditions</Text>
                </Text>
            </TouchableOpacity>

            {/* Nút Sign up */}
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
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
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    backArrow: {
        width: 40,
        height: 40,
    },
    content: {
        padding: 30,
        width: '97%',
        maxWidth: 400,

    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 30,
        marginLeft: 130,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#C0C0C0',
        marginBottom: 50,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        backgroundColor: '#f5f5f5',
        padding: 10,
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    checkboxText: {
        fontSize: 16,
    },
    link: {
        color: '#00c0ff',
    },
    button: {
        backgroundColor: '#00c0ff',
        padding: 15,
        borderRadius: 20,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
