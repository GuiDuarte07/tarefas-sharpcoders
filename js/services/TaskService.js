import Task from "../model/Task.js"

class TaskService {
  constructor(userEmail) {
    this.userEmail = userEmail
    this.tasks = this.renderTasksFromUser(userEmail)
  }
  renderTasksFromUser(email) {
    let tasksJSON = JSON.parse(localStorage.getItem(email))
    /* 
      Como o JSON.parse não instância objetos date, preciso percorrer as tasks e instanciar elas como Task
     */

    if (!tasksJSON) {
      localStorage.setItem(email, "[]")
      return []
    }

    this.tasks = tasksJSON.map(task => {
      return new Task(task.id, task.name, new Date(task.startDate), new Date(task.endDate), task.description, email, task._status)
    })
    
    return this.tasks
  }

  getTaskFromId(id) {
    let task = this.tasks.find((task) => task.id === id)

    if (!task) return undefined

    return task
  }

  addTask(task) {
    let error = this.validateTask(task.name, task.startDate, task.endDate)
    if (error) return error
    
    let id = this._generateRandomId()
    task.id = id
    this.tasks.push(task)
    this._updateTasks()
  }

  removeTask(taskId) {
    const indexToRemove = this.tasks.findIndex(task => task.id === taskId)

    if (indexToRemove !== -1) {
      this.tasks.splice(indexToRemove, 1)
      this._updateTasks()
    } else {
      throw new Error('Tarefa não encontrada.')
    }
  }

  editTask(updatedTask) {
    const indexToEdit = this.tasks.findIndex(task => task.id === updatedTask.id)

    if (indexToEdit !== -1) {
      this.tasks[indexToEdit] = updatedTask
      this._updateTasks()
    } else {
      throw new Error('Tarefa não encontrada.')
    }
  }

  setCompleteTask(taskId) {
    const indexToComplete = this.tasks.findIndex(task => task.id === taskId)

    if (indexToComplete !== -1) {
      this.tasks[indexToComplete]._status = 'Realizada'
      this._updateTasks()
    } else {
      throw new Error('Tarefa não encontrada.')
    }
  }

  undoCompleteTask(taskId) {
    const indexToUndo = this.tasks.findIndex(task => task.id === taskId)

    if (indexToUndo !== -1) {
      this.tasks[indexToUndo]._status = ''
      this._updateTasks()
    } else {
      throw new Error('Tarefa não encontrada.')
    }
  }

  _updateTasks() {
    // Salvo as alterações no localstorage
    localStorage.setItem(this.userEmail, JSON.stringify(this.tasks))
  }

  validateTask(name, startDate, endDate) {
    if (!name || name.length < 2) return 'Nome inválido'

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'Data inválida'

    if(endDate < startDate) return 'Data de fim precisa ser maior que data de início'

    return null
  }

  orderByTitle(order) {
    if (order === 'DEC') {
      this.tasks.sort((a, b) => {
        const nameA = a.name.toUpperCase() 
        const nameB = b.name.toUpperCase()
        
        if (nameA > nameB) {
          return -1
        }
        if (nameA < nameB) {
          return 1
        }
        return 0
      })
    } else if (order === 'ASC') {
      this.tasks.sort((a, b) => {
        const nameA = a.name.toUpperCase() 
        const nameB = b.name.toUpperCase()
        
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    } else {
      throw new Error('filtro não esperado')
    }
    
  }

  orderByDate(order) {
    if (order === 'ASC') {
      this.tasks.sort((a, b) => {
        const dateA = new Date(a.startDate)
        const dateB = new Date(b.startDate)
    
        return dateA - dateB
      })
    } else if (order === 'DEC') {
      this.tasks.sort((a, b) => {
        const dateA = new Date(a.startDate)
        const dateB = new Date(b.startDate)
    
        return dateB - dateA
      })
    } else {
      throw new Error('filtro não esperado')
    }
    
  }

  orderByStatus(order) {
    if(order === 'ASC') {
      //criando um objeto de status e sua ordem para na lista
      const statusOrder = {
        'Em Atraso': 1,
        'Em andamento': 2,
        'Pendente': 3,
        'Realizada': 4
      }

      this.tasks.sort((a, b) => {
        const statusA = statusOrder[a.status()]
        const statusB = statusOrder[b.status()]

        return statusA - statusB
      })
    } else if (order === 'DEC') {
      //criando um objeto de status e sua ordem para na lista
      const statusOrder = {
        'Em Atraso': 4,
        'Em andamento': 3,
        'Pendente': 2,
        'Realizada': 1
      }
    
      this.tasks.sort((a, b) => {
        const statusA = statusOrder[a.status()]
        const statusB = statusOrder[b.status()]
    
        return statusA - statusB
      })
    } else {
      throw new Error('filtro não esperado')
    }
    
  }

  _generateRandomId() {
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