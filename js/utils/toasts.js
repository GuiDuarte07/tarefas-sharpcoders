function showToast(message, textBgColor = '') {
  const existingToast = document.querySelector('.toast')

  // Verifica se o toast já existe para reutilização
  const toast = existingToast || document.createElement('div')
  toast.classList.remove(...toast.classList)
  toast.classList.add('toast', 'align-items-center', 'border-0', 'position-fixed', 'top-0', 'start-0', 'm-4', textBgColor)


  // Monta o conteúdo do toast
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  `

  // Se não existir, adiciona o toast ao corpo do documento
  if (!existingToast) {
    document.body.appendChild(toast)
  }

  console.log('dsds')

  // Exibe o toast
  const bootstrapToast = new bootstrap.Toast(toast)
  bootstrapToast.show()
}

export default showToast