import React, { useState } from "react";

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

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const headerHeight = useHeaderHeight();

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
            renderItem={({ item }) => (
              <View>
                <Text>{item.content}</Text>
              </View>
            )}
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
