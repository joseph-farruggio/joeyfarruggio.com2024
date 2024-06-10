import Alpine from "alpinejs";
import focus from "@alpinejs/focus";
import intersect from "@alpinejs/intersect";

Alpine.plugin(intersect);
Alpine.plugin(focus);

Alpine.data("menu", () => ({
	open: false,
	toggle() {
		if (this.open) {
			return this.close();
		}

		this.$refs.button.focus();

		this.open = true;
	},
	close(focusAfter) {
		if (!this.open) return;

		this.open = false;

		focusAfter && focusAfter.focus();
	},
}));

Alpine.data("stars", () => ({
	init() {
		setInterval(() => {
			this.$refs.starsContainer.querySelectorAll("circle").forEach((star) => {
				star.classList.toggle("opacity-25", Math.random() > 0.5);
			});
		}, 1000);
	},
}));

Alpine.data("scrollFade", () => ({
	// as you scroll begin decreasing the opacity of the element
	opacity: 1,
	init() {
		window.addEventListener("scroll", () => {
			const maxScroll = window.innerHeight; // Set maxScroll to the window height
			const currentScroll = window.scrollY;
			this.opacity = Math.max(1 - currentScroll / maxScroll, 0); // Faster decrease rate
		});
	},
}));

Alpine.data("toc", (firstItem) => ({
	highlight(heading) {
		// heading is a string
		console.log(heading);
		const position = this.getPosition(this.$refs[heading]);
		// Transform translateY to height
		this.$refs.highlight.style.transform = `translateY(${position.top}px)`;
		this.$refs.highlight.style.height = `${position.bottom - position.top}px`;
	},
	getPosition(item) {
		// item is a DOM element
		const containerRect = this.$el.getBoundingClientRect();
		const itemRect = item.getBoundingClientRect();

		const top = itemRect.top - containerRect.top;
		const bottom = itemRect.bottom - containerRect.top;

		return { top, bottom };
	},
	init() {
		this.highlight(firstItem);
		// loop h2s and h3s in this.$el
		const headings = document.querySelectorAll("#content h2, #content h3");
		headings.forEach((heading) => {
			heading.setAttribute(
				"x-intersect:enter",
				`$dispatch('highlight', '${heading.id}')`
			);
		});
	},
}));

window.Alpine = Alpine;
Alpine.start();
