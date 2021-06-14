function startGeneralScore() {
	const generalScore = document.querySelector('.general-stats')

	if (generalScore) {
		const score = generalScore.dataset.score

		const blockWidth = generalScore.clientWidth

		const marker = generalScore.querySelector('.general-stats__marker')
		const toner = generalScore.querySelector('.general-stats__toner')

		const offset = (blockWidth * score/100) - marker.clientWidth/2

		marker.style.left = `${score}%`
		toner.style.left = `${score}%`
	}
}

export default startGeneralScore