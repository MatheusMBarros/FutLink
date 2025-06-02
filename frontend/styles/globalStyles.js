// styles/globalStyles.js
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121218",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: "#121218",
  },
  formContainer: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: "#121218",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00e676",
    marginBottom: 24,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 24,
    textAlign: "center",
    letterSpacing: 0.8,
  },
  logo: {
    width: 300,
    height: 80,
    alignSelf: "center",
    marginBottom: 24,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    color: "#00e676",
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 14,
    letterSpacing: 1,
  },
  input: {
    width: "100%",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: "400",
    borderWidth: 1,
    borderColor: "#303043",

    elevation: 1,
    marginBottom: 12,
  },
  inputFocused: {
    borderColor: "#00C853",
  },
  button: {
    backgroundColor: "#00e676",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    width: "100%",

    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: "#1e1e2f",
    borderWidth: 1.5,
    borderColor: "#00e676",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    width: "100%",

    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#058d20",
  },
  buttonText: {
    color: "#121218",
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 1.2,
  },
  link: {
    color: "#00e676",
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  safeArea: {
    flex: 1,
    padding: 40,
    backgroundColor: "#121218",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#00e676",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 14,
  },
  card: {
    backgroundColor: "#1e1e2f",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,

    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    color: "#00e676",
    fontWeight: "700",
    marginBottom: 8,
  },
  itemText: {
    color: "#ddd",
    fontSize: 15,
    marginBottom: 4,
  },
  map: {
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  emptyText: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  separator: {
    width: "80%",
    height: 1,
    backgroundColor: "#333",
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: "#1e1e2f",
    width: "100%",
    padding: 16,
    borderRadius: 10,
    marginBottom: 30,
    borderColor: "#303043",
    borderWidth: 1,
  },
  logoutButton: {
    backgroundColor: "#FF5555",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  name: {
    fontSize: 24,
    color: "#00C853",
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 8,
  },
  info: {
    fontSize: 15,
    color: "#bbb",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#00C853",
    marginTop: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
