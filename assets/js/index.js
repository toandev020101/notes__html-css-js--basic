const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const appElement = $('.app')
const noteAddElement = $('.note__add')

const modalElement = $('.modal')
const modalOverlayElement = $('.modal__overlay')
const modalCloseElement = $('.body__header-closeIcon')

const formElement = $('.body__form')

const localStorageKey = 'Notes'

const app = {
	notes: JSON.parse(localStorage.getItem(localStorageKey)) || [],

	saveLocalStorage: function () {
		localStorage.setItem(localStorageKey, JSON.stringify(this.notes))
	},

	noteElement: function (note) {
		return `<div data-index="${note.id}" class="note">
							<h3 class="note__title">${note.title}</h3>
							<p class="note__content">${note.content}</p>
							<footer class="note__footer">
								<div class="note__footer-date">${note.date}</div>
								<i class='note__footer-action-icon bx bx-dots-vertical-rounded'>
									<div class="menu">
										<div class="menu__action">
											<i class='menu__action-icon bx bx-edit-alt'></i>
											<span class="menu__action-text">Chỉnh sửa</span>
										</div>

										<div class="menu__action">
											<i class='menu__action-icon bx bx-trash-alt'></i>
											<span class="menu__action-text">Xóa</span>
										</div>
									</div>
								</i>
							</footer>
						</div>`
	},

	closeModal: function () {
		modalElement.style.display = 'flex'
	},

	handleEvents: function () {
		const _this = this

		// xử lý sự kiện mở modal
		noteAddElement.onclick = function () {
			modalElement.style.display = 'flex'
		}

		// xử lý sự kiện đóng modal
		modalOverlayElement.onclick = function () {
			modalElement.style.display = 'none'
		}

		modalCloseElement.onclick = function () {
			modalElement.style.display = 'none'
		}

		// xử lý thêm / cập nhật ghi chú
		formElement.onsubmit = function (e) {
			e.preventDefault()

			const submitElement = formElement.elements[3]
			const idNote = formElement.elements[2].value
			const titleInputElement = formElement.title
			const contentInputElement = formElement.content

			if (submitElement.textContent.toLowerCase() === 'thêm ghi chú') {
				// thêm vào notes
				let idLast = 0
				if (_this.notes.length > 0) {
					idLast = _this.notes[0].id + 1
				}
				_this.notes.unshift({
					id: idLast,
					title: titleInputElement.value,
					content: contentInputElement.value,
					date: new Date().toLocaleDateString('en-US', {
						hour: 'numeric',
						minute: 'numeric',
						second: 'numeric',
						month: 'long',
						day: 'numeric',
						year: 'numeric',
					}),
				})

				// thêm vào html
				appElement.insertAdjacentHTML(
					'afterbegin',
					_this.noteElement(_this.notes[0]),
				)
			} else {
				const noteIndex = _this.notes.findIndex(
					(note) => note.id === parseInt(idNote),
				)

				// sửa danh sách
				_this.notes.splice(noteIndex, 1)
				_this.notes.unshift({
					id: parseInt(idNote),
					title: titleInputElement.value,
					content: contentInputElement.value,
					date: new Date().toLocaleDateString('en-US', {
						hour: 'numeric',
						minute: 'numeric',
						second: 'numeric',
						month: 'long',
						day: 'numeric',
						year: 'numeric',
					}),
				})

				// sửa html
				$$('.note')[noteIndex].remove()

				appElement.insertAdjacentHTML(
					'afterbegin',
					_this.noteElement(_this.notes[0]),
				)
			}

			// đóng / reset modal
			modalElement.style.display = 'none'
			titleInputElement.value = ''
			contentInputElement.value = ''

			// lưu vào localStorage
			_this.saveLocalStorage()
		}

		// xử lý  hành động
		appElement.onclick = function (e) {
			const btn = e.target

			// mở / đóng cửa sổ
			if (btn.classList.contains('note__footer-action-icon')) {
				const menuElement = btn.firstElementChild
				menuElement.style.display =
					menuElement.style.display === 'block' ? 'none' : 'block'
			} else if (
				btn.classList.contains('menu__action') ||
				btn.classList.contains('menu__action-icon') ||
				btn.classList.contains('menu__action-text')
			) {
				// sửa / xóa
				let actionElement
				let menuElement
				if (btn.classList.contains('menu__action')) {
					actionElement = btn.lastElementChild
					menuElement = btn.parentElement
				} else if (btn.classList.contains('menu__action-icon')) {
					actionElement = btn.parentElement.lastElementChild
					menuElement = btn.parentElement.parentElement
				} else {
					actionElement = btn
					menuElement = btn.parentElement.parentElement
				}

				const noteElement =
					menuElement.parentElement.parentElement.parentElement
				const noteIndex = _this.notes.findIndex(
					(note) => note.id === parseInt(noteElement.dataset.index),
				)

				// sửa
				if (actionElement.textContent.toLowerCase() === 'chỉnh sửa') {
					modalElement.style.display = 'flex'
					menuElement.style.display = 'none'

					$('.body__header-title').textContent = 'Sửa một ghi chú'
					$('.body__form-submit').textContent = 'Lưu ghi chú'

					const note = _this.notes[noteIndex]
					$('#title').value = note.title
					$('#content').value = note.content
					$('#id').value = note.id
				} else {
					_this.notes.splice(noteIndex, 1)

					// sửa html
					$$('.note')[noteIndex].remove()

					// lưu vào localStorage
					_this.saveLocalStorage()
				}
			}
		}
	},

	render: function () {
		let htmls = []
		this.notes.forEach((note) => {
			htmls.push(this.noteElement(note))
		})

		if (htmls.length > 0) {
			appElement.insertAdjacentHTML('afterbegin', htmls.join(''))
		}
	},

	start: function () {
		// Render
		this.render()

		// Lắng nghe / xử lý các sự kiện (DOM Events)
		this.handleEvents()
	},
}

app.start()
