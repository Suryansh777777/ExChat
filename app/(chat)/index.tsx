import { FlatList, RefreshControl, Text, View } from "react-native";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { IconSymbol } from "@/components/IconSymbol";
import { ChatRoom, Message } from "@/utils/types";
import { appwriteConfig, db } from "@/utils/Appwrite";
import { Query } from "react-native-appwrite";
import { chatRooms } from "@/utils/test-data";

export default function Index() {
  // const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchChatRooms();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChatRooms = async () => {
    try {
      const { documents, total } = await db.listDocuments(
        appwriteConfig.db,
        appwriteConfig.col.chatrooms,
        [Query.limit(100)]
      );
      // setChatRooms(documents as ChatRoom[]);
      // setChatRooms(documents as ChatRoom[]);
      // console.log(JSON.stringify(documents, null, 2), total);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   fetchChatRooms();
  // }, []);
  return (
    <FlatList
      data={chatRooms}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={handleRefresh} />
      }
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/[chat]",
            params: {
              chat: item.id,
            },
          }}
        >
          <View
            style={{
              gap: 6,
              padding: 16,
              width: "100%",
              borderRadius: 16,
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#262626",
              justifyContent: "space-between",
            }}
          >
            <ItemTitleAndDescription
              title={item.title}
              description={item.description}
              isPrivate={item.isPrivate}
            />
            <IconSymbol name="chevron.right" color="#666666" />
          </View>
        </Link>
      )}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    />
  );
}
function ItemTitle({
  title,
  isPrivate,
}: {
  title: string;
  isPrivate: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Text style={{ fontSize: 17, color: "#FFFFFF" }}>{title}</Text>
      {isPrivate && <IconSymbol name="lock.fill" size={20} color="#666666" />}
    </View>
  );
}
function ItemTitleAndDescription({
  title,
  description,
  isPrivate,
}: {
  title: string;
  description: string;
  isPrivate: boolean;
}) {
  return (
    <View style={{ gap: 4 }}>
      <ItemTitle title={title} isPrivate={isPrivate} />
      <Text style={{ fontSize: 13, color: "#666666" }}>{description}</Text>
    </View>
  );
}
