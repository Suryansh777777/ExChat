import { Client, Databases } from "react-native-appwrite";

if (
  !process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ||
  !process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID
) {
  throw new Error("Appwrite Environment Variables not set");
}

const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  platform: "com.anonymous.modernchatapp",
  db: process.env.EXPO_PUBLIC_APPWRITE_DATABASE,
  col: {
    chatrooms: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_CHATROOMS,
    messages: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_MESSAGES,
  },
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const db = new Databases(client);

export { db, appwriteConfig, client };
