
export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  message: string;
  status: string;
  read: boolean;
  timestamp: string; // ISO
};

export type MessageDTO = {
  id: string;
  from: "me" | "friend";
  text: string;
  at: number;
};

export class InputMessage  {
  chatId: string;
  message: string;
  senderId: string;
  constructor(chatId: string, message: string, senderId: string) {
    this.chatId = chatId;
    this.message = message;
    this.senderId = senderId;
  }

  toDTO() {
    return {
      chatId: this.chatId,
      message: this.message,
      senderId: this.senderId,
    };
  }
}
