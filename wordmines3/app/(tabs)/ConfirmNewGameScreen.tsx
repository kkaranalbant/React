// ConfirmNewGameScreen.tsx
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TextStyle} from 'react-native';

interface NewGameConfirmingRequest {
    approvalId: string;
    approvedId: string;
    gameMode: string;
}

const ConfirmNewGameScreen = () => {
    const [request, setRequest] = useState<NewGameConfirmingRequest>({
        approvalId: '',
        approvedId: '',
        gameMode: 'CLASSIC' // Varsayılan mod
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const handleSubmit = async () => {
        // Validasyon
        if (!request.approvalId || !request.approvedId || !request.gameMode) {
            Alert.alert('Hata', 'Tüm alanlar zorunludur!');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://10.0.2.2:8080/v1/api/game/confirm-new-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    approvalId: Number(request.approvalId),
                    approvedId: Number(request.approvedId),
                    gameMode: request.gameMode
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setMessageType('success');
            setMessage('Oyun başarıyla oluşturuldu!');
        } catch (error) {
            setMessageType('error');
            setMessage(error.message || 'İstek gönderilirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Yeni Oyun Onayı</Text>

            <TextInput
                style={styles.input}
                placeholder="Onaylayan ID"
                keyboardType="numeric"
                value={request.approvalId}
                onChangeText={(text) => setRequest({...request, approvalId: text})}
            />

            <TextInput
                style={styles.input}
                placeholder="Onaylanan ID"
                keyboardType="numeric"
                value={request.approvedId}
                onChangeText={(text) => setRequest({...request, approvedId: text})}
            />

            <Text style={styles.label}>Oyun Modu:</Text>
            <View style={styles.pickerContainer}>
                <Button
                    title="CLASSIC"
                    onPress={() => setRequest({...request, gameMode: 'CLASSIC'})}
                    color={request.gameMode === 'CLASSIC' ? '#4CAF50' : '#888'}
                />
                <Button
                    title="TIMED"
                    onPress={() => setRequest({...request, gameMode: 'TIMED'})}
                    color={request.gameMode === 'TIMED' ? '#2196F3' : '#888'}
                />
                {/* Diğer modlar eklenebilir */}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff"/>
            ) : (
                <Button title="Gönder" onPress={handleSubmit}/>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    } as TextStyle,
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    } as TextStyle,
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    message: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
    },
    success: {
        backgroundColor: '#d4edda',
        color: '#155724',
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
    },
});

export default ConfirmNewGameScreen;