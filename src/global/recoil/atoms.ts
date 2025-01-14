import { atom } from "recoil";

interface ChatRoomState {
    roomId : string | null;
    userId : string | null;
    member : string | null;
    roomName : string | null;
    date: string | null;
}

export const chatRoomState = atom<ChatRoomState>({
    key: "chatRoomState",
    default: {
        roomId: null,
        userId: null,
        member: null,
        roomName : null,
        date: null,
    },
});
