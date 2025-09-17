import { createCategory, getCategories } from "@/api/auth";
import { createRecipe } from "@/api/recipes";
import { colors } from "@/colors/colors";
import Slider from "@react-native-community/slider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import CustomButton from "../customButton";
import CustomSmallButton from "../customSmallButton";

const DIFF_BY_IDX = { 1: "Easy", 2: "Medium", 3: "Hard" } as const;
const IDX_BY_DIFF: Record<"Easy" | "Medium" | "Hard", 1 | 2 | 3> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

const Schema = Yup.object({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  time: Yup.number().typeError("Number").required("Required"),
  difficulty: Yup.mixed<"Easy" | "Medium" | "Hard">()
    .oneOf(["Easy", "Medium", "Hard"])
    .required("Required"),
  calories: Yup.number().typeError("Number").nullable(),
  steps: Yup.array().of(Yup.string()).min(1, "Add at least one step"),
  imageUri: Yup.string().required("Image is required"),
  categoryIds: Yup.array()
    .of(Yup.string())
    .min(1, "Pick at least one category"),
});

const Chip = ({
  selected,
  label,
  onPress,
}: {
  selected: boolean;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected]}
    activeOpacity={0.7}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export type Category = { _id: string; name: string };

export default function RecipesScreen() {
  const {
    data,
    isLoading,
    isError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories: Category[] = Array.isArray(data) ? data : [];
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["recipe"],
    mutationFn: createRecipe,
    onSuccess: async () => {
      Alert.alert("Success", "Recipe created!");
      await queryClient.invalidateQueries({ queryKey: ["recipe"] });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      Alert.alert("Error", msg);
    },
  });
  const { mutate: addCategory, isPending: isAddingCategory } = useMutation({
    mutationKey: ["categories"],
    mutationFn: createCategory,
    onSuccess: () => {
      Alert.alert("Success", "Category created!");
      refetchCategories();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create category";
      Alert.alert("Error", msg);
    },
  });

  const pickImage = async (setFieldValue: any) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFieldValue("imageUri", result.assets[0].uri);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.yellowLight }}>Loading categories…</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.yellowLight }}>
          Failed to load categories.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView>
        <View style={styles.card}>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Text style={styles.cardTitle}>Add New Recipe</Text>
          </View>

          <Formik
            initialValues={{
              name: "",
              description: "",
              stepInput: "",
              steps: [] as string[],
              imageUri: "",
              ingInput: "",
              ingredients: [] as string[],
              categoryIds: [] as string[],
              catInput: "",
              time: 0,
              difficulty: "Easy" as "Easy" | "Medium" | "Hard",
              calories: 0,
            }}
            validationSchema={Schema}
            onSubmit={(values, { resetForm }) => {
              const formData = new FormData();
              formData.append("name", values.name.trim());
              formData.append("description", values.description.trim());
              formData.append("time", String(values.time));
              formData.append("difficulty", values.difficulty);
              formData.append("calories", String(values.calories ?? 0));

              values.steps.forEach((s) => formData.append("steps[]", s));
              values.categoryIds.forEach((id) =>
                formData.append("categories[]", id)
              );

              const fileName = values.imageUri.split("/").pop() || "photo.jpg";
              const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
              const mime =
                ext === "png"
                  ? "image/png"
                  : ext === "webp"
                  ? "image/webp"
                  : "image/jpeg";
              formData.append("image", {
                uri: values.imageUri,
                name: fileName,
                type: mime,
              } as any);

              mutate(formData, {
                onSuccess: () => {
                  Alert.alert("Success", "Recipe created!");
                  resetForm();
                },
                onError: (error: any) => {
                  const msg =
                    error?.response?.data?.error ||
                    error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong";
                  Alert.alert("Error", msg);
                },
              });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => {
              const addStep = () => {
                const step = values.stepInput.trim();
                if (!step) return;
                const numbered = `${values.steps.length + 1}- ${step}`;
                setFieldValue("steps", [...values.steps, numbered]);
                setFieldValue("stepInput", "");
              };
              const toggleCategory = (id: string) => {
                const set = new Set(values.categoryIds);
                set.has(id) ? set.delete(id) : set.add(id);
                setFieldValue("categoryIds", Array.from(set));
              };
              const addIngredient = () => {
                const ingredient = values.ingInput.trim();
                if (!ingredient) return;
                setFieldValue("ingredients", [
                  ...values.ingredients,
                  ingredient,
                ]);
                setFieldValue("ingInput", "");
              };
              const removeIng = (label: string) =>
                setFieldValue(
                  "ingredients",
                  values.ingredients.filter(
                    (ingredient) => ingredient !== label
                  )
                );

              return (
                <>
                  <TouchableOpacity
                    style={styles.uploadBox}
                    activeOpacity={0.8}
                    onPress={() => pickImage(setFieldValue)}
                  >
                    {values.imageUri ? (
                      <Image
                        source={{ uri: values.imageUri }}
                        style={styles.uploadImage}
                      />
                    ) : (
                      <View style={{ alignItems: "center" }}>
                        <Text style={styles.uploadPlus}>＋</Text>
                        <Text style={styles.uploadText}>
                          Upload tasty photos
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  {!!touched.imageUri && !!errors.imageUri && (
                    <Text style={styles.errText}>{errors.imageUri}</Text>
                  )}

                  <Text style={styles.label}>
                    Name <Text style={styles.req}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    placeholder="Value"
                    placeholderTextColor="#9aa1b2"
                  />
                  {!!touched.name && !!errors.name && (
                    <Text style={styles.errText}>{errors.name}</Text>
                  )}

                  <Text style={styles.label}>
                    Description <Text style={styles.req}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, styles.multiline]}
                    value={values.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    placeholder="Value"
                    placeholderTextColor="#9aa1b2"
                    multiline
                  />
                  {!!touched.description && !!errors.description && (
                    <Text style={styles.errText}>{errors.description}</Text>
                  )}

                  <Text style={styles.label}>
                    Steps <Text style={styles.req}>*</Text>
                  </Text>

                  <View style={styles.row}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Add step"
                      placeholderTextColor="#9aa1b2"
                      value={values.stepInput}
                      onChangeText={handleChange("stepInput")}
                      autoCapitalize="words"
                    />

                    <CustomSmallButton
                      title={isAddingCategory ? "Adding..." : "Add"}
                      onPress={addStep}
                    />
                  </View>

                  {!!errors.steps && (
                    <Text style={styles.errText}>{errors.steps as any}</Text>
                  )}

                  {!!values.steps.length && (
                    <View style={styles.chipsWrap}>
                      {values.steps.map((step, index) => (
                        <View
                          key={index}
                          style={[styles.chip, styles.chipMuted]}
                        >
                          <Text style={[styles.chipText, { color: "#5a6376" }]}>
                            {step}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <Text style={styles.label}>
                    Ingredients <Text style={styles.req}>*</Text>
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Add ingredient"
                      placeholderTextColor="#9aa1b2"
                      value={values.ingInput}
                      onChangeText={handleChange("ingInput")}
                      autoCapitalize="words"
                    />

                    <CustomSmallButton
                      title={isAddingCategory ? "Adding..." : "Add"}
                      onPress={addIngredient}
                    />
                  </View>

                  {!!values.ingredients.length && (
                    <View style={styles.chipsWrap}>
                      {values.ingredients.map((s, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => removeIng(s)}
                          style={[
                            styles.chip,
                            styles.chipMuted,
                            { shadowOpacity: 0.08 },
                          ]}
                        >
                          <Text style={[styles.chipText, { color: "#5a6376" }]}>
                            {s}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <View style={styles.rowLabel}>
                    <Text style={styles.label}>
                      Categories <Text style={styles.req}>*</Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Add or select a category"
                      placeholderTextColor="#9aa1b2"
                      value={values.catInput}
                      onChangeText={(text) => setFieldValue("catInput", text)}
                      autoCapitalize="words"
                    />
                    <CustomSmallButton
                      title={isAddingCategory ? "Adding..." : "Add"}
                      onPress={async () => {
                        const category = values.catInput.trim();
                        if (!category) return;
                        const existing = categories.find(
                          (c) => c.name.toLowerCase() === category.toLowerCase()
                        );
                        if (existing) {
                          const set = new Set(values.categoryIds);
                          set.has(existing._id)
                            ? set.delete(existing._id)
                            : set.add(existing._id);
                          setFieldValue("categoryIds", Array.from(set));
                          setFieldValue("catInput", "");
                          return;
                        }

                        addCategory(category, {
                          onSuccess: async () => {
                            const fresh = await refetchCategories();
                            const list = Array.isArray(fresh.data)
                              ? fresh.data
                              : [];
                            const created = list.find(
                              (c: any) =>
                                c.name.toLowerCase() === category.toLowerCase()
                            );
                            if (created?._id) {
                              setFieldValue("categoryIds", [
                                ...values.categoryIds,
                                created._id,
                              ]);
                            }
                            setFieldValue("catInput", "");
                          },
                        });
                      }}
                    />
                  </View>

                  {!!touched.categoryIds && !!errors.categoryIds && (
                    <Text style={styles.errText}>
                      {errors.categoryIds as any}
                    </Text>
                  )}

                  <View style={styles.chipsWrap}>
                    {categories.map((c) => {
                      const selected = values.categoryIds.includes(c._id);
                      return (
                        <TouchableOpacity
                          key={c._id}
                          onPress={() => {
                            const set = new Set(values.categoryIds);
                            set.has(c._id) ? set.delete(c._id) : set.add(c._id);
                            setFieldValue("categoryIds", Array.from(set));
                          }}
                          style={[
                            styles.chip,
                            styles.chipMuted,
                            { shadowOpacity: 0.08 },
                            selected && { backgroundColor: "#dadff0" },
                          ]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              { color: "#5a6376" },
                              selected && { color: "#1f2533" },
                            ]}
                          >
                            {c.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={styles.sliderRow}>
                    <Text style={styles.sliderLabel}>Time</Text>
                    <Text style={styles.sliderValue}>{values.time}m</Text>
                  </View>
                  <Slider
                    minimumValue={0}
                    maximumValue={1440}
                    step={1}
                    value={values.time}
                    onValueChange={(v) => setFieldValue("time", v)}
                    minimumTrackTintColor={colors.blueLight}
                    thumbTintColor={colors.blueLight}
                  />

                  <View style={styles.sliderRow}>
                    <Text style={styles.sliderLabel}>Difficulty</Text>
                    <Text style={styles.sliderValue}>{values.difficulty}</Text>
                  </View>
                  <Slider
                    minimumValue={1}
                    maximumValue={3}
                    step={1}
                    value={IDX_BY_DIFF[values.difficulty]}
                    onValueChange={(v) =>
                      setFieldValue("difficulty", DIFF_BY_IDX[v as 1 | 2 | 3])
                    }
                    minimumTrackTintColor={colors.blueLight}
                    thumbTintColor={colors.blueLight}
                  />

                  <View style={styles.sliderRow}>
                    <Text style={styles.sliderLabel}>Calories</Text>
                    <Text style={styles.sliderValue}>{values.calories}</Text>
                  </View>
                  <Slider
                    minimumValue={0}
                    maximumValue={5000}
                    step={1}
                    value={values.calories}
                    onValueChange={(v) => setFieldValue("calories", v)}
                    minimumTrackTintColor={colors.blueLight}
                    thumbTintColor={colors.blueLight}
                  />

                  <View style={{ alignItems: "center", padding: 20 }}>
                    <CustomButton
                      text={isPending ? "Submitting..." : "Submit"}
                      onPress={handleSubmit}
                    ></CustomButton>
                  </View>
                </>
              );
            }}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 18, paddingHorizontal: 16, paddingBottom: 8 },
  headerTitle: {
    color: "#a2a6b3",
    letterSpacing: 1,
    fontSize: 14,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#e9ebf5",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  rowBetween: { flexDirection: "row", alignItems: "center" },
  backArrow: { fontSize: 20, color: "#222" },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#222", marginTop: 2 },

  uploadBox: {
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e1e4ef",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadPlus: { fontSize: 28, color: colors.blueLight, marginBottom: 6 },
  uploadText: { color: colors.muted, fontSize: 14, fontWeight: "500" },
  uploadImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    resizeMode: "cover",
  },

  label: {
    color: "#2a2e3a",
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
  },
  req: { color: "#e15353" },

  rowLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d6dae6",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#1f2430",
  },
  multiline: { minHeight: 90, textAlignVertical: "top" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  chip: {
    backgroundColor: "#eef1f7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  chipSelected: { backgroundColor: "#dadff0" },
  chipMuted: { backgroundColor: "#eef1f7" },
  chipText: { color: "#2e3646", fontWeight: "600" },
  chipTextSelected: { color: "#1f2533" },

  sliderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },
  sliderLabel: { color: "#2a2e3a", fontWeight: "700" },
  sliderValue: { color: "#2a2e3a", fontWeight: "700" },

  submitBtn: {
    backgroundColor: "#f5b800",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },
  submitText: { color: "#1f1c0d", fontSize: 16, fontWeight: "800" },
  errText: { color: colors.error, marginTop: 6 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
