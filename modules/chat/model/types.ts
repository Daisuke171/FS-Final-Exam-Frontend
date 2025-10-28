export type Message = { 
    id: string; 
    chatId: string; 
    senderId: string;
    message: string; 
    status: string; 
    read: boolean; 
    timestamp: Date; 
}; 

export type Chat = { 
    id: string; 
    userId: string; 
    friendId: string; 
    messages: Message[]; 
    createdAt: Date;
    updatedAt: Date;
};

export type ChatList = { 
    chats: Chat[]; 
};

export type MessageDTO = { 
    id: string; 
    from: "me"|"friend"; 
    text: string; 
    at: number };