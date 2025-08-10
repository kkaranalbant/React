// import React, { useState, useEffect } from 'react';
// import {
//     StyleSheet,
//     View,
//     Text,
//     ActivityIndicator,
//     ScrollView,
//     TextStyle,
//     ViewStyle,
//     TouchableOpacity
// } from 'react-native';
//
// interface User {
//     id: number;
//     username: string;
//     email: string;
//     userStatus: string;
// }
//
// interface GameResponse {
//     id: number;
//     user1: User;
//     user2: User;
//     gameMode: string;
//     gameStatus: string;
//     user1Score: number;
//     user2Score: number;
//     isUser1Won: boolean;
//     isUser2Won: boolean;
//     isTie: boolean;
//     startingTimeInMs: number;
// }
//
// interface Notification {
//     id: number;
//     sender: User;
//     receiver: User;
//     isActive: boolean;
//     isApproved: boolean;
//     gameMode: string;
// }
//
// const Info = () => {
//     const [games, setGames] = useState<GameResponse[]>([]);
//     const [userInfo, setUserInfo] = useState<User | null>(null);
//     const [notifications, setNotifications] = useState<Notification[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//
//     const getCookie = (name: string) => {
//         const value = `; ${document.cookie}`;
//         const parts = value.split(`; ${name}=`);
//         if (parts.length === 2) return parts.pop()?.split(';').shift();
//         return null;
//     };
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const userId = getCookie('id');
//
//                 if (!userId) {
//                     throw new Error('Kullanıcı oturumu bulunamadı');
//                 }
//
//                 // Fetch user data
//                 const userResponse = await fetch(`http://10.0.2.2:8084/v1/api/user/get`, {
//                     credentials: "include"
//                 });
//
//                 // Fetch games data
//                 const gamesResponse = await fetch(`http://10.0.2.2:8084/v1/api/game/get-all`, {
//                     credentials: "include"
//                 });
//
//                 // Fetch notifications
//                 const notificationsResponse = await fetch(`http://10.0.2.2:8084/v1/api/notification/get-all`, {
//                     credentials: "include"
//                 });
//
//                 if (!userResponse.ok || !gamesResponse.ok || !notificationsResponse.ok) {
//                     throw new Error('Veri alınamadı');
//                 }
//
//                 const userData: User = await userResponse.json();
//                 const gamesData: GameResponse[] = await gamesResponse.json();
//                 const notificationsData: Notification[] = await notificationsResponse.json();
//
//                 setUserInfo(userData);
//                 setGames(gamesData);
//                 setNotifications(notificationsData.filter(notification => notification.isActive));
//
//             } catch (error) {
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchData();
//     }, []);
//
//     const handleApprove = async (notificationId: number) => {
//         try {
//             const response = await fetch(`http://10.0.2.2:8084/v1/api/notification/approve/${notificationId}`, {
//                 credentials: "include"
//             });
//
//             if (response.ok) {
//                 setNotifications(prev => prev.filter(n => n.id !== notificationId));
//             } else {
//                 console.error('Onaylama işlemi başarısız');
//             }
//         } catch (error) {
//             console.error('Bildirim onaylanırken hata:', error);
//         }
//     };
//
//     const formatDate = (timestamp: number) => {
//         return new Date(timestamp).toLocaleDateString('tr-TR', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric'
//         });
//     };
//
//     const getGameStatus = (game: GameResponse) => {
//         if (game.isTie) return 'Berabere';
//         if (game.isUser1Won) return `${game.user1.username} Kazandı`;
//         if (game.isUser2Won) return `${game.user2.username} Kazandı`;
//         return 'Devam Ediyor';
//     };
//
//     if (loading) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#4CAF50"/>
//             </View>
//         );
//     }
//
//     if (error) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.errorText}>{error}</Text>
//             </View>
//         );
//     }
//
//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             {/* Kullanıcı Bilgileri */}
//             <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Kullanıcı Bilgileri</Text>
//                 <View style={styles.infoCard}>
//                     <Text style={styles.infoText}>Kullanıcı Adı: {userInfo?.username}</Text>
//                     <Text style={styles.infoText}>Email: {userInfo?.email}</Text>
//                     <Text style={styles.infoText}>Durum: {userInfo?.userStatus}</Text>
//                 </View>
//             </View>
//
//             {/* Bildirimler */}
//             <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Bildirimler</Text>
//                 {notifications.length === 0 ? (
//                     <Text style={styles.infoText}>Hiç bildirim bulunmamaktadır.</Text>
//                 ) : (
//                     notifications.map(notification => (
//                         <View key={notification.id} style={styles.notificationCard}>
//                             <Text style={styles.notificationText}>
//                                 {notification.sender.username} sizi {notification.gameMode} modunda oyuna davet etti.
//                             </Text>
//                             <TouchableOpacity
//                                 style={styles.approveButton}
//                                 onPress={() => handleApprove(notification.id)}
//                             >
//                                 <Text style={styles.approveButtonText}>Onayla</Text>
//                             </TouchableOpacity>
//                         </View>
//                     ))
//                 )}
//             </View>
//
//             {/* Oyun Geçmişi */}
//             <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Oyunlarım</Text>
//                 {games.map(game => (
//                     <View key={game.id} style={styles.gameCard}>
//                         <Text style={styles.gameMode}>{game.gameMode}</Text>
//                         <View style={styles.playersContainer}>
//                             <Text style={styles.playerText}>
//                                 {game.user1.username} vs {game.user2.username}
//                             </Text>
//                         </View>
//                         <View style={styles.scoreContainer}>
//                             <Text style={styles.scoreText}>
//                                 Skor: {game.user1Score} - {game.user2Score}
//                             </Text>
//                             <Text style={styles.statusText}>
//                                 Durum: {getGameStatus(game)}
//                             </Text>
//                         </View>
//                         <Text style={styles.dateText}>
//                             Başlangıç Tarihi: {formatDate(game.startingTimeInMs)}
//                         </Text>
//                     </View>
//                 ))}
//             </View>
//         </ScrollView>
//     );
// };
//
// interface Styles {
//     container: ViewStyle;
//     section: ViewStyle;
//     sectionTitle: TextStyle;
//     infoCard: ViewStyle;
//     gameCard: ViewStyle;
//     notificationCard: ViewStyle;
//     infoText: TextStyle;
//     errorText: TextStyle;
//     playersContainer: ViewStyle;
//     playerText: TextStyle;
//     scoreContainer: ViewStyle;
//     scoreText: TextStyle;
//     statusText: TextStyle;
//     dateText: TextStyle;
//     gameMode: TextStyle;
//     notificationText: TextStyle;
//     approveButton: ViewStyle;
//     approveButtonText: TextStyle;
// }
//
// const styles = StyleSheet.create<Styles>({
//     container: {
//         padding: 20,
//         backgroundColor: '#f5f5f5',
//     },
//     section: {
//         marginBottom: 30,
//     },
//     sectionTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 15,
//         color: '#333',
//     },
//     infoCard: {
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 15,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     gameCard: {
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 15,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     notificationCard: {
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 15,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     infoText: {
//         fontSize: 16,
//         marginBottom: 8,
//         color: '#666',
//     },
//     errorText: {
//         color: '#ff4444',
//         fontSize: 16,
//         textAlign: 'center',
//     },
//     playersContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 10,
//     },
//     playerText: {
//         fontSize: 16,
//         color: '#444',
//     },
//     scoreContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 10,
//     },
//     scoreText: {
//         fontSize: 14,
//         color: '#666',
//     },
//     statusText: {
//         fontSize: 14,
//         color: '#4CAF50',
//         fontWeight: '500',
//     },
//     dateText: {
//         fontSize: 12,
//         color: '#888',
//         textAlign: 'right',
//     },
//     gameMode: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#2196F3',
//         marginBottom: 10,
//     },
//     notificationText: {
//         fontSize: 16,
//         color: '#666',
//         marginBottom: 10,
//     },
//     approveButton: {
//         backgroundColor: '#4CAF50',
//         borderRadius: 5,
//         paddingVertical: 8,
//         paddingHorizontal: 12,
//         alignSelf: 'flex-end',
//     },
//     approveButtonText: {
//         color: 'white',
//         fontWeight: '600',
//     },
// });
//
// export default Info;


import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TextStyle,
    ViewStyle,
    TouchableOpacity,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: number;
    username: string;
    email: string;
    userStatus: string;
}

interface GameResponse {
    id: number;
    user1: User;
    user2: User;
    gameMode: string;
    gameStatus: string;
    user1Score: number;
    user2Score: number;
    isUser1Won: boolean;
    isUser2Won: boolean;
    isTie: boolean;
    startingTimeInMs: number;
}

interface Notification {
    id: number;
    sender: User;
    receiver: User;
    isActive: boolean;
    isApproved: boolean;
    gameMode: string;
}

const Info = () => {
    const [games, setGames] = useState<GameResponse[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getUserId = async () => {
        try {
            // Use AsyncStorage instead of cookies
            const userId = await AsyncStorage.getItem('userId');
            return userId;
        } catch (error) {
            console.error('Error getting userId from AsyncStorage:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = await getUserId();

                if (!userId) {
                    throw new Error('Kullanıcı oturumu bulunamadı');
                }

                // Fetch user data
                const userResponse = await fetch(`http://10.0.2.2:8084/v1/api/user/get`, {
                    headers: {
                        // Add any authentication headers needed
                        'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`
                    }
                });

                // Fetch games data
                const gamesResponse = await fetch(`http://10.0.2.2:8084/v1/api/game/get-all`, {
                    headers: {
                        'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`
                    }
                });

                // Fetch notifications
                const notificationsResponse = await fetch(`http://10.0.2.2:8084/v1/api/notification/get-all`, {
                    headers: {
                        'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`
                    }
                });

                if (!userResponse.ok) {
                    throw new Error(`Kullanıcı bilgileri alınamadı: ${userResponse.status}`);
                }

                if (!gamesResponse.ok) {
                    throw new Error(`Oyun bilgileri alınamadı: ${gamesResponse.status}`);
                }

                if (!notificationsResponse.ok) {
                    throw new Error(`Bildirimler alınamadı: ${notificationsResponse.status}`);
                }

                const userData: User = await userResponse.json();
                const gamesData: GameResponse[] = await gamesResponse.json();
                const notificationsData: Notification[] = await notificationsResponse.json();

                setUserInfo(userData);
                setGames(gamesData);
                setNotifications(notificationsData.filter(notification => notification.isActive));

            } catch (error) {
                console.error('Fetch error:', error);
                setError(error.message || 'Bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleApprove = async (notificationId: number) => {
        try {
            const response = await fetch(`http://10.0.2.2:8084/v1/api/notification/approve/${notificationId}`, {
                headers: {
                    'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
                Alert.alert('Başarılı', 'Oyun isteği onaylandı');
            } else {
                Alert.alert('Hata', 'Onaylama işlemi başarısız');
            }
        } catch (error) {
            console.error('Bildirim onaylanırken hata:', error);
            Alert.alert('Hata', 'Bildirim onaylanırken bir hata oluştu');
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getGameStatus = (game: GameResponse) => {
        if (game.isTie) return 'Berabere';
        if (game.isUser1Won) return `${game.user1.username} Kazandı`;
        if (game.isUser2Won) return `${game.user2.username} Kazandı`;
        return 'Devam Ediyor';
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4CAF50"/>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Kullanıcı Bilgileri */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Kullanıcı Bilgileri</Text>
                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>Kullanıcı Adı: {userInfo?.username}</Text>
                    <Text style={styles.infoText}>Email: {userInfo?.email}</Text>
                    <Text style={styles.infoText}>Durum: {userInfo?.userStatus}</Text>
                </View>
            </View>

            {/* Bildirimler */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bildirimler</Text>
                {notifications.length === 0 ? (
                    <Text style={styles.infoText}>Hiç bildirim bulunmamaktadır.</Text>
                ) : (
                    notifications.map(notification => (
                        <View key={notification.id} style={styles.notificationCard}>
                            <Text style={styles.notificationText}>
                                {notification.sender.username} sizi {notification.gameMode} modunda oyuna davet etti.
                            </Text>
                            <TouchableOpacity
                                style={styles.approveButton}
                                onPress={() => handleApprove(notification.id)}
                            >
                                <Text style={styles.approveButtonText}>Onayla</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>

            {/* Oyun Geçmişi */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Oyunlarım</Text>
                {games.length === 0 ? (
                    <Text style={styles.infoText}>Henüz oyun bulunamadı.</Text>
                ) : (
                    games.map(game => (
                        <View key={game.id} style={styles.gameCard}>
                            <Text style={styles.gameMode}>{game.gameMode}</Text>
                            <View style={styles.playersContainer}>
                                <Text style={styles.playerText}>
                                    {game.user1.username} vs {game.user2.username}
                                </Text>
                            </View>
                            <View style={styles.scoreContainer}>
                                <Text style={styles.scoreText}>
                                    Skor: {game.user1Score} - {game.user2Score}
                                </Text>
                                <Text style={styles.statusText}>
                                    Durum: {getGameStatus(game)}
                                </Text>
                            </View>
                            <Text style={styles.dateText}>
                                Başlangıç Tarihi: {formatDate(game.startingTimeInMs)}
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

interface Styles {
    container: ViewStyle;
    section: ViewStyle;
    sectionTitle: TextStyle;
    infoCard: ViewStyle;
    gameCard: ViewStyle;
    notificationCard: ViewStyle;
    infoText: TextStyle;
    errorText: TextStyle;
    playersContainer: ViewStyle;
    playerText: TextStyle;
    scoreContainer: ViewStyle;
    scoreText: TextStyle;
    statusText: TextStyle;
    dateText: TextStyle;
    gameMode: TextStyle;
    notificationText: TextStyle;
    approveButton: ViewStyle;
    approveButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    gameCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    notificationCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#666',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 16,
        textAlign: 'center',
    },
    playersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    playerText: {
        fontSize: 16,
        color: '#444',
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    scoreText: {
        fontSize: 14,
        color: '#666',
    },
    statusText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
    },
    gameMode: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2196F3',
        marginBottom: 10,
    },
    notificationText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    approveButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: 'flex-end',
    },
    approveButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default Info;