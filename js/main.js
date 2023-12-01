import TaskView from "./view/TaskView.js"
import Task from "./model/Task.js"
import UserService from "./services/UserService.js"
import TaskService from "./services/TaskService.js"

// Pegando o email do usuário logado para uso posterior
let userEmail = UserService.getSession()
// Caso não exista, o usuário não está logado
if (!userEmail) {
  window.location.href = 'login.html'
}

// Mostrando todos as tarefas do usuário
TaskService.refreshTaks(userEmail)

// Adicionando o nome do usuário na mensagem de bem-vindo
let welcomeMessage = document.getElementById("welcome")
welcomeMessage.innerText += UserService.getUser(userEmail).name


// Criando uma função onSubmit, para a criação de nova tarefa
let createTaskForm = document.getElementById('createTaskForm')
createTaskForm.onsubmit = (e) => {
  e.preventDefault()
  // Cada indice do srcElement é um dos inputs, na ordem que aparece
  let taskName = e.srcElement[0].value
  let taskStartDatetime = TaskView.dateAndHourToDatehour(e.srcElement[1].value, e.srcElement[2].value)
  let taskEndDatetime = TaskView.dateAndHourToDatehour(e.srcElement[3].value, e.srcElement[4].value)
  let TaskDescription = e.srcElement[5].value

  // Aqui eu instâncio uma nova task
  let task = new Task(null, taskName, taskStartDatetime, taskEndDatetime, TaskDescription, userEmail)
  
  // E uso o TaskService para adicionar essa task
  TaskService.addTask(task)
}

/* function editTaskHandle() {
  let editTaskBtn = document.getElementById("editTaskBtn")
  let completeTaskBtn =  document.getElementById("completeTaskBtn")
  let deleteTaskBtn =  document.getElementById("deleteTaskBtn")

  let taskId = document.getElementById("editTaskBtn").getAttribute('data-id')
  let task = TaskService.getTaskFromId(userEmail, taskId)
  
  if (task.status() === 'Realizada') {
    completeTaskBtn.textContent = 'Marcar como Não Realizada'
    completeTaskBtn.onclick = () => TaskService.setCompleteTask(taskId, userEmail)
  } else {
    completeTaskBtn.textContent = 'Marcar como Realizada'
    completeTaskBtn.onclick = () => TaskService.undoCompleteTask(taskId, userEmail)
  }

  deleteTaskBtn.onclick = () => TaskService.removeTask(taskId, userEmail)

  editTaskBtn.onclick = () => {
    let {
      editTaskName,
      editTaskStartDate,
      editTaskStartHour,
      editTaskEndDate,
      editTaskEndHour,
      editTaskDescription
    } = TaskView.getTaskFromEdit()

    let editTaskStartDatetime = TaskView.dateAndHourToDatehour(editTaskStartDate, editTaskStartHour)
    let editTaskEndDatetime = TaskView.dateAndHourToDatehour(editTaskEndDate, editTaskEndHour)
    
    let editTask = new Task(taskId, editTaskName, editTaskStartDatetime, editTaskEndDatetime, editTaskDescription, userEmail)

    TaskService.editTask(editTask)
  }
}

editTaskHandle() */