import Alpine from 'alpinejs'

Alpine.data('stars', () => ({
	init() {
		setInterval(() => {
			this.$refs.starsContainer.querySelectorAll('circle').forEach(star => {
				star.classList.toggle('opacity-25', Math.random() > 0.5)
			})
		}, 1000)

	}
}))


window.Alpine = Alpine
Alpine.start()
