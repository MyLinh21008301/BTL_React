import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function ResetPassword({ navigation }) {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const handleResetPassword = async () => {
      if (!username || !newPassword || !confirmPassword) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }
  
      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3000/api/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, newPassword }), // Chỉ gửi gmail và newPassword
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Alert.alert("Success", "Password reset successfully!");
          navigation.navigate("Login"); // Điều hướng về trang đăng nhập
        } else {
          Alert.alert("Error", data.message || "Failed to reset password.");
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        Alert.alert("Error", "An error occurred while connecting to the server.");
      }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.btn} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    btn: {
        backgroundColor: '#5CC1D6',
        padding: 15,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
