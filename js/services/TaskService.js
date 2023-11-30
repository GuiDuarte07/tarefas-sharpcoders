import Task from "../model/Task.js"
import TaskView from "../view/TaskView.js"

class TaskService {
  static getTasksFromUser(email) {
    let tasksJSON = JSON.parse(localStorage.getItem(email))
    /* 
      Como o JSON.parse não instância objetos date, preciso percorrer as tasks e instanciar elas como Task
     */

    if (!tasksJSON) {
      localStorage.setItem(email, "[]")
      return []
    }

    let tasks = tasksJSON.map(task => {
      return new Task(task.id, task.name, new Date(task.startDate), new Date(task.endDate), task.description, email)
    })
    
    
    return tasks
  }

  static getTaskFromId(email, id) {
    let tasksJSON = JSON.parse(localStorage.getItem(email))
    /* 
      Como o JSON.parse não instância objetos date, preciso percorrer as tasks e instanciar elas como Task
     */

    let task = tasksJSON.find((task) => task.id === id)

    if (!task) return undefined

    return new Task(id, task.name, new Date(task.startDate), new Date(task.endDate), task.description, email)
  }

  static addTask(task) {
    let id = this._generateRandomId()
    task.id = id
    let tasks = this.getTasksFromUser(task.userEmail)
    tasks.push(task)
    this._updateTasks(task.userEmail, tasks)
  }

  static removeTask(taskToRemove) {
    const tasks = this.getTasksFromUser(taskToRemove.userEmail)
    const indexToRemove = tasks.findIndex(task => task.id === taskToRemove.id)

    if (indexToRemove !== -1) {
      tasks.splice(indexToRemove, 1)
      this._updateTasks(taskToRemove.userEmail, tasks)
    } else {
      console.log('Tarefa não encontrada.')
    }
  }

  static editTask(updatedTask) {
    const tasks = this.getTasksFromUser(updatedTask.userEmail)
    const indexToEdit = tasks.findIndex(task => task.id === updatedTask.id)

    console.log(updatedTask, tasks, indexToEdit)

    if (indexToEdit !== -1) {
      tasks[indexToEdit] = updatedTask
      this._updateTasks(updatedTask.userEmail, tasks)
    } else {
      console.log('Tarefa não encontrada.')
    }
  }

  static refreshTaks(email) {
    this._updateTasks(email, this.getTasksFromUser(email))
  }

  /* 
    Em tese teria um controller que repeceria os dados da taskService (ou repository) e depois enviaria
    para o a view, porém como não tenho um taskController, a responsabilidade de alterar a view estou 
    enviando para o TaskService através desse metódo privado. Assim, eu não preciso me preocupar em 
    executar a view sempre que usar o TaskService
   */
  static _updateTasks(email, tasks) {
    // Salvo as alterações no localstorage
    localStorage.setItem(email, JSON.stringify(tasks))
    // Gera uma alteração na VIEW
    TaskView.generateTable(tasks)
  }

  static _generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const idLength = 8 // Tamanho do id
    let randomId = ''

    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomId += characters.charAt(randomIndex)
    }

    return randomId
  }
}

export default TaskService