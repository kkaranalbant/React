import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ActivityIndicator,
    Alert, TextStyle
} from 'react-native';
import GameTableScreen from './GameTableScreen';
import {
    User,
    GameObjectResponse,
    GameTableResponse,
    GameResponse
} from './types'


export default function JoinGameScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [gameData, setGameData] = useState<GameResponse | null>(null);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState<number | null>(1);


    const handleJoinGame = async () => {
        if (!userId) {
            Alert.alert('Hata', 'Kullanıcı kimliği bulunamadı');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Aktif oyun ID'sini bul
            const activeGameRes = await fetch("http://localhost:8084/v1/api/game/find-active-game", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials : "include"
            });

            if (!activeGameRes.ok) throw new Error('Aktif oyun sorgulama hatası');

            const gameId = await activeGameRes.json();

            if (!gameId) {
                setError('Devam eden bir oyununuz bulunmamaktadır');
                return;
            }

            // Oyun detaylarını getir
            const gameDetailsRes = await fetch(
                `http://localhost:8084/v1/api/game/get/${gameId}`
            );

            if (!gameDetailsRes.ok) throw new Error('Oyun detayları alınamadı');

            const gameData: GameResponse = await gameDetailsRes.json();

            // Oyun durum kontrolü
            if (gameData.gameStatus === 'FINISHED') {
                throw new Error('Bu oyun sona ermiş');
            }

            // Kullanıcı yetki kontrolü
            if (gameData.user1.id !== userId && gameData.user2.id !== userId) {
                throw new Error('Bu oyuna erişim izniniz yok');
            }

            setGameData(gameData);

        } catch (error) {
            setError(error.message);
            Alert.alert('Hata', error.message);
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

    if (gameData) {
        return (
            <GameTableScreen
                navigation={navigation}
                route={{
                    params: {
                        gameId: gameData.id,
                        userId: userId!,
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
                <ActivityIndicator size="large" color="#4CAF50" />
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