// // Login.tsx
// import React, { useState } from 'react';
// import { StyleSheet, View, TextInput, Button, Alert, Text, TextStyle, ViewStyle } from 'react-native';
//
// interface LoginRequest {
//     username: string;
//     password: string;
// }
//
// const Login = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//
//     const handleLogin = async () => {
//         if (!username || !password) {
//             Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
//             return;
//         }
//
//         setLoading(true);
//
//         try {
//             const response = await fetch('http://localhost:8084/v1/api/user/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ username, password }),
//                 credentials: 'include'
//             });
//
//             if (!response.ok) {
//                 throw new Error(response.status === 400 ? 'Geçersiz kimlik bilgileri' : 'Giriş başarısız');
//             }
//
//             Alert.alert('Başarılı', 'Giriş yapıldı');
//             // Yönlendirme veya diğer işlemler burada yapılabilir
//
//         } catch (error) {
//             Alert.alert('Hata', error.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Giriş Yap</Text>
//
//             <TextInput
//                 style={styles.input}
//                 placeholder="Kullanıcı Adı"
//                 value={username}
//                 onChangeText={setUsername}
//                 autoCapitalize="none"
//             />
//
//             <TextInput
//                 style={styles.input}
//                 placeholder="Şifre"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry
//             />
//
//             <Button
//                 title={loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
//                 onPress={handleLogin}
//                 color="#4CAF50"
//                 disabled={loading}
//             />
//         </View>
//     );
// };
//
// interface Styles {
//     container: ViewStyle;
//     title: TextStyle;
//     input: ViewStyle & TextStyle;
// }
//
// const styles = StyleSheet.create<Styles>({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 20,
//         backgroundColor: '#ffffff',
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 30,
//         textAlign: 'center',
//         color: '#333',
//     },
//     input: {
//         height: 40,
//         borderColor: '#cccccc',
//         borderWidth: 1,
//         marginBottom: 15,
//         paddingHorizontal: 10,
//         borderRadius: 5,
//         fontSize: 16,
//     },
// });
//
// export default Login;


import React, {useState} from 'react';
import {StyleSheet, View, TextInput, Button, Alert, Text, TextStyle, ViewStyle, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginRequest {
    username: string;
    password: string;
}

const Login = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return;
        }

        setLoading(true);

        try {
            // API sunucu adresini platform'a göre ayarla
            const apiBaseUrl = Platform.OS === 'android'
                ? 'http://10.0.2.2:8084/v1/api'  // Android emülatör için
                : 'http://localhost:8084/v1/api'; // iOS için

            const response = await fetch(`${apiBaseUrl}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password})
                // 'credentials: include' özelliğini kaldırıyoruz, mobilde geçerli değil
            });

            if (!response.ok) {
                throw new Error(response.status === 400 ? 'Geçersiz kimlik bilgileri' : 'Giriş başarısız');
            }

            // Yanıt verilerini JSON olarak al
            const userData = await response.json();

            // Kullanıcı ID'sini AsyncStorage'a kaydet
            if (userData && userData.id) {
                await AsyncStorage.setItem('userId', userData.id.toString());
                console.log('userId kaydedildi:', userData.id);
            }

            // Token varsa token'ı da kaydet
            if (userData && userData.token) {
                await AsyncStorage.setItem('authToken', userData.token);
                console.log('authToken kaydedildi');
            }

            Alert.alert('Başarılı', 'Giriş yapıldı', [
                {
                    text: 'Tamam',
                    onPress: () => {
                        // Ana sayfaya yönlendir
                        navigation.navigate('JoinGame');
                    }
                }
            ]);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
            Alert.alert('Hata', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giriş Yap</Text>

            <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                title={loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                onPress={handleLogin}
                color="#4CAF50"
                disabled={loading}
            />
        </View>
    );
};

interface Styles {
    container: ViewStyle;
    title: TextStyle;
    input: ViewStyle & TextStyle;
}

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 16,
    },
});

export default Login;