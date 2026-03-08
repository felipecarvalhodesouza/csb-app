import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Parcial from "../../domain/parcial";

type Props = {
  parcial: Parcial;
  onChangeMandante: (valor: number) => void;
  onChangeVisitante: (valor: number) => void;
};

export default function PartialCard({ parcial, onChangeMandante, onChangeVisitante }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>
        {parcial.periodo <= 4 ? `${parcial.periodo}º QUARTO` : `PRORROGAÇÃO ${parcial.periodo - 4}`}
      </Text>
      <View style={styles.linhaPlacar}>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={2}
          value={String(parcial.placarMandante ?? "")}
          onChangeText={(v) => onChangeMandante(Number(v))}
        />
        <Text style={styles.x}>x</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={2}
          value={String(parcial.placarVisitante ?? "")}
          onChangeText={(v) => onChangeVisitante(Number(v))}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "white", padding: 18, borderRadius: 12, marginBottom: 15 },
    titulo: { textAlign: "center", fontWeight: "600", marginBottom: 12 },
    linhaPlacar: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
    input: { borderWidth: 1, borderColor: "#DDD", width: 60, height: 45, borderRadius: 8, textAlign: "center", fontSize: 18, fontWeight: "600" },
    x: { marginHorizontal: 15, fontSize: 20, fontWeight: "bold" }
});