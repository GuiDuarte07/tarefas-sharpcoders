class UserService {
  static getUser() {
    return JSON.parse(localStorage.getItem("users"))
  }

  static addUser(user) {
    let users = this.getUser()

    if (!users.length) {
      localStorage.setItem("users", JSON.stringify([user]))
    } else {
      localStorage.setItem("users", JSON.stringify([...users, user]))
    }
  }

  static verifyCredentials(email, password) {
    let users = this.getUser()

    console.log(users)

    let user = users.find(user => {
      if (user.email === email && user.password === password) {
        return user
      }
    });

    return user
  }

  static loginUser(email) {
    localStorage.setItem("session", email)
  }

  static logoutUser() {
    localStorage.setItem("session", null)
  }

  static validateUserData(name, email, password) {
    const errors = {email: [], password: [], name: []};

    let nameErros = this.validateName(name)
    if (nameErros.length) {
      errors.name.push(nameErros);
    }

    let emailErros = this.validateEmail(email)
    if (emailErros.length) {
      errors.email.push(emailErros);
    }

    let passwordErros = this.validatePassword(password)
    if (passwordErros.length) {
      errors.password.push(passwordErros);
    }

    return errors;
  }

  static validateEmail(email) {
    let errors = []
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("E-mail inválido")
    }

    return errors    
  }

  static validatePassword(password) {
    let errors = []
    if(password.length < 6) {
      errors.push("A senha deve ter pelo menos 6 caracteres")
    }

    return errors
  }

  static validateName(name) {
    let errors = []
    if(name.trim() === '') {
      errors.push("Nome não pode estar vazio")
    }
    return errors
  }
}

export default UserService