export const AdminRole = {
  MAINTANANCE_ADMIN: 10001,
  SUPER_ADMIN: 40001,
  DISPUTE_ADMIN: 80001,
  WALLET_ADMIN: 60001,
  JOB_ADMIN: 70001,
  CHAT_SUPER_ADMIN:20001
}

export const UserRole = {
  BUSINESS: 10001,
  CUSTOMER: 40001,
  ADMIN: 80001,  
}

export const convType = {
  USER: 1,
  BUSINESS: 2,
  GROUP: 3,
};

export const GroupEvents = {
  CREATE: 1,
  ADD_MEMBER: 2,
  REMOVE_MEMBER: 3,
  JOIN_MEMBER: 4,
  NORMAL_MESSAGE: 5,
  UPDATE_GROUP: 6,
  LEAVE_GROUP: 7,
  INACTIVE_GROUP: 11,
  ACTIVE_GROUP: 12
};

export const MessageStatusEnum = {
  PENDING: 0,
  SENT: 1,
  DELIVERED: 2,
  READ: 3,
  FAILED: 4,
};

export const DeleteStatus = {
  deleteForMe: 1,
  deleteForEveryOne: 2    
};

export const MsgType = {
  TEXT: 1,
  IMAGE: 2,
  AUDIO: 3,
  VIDEO: 4,
  LOCATION: 5,
  DOCUMENT: 6,
  EVENT: 7,
  CONTACT: 8,
  VOICE: 9,
  REPLY: 10,
};

export const DeleteStatusFromBackend = {
  DeleteForSender: 1,
  DeleteForReceiver: 2,
  DeleteForBoth: 3,
  BothSideDeleted: 4,
};