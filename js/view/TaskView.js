import Task from "../model/Task.js"
import TaskService from "../services/TaskService.js"
import UserService from "../services/UserService.js"

class TaskView {
  static generateTable(tasks) {
    let tableBody = document.getElementById("taskTableBody")
    tableBody.innerHTML = ''
    tasks.forEach((task, indice) => {
      const trElement = document.createElement('tr')

      const tdName = document.createElement('td')
      const detailsButton = document.createElement('button')
      detailsButton.type = 'button'
      detailsButton.classList.add('fw-bold')
      detailsButton.setAttribute('data-bs-toggle', 'modal')
      detailsButton.setAttribute('data-bs-target', '#task'+indice)
      detailsButton.innerHTML =  `<ins>${task.name}</ins>`
      tdName.appendChild(detailsButton)
      tdName.innerHTML += 
      `
      <div class="modal fade" id="task${indice}" tabindex="-1" aria-labelledby="task${indice}" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title">${task.name}</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
              </button>
            </div>
            <div class="modal-body">${task.description}</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
              </div>
          </div>
        </div>
      </div>
      `
      
      const tdStartDate = document.createElement('td')
      tdStartDate.textContent = this.formatDate(task.startDate)

      const tdEndDate = document.createElement('td')
      tdEndDate.textContent = this.formatDate(task.endDate)

      const tdStatus = document.createElement('td')
      tdStatus.textContent = task.status()
      tdStatus.classList.add('fw-bold')
      switch (task.status()) {
        case 'Pendente':
          tdStatus.classList.add('text-warning')
          break
        case 'Em andamento':
          tdStatus.classList.add('text-info')
          break
        case 'Em Atraso':
          tdStatus.classList.add('text-danger')
          break
        case 'Realizada':
          tdStatus.classList.add('text-success')
          break
      }

      // Botão de Alterar task e sua lógica
      const tdEdit = document.createElement('td')
      const btnEdit = document.createElement('button')
      btnEdit.textContent = 'Alterar'
      btnEdit.classList.add('btn', 'btn-warning')
      btnEdit.setAttribute('data-bs-toggle', 'modal')
      btnEdit.setAttribute('data-bs-target', '#editTask')
      btnEdit.type = 'button'
      btnEdit.onclick = () => this.editModal(task)
      tdEdit.appendChild(btnEdit)

      
      Array.from([tdName, tdStartDate, tdEndDate, tdStatus, tdEdit]).forEach(el => {trElement.appendChild(el)})

      tableBody.appendChild(trElement)
    })
  }

  static editModal(task) {
    document.getElementById("editTaskBtn").setAttribute('data-id', task.id)
    document.getElementById("completeTaskBtn").setAttribute('data-id', task.id)
    document.getElementById("deleteTaskBtn").setAttribute('data-id', task.id)


    let editTaskNameInput = document.getElementById("editTaskName")
    let editTaskStartDateInput = document.getElementById("editTaskStartDate")
    let editTaskStartHourInput = document.getElementById("editTaskStartHour")
    let editTaskEndDateInput = document.getElementById("editTaskEndDate")
    let editTaskEndHourInput = document.getElementById("editTaskEndHour")
    let editTaskDescriptionInput = document.getElementById("editTaskDescription")

    editTaskNameInput.value = task.name

    let [startDate, startHour] = this.dateHourToDateAndHour(task.startDate)
    let [endDate, endHour] = this.dateHourToDateAndHour(task.endDate)
    editTaskStartDateInput.value = startDate
    editTaskStartHourInput.value = startHour
    editTaskEndDateInput.value = endDate
    editTaskEndHourInput.value = endHour
    editTaskDescriptionInput.value = task.description

    this.editTaskHandle()
  }

  static getTaskFromEdit() {
    let editTaskName = document.getElementById("editTaskName").value
    let editTaskStartDate = document.getElementById("editTaskStartDate").value
    let editTaskStartHour = document.getElementById("editTaskStartHour").value
    let editTaskEndDate = document.getElementById("editTaskEndDate").value
    let editTaskEndHour = document.getElementById("editTaskEndHour").value
    let editTaskDescription = document.getElementById("editTaskDescription").value

    return {
      editTaskName,
      editTaskStartDate,
      editTaskStartHour,
      editTaskEndDate,
      editTaskEndHour,
      editTaskDescription,
    }
  }

  static editTaskHandle() {
    let userEmail = UserService.getSession()
    let editTaskBtn = document.getElementById("editTaskBtn")
    let completeTaskBtn =  document.getElementById("completeTaskBtn")
    let deleteTaskBtn =  document.getElementById("deleteTaskBtn")
  
    let taskId = document.getElementById("editTaskBtn").getAttribute('data-id')
    let task = TaskService.getTaskFromId(userEmail, taskId)
    if (task.status() === 'Realizada') {
      completeTaskBtn.textContent = 'Marcar como Não Realizada'
      completeTaskBtn.onclick = () => TaskService.undoCompleteTask(taskId, userEmail)
    } else {
      completeTaskBtn.textContent = 'Marcar como Realizada'
      completeTaskBtn.onclick = () => TaskService.setCompleteTask(taskId, userEmail)
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
      
      let editTask = new Task(taskId, editTaskName, editTaskStartDatetime, editTaskEndDatetime, editTaskDescription, userEmail, task.status())
  
      TaskService.editTask(editTask)
    }
  }

  static formatDate(date) {
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0') // Mês começa do zero
    const ano = date.getFullYear()
    const hora = String(date.getHours()).padStart(2, '0')
    const minutos = String(date.getMinutes()).padStart(2, '0')
  
    return `${dia}/${mes}/${ano} às ${hora}:${minutos}`
  }

  static dateAndHourToDatehour(date, hour) {
    const [day, month, year] = date.split('/')
    const [hours, minutes] = hour.split(':')

    return new Date(year, month - 1, day, hours, minutes)
  }

  static dateHourToDateAndHour(date) {
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const ano = date.getFullYear()
    const hora = String(date.getHours()).padStart(2, '0')
    const minutos = String(date.getMinutes()).padStart(2, '0')

    return [`${dia}/${mes}/${ano}`, `${hora}:${minutos}`]
  }
}

export default TaskView