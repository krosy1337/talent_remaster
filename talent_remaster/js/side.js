function getScrollWidth() {
	let div = document.createElement('div');

	div.style.overflowY = 'scroll';
	div.style.width = '50px';
	div.style.height = '50px';

	document.body.append(div);

	let scrollWidth = div.offsetWidth - div.clientWidth;

	div.remove();

	return scrollWidth
}

function startSide() {
	const side = document.querySelector('.side')

	if (side) {
		const menuBtn = document.querySelector('.menu-btn')
		const layout = document.querySelector('.layout')
		const sideArrow = document.querySelector('.side__arrow')
		const scrollWidth = getScrollWidth()

		function exitHandler() {
			side.classList.remove('active')
			layout.classList.remove('active')
			side.addEventListener('transitionend', () => {
				document.body.classList.remove('lock')
				document.body.style.paddingRight = ''
			})


			this.removeEventListener('click', exitHandler)
		}

		menuBtn.addEventListener('click', () => {
			side.classList.add('active')
			layout.classList.add('active')

			side.addEventListener('transitionend', () => {
				document.body.classList.add('lock')
				document.body.style.paddingRight = `${scrollWidth}px`
			})

			sideArrow.addEventListener('click', exitHandler)
			layout.addEventListener('click', exitHandler)
		})
	}
}

export default startSide
