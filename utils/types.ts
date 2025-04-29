interface ChatRoom {
  $id: string;
  title: string;
  description: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: any[];
  $collectionId: string;
  $databaseId: string;
}
// Here $ is for appwrite because of the $ in the collection name
interface Message {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $collectionId?: string;
  $databaseId?: string;
  $permissions?: any[];
  content: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  chatRoomId: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  imageUrl: string;
}

export type { ChatRoom, Message, User };
