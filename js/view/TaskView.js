import Task from "../model/Task.js"
import showToast from "../utils/toasts.js"

class TaskView {
  constructor(taskService) {
    this.taskService = taskService
    this.userEmail = taskService.userEmail
  }

  build() {
    this.setForm()
    this.generateTable()
    this.handleFilter()
  }

  setForm() {
    // Criando uma função onSubmit, para a criação de nova tarefa
    let createTaskForm = document.getElementById('createTaskForm')
    createTaskForm.onsubmit = (e) => {
      e.preventDefault()
      // Cada indice do srcElement é um dos inputs, na ordem que aparece
      let taskName = e.srcElement[0].value
      let taskStartDatetime = taskView.dateAndHourToDatehour(e.srcElement[1].value, e.srcElement[2].value)
      let taskEndDatetime = taskView.dateAndHourToDatehour(e.srcElement[3].value, e.srcElement[4].value)
      let TaskDescription = e.srcElement[5].value

      // Aqui eu instâncio uma nova task
      let task = new Task(null, taskName, taskStartDatetime, taskEndDatetime, TaskDescription, userEmail)
      
      // E uso o TaskService para adicionar essa task
      let error = taskService.addTask(task)
      if (error) {
        showToast(`Erro ao cadastrar tarefa: ${error}`, 'text-bg-danger')
        return
      }
      taskView.generateTable()

      Array.from(e.srcElement).forEach(element => {
        // limpar todos os campos menos o input submit
        if (element.type === 'submit') return
        element.value = ''
      })

      showToast('Tarefa Criada com sucesso!', 'text-bg-success')
    }
  }

  generateTable() {
    let tableBody = document.getElementById("taskTableBody")
    tableBody.innerHTML = ''
    this.taskService.tasks.forEach((task, indice) => {
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

  editModal(task) {
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

  getTaskFromEdit() {
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

  _resetOthersFilters() {
    let titleFilterBtn = document.getElementById('titleFilter')
    let dateFilterBtn = document.getElementById('dateFilter')
    let statusFilterBtn = document.getElementById('statusFilter')

    Array.from([titleFilterBtn, dateFilterBtn, statusFilterBtn]).forEach(el => {
      el.setAttribute('data-order', 'ASC')
      el.setAttribute('data-selected', 'false')
      el.classList.remove('active')
      el.innerHTML = '<i class="fa fa-arrow-up"></i>'
    })
  }

  handleFilter() {
    let titleFilterBtn = document.getElementById('titleFilter')
    let dateFilterBtn = document.getElementById('dateFilter')
    let statusFilterBtn = document.getElementById('statusFilter')

    Array.from([titleFilterBtn, dateFilterBtn, statusFilterBtn]).forEach((filterBtn, index) => {
      filterBtn.onclick = () => {
        let orderBy = ''
        let dataOrder = filterBtn.getAttribute('data-order')
        let active = filterBtn.getAttribute('data-selected') === 'true' ? true : false
        this._resetOthersFilters()
        filterBtn.setAttribute('data-selected', 'true')
        filterBtn.classList.add('active')
  
        if (dataOrder === 'ASC') {
          if (active) {
            orderBy = 'DEC'
            filterBtn.setAttribute('data-order', 'DEC')
            filterBtn.innerHTML = '<i class="fa fa-arrow-down"></i>'
          } else {
            orderBy = 'ASC'
            filterBtn.setAttribute('data-order', 'ASC')
            filterBtn.innerHTML = '<i class="fa fa-arrow-up"></i>'
          }
        } else {
          filterBtn.setAttribute('data-order', 'ASC')
          orderBy = 'ASC'
          filterBtn.innerHTML = '<i class="fa fa-arrow-up"></i>'
        }
        
        if (index === 0) {
          this.taskService.orderByTitle(orderBy)
        } else if (index === 1) {
          this.taskService.orderByDate(orderBy)
        } else {
          this.taskService.orderByStatus(orderBy)
        }
        
        this.generateTable()
      }
    })

    
  }

  editTaskHandle() {
    let editTaskBtn = document.getElementById("editTaskBtn")
    let completeTaskBtn =  document.getElementById("completeTaskBtn")
    let deleteTaskBtn =  document.getElementById("deleteTaskBtn")
  
    let taskId = document.getElementById("editTaskBtn").getAttribute('data-id')
    let task = this.taskService.getTaskFromId(taskId)
    if (task.status() === 'Realizada') {
      completeTaskBtn.textContent = 'Marcar como Não Realizada'
      completeTaskBtn.onclick = () => {
        this.taskService.undoCompleteTask(taskId)
        this.generateTable()
        showToast('Tarefa desmarcada como Realizada!', 'text-bg-warning')
      }
    } else {
      completeTaskBtn.textContent = 'Marcar como Realizada'
      completeTaskBtn.onclick = () => {
        this.taskService.setCompleteTask(taskId)
        this.generateTable()
        showToast('Tarefa marcada como Realizada!', 'text-bg-success')
      }
    }
  
    deleteTaskBtn.onclick = () => {
      this.taskService.removeTask(taskId)
      this.generateTable()
      showToast('Tarefa excluida com sucesso!', 'text-bg-danger')
    }
  
    editTaskBtn.onclick = () => {
      let {
        editTaskName,
        editTaskStartDate,
        editTaskStartHour,
        editTaskEndDate,
        editTaskEndHour,
        editTaskDescription
      } = this.getTaskFromEdit()
  
      let editTaskStartDatetime = this.dateAndHourToDatehour(editTaskStartDate, editTaskStartHour)
      let editTaskEndDatetime = this.dateAndHourToDatehour(editTaskEndDate, editTaskEndHour)
      
      let editTask = new Task(taskId, editTaskName, editTaskStartDatetime, editTaskEndDatetime, editTaskDescription, this.userEmail, task.status())
  
      this.taskService.editTask(editTask)
      this.generateTable()
      showToast('Tarefa alterada com sucesso!', 'text-bg-primary')
    }
  }

  formatDate(date) {
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0') // Mês começa do zero
    const ano = date.getFullYear()
    const hora = String(date.getHours()).padStart(2, '0')
    const minutos = String(date.getMinutes()).padStart(2, '0')
  
    return `${dia}/${mes}/${ano} às ${hora}:${minutos}`
  }

  dateAndHourToDatehour(date, hour) {
    const [day, month, year] = date.split('/')
    const [hours, minutes] = hour.split(':')

    return new Date(year, month - 1, day, hours, minutes)
  }

  dateHourToDateAndHour(date) {
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const ano = date.getFullYear()
    const hora = String(date.getHours()).padStart(2, '0')
    const minutos = String(date.getMinutes()).padStart(2, '0')

    return [`${dia}/${mes}/${ano}`, `${hora}:${minutos}`]
  }
}

export default TaskView