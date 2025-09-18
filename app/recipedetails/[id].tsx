const BASE_URL = "http://192.168.7.245:8000";
// import { useLocalSearchParams } from "expo-router";
// import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// // Assuming you have a file to manage your BASE_URL


// // A separate function to fetch the recipe, making it reusable
// const getRecipeById = async (id: string) => {
//   const { data } = await axios.get(`${BASE_URL}/api/recipe/${id}`);
//   return data;
// };

// export default function RecipeDetails() {
//   const { id } = useLocalSearchParams<{ id: string }>();

//   // Use the useQuery hook for data fetching
//   const { data: recipe, isLoading, error } = useQuery({
//     queryKey: ["recipe", id],
//     queryFn: () => getRecipeById(id),
//     enabled: !!id, // Only run the query if 'id' exists
//   });

//   if (isLoading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#FFD700" />
//         <Text style={{ marginTop: 10 }}>Loading...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text>Error fetching recipe: {(error as Error).message}</Text>
//       </View>
//     );
//   }

//   if (!recipe) {
//     return (
//       <View style={styles.container}>
//         <Text>No recipe found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.recipeContainer}>
//       <Text style={styles.recipeTitle}>{recipe.name}</Text>
//       <Text style={styles.recipeDescription}>{recipe.description}</Text>
//       {/* You can add more recipe details here */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   recipeContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#F6F7FB",
//   },
//   recipeTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   recipeDescription: {
//     fontSize: 16,
//     color: "#666",
//   },
// });
import { useLocalSearchParams } from "expo-router";
import { ReactNode, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet, ScrollView } from "react-native";
import axios from "axios";

// يمكنك استخدام getImageUrl من ملفك السابق
// import { getImageUrl } from "@/utils/image";

// عنوان الـ API


// دالة لجلب الصورة (مأخوذة من الكود السابق)
const getImageUrl = (path: string) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const origin = BASE_URL.replace(/\/api\/?$/, "");
  return `${origin.replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;
};

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  interface Recipe {
    name: string;
    description: string;
    time: number;
    difficulty: string;
    calories?: number;
    image?: string;
    ingredients?: { amount: string; unit: string; ingredient: { name: string } }[];
    steps?: string[];
    categories?: { name: string }[];
    user?: {
        username: ReactNode;
        email: ReactNode; name: string 
};
  }

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التأكد من أن الـ ID موجود قبل إرسال الطلب
    if (id) {
      axios.get(`${BASE_URL}/api/recipe/${id}`)
        .then((res) => setRecipe(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No recipe found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* صورة الوصفة */}
      {recipe.image && (
        <Image 
          source={{ uri: getImageUrl(recipe.image) as string }} 
          style={styles.recipeImage} 
        />
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.recipeTitle}>{recipe.name}</Text>
        <Text style={styles.recipeDescription}>{recipe.description}</Text>
        
        {/* معلومات الوصفة الرئيسية */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>⏱️ {recipe.time} min</Text>
          <Text style={styles.infoText}>🔥 {recipe.difficulty}</Text>
          {recipe.calories && (
            <Text style={styles.infoText}>⚡️ {recipe.calories} kcal</Text>
          )}
        </View>

        {/* قائمة المكونات */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((item, index) => (
              <Text key={index} style={styles.listItem}>
                • {item.amount} {item.unit} of {item.ingredient.name}
              </Text>
            ))}
          </View>
        )}

        {/* خطوات التحضير */}
        {recipe.steps && recipe.steps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Steps</Text>
            {recipe.steps.map((step, index) => (
              <Text key={index} style={styles.listItem}>
                {index + 1}. {step}
              </Text>
            ))}
          </View>
        )}

        {/* الفئات */}
        {recipe.categories && recipe.categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.chipsContainer}>
              {recipe.categories.map((cat, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{cat.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* معلومات المستخدم */}
        {recipe.user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Created by</Text>
            <Text style={styles.infoText}>👤 {recipe.user.email}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  recipeImage: {
    width: "100%",
    height: 250,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  chip: {
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
    color: "#666",
  },
  userText: {
    fontSize: 17,
    color: "#ef0000ff",
    backgroundColor:"yellow"
  },
});