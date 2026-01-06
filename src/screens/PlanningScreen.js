import React, { useMemo, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

function formatDateYYYYMMDD(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function PlanningScreen({ route, navigation }) {
  const userName = route?.params?.userName;

  const [sport, setSport] = useState(null); // "Football" | "Basketball"
  const [dateObj, setDateObj] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedDate = useMemo(() => formatDateYYYYMMDD(dateObj), [dateObj]);

  const checkWeather = async () => {
    if (!sport) {
      Alert.alert("Erreur", "Choisissez d'abord un sport (Football ou Basketball).");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Exemple TP (Casablanca env. latitude=33.6 longitude=-7.6)
      const url =
        "https://api.open-meteo.com/v1/forecast?latitude=33.6&longitude=-7.6&daily=precipitation_sum&timezone=auto";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Erreur réseau");

      const data = await res.json();

      // Open-Meteo renvoie daily.time[] et daily.precipitation_sum[]
      const times = data?.daily?.time ?? [];
      const rains = data?.daily?.precipitation_sum ?? [];

      const idx = times.indexOf(selectedDate);

      if (idx === -1) {
        // La date choisie n'est pas dans la période de prévision renvoyée
        setMessage(
          `Aucune prévision disponible pour ${selectedDate}. Choisissez une date dans la plage renvoyée par l'API.`
        );
        return;
      }

      const rain = Number(rains[idx] ?? 0);

      // Règle métier demandée
      if (rain > 0) {
        setMessage("Il est conseillé de jouer au Basket (sport en salle) : il est prévu de la pluie.");
      } else {
        setMessage("Vous pouvez planifier un match de Football : pas de pluie prévue.");
      }
    } catch (e) {
      setMessage("Impossible de vérifier la météo. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planification sportive</Text>

      {!!userName && <Text style={styles.subtitle}>Bienvenue, {userName}</Text>}

      <Text style={styles.label}>1) Choisir un sport</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.choiceBtn, sport === "Football" && styles.choiceBtnActive]}
          onPress={() => setSport("Football")}
        >
          <Text style={styles.choiceText}>Football</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.choiceBtn, sport === "Basketball" && styles.choiceBtnActive]}
          onPress={() => setSport("Basketball")}
        >
          <Text style={styles.choiceText}>Basketball</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>2) Choisir une date</Text>
      <View style={styles.row}>
        <Text style={styles.dateText}>{selectedDate}</Text>
        <Button title="Changer" onPress={() => setShowPicker(true)} />
      </View>

      {showPicker && (
        <DateTimePicker
          value={dateObj}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setDateObj(date);
          }}
        />
      )}

      <Text style={styles.label}>3) Vérifier la météo (API)</Text>
      <Button title="Vérifier la météo et conseiller" onPress={checkWeather} />

      <View style={{ height: 16 }} />

      {loading && <ActivityIndicator size="large" />}

      {!!message && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{message}</Text>
        </View>
      )}

      <View style={{ height: 16 }} />

      <Button
        title="Déconnexion"
        onPress={() => navigation.replace("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subtitle: { marginBottom: 16, fontSize: 16 },
  label: { marginTop: 14, marginBottom: 8, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  choiceBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  choiceBtnActive: { borderColor: "#333" },
  choiceText: { fontWeight: "600" },
  dateText: { fontSize: 16, flex: 1 },
  resultBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resultText: { fontSize: 16 },
});