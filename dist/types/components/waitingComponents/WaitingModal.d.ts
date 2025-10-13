import React from "react";
import { RespondToWaitingType } from "../../methods/waitingMethods/respondToWaiting";
import "./WaitingRoomModal.css";
import { WaitingRoomParticipant } from "../../@types/types";
import { Socket } from "socket.io-client";
export interface WaitingRoomModalParameters {
    filteredWaitingRoomList: WaitingRoomParticipant[];
    getUpdatedAllParams: () => WaitingRoomModalParameters;
    [key: string]: any;
}
export interface WaitingRoomModalOptions {
    isWaitingModalVisible: boolean;
    onWaitingRoomClose: () => void;
    waitingRoomCounter: number;
    onWaitingRoomFilterChange: (filter: string) => void;
    waitingRoomList: WaitingRoomParticipant[];
    updateWaitingList: (updatedList: WaitingRoomParticipant[]) => void;
    roomName: string;
    socket: Socket;
    position?: string;
    backgroundColor?: string;
    parameters: WaitingRoomModalParameters;
    onWaitingRoomItemPress?: RespondToWaitingType;
    title?: React.ReactNode;
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    headerProps?: React.HTMLAttributes<HTMLDivElement>;
    titleProps?: React.HTMLAttributes<HTMLDivElement>;
    badgeWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    badgeProps?: React.HTMLAttributes<HTMLSpanElement>;
    closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    closeIconComponent?: React.ReactNode;
    bodyProps?: React.HTMLAttributes<HTMLDivElement>;
    searchWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    searchInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    waitingListProps?: React.HTMLAttributes<HTMLDivElement>;
    participantRowProps?: React.HTMLAttributes<HTMLDivElement>;
    acceptButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    rejectButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    acceptIconComponent?: React.ReactNode;
    rejectIconComponent?: React.ReactNode;
    emptyState?: React.ReactNode | ((context: {
        counter: number;
    }) => React.ReactNode);
    renderHeader?: (options: {
        defaultHeader: React.ReactNode;
        counter: number;
        onClose: () => void;
    }) => React.ReactNode;
    renderSearch?: (options: {
        defaultSearch: React.ReactNode;
        onFilter: (value: string) => void;
    }) => React.ReactNode;
    renderParticipant?: (options: {
        participant: WaitingRoomParticipant;
        index: number;
        defaultParticipant: React.ReactNode;
        handleAccept: () => void;
        handleReject: () => void;
    }) => React.ReactNode;
    renderBody?: (options: {
        defaultBody: React.ReactNode;
        counter: number;
    }) => React.ReactNode;
}
export type WaitingRoomModalType = (options: WaitingRoomModalOptions) => React.JSX.Element;
declare const WaitingRoomModal: React.FC<WaitingRoomModalOptions>;
export default WaitingRoomModal;
//# sourceMappingURL=WaitingModal.d.ts.map