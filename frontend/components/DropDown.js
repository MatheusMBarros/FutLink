import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function CustomDropdown({
  label,
  open,
  setOpen,
  value,
  setValue,
  items,
  setItems,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={{ color: "#fff" }}
        listItemLabelStyle={{ color: "#fff" }}
        placeholder="Selecione uma opção"
        zIndex={1000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    fontWeight: "500",
  },
  dropdown: {
    borderColor: "#555",
    backgroundColor: "#1e1e2f",
  },
  dropdownContainer: {
    backgroundColor: "#2C2C3E",
    borderWidth: 0,
  },
});
