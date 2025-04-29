import { FlatList, RefreshControl, Text, View } from "react-native";
import { chatRooms } from "@/utils/test-data";
import { Link } from "expo-router";
import React from "react";
import { IconSymbol } from "@/components/IconSymbol";

export default function Index() {
  const [refreshing, setRefreshing] = React.useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };
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
