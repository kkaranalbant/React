// Register.tsx
import React, {useState} from 'react';
import {StyleSheet, View, TextInput, Button, Alert, Text, TextStyle, ViewStyle} from 'react-native';

interface RegisterRequest {
    username: string;
    password: string;
    email: string;
}

const Register = ({navigation}: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleRegister = async () => {
        if (!username || !password || !email) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Hata', 'Geçersiz email formatı');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://10.0.2.2:8084/v1/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password, email}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Kayıt başarısız');
            }

            Alert.alert('Başarılı', 'Hesap oluşturuldu', [
                {text: 'Tamam', onPress: () => navigation.navigate('Login')}
            ]);

        } catch (error) {
            Alert.alert('Hata', error.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kayıt Ol</Text>

            <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
                title={loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
                onPress={handleRegister}
                color="#4CAF50"
                disabled={loading}
            />

            <Text
                style={styles.loginText}
                onPress={() => navigation.navigate('Login')}>
                Zaten hesabınız var mı? Giriş Yap
            </Text>
        </View>
    );
};

interface Styles {
    container: ViewStyle;
    title: TextStyle;
    input: ViewStyle & TextStyle;
    loginText: TextStyle;
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
    loginText: {
        marginTop: 20,
        color: '#2196F3',
        textAlign: 'center',
        fontSize: 14,
    },
});

export default Register;