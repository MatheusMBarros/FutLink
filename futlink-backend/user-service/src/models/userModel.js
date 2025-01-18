class UserModel {
  constructor({
    id = null,
    username,
    cpf ,
    birth ,
    phone ,
    email,
    password,
    profileImageUri = null,
    height = null,
    weight = null,
    primaryPosition = null,
    secondaryPosition = null,
    manager = false,
    address = null, // Objeto para representar a subcoleção address
  }) {
    this.id = id;
    this.username = username;
    this.cpf = cpf;
    this.birth = birth;
    this.phone = phone;
    this.email = email;
    this.password = password;
    this.profileImageUri = profileImageUri;
    this.height = height;
    this.weight = weight;
    this.primaryPosition = primaryPosition;
    this.secondaryPosition = secondaryPosition;
    this.manager = manager;
    this.address = address || {}; // Inicializa com um objeto vazio se não for fornecido
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      cpf: this.cpf,
      birth: this.birth,
      phone: this.phone,
      email: this.email,
      password: this.password,
      profileImageUri: this.profileImageUri,
      height: this.height,
      weight: this.weight,
      primaryPosition: this.primaryPosition,
      secondaryPosition: this.secondaryPosition,
      manager: this.manager,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(data) {
    this.username = data.username || this.username;
    this.cpf = data.cpf || this.cpf;
    this.birth = data.birth || this.birth;
    this.phone = data.phone || this.phone;
    this.email = data.email || this.email;
    this.password = data.password || this.password;
    this.profileImageUri = data.profileImageUri || this.profileImageUri;
    this.height = data.height || this.height;
    this.weight = data.weight || this.weight;
    this.primaryPosition = data.primaryPosition || this.primaryPosition;
    this.secondaryPosition = data.secondaryPosition || this.secondaryPosition;
    this.manager = data.manager !== undefined ? data.manager : this.manager;
    this.address = data.address || this.address;
    this.updatedAt = new Date();
  }
}

module.exports = UserModel;
