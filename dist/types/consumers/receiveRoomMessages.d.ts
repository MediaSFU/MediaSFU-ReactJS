import { Socket } from "socket.io-client";
import { Message } from "../@types/types";
export interface ReceiveRoomMessagesOptions {
    socket: Socket;
    roomName: string;
    updateMessages: (messages: Message[]) => void;
}
export type ReceiveRoomMessagesType = (options: ReceiveRoomMessagesOptions) => Promise<void>;
export declare function receiveRoomMessages({ socket, roomName, updateMessages, }: ReceiveRoomMessagesOptions): Promise<void>;
//# sourceMappingURL=receiveRoomMessages.d.ts.map