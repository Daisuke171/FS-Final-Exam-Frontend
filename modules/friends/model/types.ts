export type Presence = "online" | "offline";

export type Friend = {
	id: string;
	nickname: string;
	skin: string;
	presence: Presence;
};

type SkinLite = {
	id: string;
	name: string;
	img: string;
	level: number;
	value: number;
};

type Peer = {
	id: string;
	nickname: string;
	activeSkin?: SkinLite | null;
	chatId: string;
};

export type FriendPeer = {
	id: string; // id del Friend (relación)
	status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
	active: boolean;
	peer: Peer; // el “otro” usuario
	chatId: string;
};

export type FriendPeersResponse = { friendPeersOfUser: FriendPeer[] };

export type FriendPayload = {
	id: string;
	status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
	active: boolean;
	chatId: string | null;
	requesterId: string;
	receiverId: string;
	createdAt: string;
	updatedAt: string;
};

// --------------- Clases para Inputs de Mutations ---------------

export class CreateFriendInviteInput {
    inviterId: string;
    ttlHours?: number = 24;
    targetUsername?: string;
    constructor( inviterId: string, ttlHours?: number, targetUsername?: string,) {
        this.inviterId = inviterId;
        this.ttlHours = ttlHours;
        this.targetUsername = targetUsername;
    }

    toDTO() {
        return {
            targetUsername: this.targetUsername,
            inviterId: this.inviterId,
            ttlHours: this.ttlHours,
        };
    }
}

export class CreateFriendInviteInputByUsername {
    targetUsername: string;
    inviterId: string;
    constructor(targetUsername: string, inviterId: string) {
        this.targetUsername = targetUsername;
        this.inviterId = inviterId;
    }

    toDTO() {
        return {
            targetUsername: this.targetUsername,
            inviterId: this.inviterId,
        };
    }
}
