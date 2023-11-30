//JS para controlar login e sign-in
import User from "./model/User.js"
import UserService from "./services/UserService.js"

let nameRegisterInput = document.getElementById("register-name")
let emailRegisterInput = document.getElementById("register-email")
let passwordRegisterInput = document.getElementById("register-password")
let invalidLoginCredentialsText = document.getElementById("invalid-login-credentials")

console.log(nameRegisterInput)

function formsSubmit() {
  let loginForm = document.getElementById("form-login")
  loginForm.onsubmit = function(e) {
    e.preventDefault()
    console.log(e)
    
    let email = document.getElementById("login-email").value
    let password = document.getElementById("login-password").value

    let user = UserService.verifyCredentials(email, password)

    if (user === undefined) {
      //login falhou
      invalidLoginCredentialsText.style.display = 'block'
      return
    }

    UserService.loginUser(user.email)

    window.location.href = "index.html"
  }

  document.getElementById("form-register").onsubmit = function(e) {
    e.preventDefault()
    
    let name = nameRegisterInput.value
    let email = emailRegisterInput.value
    let password = passwordRegisterInput.value

    let errors = UserService.validateUserData(name, email, password)
    console.log(errors)
    console.log(errors.email.length, errors.name.length, errors.password.length)
    console.log(errors.email.length > 0 || errors.name.length > 0 || errors.password.length > 0)

    if (errors.email.length > 0 || errors.name.length > 0 || errors.password.length > 0) {
      throw new Error("Credenciais inválidas")
    }

    let user = new User(name, email, password)

    UserService.addUser(user)
  }
}

function showInvalidText(inputElement, errors) {
  console.log(errors)
  if (errors.length) {
    inputElement.classList.add("is-invalid")
    console.log(inputElement.nextElementSibling)
    inputElement.nextElementSibling.innerHTML = errors[0]
  } else {
    inputElement.classList.add("is-valid") 
    inputElement.classList.remove("is-invalid")
  }
}

function validateInputs() {
  nameRegisterInput.oninput = (event) => {
    let errors = UserService.validateName(event.target.value)
    showInvalidText(nameRegisterInput, errors)
  }

  emailRegisterInput.oninput = (event) => {
    let errors = UserService.validateEmail(event.target.value)
    showInvalidText(emailRegisterInput, errors)
    
  }

  passwordRegisterInput.oninput = (event) => {
    let errors = UserService.validatePassword(event.target.value)
    showInvalidText(passwordRegisterInput, errors)
  }
}

validateInputs()
formsSubmit()