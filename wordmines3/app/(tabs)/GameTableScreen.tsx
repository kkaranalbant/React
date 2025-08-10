import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextStyle,
} from 'react-native';
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

import { NativeStackNavigationProp } from '@react-navigation/native-stack';


interface GameConfirmingRequest {
    gameId: number;
    userId: number;
}

export default function GameTableScreen({route, navigation}: GameTableScreenProps) {
    const {gameId, userId, gameData, gameTable: initialGameTable} = route.params;
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
    const [selectedLetter, setSelectedLetter] = useState<PlayerLetter | null>(null);
    const [isUserGrantExtraTurn, setIsUserGrantExtraTurn] = useState(false);
    const [isUserHasPointDivision, setIsUserHasPointDivision] = useState(false);
    const [isUserHasPointTransfer, setIsUserHasPointTransfer] = useState(false);
    const [isUserHasReplaceLetters, setIsUserHasReplaceLetters] = useState(false);
    const [isUserHasCancelWord, setIsUserHasCancelWord] = useState(false);
    const [usedLettersInTurn, setUsedLettersInTurn] = useState<string[]>([]);
    // Yeni değişkenler
    const [lastDiscoveredObject, setLastDiscoveredObject] = useState<{
        type: string;
        name: string;
    } | null>(null);
    // Keşfedilen nesnelerin listesini tutacak yeni state
    const [discoveredObjects, setDiscoveredObjects] = useState<Array<{
        type: string;
        name: string;
    }>>([]);

    useEffect(() => {
        const initializeGame = async () => {
            await fetchGameTable();
            await fetchExtensions();
            await checkUserTurn();
            await letterControl();
            await fetchPlayerLetters();
        };
        initializeGame();

        // Set up polling for game updates every 5 seconds
        const gameUpdateInterval = setInterval(async () => {
            await fetchGameTable();
        }, 10000);

        // Clean up interval on component unmount
        return () => {
            clearInterval(gameUpdateInterval);
        };
    }, [gameId]);

    const checkUserTurn = async () => {
        try {
            const response = await fetch(
                `http://10.0.2.2:8084/v1/api/game/get-current-user-id/${gameId}`
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
                `http://10.0.2.2:8084/v1/api/game/letter-control/${userId}`
            );
            if (!response.ok) throw new Error('Harf kontrolü başarısız');
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };

    const fetchPlayerLetters = async () => {
        try {
            const response = await fetch(
                `http://10.0.2.2:8084/v1/api/game/get-letters?gid=${gameId}&uid=${userId}`
            );
            if (!response.ok) throw new Error('Harfler alınamadı');

            // Update this part to match the actual API response structure
            const data = await response.json();
            // The response is already in the correct format, no need for mapping transformation
            setPlayerLetters(data);

            // Log the received letters to verify
            console.log('Player letters loaded:', data);
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };

    const fetchExtensions = async () => {
        try {
            const response = await fetch(
                `http://10.0.2.2:8084/v1/api/extension/get-all?gid=${gameId}&uid=${userId}`
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
                    `http://10.0.2.2:8084/v1/api/extension/make-passive/${ext.id}`,
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
                await fetch(`http://10.0.2.2:8084/v1/api/game/use-joker`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({gameId, userId, letter: jokerLetter}),
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

    // Güncellenmiş puan hesaplama fonksiyonu
    const calculateScore = (letters) => {
        // Harflerin puanlarını topla
        const baseScore = letters.reduce((sum, letter) => {
            // letter.point null veya undefined ise 0 kullan
            const letterPoint = letter.point || 0;
            return sum + letterPoint;
        }, 0);

        // Çarpanları uygula
        return baseScore * scoreMultiplier * wordMultiplier;
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
                `http://10.0.2.2:8084/v1/api/game/get-opponent-letters/${userId}`
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
                    {cancelable: true}
                );
            });

            const banResponse = await fetch(
                'http://10.0.2.2:8084/v1/api/game/ban-opponent-letters',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
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

    // Komşu GameLetter kontrolü yapan yeni fonksiyon
    const hasAdjacentGameLetter = (rowIdx: number, colIdx: number): boolean => {

        const isFirstLetter = gameTable.every(row =>
            row.every(cell => !cell || cell.type !== 'GameLetter' || !cell.visible)
        );

        if (isFirstLetter) {
            return true; // Eğer oyun tablosunda hiç GameLetter yoksa, komşuluk kontrolü yapma
        }

        // Komşu hücrelerin koordinatları (8 yön: sağ, sol, yukarı, aşağı, ve 4 çapraz)
        const adjacentCells = [
            [rowIdx, colIdx + 1],     // sağ
            [rowIdx, colIdx - 1],     // sol
            [rowIdx - 1, colIdx],     // yukarı
            [rowIdx + 1, colIdx],     // aşağı
            [rowIdx - 1, colIdx + 1], // sağ yukarı çapraz
            [rowIdx - 1, colIdx - 1], // sol yukarı çapraz
            [rowIdx + 1, colIdx + 1], // sağ aşağı çapraz
            [rowIdx + 1, colIdx - 1]  // sol aşağı çapraz
        ];

        // Her komşu hücreyi kontrol et
        for (const [row, col] of adjacentCells) {
            // Oyun tablosu sınırları içinde mi?
            if (row >= 0 && row < gameTable.length && col >= 0 && col < gameTable[0].length) {
                const cell = gameTable[row][col];
                // Komşu hücre bir GameLetter mi?
                if (cell && cell.type === 'GameLetter') {
                    return true;
                }
            }
        }
        return false;
    };

    // handleCellPress fonksiyonundaki değişiklik - Engeller için state güncellemesi ekleniyor
    const handleCellPress = (rowIdx: number, colIdx: number, cell: GameObjectResponse | null) => {
        if (!isUserTurn) {
            Alert.alert('Hata', 'Şu an sıra sizde değil!');
            return;
        }

        if (selectedLetter) {
            // Eğer bir harf seçilmişse, hücreye yerleştirme işlemi yapalım

            // ÖNEMLİ: Hücrede zaten bir GameLetter varsa, harf yerleştirmeyi engelle
            if (cell && cell.type === 'GameLetter' && cell.visible) {
                Alert.alert('Hata', 'Bu hücreye zaten bir harf yerleştirilmiş!');
                return;
            }

            // Hücre boş olabilir, görünmez bir nesne olabilir veya bir bonus/obstacle/reward olabilir
            if (!cell || cell.type === 'Empty' || !cell.visible ||
                cell.type === 'Bonus' || cell.type === 'Obstacle' || cell.type === 'Reward') {

                // Komşuluk kontrolü yap - oyundaki ilk harf ise bu kontrolü atla
                const isFirstLetter = gameTable.every(row =>
                    row.every(cell => !cell || cell.type !== 'GameLetter' || !cell.visible)
                );

                if (!isFirstLetter && !hasAdjacentGameLetter(rowIdx, colIdx)) {
                    Alert.alert('Hata', 'Bu hücre mevcut harflerin yanında değil! En az bir komşu harf olmalı.');
                    return;
                }

                // Hücredeki nesneyi kontrol et
                let hiddenObject: GameObjectResponse | null = null;
                let originalType = 'Empty';
                let originalBonusType = null;
                let originalObstacleType = null;
                let originalRewardType = null;

                // Hücrede bir nesne varsa onu saklayalım (görünmez veya özel nesne)
                if (cell) {
                    hiddenObject = {...cell};
                    originalType = cell.type;
                    originalBonusType = cell.bonusType || null;
                    originalObstacleType = cell.obstacleType || null;
                    originalRewardType = cell.rewardType || null;
                }

                // Yeni harfimizi oluşturalım
                const newLetter: GameObjectResponse = {
                    id: Date.now().toString(),
                    type: 'GameLetter',
                    letter: selectedLetter.letter,
                    point: selectedLetter.point,
                    isClicked: true,
                    row: rowIdx,
                    column: colIdx,
                    bonusType: originalBonusType,
                    obstacleType: originalObstacleType,
                    rewardType: originalRewardType,
                    visible: true,
                    // Orijinal nesne bilgisini saklayalım
                    originalType: originalType
                };

                // Oyun tablosunu güncelleyelim
                const newGameTable = [...gameTable];
                newGameTable[rowIdx][colIdx] = newLetter;
                setGameTable(newGameTable);

                // Bonus hücre işlemleri - eğer bonus bir hücreye harf yerleştirilmişse
                if (originalType === 'Bonus' && originalBonusType) {
                    let bonusMessage = '';
                    switch (originalBonusType) {
                        case BonusType.LETTER_2:
                            bonusMessage = `Harf 2x: "${selectedLetter.letter}" harfi için 2 kat puan!`;
                            break;
                        case BonusType.LETTER_3:
                            bonusMessage = `Harf 3x: "${selectedLetter.letter}" harfi için 3 kat puan!`;
                            break;
                        case BonusType.WORD_2:
                            bonusMessage = 'Kelime 2x: Bu kelime için toplam puan 2 kat olacak!';
                            break;
                        case BonusType.WORD_3:
                            bonusMessage = 'Kelime 3x: Bu kelime için toplam puan 3 kat olacak!';
                            break;
                        default:
                            bonusMessage = 'Bonus hücre bulundu!';
                    }
                    Alert.alert('Bonus Hücre!', bonusMessage);
                }

                // ÖNEMLİ: Engel hücreleri için state güncellemeleri
                if (originalType === 'Obstacle' && originalObstacleType) {
                    // Engel tipine göre ilgili state'i aktifleştir
                    switch (originalObstacleType) {
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
                            resetMultipliers(); // Bu mevcut bir engel etkisi
                            break;
                        case ObstacleType.WORD_CANCEL:
                            setIsUserHasCancelWord(true);
                            break;
                    }
                }

                // ÖNEMLİ: Ödül hücreleri için state güncellemeleri
                if (originalType === 'Reward' && originalRewardType) {
                    // Ödül tipine göre ilgili state'i aktifleştir
                    switch (originalRewardType) {
                        case RewardType.EXTRA_MOVEMENT:
                            setIsUserGrantExtraTurn(true);
                            break;
                        case RewardType.LETTER_BAN:
                            // Bu hemen uygulanır, ayrı bir state'e ihtiyaç yok
                            banLetters();
                            break;
                    }
                }

                // Bir nesne üzerine koyduysak veya gizli bir nesne bulduysak, bilgilendirici mesajı gösterelim
                if (hiddenObject) {
                    let objectType = '';
                    let objectName = '';

                    if (originalType === 'Bonus' && originalBonusType) {
                        objectType = 'Bonus';
                        objectName = originalBonusType;
                        const newDiscoveredObject = {type: 'Bonus', name: originalBonusType};
                        setLastDiscoveredObject(newDiscoveredObject);
                        // Keşfedilen nesneyi listeye ekle
                        setDiscoveredObjects(prevObjects => [...prevObjects, newDiscoveredObject]);
                    } else if (originalType === 'Obstacle' && originalObstacleType) {
                        objectType = 'Engel';
                        objectName = originalObstacleType;
                        const newDiscoveredObject = {type: 'Engel', name: originalObstacleType};
                        setLastDiscoveredObject(newDiscoveredObject);
                        // Keşfedilen nesneyi listeye ekle
                        setDiscoveredObjects(prevObjects => [...prevObjects, newDiscoveredObject]);
                    } else if (originalType === 'Reward' && originalRewardType) {
                        objectType = 'Ödül';
                        objectName = originalRewardType;
                        const newDiscoveredObject = {type: 'Ödül', name: originalRewardType};
                        setLastDiscoveredObject(newDiscoveredObject);
                        // Keşfedilen nesneyi listeye ekle
                        setDiscoveredObjects(prevObjects => [...prevObjects, newDiscoveredObject]);
                    }

                    if (objectType && objectType !== 'Bonus') {
                        Alert.alert(
                            'Nesne Bulundu!',
                            `${objectType}: ${objectName}`,
                            [{text: 'Tamam'}]
                        );
                    }
                } else {
                    setLastDiscoveredObject(null);
                }

                // Oyuncunun harf listesini güncelleyelim
                setPlayerLetters(prev =>
                    prev.map(l =>
                        l.letter === selectedLetter.letter ? {...l, isActive: false} : l
                    )
                );

                // Bu turda kullanılan harfleri güncelleyelim
                setUsedLettersInTurn(prev => [...prev, selectedLetter.letter]);

                // Yeni eklenen harfi selectedLetters listesine ekleyelim
                setSelectedLetters(prev => [...prev, newLetter]);

                // Seçili harfi temizleyelim
                setSelectedLetter(null);
            } else {
                // Eğer hücre dolu ise (görünür bir harf ile), uyarı verelim
                Alert.alert('Hata', 'Bu hücre dolu! Boş bir hücre veya özel bir nesne seçin.');
            }
        } else if (cell?.type === 'GameLetter' && !cell.isClicked) {
            // Eğer seçili bir harf yoksa ve tıklanan hücrede bir harf varsa, bu harfi seçelim
            if (isZoneBanned(cell.column)) {
                Alert.alert('Yasaklı Bölge', 'Bu bölgeye hamle yapamazsınız!');
                return;
            }
            setSelectedLetters(prev => [...prev, cell]);
        }
    }

    // Helper function to get description of hidden objects
    const getHiddenObjectDescription = (obj: GameObjectResponse): string => {
        switch (obj.type) {
            case 'Bonus':
                return `Bonus Bulundu: ${obj.bonusType}`;
            case 'Obstacle':
                return `Engel Bulundu: ${obj.obstacleType}`;
            case 'Reward':
                return `Ödül Bulundu: ${obj.rewardType}`;
            default:
                return 'Gizli bir nesne bulundu!';
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
            const response = await fetch(`http://10.0.2.2:8084/v1/api.table/get/${tableId}`);
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
                `http://10.0.2.2:8084/v1/api/game/pass?gid=${gameId}&uid=${userId}`
            );
            if (!response.ok) throw new Error('Pas geçilemedi');
            await handleTurnChange();
        } catch (error: any) {
            Alert.alert('Hata', error.message);
        }
    };

    // Güncellenmiş handleConfirm fonksiyonu
    // const handleConfirm = async () => {
    //     console.log("Onayla butonu çalıştı!");
    //
    //     if (!isUserTurn) {
    //         Alert.alert('Hata', 'Şu an sıra sizde değil!');
    //         return;
    //     }
    //
    //     // Harflerin yerleştirildiğinden emin ol
    //     if (!selectedLetters || selectedLetters.length === 0) {
    //         Alert.alert('Hata', 'Lütfen önce bir kelime oluşturun!');
    //         return;
    //     }
    //
    //     try {
    //         // En son yerleştirilen harfe göre kelime oluştur
    //         const wordResult = findWordFromLastPlacedLetter();
    //
    //         if (!wordResult) {
    //             Alert.alert('Hata', 'Geçerli bir kelime bulunamadı! Harflerin yatay veya dikey bir çizgide olduğundan emin olun.');
    //             return;
    //         }
    //
    //         const word = wordResult.text;
    //         const wordLetters = wordResult.letters;
    //
    //         console.log(`Oluşturulan kelime: ${word} (${wordResult.direction})`);
    //
    //         const usedLettersFromThisRound = usedLettersInTurn.join(',');
    //         console.log("Bu turda kullanılan harfler:", usedLettersFromThisRound);
    //
    //         // Hesaplamayı yeni bulunan kelime harflerine göre yap
    //         const score = calculateScore(wordLetters);
    //         console.log("Hesaplanan puan:", score);
    //
    //         // Kelimeden oluşturulan harflerin pozisyonlarını al
    //         const letterAndPostionList = wordLetters.map((letter) => [
    //             letter.letter,
    //             letter.row,
    //             letter.column
    //         ]);
    //         console.log("Harf pozisyon listesi:", JSON.stringify(letterAndPostionList));
    //
    //         // API isteği için request body oluştur
    //         const requestBody = {
    //             userId,
    //             gameId,
    //             word,
    //             score,
    //             usedLettersFromThisRound,
    //             letterAndPostionList,
    //             isUserGrantExtraTurn,
    //             isUserHasPointDivision,
    //             isUserHasPointTransfer,
    //             isUserHasReplaceLetters,
    //             isUserHasCancelWord,
    //         };
    //         console.log("API isteği gönderiliyor:", JSON.stringify(requestBody));
    //
    //         // API isteğini gönder
    //         const response = await fetch('http://localhost:8084/v1/api/game/confirm', {
    //             method: 'POST',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify(requestBody),
    //         });
    //
    //         console.log("API yanıtı:", response.status);
    //
    //         if (!response.ok) {
    //             const errorText = await response.text();
    //             console.error("API yanıt hatası:", errorText);
    //             throw new Error(`Onaylama başarısız: ${response.status} ${errorText}`);
    //         }
    //
    //         // Başarılı işlem sonrası
    //         Alert.alert('Başarılı', `"${word}" kelimesi onaylandı!`);
    //         await handleTurnChange();
    //     } catch (error) {
    //         console.error("Onayla fonksiyonu hatası:", error.message);
    //         Alert.alert('Hata', `İşlem sırasında bir hata oluştu: ${error.message}`);
    //     }
    // };


    // Hem yatay hem dikey kelimeler için ayrı ayrı istek gönderen handleConfirm fonksiyonu
    const handleConfirm = async () => {
        console.log("Onayla butonu çalıştı!");

        if (!isUserTurn) {
            Alert.alert('Hata', 'Şu an sıra sizde değil!');
            return;
        }

        // Harflerin yerleştirildiğinden emin ol
        if (!selectedLetters || selectedLetters.length === 0) {
            Alert.alert('Hata', 'Lütfen önce bir kelime oluşturun!');
            return;
        }

        try {
            // En son yerleştirilen harfe göre yatay ve dikey kelimeleri oluştur
            const horizontalWordResult = findHorizontalWord(
                selectedLetters[selectedLetters.length - 1].row,
                selectedLetters[selectedLetters.length - 1].column
            );

            const verticalWordResult = findVerticalWord(
                selectedLetters[selectedLetters.length - 1].row,
                selectedLetters[selectedLetters.length - 1].column
            );

            // En az bir geçerli kelime olmalı
            if (!horizontalWordResult && !verticalWordResult) {
                Alert.alert('Hata', 'Geçerli bir kelime bulunamadı! Harflerin yatay veya dikey bir çizgide olduğundan emin olun.');
                return;
            }

            const usedLettersFromThisRound = usedLettersInTurn.join(',');
            let confirmedWords = [];

            // Yatay kelime için istek gönder
            if (horizontalWordResult) {
                const horizontalWord = horizontalWordResult.text;
                const horizontalLetters = horizontalWordResult.letters;

                console.log(`Yatay kelime: ${horizontalWord}`);

                // Yatay kelime için puanı hesapla
                const horizontalScore = calculateScore(horizontalLetters);

                // Yatay kelime için harf pozisyonlarını al
                const horizontalLetterPositions = horizontalLetters.map((letter) => [
                    letter.letter,
                    letter.row,
                    letter.column
                ]);

                // Yatay kelime için API isteği
                const horizontalRequestBody = {
                    userId,
                    gameId,
                    word: horizontalWord,
                    score: horizontalScore,
                    usedLettersFromThisRound,
                    letterAndPostionList: horizontalLetterPositions,
                    isUserGrantExtraTurn,
                    isUserHasPointDivision,
                    isUserHasPointTransfer,
                    isUserHasReplaceLetters,
                    isUserHasCancelWord,
                };

                console.log("Yatay kelime için API isteği gönderiliyor:", JSON.stringify(horizontalRequestBody));

                const horizontalResponse = await fetch('http://10.0.2.2:8084/v1/api/game/confirm', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(horizontalRequestBody),
                });

                console.log("Yatay kelime API yanıtı:", horizontalResponse.status);

                if (horizontalResponse.ok) {
                    confirmedWords.push(horizontalWord);
                } else {
                    const errorText = await horizontalResponse.text();
                    console.error("Yatay kelime API yanıt hatası:", errorText);
                    // Hata mesajını direkt gösterme, diğer kelime işlensin
                }
            }

            // Dikey kelime için istek gönder
            if (verticalWordResult) {
                const verticalWord = verticalWordResult.text;
                const verticalLetters = verticalWordResult.letters;

                console.log(`Dikey kelime: ${verticalWord}`);

                // Dikey kelime için puanı hesapla
                const verticalScore = calculateScore(verticalLetters);

                // Dikey kelime için harf pozisyonlarını al
                const verticalLetterPositions = verticalLetters.map((letter) => [
                    letter.letter,
                    letter.row,
                    letter.column
                ]);

                // Dikey kelime için API isteği
                const verticalRequestBody = {
                    userId,
                    gameId,
                    word: verticalWord,
                    score: verticalScore,
                    usedLettersFromThisRound,
                    letterAndPostionList: verticalLetterPositions,
                    isUserGrantExtraTurn,
                    isUserHasPointDivision,
                    isUserHasPointTransfer,
                    isUserHasReplaceLetters,
                    isUserHasCancelWord,
                };

                console.log("Dikey kelime için API isteği gönderiliyor:", JSON.stringify(verticalRequestBody));

                const verticalResponse = await fetch('http://10.0.2.2:8084/v1/api/game/confirm', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(verticalRequestBody),
                });

                console.log("Dikey kelime API yanıtı:", verticalResponse.status);

                if (verticalResponse.ok) {
                    confirmedWords.push(verticalWord);
                } else {
                    const errorText = await verticalResponse.text();
                    console.error("Dikey kelime API yanıt hatası:", errorText);
                    // Hata mesajını direkt gösterme, diğer kelime işlenmiş olabilir
                }
            }

            // Sonuçları göster
            if (confirmedWords.length > 0) {
                Alert.alert('Başarılı', `${confirmedWords.join(' ve ')} kelimesi onaylandı!`);
                await handleTurnChange();
            } else {
                Alert.alert('Hata', 'Kelimeler onaylanamadı. Lütfen tekrar deneyin.');
            }

        } catch (error) {
            console.error("Onayla fonksiyonu hatası:", error.message);
            Alert.alert('Hata', `İşlem sırasında bir hata oluştu: ${error.message}`);
        }
    };

    // Kullanıcının en son yerleştirdiği harften yatay veya dikey kelime oluşturan fonksiyon
    const findWordFromLastPlacedLetter = () => {
        // En son yerleştirilen harfi bul (en son eklenen selectedLetter)
        if (!selectedLetters || selectedLetters.length === 0) {
            console.log("Seçili harf bulunamadı");
            return null;
        }

        const lastPlacedLetter = selectedLetters[selectedLetters.length - 1];
        const row = lastPlacedLetter.row;
        const col = lastPlacedLetter.column;

        console.log(`Son yerleştirilen harf: ${lastPlacedLetter.letter} (${row},${col})`);

        // Yatay kelime oluşturma girişimi
        const horizontalWord = findHorizontalWord(row, col);

        // Dikey kelime oluşturma girişimi
        const verticalWord = findVerticalWord(row, col);

        console.log("Yatay kelime:", horizontalWord);
        console.log("Dikey kelime:", verticalWord);

        // Eğer her ikisi de varsa, daha uzun olanı döndür
        // Eşitse yatay olanı tercih et
        if (horizontalWord && verticalWord) {
            return horizontalWord.letters.length >= verticalWord.letters.length ? horizontalWord : verticalWord;
        }

        // İkisinden birini döndür (hangisi null değilse)
        return horizontalWord || verticalWord;
    };

// Yatay kelime bulma fonksiyonu
    const findHorizontalWord = (row, col) => {
        // Soldan başlayarak kelimeyi oluştur
        let startCol = col;
        while (startCol > 0) {
            const leftCell = gameTable[row][startCol - 1];
            if (leftCell && leftCell.type === 'GameLetter' && leftCell.visible) {
                startCol--;
            } else {
                break;
            }
        }

        // Sağa doğru kelimeyi topla
        let endCol = col;
        while (endCol < gameTable[0].length - 1) {
            const rightCell = gameTable[row][endCol + 1];
            if (rightCell && rightCell.type === 'GameLetter' && rightCell.visible) {
                endCol++;
            } else {
                break;
            }
        }

        // Tek bir harf varsa kelime sayılmaz
        if (startCol === endCol) {
            return null;
        }

        // Kelimeyi oluştur
        const letters = [];
        let wordText = '';

        for (let c = startCol; c <= endCol; c++) {
            const cell = gameTable[row][c];
            if (cell && cell.type === 'GameLetter' && cell.visible) {
                letters.push(cell);
                wordText += cell.letter;
            }
        }

        return {
            letters,
            text: wordText,
            direction: 'horizontal'
        };
    };

// Dikey kelime bulma fonksiyonu
    const findVerticalWord = (row, col) => {
        // Yukarıdan başlayarak kelimeyi oluştur
        let startRow = row;
        while (startRow > 0) {
            const topCell = gameTable[startRow - 1][col];
            if (topCell && topCell.type === 'GameLetter' && topCell.visible) {
                startRow--;
            } else {
                break;
            }
        }

        // Aşağıya doğru kelimeyi topla
        let endRow = row;
        while (endRow < gameTable.length - 1) {
            const bottomCell = gameTable[endRow + 1][col];
            if (bottomCell && bottomCell.type === 'GameLetter' && bottomCell.visible) {
                endRow++;
            } else {
                break;
            }
        }

        // Tek bir harf varsa kelime sayılmaz
        if (startRow === endRow) {
            return null;
        }

        // Kelimeyi oluştur
        const letters = [];
        let wordText = '';

        for (let r = startRow; r <= endRow; r++) {
            const cell = gameTable[r][col];
            if (cell && cell.type === 'GameLetter' && cell.visible) {
                letters.push(cell);
                wordText += cell.letter;
            }
        }

        return {
            letters,
            text: wordText,
            direction: 'vertical'
        };
    };

    const handleTurnChange = async () => {
        setSelectedLetters([]);
        setSelectedLetter(null);
        setUsedLettersInTurn([]);
        setLastDiscoveredObject(null);
        // Keşfedilen nesneleri sıfırlamıyoruz ki kalıcı olsun
        // setDiscoveredObjects([]);
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
            {text: 'Vazgeç', style: 'cancel'},
            {
                text: 'Evet',
                onPress: async () => {
                    try {
                        await fetch(
                            `http://10.0.2.2:8084/v1/api/game/surrender?gid=${gameId}&uid=${userId}`
                        );
                        navigation.goBack();
                    } catch (error) {
                        Alert.alert('Hata', 'Çekilme işlemi başarısız');
                    }
                },
            },
        ]);
    };

    const handleLetterSelect = (letter: PlayerLetter) => {
        if (letter.isActive && isUserTurn) {
            setSelectedLetter(prev => prev?.letter === letter.letter ? null : letter);
        }
    };

    const renderCell = (rowIdx: number, colIdx: number, cell: GameObjectResponse | null) => {
        let cellStyle = styles.emptyCell;
        let cellText = '';
        let isPressable = false;
        let additionalStyles = {};

        if (cell) {
            // Hücre görünür mü değil mi kontrol edelim
            if (!cell.visible) {
                // Görünmeyen hücreler için özel stil
                cellStyle = styles.hiddenObjectCell;
                cellText = '?';
                isPressable = !!selectedLetter; // Seçili harf varsa basılabilir
            } else {
                // Görünür hücrelerin tipine göre stil belirleyelim
                switch (cell.type) {
                    case 'GameLetter':
                        // Eğer harf bir özel hücreye yerleştirilmişse, bunu belirten bir stil ekleyelim
                        if (cell.originalType && cell.originalType !== 'Empty') {
                            let specialCellStyle = {};
                            if (cell.bonusType) {
                                specialCellStyle = styles.letterOnBonusCell;
                            } else if (cell.obstacleType) {
                                specialCellStyle = styles.letterOnObstacleCell;
                            } else if (cell.rewardType) {
                                specialCellStyle = styles.letterOnRewardCell;
                            }
                            additionalStyles = specialCellStyle;
                        }

                        cellStyle = cell.isClicked ? styles.usedLetterCell : styles.letterCell;
                        cellText = cell.letter!;
                        isPressable = !cell.isClicked;
                        break;
                    case 'Bonus':
                        cellStyle = styles.bonusCell;
                        cellText = getBonusSymbol(cell!.bonusType as BonusType);
                        isPressable = !!selectedLetter; // Seçili harf varsa bonus hücreler basılabilir
                        break;
                    case 'Obstacle':
                        cellStyle = styles.obstacleCell;
                        cellText = 'O';
                        isPressable = !!selectedLetter; // Seçili harf varsa engel hücreleri basılabilir
                        break;
                    case 'Reward':
                        cellStyle = styles.rewardCell;
                        cellText = 'R';
                        isPressable = !!selectedLetter; // Seçili harf varsa ödül hücreleri basılabilir
                        break;
                }
            }
        } else {
            cellStyle = selectedLetter ? styles.availableCell : styles.emptyCell;
            isPressable = !!selectedLetter;
        }

        return (
            <TouchableOpacity
                key={`${rowIdx}-${colIdx}`}
                style={[styles.cell, cellStyle, additionalStyles]}
                onPress={() => handleCellPress(rowIdx, colIdx, cell)}
                disabled={!isPressable && !(cell?.type === 'GameLetter' && !cell.isClicked) || !isUserTurn}
            >
                <Text style={styles.cellText}>{cellText}</Text>
            </TouchableOpacity>
        );
    };

    const getBonusSymbol = (type?: BonusType) => {
        switch (type) {
            case BonusType.LETTER_2:
                return 'L2';
            case BonusType.LETTER_3:
                return 'L3';
            case BonusType.WORD_2:
                return 'W2';
            case BonusType.WORD_3:
                return 'W3';
            default:
                return 'B';
        }
    };

    const renderPlayerLetters = () => (
        <ScrollView
            horizontal
            style={styles.lettersContainer}
            contentContainerStyle={styles.lettersContent}
        >
            {playerLetters.map((letter, index) => (
                <TouchableOpacity
                    key={`letter-${index}`}
                    style={[
                        styles.letterBox,
                        letter.isActive ? styles.activeLetter : styles.inactiveLetter,
                        selectedLetter?.letter === letter.letter && styles.selectedLetter
                    ]}
                    onPress={() => handleLetterSelect(letter)}
                    disabled={!letter.isActive}
                >
                    <Text style={styles.letterText}>{letter.letter}</Text>
                    <Text style={styles.pointText}>{letter.point}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    return (
        <View style={styles.mainContainer}>
            <View style={styles.statusBar}>
                <Text style={styles.statusText}>
                    {isUserTurn ? "Sıra sizde!" : "Rakibin sırası..."}
                </Text>
                {selectedLetter && (
                    <Text style={styles.selectedLetterText}>
                        Seçilen Harf: {selectedLetter.letter}
                    </Text>
                )}
            </View>

            <ScrollView
                contentContainerStyle={styles.container}
                maximumZoomScale={2.0}
                minimumZoomScale={0.5}
            >
                {gameTable.map((row, rowIdx) => (
                    <View key={`row-${rowIdx}`} style={styles.row}>
                        {row.map((cell, colIdx) => renderCell(rowIdx, colIdx, cell))}
                    </View>
                ))}
            </ScrollView>

            {lastDiscoveredObject && (
                <View style={styles.discoveredObjectContainer}>
                    <Text style={styles.discoveredObjectText}>
                        Son Keşfedilen Nesne: {lastDiscoveredObject.type} - {lastDiscoveredObject.name}
                    </Text>
                </View>
            )}

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
        backgroundColor: '#f5f5f5',
        padding: 5,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cellText: {
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle,
    emptyCell: {
        backgroundColor: '#fff',
    },
    letterCell: {
        backgroundColor: '#acf3c2',
    },
    usedLetterCell: {
        backgroundColor: '#c2e2f3',
    },
    bonusCell: {
        backgroundColor: '#ffe3aa',
    },
    obstacleCell: {
        backgroundColor: '#ffaaaa',
    },
    rewardCell: {
        backgroundColor: '#d4aaff',
    },
    hiddenObjectCell: {
        backgroundColor: '#cccccc',
    },
    availableCell: {
        backgroundColor: '#e6ffe6',
        borderWidth: 2,
        borderColor: '#00aa00',
    },
    letterOnBonusCell: {
        backgroundColor: '#acf3c2',
        borderWidth: 3,
        borderColor: '#ffe3aa',
    },
    letterOnObstacleCell: {
        backgroundColor: '#acf3c2',
        borderWidth: 3,
        borderColor: '#ffaaaa',
    },
    letterOnRewardCell: {
        backgroundColor: '#acf3c2',
        borderWidth: 3,
        borderColor: '#d4aaff',
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    statusText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    } as TextStyle,
    selectedLetterText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    } as TextStyle,
    lettersContainer: {
        maxHeight: 90,
        backgroundColor: '#e0e0e0',
        marginBottom: 10,
        borderRadius: 5,
    },
    lettersContent: {
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    letterBox: {
        width: 50,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 5,
        borderWidth: 2,
    },
    activeLetter: {
        backgroundColor: '#c8e6c9',
        borderColor: '#4caf50',
    },
    inactiveLetter: {
        backgroundColor: '#e0e0e0',
        borderColor: '#9e9e9e',
        opacity: 0.7,
    },
    selectedLetter: {
        borderColor: '#2196F3',
        borderWidth: 3,
        backgroundColor: '#bbdefb',
    },
    letterText: {
        fontSize: 20,
        fontWeight: 'bold',
    } as TextStyle,
    pointText: {
        fontSize: 12,
        marginTop: 3,
    } as TextStyle,
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    passButton: {
        backgroundColor: '#ffd54f',
    },
    confirmButton: {
        backgroundColor: '#66bb6a',
    },
    surrenderButton: {
        backgroundColor: '#ef5350',
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    } as TextStyle,
    effectContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#e8eaf6',
        borderRadius: 5,
    },
    effectText: {
        marginVertical: 2,
        fontSize: 14,
        color: '#3f51b5',
    } as TextStyle,
    discoveredObjectContainer: {
        padding: 10,
        backgroundColor: '#fff3e0',
        borderRadius: 5,
        marginVertical: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#ff9800',
    },
    discoveredObjectText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#e65100',
    } as TextStyle,
});