import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    TextStyle, ViewStyle, StyleProp,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
    AnimatedStyle,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {
    GameResponse,
    GameTableResponse,
    GameObjectResponse,
    BonusType,
    ObstacleType,
    RewardType,
    Extension,
    PlayerLetter,
    GameTableScreenProps,
} from './types';

interface GameConfirmingRequest {
    gameId: number;
    userId: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function GameTableScreen({ route, navigation }: GameTableScreenProps) {
    const { gameId, userId, gameData, gameTable: initialGameTable } = route.params;
    const [gameTable, setGameTable] = useState<(GameObjectResponse | null)[][]>(
        initialGameTable.gameObjects
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [extensions, setExtensions] = useState<Extension[]>([]);
    const [activeEffects, setActiveEffects] = useState<string[]>([]);
    const [selectedLetters, setSelectedLetters] = useState<GameObjectResponse[]>([]);
    const [scoreMultiplier, setScoreMultiplier] = useState(1);
    const [wordMultiplier, setWordMultiplier] = useState(1);
    const [bannedZones, setBannedZones] = useState<string[]>([]);
    const [isUserTurn, setIsUserTurn] = useState(false);
    const [playerLetters, setPlayerLetters] = useState<PlayerLetter[]>([]);
    const [selectedPlayerLetter, setSelectedPlayerLetter] = useState<string | null>(null);
    const [isUserGrantExtraTurn, setIsUserGrantExtraTurn] = useState(false);
    const [isUserHasPointDivision, setIsUserHasPointDivision] = useState(false);
    const [isUserHasPointTransfer, setIsUserHasPointTransfer] = useState(false);
    const [isUserHasReplaceLetters, setIsUserHasReplaceLetters] = useState(false);
    const [isUserHasCancelWord, setIsUserHasCancelWord] = useState(false);
    const [usedLettersInTurn, setUsedLettersInTurn] = useState<string[]>([]);

    // Drag & Drop States
    const dragX = useSharedValue(0);
    const dragY = useSharedValue(0);
    const [draggedLetter, setDraggedLetter] = useState<PlayerLetter | null>(null);
    const [showDragPreview, setShowDragPreview] = useState(false);

    // const animatedStyle = useAnimatedStyle(() => {
    //     return {
    //         transform: [
    //             { translateX: withSpring(dragX.value - 25) },
    //             { translateY: withSpring(dragY.value - 25) }
    //         ],
    //         opacity: showDragPreview ? 1 : 0
    //     };
    // });

    const animatedStyle = useAnimatedStyle<any>(() => {
        'worklet';
        return {
            transform: [
                { translateX: withSpring(dragX.value - 25) },
                { translateY: withSpring(dragY.value - 25) }
            ],
            opacity: showDragPreview ? 1 : 0
        };
    });


    useEffect(() => {
        const initializeGame = async () => {
            await fetchGameTable();
            await fetchExtensions();
            await checkUserTurn();
            await letterControl();
            await fetchPlayerLetters();
        };
        initializeGame();
    }, [gameId]);

    const checkUserTurn = async () => {
        try {
            const response = await fetch(
                `http://localhost:8084/v1/api/game/get-current-user-id/${gameId}`
            );
            if (!response.ok) throw new Error('Sıra bilgisi alınamadı');
            const currentUserId = await response.json();
            setIsUserTurn(currentUserId === userId);
        } catch (error) {
            Alert.alert('Hata', error.message);
            setIsUserTurn(false);
        }
    };

    const letterControl = async () => {
        try {
            const response = await fetch(
                `http://localhost:8084/v1/api/game/letter-control/${userId}`
            );
            if (!response.ok) throw new Error('Harf kontrolü başarısız');
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };

    const fetchPlayerLetters = async () => {
        try {
            const response = await fetch(
                `http://localhost:8084/v1/api/game/get-letters?gid=${gameId}&uid=${userId}`
            );
            if (!response.ok) throw new Error('Harfler alınamadı');

            const data = await response.json();
            const letters = data.map((item: any) => ({
                letter: item.gameLetter.letter.toUpperCase(),
                point: item.gameLetter.point,
                isActive: item.isActive,
            }));

            setPlayerLetters(letters);
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };

    const fetchExtensions = async () => {
        try {
            const response = await fetch(
                `http://localhost:8084/v1/api/extension/get-all?gid=${gameId}&uid=${userId}`
            );

            if (!response.ok) throw new Error('Extension bilgileri alınamadı');

            const data: Extension[] = await response.json();
            setExtensions(data);
            await checkActiveExtensions(data);
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };

    const checkActiveExtensions = async (extensions: Extension[]) => {
        const activeOnes = extensions.filter((ext) => ext.isActive);
        const effects: string[] = [];

        for (const ext of activeOnes) {
            const type = classifyExtension(ext.name);
            try {
                switch (type) {
                    case 'BONUS':
                        await handleBonus(ext.name);
                        break;
                    case 'OBSTACLE':
                        await handleObstacle(ext.name);
                        break;
                    case 'REWARD':
                        await handleReward(ext.name);
                        break;
                }

                const response = await fetch(
                    `http://localhost:8084/v1/api/extension/make-passive/${ext.id}`,
                    {
                        method: 'PUT',
                    }
                );

                if (!response.ok) throw new Error('Extension pasif hale getirilemedi');
                effects.push(ext.name);
            } catch (error) {
                Alert.alert('Hata', error.message);
            }
        }

        setActiveEffects(effects);
    };

    const classifyExtension = (name: string): 'BONUS' | 'OBSTACLE' | 'REWARD' => {
        if (Object.values(BonusType).includes(name as BonusType)) return 'BONUS';
        if (Object.values(ObstacleType).includes(name as ObstacleType)) return 'OBSTACLE';
        if (Object.values(RewardType).includes(name as RewardType)) return 'REWARD';
        return 'BONUS';
    };

    const handleBonus = async (name: string) => {
        switch (name) {
            case BonusType.LETTER_2:
                setScoreMultiplier(2);
                break;
            case BonusType.LETTER_3:
                setScoreMultiplier(3);
                break;
            case BonusType.WORD_2:
                setWordMultiplier(2);
                break;
            case BonusType.WORD_3:
                setWordMultiplier(3);
                break;
            case BonusType.JOKER:
                await handleJoker();
                break;
        }
    };

    const handleJoker = async () => {
        const jokerLetter = await new Promise<string>((resolve) => {
            Alert.prompt('Joker Kullan', 'Bir harf seçin:', (text) =>
                resolve(text?.toUpperCase() || '')
            );
        });

        if (jokerLetter) {
            try {
                await fetch(`http://localhost:8084/v1/api/game/use-joker`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ gameId, userId, letter: jokerLetter }),
                });
                Alert.alert('Joker Kullanıldı', `Seçilen harf: ${jokerLetter}`);
            } catch (error) {
                Alert.alert('Hata', 'Joker kullanılamadı');
            }
        }
    };

    const handleObstacle = async (name: string) => {
        switch (name) {
            case ObstacleType.POINT_DIVISION:
                setIsUserHasPointDivision(true);
                break;
            case ObstacleType.POINT_TRANSFER:
                setIsUserHasPointTransfer(true);
                break;
            case ObstacleType.LETTER_LOSE:
                setIsUserHasReplaceLetters(true);
                break;
            case ObstacleType.EXTRA_MOVEMENT_OBSTACLE:
                resetMultipliers();
                break;
            case ObstacleType.WORD_CANCEL:
                setIsUserHasCancelWord(true);
                break;
        }
    };

    const calculateScore = (): number => {
        return (
            selectedLetters.reduce((sum, letter) => sum + (letter.point || 0), 0) *
            scoreMultiplier *
            wordMultiplier
        );
    };

    const resetMultipliers = () => {
        setScoreMultiplier(1);
        setWordMultiplier(1);
        Alert.alert('Çarpanlar Sıfırlandı', 'Tüm özel çarpanlar iptal edildi');
    };

    const handleReward = async (name: string) => {
        switch (name) {
            case RewardType.LETTER_BAN:
                await banLetters();
                break;
            case RewardType.EXTRA_MOVEMENT:
                setIsUserGrantExtraTurn(true);
                break;
        }
    };

    const banLetters = async () => {
        try {
            const response = await fetch(
                `http://localhost:8084/v1/api/game/get-opponent-letters/${userId}`
            );
            if (!response.ok) throw new Error('Rakip harfleri alınamadı');

            const lettersData = await response.json();
            const opponentLetters = lettersData.map(
                (item: any) => item.gameLetter.letter.toUpperCase()
            );

            const selected = await new Promise<string[]>((resolve, reject) => {
                let selection: string[] = [];
                const alertButtons = opponentLetters.map((letter: string) => ({
                    text: letter,
                    onPress: () => {
                        if (!selection.includes(letter)) {
                            selection = [...selection, letter];
                            if (selection.length === 2) resolve(selection);
                        }
                    },
                }));

                alertButtons.push({
                    text: 'İptal',
                    onPress: () => reject(new Error('Seçim iptal edildi')),
                    style: 'cancel',
                });

                Alert.alert(
                    'Harf Seçimi',
                    'Yasaklamak için 2 harf seçin:',
                    alertButtons,
                    { cancelable: true }
                );
            });

            const banResponse = await fetch(
                'http://localhost:8084/v1/api/game/ban-opponent-letters',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        uid: userId,
                        letter1: selected[0],
                        letter2: selected[1],
                    }),
                }
            );

            if (!banResponse.ok) throw new Error('Harfler yasaklanamadı');
            Alert.alert('Başarılı', 'Harfler başarıyla yasaklandı!');
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };

    const handleCellPress = (cell: GameObjectResponse | null) => {
        if (!cell || !isUserTurn) {
            if (!isUserTurn && cell) Alert.alert('Hata', 'Şu an sıra sizde değil!');
            return;
        }

        if (selectedPlayerLetter && cell.type === 'Empty') {
            const newLetter: GameObjectResponse = {
                ...cell,
                id: Date.now().toString(),
                type: 'GameLetter',
                letter: selectedPlayerLetter,
                point: playerLetters.find((l) => l.letter === selectedPlayerLetter)?.point || 0,
                isClicked: true,
                bonusType: undefined,
                obstacleType: undefined,
                rewardType: undefined,
            };

            const newGameTable = gameTable.map((row) => [...row]);
            newGameTable[cell.row][cell.column] = newLetter;
            setGameTable(newGameTable);

            setPlayerLetters((prev) =>
                prev.map((l) =>
                    l.letter === selectedPlayerLetter ? { ...l, isActive: false } : l
                )
            );

            setSelectedPlayerLetter(null);
            setUsedLettersInTurn([...usedLettersInTurn, selectedPlayerLetter]);
        } else if (!selectedPlayerLetter && cell.type === 'GameLetter') {
            if (isZoneBanned(cell.column)) {
                Alert.alert('Yasaklı Bölge', 'Bu bölgeye hamle yapamazsınız!');
                return;
            }

            if (!cell.isClicked) {
                setSelectedLetters([...selectedLetters, cell]);
            }
        }
    };

    const isZoneBanned = (column: number): boolean => {
        const zone = column < 7 ? 'left' : 'right';
        return bannedZones.includes(zone);
    };

    const fetchGameTable = async () => {
        setLoading(true);
        const tableId = route.params.gameTable.id;
        try {
            const response = await fetch(`http://localhost:8084/v1/api.table/get/${tableId}`);
            const data: GameTableResponse = await response.json();
            setGameTable(data.gameObjects);
        } catch (err: any) {
            setError(err.message || 'Oyun tahtası yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handlePass = async () => {
        if (!isUserTurn) {
            Alert.alert('Hata', 'Şu an sıra sizde değil!');
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8084/v1/api/game/pass?gid=${gameId}&uid=${userId}`
            );
            if (!response.ok) throw new Error('Pas geçilemedi');
            await handleTurnChange();
        } catch (error: any) {
            Alert.alert('Hata', error.message);
        }
    };

    const handleConfirm = async () => {
        if (!isUserTurn) {
            Alert.alert('Hata', 'Şu an sıra sizde değil!');
            return;
        }

        try {
            const word = selectedLetters.map((letter) => letter.letter).join('');
            const usedLettersFromThisRound = usedLettersInTurn.join(',');
            const letterAndPostionList = selectedLetters.map((letter) => [
                letter.letter,
                [letter.row, letter.column],
            ]);

            const response = await fetch(`http://localhost:8084/v1/api/game/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    gameId,
                    word,
                    usedLettersFromThisRound,
                    letterAndPostionList,
                    isUserGrantExtraTurn,
                    isUserHasPointDivision,
                    isUserHasPointTransfer,
                    isUserHasReplaceLetters,
                    isUserHasCancelWord,
                }),
            });

            if (!response.ok) throw new Error('Onaylama başarısız');
            await handleTurnChange();
            Alert.alert('Başarılı', 'Kelimeniz onaylandı!');
        } catch (error: any) {
            Alert.alert('Hata', error.message);
        }
    };

    const handleTurnChange = async () => {
        setSelectedLetters([]);
        await fetchExtensions();
        await fetchGameTable();
        await checkUserTurn();
        await fetchPlayerLetters();
    };

    const handleSurrender = async () => {
        if (!isUserTurn) {
            Alert.alert('Hata', 'Şu an sıra sizde değil!');
            return;
        }

        Alert.alert('Oyundan Çekil', 'Emin misiniz?', [
            { text: 'Vazgeç', style: 'cancel' },
            {
                text: 'Evet',
                onPress: async () => {
                    try {
                        await fetch(
                            `http://localhost:8084/v1/api/game/surrender?gid=${gameId}&uid=${userId}`
                        );
                        navigation.goBack();
                    } catch (error) {
                        Alert.alert('Hata', 'Çekilme işlemi başarısız');
                    }
                },
            },
        ]);
    };

    // Drag & Drop Handlers
    const handleDragLetter = (letter: PlayerLetter) => {
        if (!letter.isActive || !isUserTurn) return;
        setDraggedLetter(letter);
        setShowDragPreview(true);
    };

    const handleDropLetter = (cell: GameObjectResponse | null) => {
        if (!draggedLetter || !cell || !isUserTurn) return;

        if (cell.type === 'Empty') {
            const newLetter: GameObjectResponse = {
                ...cell,
                type: 'GameLetter',
                letter: draggedLetter.letter,
                point: draggedLetter.point,
                isClicked: true,
                bonusType: undefined,
                obstacleType: undefined,
                rewardType: undefined,
            };

            const newGameTable = gameTable.map((row) => [...row]);
            newGameTable[cell.row][cell.column] = newLetter;
            setGameTable(newGameTable);

            setPlayerLetters((prev) =>
                prev.map((l) =>
                    l.letter === draggedLetter.letter ? { ...l, isActive: false } : l
                )
            );

            setUsedLettersInTurn([...usedLettersInTurn, draggedLetter.letter]);
        }

        setShowDragPreview(false);
        setDraggedLetter(null);
    };

    const renderCell = (cell: GameObjectResponse | null, rowIdx: number, colIdx: number) => {
        if (!cell || cell.type === 'Empty') {
            return (
                <PanGestureHandler
                    key={`drop-${rowIdx}-${colIdx}`}
                    onHandlerStateChange={({ nativeEvent }) => {
                        if (nativeEvent.state === State.END) {
                            handleDropLetter(cell);
                        }
                    }}
                >
                    <View>
                        <TouchableOpacity
                            key={`${rowIdx}-${colIdx}`}
                            style={[styles.cell, styles.emptyCell]}
                            onPress={() => handleCellPress(cell)}
                            disabled={!isUserTurn}
                        />
                    </View>
                </PanGestureHandler>
            );
        }

        let cellStyle = {};
        let cellText = '';

        switch (cell.type) {
            case 'GameLetter':
                cellStyle = {
                    backgroundColor: cell.isClicked ? '#4CAF50' : '#81C784',
                    borderColor: '#000',
                };
                cellText = cell.letter?.toUpperCase() || '';
                break;
            case 'Bonus':
                cellStyle = styles.bonusCell;
                switch (cell.bonusType) {
                    case BonusType.LETTER_2:
                        cellText = 'L2';
                        break;
                    case BonusType.LETTER_3:
                        cellText = 'L3';
                        break;
                    case BonusType.WORD_2:
                        cellText = 'W2';
                        break;
                    case BonusType.WORD_3:
                        cellText = 'W3';
                        break;
                    default:
                        cellText = 'B';
                }
                break;
            case 'Obstacle':
                cellStyle = { backgroundColor: '#F44336', borderColor: '#000' };
                cellText = 'O';
                break;
            case 'Reward':
                cellStyle = { backgroundColor: '#2196F3', borderColor: '#000' };
                cellText = 'R';
                break;
        }

        return (
            <PanGestureHandler
                key={`drop-${rowIdx}-${colIdx}`}
                onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === State.END) {
                        handleDropLetter(cell);
                    }
                }}
            >
                <View>
                    <TouchableOpacity
                        style={[styles.cell, cellStyle]}
                        onPress={() => handleCellPress(cell)}
                        disabled={!isUserTurn || cell.type !== 'Empty'}
                    >
                        <Text style={styles.cellText}>{cellText}</Text>
                    </TouchableOpacity>
                </View>
            </PanGestureHandler>
        );
    };

    // Move the renderPlayerLetters function inside the component
    const renderPlayerLetters = () => (
        <ScrollView
            horizontal
            style={styles.lettersContainer}
            contentContainerStyle={styles.lettersContent}
        >
            {playerLetters.map((letter, index) => (
                <PanGestureHandler
                    key={`drag-${index}`}
                    onGestureEvent={({ nativeEvent }) => {
                        dragX.value = nativeEvent.absoluteX;
                        dragY.value = nativeEvent.absoluteY;
                    }}
                    onHandlerStateChange={({ nativeEvent }) => {
                        if (nativeEvent.state === State.BEGAN) {
                            handleDragLetter(letter);
                        }
                        if (nativeEvent.state === State.END) {
                            setShowDragPreview(false);
                        }
                    }}
                >
                    <Animated.View>
                        <TouchableOpacity
                            style={[
                                styles.letterBox,
                                !letter.isActive && styles.inactiveLetter,
                                selectedPlayerLetter === letter.letter && styles.selectedLetter
                            ]}
                            onPress={() => {
                                if (letter.isActive) {
                                    setSelectedPlayerLetter(prev =>
                                        prev === letter.letter ? null : letter.letter
                                    );
                                }
                            }}
                            disabled={!letter.isActive}
                        >
                            <Text style={styles.letterText}>{letter.letter}</Text>
                            <Text style={styles.pointText}>{letter.point}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </PanGestureHandler>
            ))}
        </ScrollView>
    );

    return (
        <View style={styles.mainContainer}>
            <Animated.View style={[styles.draggedLetterPreview, animatedStyle]}>
                <Text style={styles.draggedLetterText}>{draggedLetter?.letter}</Text>
            </Animated.View>

            <ScrollView
                contentContainerStyle={styles.container}
                maximumZoomScale={2.0}
                minimumZoomScale={0.5}
            >
                {gameTable.map((row, rowIdx) => (
                    <View key={`row-${rowIdx}`} style={styles.row}>
                        {row.map((cell, colIdx) => renderCell(cell, rowIdx, colIdx))}
                    </View>
                ))}
            </ScrollView>

            {renderPlayerLetters()}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.passButton,
                        !isUserTurn && styles.disabledButton,
                    ]}
                    onPress={isUserTurn ? handlePass : undefined}
                    disabled={!isUserTurn}
                >
                    <Text style={styles.buttonText}>Pas Geç</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.confirmButton,
                        !isUserTurn && styles.disabledButton,
                    ]}
                    onPress={isUserTurn ? handleConfirm : undefined}
                    disabled={!isUserTurn}
                >
                    <Text style={styles.buttonText}>Onayla</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.surrenderButton,
                        !isUserTurn && styles.disabledButton,
                    ]}
                    onPress={isUserTurn ? handleSurrender : undefined}
                    disabled={!isUserTurn}
                >
                    <Text style={styles.buttonText}>Çekil</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.effectContainer}>
                {activeEffects.map((effect, index) => (
                    <Text key={index} style={styles.effectText}>
                        ⚡ {effect}
                    </Text>
                ))}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        padding: 10,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 35,
        height: 35,
        margin: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#000',
    },
    emptyCell: {
        backgroundColor: '#FFFFFF',
        borderColor: '#000',
    },
    bonusCell: {
        backgroundColor: '#FF9800',
        borderColor: '#000',
    },
    cellText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    } as TextStyle,
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        fontSize: 18,
        padding: 20,
        textAlign: 'center',
    } as TextStyle,
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#9E9E9E',
        opacity: 0.6,
    },
    passButton: {
        backgroundColor: '#2196F3',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
    surrenderButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    } as TextStyle,
    effectContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    effectText: {
        color: '#4CAF50',
        fontSize: 12,
        marginVertical: 2,
    } as TextStyle,
    lettersContainer: {
        maxHeight: 80,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    lettersContent: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    letterBox: {
        width: 50,
        height: 60,
        marginHorizontal: 3,
        backgroundColor: '#81C784',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        elevation: 2,
    },
    inactiveLetter: {
        backgroundColor: '#BDBDBD',
        opacity: 0.6,
    },
    selectedLetter: {
        borderColor: '#FFD700',
        borderWidth: 2,
    },
    letterText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    } as TextStyle,
    pointText: {
        position: 'absolute',
        bottom: 3,
        right: 5,
        fontSize: 12,
        color: '#fff',
    },
    draggedLetterPreview: {
        position: 'absolute',
        zIndex: 1000,
        width: 50,
        height: 60,
        backgroundColor: '#81C784',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    draggedLetterText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    } as TextStyle,
});