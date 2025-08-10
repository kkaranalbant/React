import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TextStyle,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameTableScreen from './GameTableScreen';
import {GameResponse} from './types';

export default function JoinGameScreen({navigation}) {
    const [loading, setLoading] = useState(false);
    const [gameData, setGameData] = useState<GameResponse | null>(null);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const userIdRef = useRef<number | null>(null);

    // Update ref whenever userId changes
    useEffect(() => {
        userIdRef.current = userId;
    }, [userId]);

    // Check user session using AsyncStorage
    useEffect(() => {
        const checkAndUpdateUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');

                if (storedUserId) {
                    const newUserId = parseInt(storedUserId, 10);

                    if (newUserId !== userIdRef.current) {
                        setUserId(newUserId);
                        if (userIdRef.current !== null) {
                            Alert.alert('Bilgi', 'Kullanıcı oturumu güncellendi');
                        }
                    }
                } else {
                    Alert.alert('Hata', 'Oturum açmanız gerekiyor');
                    navigation.navigate('Login');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
                Alert.alert('Hata', 'Kullanıcı bilgisi okuma hatası: ' + errorMessage);
            }
        };

        // Initial check
        checkAndUpdateUserId();

        // Check every 10 seconds
        const interval = setInterval(checkAndUpdateUserId, 10000);

        // Cleanup
        return () => {
            clearInterval(interval);
        };
    }, [navigation]);

    const handleJoinGame = async () => {
        if (!userId) {
            Alert.alert('Hata', 'Kullanıcı kimliği bulunamadı');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // API sunucu adresini platform'a göre ayarla
            // Android emülatör localhost için 10.0.2.2 adresini kullanır
            const apiBaseUrl = Platform.OS === 'android'
                ? 'http://10.0.2.2:8084/v1/api'  // Android emülatör için
                : 'http://localhost:8084/v1/api'; // iOS için

            const authToken = await AsyncStorage.getItem('authToken');

            const headers = {
                "Content-Type": "application/json"
            };

            if (authToken) {
                headers["Authorization"] = `Bearer ${authToken}`;
            }

            const activeGameRes = await fetch(`${apiBaseUrl}/game/find-active-game`, {
                method: "GET",
                headers: headers
            });

            if (!activeGameRes.ok) throw new Error('Aktif oyun sorgulama hatası');

            const gameId = await activeGameRes.json();

            if (!gameId) {
                setError('Devam eden bir oyununuz bulunmamaktadır');
                setLoading(false);
                return;
            }

            const gameDetailsRes = await fetch(
                `${apiBaseUrl}/game/get/${gameId}`,
                {
                    headers: headers
                }
            );

            if (!gameDetailsRes.ok) throw new Error('Oyun detayları alınamadı');

            const gameData: GameResponse = await gameDetailsRes.json();

            if (gameData.gameStatus === 'FINISHED') {
                throw new Error('Bu oyun sona ermiş');
            }

            if (gameData.user1.id !== userId && gameData.user2.id !== userId) {
                throw new Error('Bu oyuna erişim izniniz yok');
            }

            setGameData(gameData);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
            setError(errorMessage);
            Alert.alert('Hata', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const renderGameInfo = () => {
        if (!gameData) return null;

        return (
            <View style={styles.gameInfoContainer}>
                <Text style={styles.gameInfoText}>
                    Oyun Modu: {gameData.gameMode}
                </Text>
                <Text style={styles.gameInfoText}>
                    Skor: {gameData.user1.username} {gameData.user1Score} - {gameData.user2Score} {gameData.user2.username}
                </Text>
                <Text style={styles.gameInfoText}>
                    Sıra: {gameData.currentUser.username}
                </Text>
            </View>
        );
    };

    if (!userId) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4CAF50"/>
                <Text style={styles.infoText}>Kullanıcı bilgileri yükleniyor...</Text>
            </View>
        );
    }

    if (gameData) {
        return (
            <GameTableScreen
                navigation={navigation}
                route={{
                    params: {
                        gameId: gameData.id,
                        userId: userId,
                        gameData: gameData,
                        gameTable: gameData.gameTableResponse
                    }
                }}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Aktif Oyununuza Katılın</Text>

            {renderGameInfo()}

            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50"/>
            ) : (
                <Button
                    title="Oyuna Katıl"
                    onPress={handleJoinGame}
                    color="#4CAF50"
                />
            )}

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <Text style={styles.infoText}>
                    {userId ? 'Aktif oyununuzu yüklemek için butona basın' : 'Giriş yapmanız gerekiyor'}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    } as TextStyle,
    gameInfoContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    gameInfoText: {
        fontSize: 16,
        color: '#666',
        marginVertical: 5,
    } as TextStyle,
    errorText: {
        color: '#ff4444',
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    } as TextStyle,
    infoText: {
        color: '#666',
        marginTop: 20,
        fontSize: 14,
        textAlign: 'center',
    } as TextStyle,
});