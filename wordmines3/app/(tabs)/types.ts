// types.ts

import { NativeStackScreenProps } from '@react-navigation/native-stack';


export interface User {
    id: number;
    username: string;
    email: string;
}

export interface GameObjectResponse {
    id?: string;  // Add optional id property
    type: 'GameLetter' | 'Obstacle' | 'Reward' | 'Bonus';
    row: number;
    column: number;
    isClicked: boolean;
    letter?: string;
    point?: number;
    obstacleType?: string;
    rewardType?: string;
    bonusType?: string;
    visible: boolean ;
    originalType?: string;
}

export interface GameTableResponse {
    id: number;
    gameObjects: (GameObjectResponse | null)[][];
}

export interface GameResponse {
    id: number;
    user1: User;
    user2: User;
    starter: User;
    currentUser: User;
    gameMode: string;
    gameStatus: string;
    gameTableResponse: GameTableResponse;
    user1Score: number;
    user2Score: number;
    isUser1Won: boolean;
    isUser2Won: boolean;
}

export enum BonusType {
    LETTER_2 = 'LETTER_2',
    LETTER_3 = 'LETTER_3',
    WORD_2 = 'WORD_2',
    WORD_3 = 'WORD_3',
    JOKER = 'JOKER'
}

export enum ObstacleType {
    POINT_DIVISION = 'POINT_DIVISION',
    POINT_TRANSFER = 'POINT_TRANSFER',
    LETTER_LOSE = 'LETTER_LOSE',
    EXTRA_MOVEMENT_OBSTACLE = 'EXTRA_MOVEMENT_OBSTACLE',
    WORD_CANCEL = 'WORD_CANCEL'
}

export enum RewardType {
    ZONE_BAN = 'ZONE_BAN',
    LETTER_BAN = 'LETTER_BAN',
    EXTRA_MOVEMENT = 'EXTRA_MOVEMENT'
}

export interface Extension {
    id: number;
    name: string;
    isActive: boolean;
}

export interface PlayerLetter {
    letter: string;
    point: number;
    isActive: boolean;
}

export interface GameTableScreenProps {
    route: {
        params: {
            gameId: number;
            userId: number;
            gameData: GameResponse;
            gameTable: GameTableResponse;
        }
    };
    navigation: any;
}


export type RootStackParamList = {
    Home: undefined;
    JoinGame: undefined;
    GameTable: {
        gameId: number;
        userId: number;
        gameData: GameResponse;
        gameTable: GameTableResponse;
    };
};


declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {
        }
    }
}