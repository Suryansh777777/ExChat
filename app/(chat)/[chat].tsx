import React, { useEffect, useState } from "react";

import { Link, Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { Text } from "@/components/Text";
import { Message, ChatRoom } from "@/utils/types";
import { db, appwriteConfig, client } from "@/utils/Appwrite";
import { ID, Query } from "react-native-appwrite";
import { LegendList } from "@legendapp/list";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { IconSymbol } from "@/components/IconSymbol";
import { useUser } from "@clerk/clerk-expo";
import { FlatList } from "react-native";
import { Primary, Secondary } from "@/utils/colors";

export default function Chat() {
  const { chat: chatId } = useLocalSearchParams();
  const { user } = useUser();
  if (!chatId) return <Text>Chat not found</Text>;

  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const headerHeight = useHeaderHeight();

  const handleFirstLoad = async () => {
    try {
      await getMessages();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFirstLoad();
  }, [chatId]);

  useEffect(() => {
    const channel = `databases.${appwriteConfig.db}.collections.${appwriteConfig.col.chatrooms}.documents.${chatId}`;
    const unsubscribe = client.subscribe(channel, () => {
      console.log("chat room updated");
      getMessages();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getChatRoom = async () => {
    try {
      const data = await db.getDocument(
        appwriteConfig.db,
        appwriteConfig.col.chatrooms,
        chatId as string
      );

      setChatRoom(document as unknown as ChatRoom);
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async () => {
    try {
      const { documents, total } = await db.listDocuments(
        appwriteConfig.db,
        appwriteConfig.col.messages,
        [
          Query.equal("chatRoomId", chatId as string),
          Query.limit(100),
          Query.orderAsc("$createdAt"),
        ]
      );
      setMessages(documents as Message[]);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (messageContent.trim() === "") return;
    try {
      const message = {
        content: messageContent,
        senderId: user?.id!,
        senderName: user?.fullName ?? "Anonymous",
        senderPhoto: user?.imageUrl ?? "",
        chatRoomId: chatId as string,
      };
      await db.createDocument(
        appwriteConfig.db,
        appwriteConfig.col.messages,
        ID.unique(),
        message
      );
      setMessageContent("");

      await db.updateDocument(
        appwriteConfig.db,
        appwriteConfig.col.chatrooms,
        chatId as string,
        {
          $updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <>
      <Stack.Screen
        options={{
          title: "Chat",
        }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={headerHeight}
        >
          <LegendList
            data={messages}
            renderItem={({ item }) => {
              const isSender = item.senderId === user?.id;
              return (
                <View
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: 6,
                    maxWidth: "80%",
                    alignSelf: isSender ? "flex-end" : "flex-start",
                  }}
                >
                  {!isSender && (
                    <Image
                      source={{ uri: item.senderPhoto }}
                      style={{ width: 30, height: 30, borderRadius: 15 }}
                    />
                  )}
                  <View
                    style={{
                      backgroundColor: isSender ? "#007AFF" : "#161616",
                      flex: 1,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontWeight: "500", marginBottom: 4 }}>
                      {item.senderName}
                    </Text>
                    <Text>{item.content}</Text>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "right",
                      }}
                    >
                      {new Date(item.$createdAt!).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item?.$id ?? "unknown"}
            contentContainerStyle={{ padding: 10 }}
            recycleItems={true}
            initialScrollIndex={messages.length - 1}
            alignItemsAtEnd // Aligns to the end of the screen, so if there's only a few items there will be enough padding at the top to make them appear to be at the bottom.
            maintainScrollAtEnd // prop will check if you are already scrolled to the bottom when data changes, and if so it keeps you scrolled to the bottom.
            maintainScrollAtEndThreshold={0.5} // prop will check if you are already scrolled to the bottom when data changes, and if so it keeps you scrolled to the bottom.
            maintainVisibleContentPosition //Automatically adjust item positions when items are added/removed/resized above the viewport so that there is no shift in the visible content.
            estimatedItemSize={100} // estimated height of the item
            // getEstimatedItemSize={(info) => { // use if items are different known sizes
            //   console.log("info", info);
          />

          {/* Input */}
          <View
            style={{
              borderWidth: 1,
              borderColor: Secondary,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              marginBottom: 6,
              marginHorizontal: 10,
            }}
          >
            <TextInput
              placeholder="Type a message"
              style={{
                minHeight: 40,
                color: "white",
                flexShrink: 1, // prevent pushing the send button out of the screen
                flexGrow: 1, // allow the text input to grow keeping the send button to the right
                padding: 12,
              }}
              placeholderTextColor={"gray"}
              multiline
              value={messageContent}
              onChangeText={setMessageContent}
            />
            <Pressable
              disabled={messageContent === ""}
              style={{
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={sendMessage}
            >
              <IconSymbol
                name="paperplane"
                color={messageContent === "" ? Primary : "gray"}
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
