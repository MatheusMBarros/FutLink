import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { globalStyles, typography, colors } from '../styles/global';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';


export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [type, setType] = useState('atleta');
    const [imageId, setImageId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const imagePickerRef = useRef(null);


    useEffect(() => {
        // Solicitar permissão para acessar a câmera e a galeria
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('É necessário permitir o acesso à galeria de imagens');
                    return;
                }

                const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
                if (cameraStatus.status !== 'granted') {
                    alert('É necessário permitir o acesso à câmera');
                }
            }
        })();
    }, []);


    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        const user = {
            username,
            email,
            password,
            cpf,
            type,
            imageId,
        };

        console.log("Cadastro do usuário:", user);
        // Aqui você adicionaria a lógica de salvar no banco de dados

        // Após o cadastro, redireciona o usuário
        navigation.navigate('HomeScreen');
    };

    const handleImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaType: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImageId(result.assets[0].uri);
        }
         setModalVisible(false);
    };

    const handleCameraCapture = async () => {
    // Solicitar permissão para acessar a câmera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        alert('É necessário permitir o acesso à câmera');
        return;
    }

    let result = await ImagePicker.launchCameraAsync({
        mediaType: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
    });

    if (!result.canceled) {
        setImageId(result.assets[0].uri);
    }
    setModalVisible(false);
};

    
  const openModal = () => {
      setModalVisible(true);
  };
  const closeModal = () => {
      setModalVisible(false);
  };
  
  
  const renderImagePickerModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity
                        style={styles.imageButton}
                        onPress={handleImagePick}
                    >
                        <Text style={styles.buttonText}>Escolher da Galeria</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.imageButton}
                        onPress={handleCameraCapture}
                    >
                        <Text style={styles.buttonText}>Tirar Foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                      <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={globalStyles.container}>
            <Text style={typography.title}>Cadastro</Text>
          
          {/* Seção de foto de perfil */}
             <View style={styles.profileImageContainer}>
                    <TouchableOpacity onPress={openModal} ref={imagePickerRef} >
                    {imageId ? (
                        <Image source={{ uri: imageId }} style={styles.profileImage} />
                    ) : (
                            <View style={styles.placeholderContainer}>
                                <MaterialIcons name="camera-alt" size={40} color={colors.textSecondary} />
                                <Text style={styles.placeholderText}>Foto de Perfil</Text>
                            </View>
                    )}
                    </TouchableOpacity>
             </View>
              {renderImagePickerModal()}

            {/* Campos de entrada */}
            <TextInput
                style={globalStyles.input}
                placeholder="Nome de Usuário"
                placeholderTextColor={colors.textSecondary}
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Digite seu email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Escolha uma senha"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Confirme a senha"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Digite seu CPF"
                placeholderTextColor={colors.textSecondary}
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
            />

            {/* Campo de tipo de usuário */}
            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Tipo de Usuário</Text>
                <Picker
                    selectedValue={type}
                    style={styles.picker}
                    onValueChange={(itemValue) => setType(itemValue)}
                >
                    <Picker.Item label="Atleta" value="atleta" />
                    <Picker.Item label="Treinador" value="treinador" />
                    <Picker.Item label="Organizador" value="organizador" />
                </Picker>
            </View>

            {/* Botão de cadastro */}
            <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
                <Text style={globalStyles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            {/* Link para login */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={typography.link}>Já tem uma conta? Faça login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
     
       fontSize:14,
       marginTop:5
  },
 imageButton: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    pickerLabel: {
      fontSize: 16,
      marginRight: 8,
      color: colors.textPrimary,
    },
    picker: {
        flex: 1,
       height: 40,
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