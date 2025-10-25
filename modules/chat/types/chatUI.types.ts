export interface ChatFriend {
	id: string;
	nickname: string;
	skin: string;
	chatId: string;
}

export type Msg = {
	id: string;
	from: "me" | "friend";
	text: string;
	at: number;
	read?: boolean;
	status?: string;
};

export interface ChatWindowProps {
	friend?: ChatFriend | null;
	visible?: boolean;
	onClose?: () => void;
	className?: string;
	currentUserId?: string; // opcional para decidir "me"
}