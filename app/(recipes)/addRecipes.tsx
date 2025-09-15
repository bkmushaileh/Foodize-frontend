import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import axios from "axios";
import { Button, Chip } from "react-native-paper";

const API_URL = "http://localhost:8000/api/recipe/"; 

const AddRecipeScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [stepInput, setStepInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingInput, setIngInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [catInput, setCatInput] = useState("");
  const [time, setTime] = useState(1);
  const [difficulty, setDifficulty] = useState(1);
  const [calories, setCalories] = useState(100);

  const addItem = (type: "step" | "ing" | "cat") => {
    if (type === "step" && stepInput.trim()) {
      setSteps([...steps, stepInput.trim()]);
      setStepInput("");
    } else if (type === "ing" && ingInput.trim()) {
      setIngredients([...ingredients, ingInput.trim()]);
      setIngInput("");
    } else if (type === "cat" && catInput.trim()) {
      setCategories([...categories, catInput.trim()]);
      setCatInput("");
    }
  };

  const removeItem = (type: string, item: string) => {
    if (type === "step") setSteps(steps.filter(s => s !== item));
    if (type === "ing") setIngredients(ingredients.filter(i => i !== item));
    if (type === "cat") setCategories(categories.filter(c => c !== item));
  };

  const submit = async () => {
    if (!name || !description || !steps.length || !ingredients.length) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      await axios.post(API_URL, {
        name,
        description,
        steps,
        ingredients,
        categories,
        time,
        difficulty: ["Easy", "Medium", "Hard"][difficulty - 1],
        calories,
      });
      Alert.alert("Success", "Recipe added successfully!");
      // reset form
      setName(""); setDescription("");
      setSteps([]); setIngredients([]); setCategories([]);
      setTime(1); setDifficulty(1); setCalories(100);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add New Recipe</Text>

      <Text style={styles.label}>Name *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* Steps */}
      <Text style={styles.label}>Steps *</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.flexInput}
          placeholder="Add step"
          value={stepInput}
          onChangeText={setStepInput}
        />
        <Button mode="contained" onPress={() => addItem("step")}>Add</Button>
      </View>
      <View style={styles.wrap}>
        {steps.map((s, i) => (
          <Chip key={i} onClose={() => removeItem("step", s)} style={styles.chip}>{s}</Chip>
        ))}
      </View>

      {/* Ingredients */}
      <Text style={styles.label}>Ingredients *</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.flexInput}
          placeholder="Add ingredient"
          value={ingInput}
          onChangeText={setIngInput}
        />
        <Button mode="contained" onPress={() => addItem("ing")}>Add</Button>
      </View>
      <View style={styles.wrap}>
        {ingredients.map((s, i) => (
          <Chip key={i} onClose={() => removeItem("ing", s)} style={styles.chip}>{s}</Chip>
        ))}
      </View>

      {/* Categories */}
      <Text style={styles.label}>Categories</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.flexInput}
          placeholder="Add category"
          value={catInput}
          onChangeText={setCatInput}
        />
        <Button mode="contained" onPress={() => addItem("cat")}>Add</Button>
      </View>
      <View style={styles.wrap}>
        {categories.map((s, i) => (
          <Chip key={i} onClose={() => removeItem("cat", s)} style={styles.chip}>{s}</Chip>
        ))}
      </View>

      {/* Time */}
      <Text style={styles.label}>Time: {time} h</Text>
      <Slider minimumValue={1} maximumValue={24} step={1} value={time} onValueChange={setTime} />

      {/* Difficulty */}
      <Text style={styles.label}>
        Difficulty: {["Easy", "Medium", "Hard"][difficulty - 1]}
      </Text>
      <Slider minimumValue={1} maximumValue={3} step={1} value={difficulty} onValueChange={setDifficulty} />

      {/* Calories */}
      <Text style={styles.label}>Calories: {calories}</Text>
      <Slider minimumValue={0} maximumValue={2000} step={50} value={calories} onValueChange={setCalories} />

      <Button mode="contained" style={styles.submit} onPress={submit}>
        Submit
      </Button>
    </ScrollView>
  );
};

export default AddRecipeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f8" },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 16 },
  label: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#ccc", padding: 8 },
  row: { flexDirection: "row", alignItems: "center" },
  flexInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, backgroundColor: "#fff", marginRight: 8 },
  wrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  chip: { margin: 4 },
  submit: { marginTop: 20, backgroundColor: "#f5b800", borderRadius: 12 },
});
