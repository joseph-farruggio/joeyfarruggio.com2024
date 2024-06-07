import Alpine from 'alpinejs'
import focus from '@alpinejs/focus'
 
Alpine.plugin(focus)

Alpine.data('stars', () => ({
	init() {
		setInterval(() => {
			this.$refs.starsContainer.querySelectorAll('circle').forEach(star => {
				star.classList.toggle('opacity-25', Math.random() > 0.5)
			})
		}, 1000)

	}
}))

Alpine.data('scrollFade', () => ({
	// as you scroll begin decreasing the opacity of the element
	opacity: 1,
	init() {
		window.addEventListener('scroll', () => {
			const maxScroll = window.innerHeight; // Set maxScroll to the window height
			const currentScroll = window.scrollY;
			this.opacity = Math.max(1 - (currentScroll / maxScroll), 0); // Faster decrease rate
		});
	}
}))


window.Alpine = Alpine
Alpine.start()
