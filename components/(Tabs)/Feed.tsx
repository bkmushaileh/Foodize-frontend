import { getCategories } from "@/api/auth";
import { colors } from "@/colors/colors";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Category = {
  _id: string;
  name: string;
};

const FeedScreen = () => {
  const { data, isFetching } = useQuery<Category[]>({
    queryKey: ["Category"],
    queryFn: getCategories,
  });

  const [selected, setSelected] = useState<string | null>(null);
  if (isFetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.blue} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <Text style={styles.guestText}>Guest</Text>
        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- Categories ---------- */}
      <View style={styles.categoriesHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesRow}
      >
        {data?.map((cat: Category) => (
          <TouchableOpacity
            key={cat._id}
            onPress={() => setSelected(cat._id)}
            style={[
              styles.categoryChip,
              selected === cat._id && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                selected === cat._id && styles.categoryChipTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  guestText: {
    fontSize: 16,
    color: "#555",
  },
  signUpButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  signUpText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },

  categoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    color: colors.blue ?? "#4A90E2",
    fontSize: 14,
  },
  categoriesRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#FFD700",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#555",
  },
  categoryChipTextActive: {
    color: "#000",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
});
