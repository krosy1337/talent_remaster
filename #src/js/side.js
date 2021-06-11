function startSide() {
	const side = document.querySelector('.side')

	if (side) {
		const menuBtn = document.querySelector('.menu-btn')
		const layout = document.querySelector('.layout')
		const sideArrow = document.querySelector('.side__arrow')

		function exitHandler() {
			side.classList.remove('active')
			layout.classList.remove('active')

			this.removeEventListener('click', exitHandler)
		}

		menuBtn.addEventListener('click', () => {
			side.classList.add('active')
			layout.classList.add('active')

			sideArrow.addEventListener('click', exitHandler)
			layout.addEventListener('click', exitHandler)
		})
	}
}

export default startSide
