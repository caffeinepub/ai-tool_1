import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LetterContent {
    id: bigint;
    title: string;
    content: string;
    owner: Principal;
    createdAt: bigint;
    tone: string;
    letterType: LetterType;
    updatedAt: bigint;
    fontFamily: string;
}
export enum LetterType {
    informationRequestLetter = "informationRequestLetter",
    application = "application",
    certificateOfAppreciation = "certificateOfAppreciation",
    governmentPressNote = "governmentPressNote",
    officeLetter = "officeLetter",
    complaintLetter = "complaintLetter",
    petition = "petition"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createLetter(creationRequest: {
        title: string;
        content: string;
        tone: string;
        letterType: LetterType;
        fontFamily: string;
    }): Promise<bigint>;
    deleteLetter(letterId: bigint): Promise<void>;
    getAccessibleLettersSortedByType(): Promise<Array<LetterContent>>;
    getAllLetters(): Promise<Array<LetterContent>>;
    getCallerUserRole(): Promise<UserRole>;
    getLetterById(letterId: bigint): Promise<LetterContent>;
    getLettersByType(letterType: LetterType): Promise<Array<LetterContent>>;
    isCallerAdmin(): Promise<boolean>;
    searchLettersByTitle(searchTerm: string): Promise<Array<LetterContent>>;
    updateLetter(updateRequest: {
        id: bigint;
        title: string;
        content: string;
        tone: string;
        letterType: LetterType;
        fontFamily: string;
    }): Promise<void>;
}
