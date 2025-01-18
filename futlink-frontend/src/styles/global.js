import { StyleSheet } from 'react-native';

const colors = {
  primary: '#00AEEF', // Azul FutLink
  secondary: '#82db54', // Verde
  background: '#253040', // Fundo Claro
  textPrimary: '#FFF', // Texto branco
  textSecondary: '#B0B0B0', // Texto cinza claro
  error: '#FF5252', // Vermelho para erros
};

const spacing = {
  small: 8,
  medium: 16,
  large: 24,
};

const typography = {
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.medium,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.small,
  },
  body: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  link: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: spacing.small,
  },
};

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.medium,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    padding: spacing.small,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8, // Borda mais arredondada
    marginBottom: spacing.medium,
    color: colors.textPrimary,
    backgroundColor: '#35414F', // Fundo mais suave para inputs
    fontSize: 16, // Melhor legibilidade
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.small,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.medium,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: spacing.small,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: spacing.large,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  profileImageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    marginBottom: 10,
  },
  placeholderContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.medium,
    backgroundColor: '#35414F', // Fundo mais suave
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Garantir que o conteúdo seja bem distribuído
  },

  pickerLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: spacing.small, // Ajustando o espaçamento
  },

  picker: {
    flex: 1, // Garantir que o Picker ocupe todo o espaço disponível
    height: 40,
    color: colors.textPrimary, // Para garantir que o texto seja visível
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export { colors, spacing, typography, globalStyles };
