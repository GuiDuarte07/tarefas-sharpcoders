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
      return new Task(task.id, task.name, new Date(task.startDate), new Date(task.endDate), task.description, email, task._status)
    })
    
    
    return tasks
  }

  static getTaskFromId(email, id) {
    let tasks = this.getTasksFromUser(email)
    /* 
      Como o JSON.parse não instância objetos date, preciso percorrer as tasks e instanciar elas como Task
     */

    let task = tasks.find((task) => task.id === id)

    if (!task) return undefined

    return task
  }

  static addTask(task) {
    let id = this._generateRandomId()
    task.id = id
    let tasks = this.getTasksFromUser(task.userEmail)
    tasks.push(task)
    this._updateTasks(task.userEmail, tasks)
  }

  static removeTask(taskId, email) {
    const tasks = this.getTasksFromUser(email)
    const indexToRemove = tasks.findIndex(task => task.id === taskId)

    if (indexToRemove !== -1) {
      tasks.splice(indexToRemove, 1)
      this._updateTasks(email, tasks)
    } else {
      console.log('Tarefa não encontrada.')
    }
  }

  static editTask(updatedTask) {
    const tasks = this.getTasksFromUser(updatedTask.userEmail)
    const indexToEdit = tasks.findIndex(task => task.id === updatedTask.id)

    if (indexToEdit !== -1) {
      tasks[indexToEdit] = updatedTask
      this._updateTasks(updatedTask.userEmail, tasks)
    } else {
      console.log('Tarefa não encontrada.')
    }
  }

  static setCompleteTask(taskId, email) {
    
    const tasks = this.getTasksFromUser(email)
    const indexToComplete = tasks.findIndex(task => task.id === taskId)

    if (indexToComplete !== -1) {
      tasks[indexToComplete]._status = 'Realizada'
      this._updateTasks(email, tasks)
    } else {
      console.log('Tarefa não encontrada.')
    }
  }

  static undoCompleteTask(taskId, email) {
    
    const tasks = this.getTasksFromUser(email)
    const indexToUndo = tasks.findIndex(task => task.id === taskId)

    if (indexToUndo !== -1) {
      tasks[indexToUndo]._status = ''
      this._updateTasks(email, tasks)
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