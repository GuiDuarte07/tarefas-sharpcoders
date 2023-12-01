class Task {
  constructor(id, name, startDate, endDate, description, userEmail, status){
    this.id = id
    this.name = name
    this.startDate = startDate
    this.endDate = endDate
    this.description = description
    this.userEmail = userEmail
    this._status = status
    this.status()
  }


  status() {
    if(this._status === 'Realizada') return this._status

    let dateNow = new Date()

    if(dateNow < this.startDate) {
      this._status = 'Pendente'
    }
    
    if (dateNow >= this.startDate && dateNow <= this.endDate) {
      this._status = 'Em andamento'
    }

    if (dateNow > this.endDate) {
      this._status = 'Em Atraso'
    }

    return this._status
  }

  completeTask() {
    this._status = 'Realizada'
  }
}

export default Task