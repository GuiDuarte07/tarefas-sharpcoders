import TaskView from "./view/TaskView.js"
import Task from "./model/Task.js"
import UserService from "./services/UserService.js"
import TaskService from "./services/TaskService.js"
import showToast from "./utils/toasts.js"

// Pegando o email do usuário logado para uso posterior
let userEmail = UserService.getSession()
console.log(userEmail)
// Caso não exista, o usuário não está logado
if (!userEmail) {
  window.location.href = 'login.html'
}

let logoutBtn = document.getElementById('logout')
logoutBtn.onclick = () => {
  UserService.logoutUser()
  window.location.href = 'login.html'
}

// Adicionando o nome do usuário na mensagem de bem-vindo
let welcomeMessage = document.getElementById("welcome")
welcomeMessage.innerText += UserService.getUser(userEmail).name


let taskService = new TaskService(userEmail)

let taskView = new TaskView(taskService) 
taskView.build()
