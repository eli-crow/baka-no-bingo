
<template>
	<transition-group class="BingoBoard3"
	                  name="BingoBoard3"
	                  tag="div"
					  @before-leave="beforeLeave">
		<div class="tile-container"
		      v-for="(tile, i) in tiles"
		      :key="tile.key"
			  :style="{zIndex: i}">
			<div :class="{
				     tile: true,
				     '-selected': tile.selected,
				     '-star': i === 4,
				  }"
				  @click="$emit('select', i)">
				<span v-if="i === 4" class="icon">★</span>
				<span v-else class="text">{{ tile.text }}</span>
			</div>
		</div>
	</transition-group>
</template>



<script>
export default {
	name: 'BingoBoard3',
	props: {
		tiles: Array,
		enabled: {
			type: Boolean,
			default: true,
		},
	},
	data () {
		return {
			staggerIndex: 0,
		}
	},
	methods: {
		beforeLeave (el) {
			el.style.setProperty('--stagger-index', this.staggerIndex)
			this.staggerIndex++
		},
		applyTransitionOffsetStyles() {
			const children = Array.from(this.$el.children)
			children.forEach(el => {
				const {marginLeft, marginTop, width, height} = window.getComputedStyle(el)
				const {offsetLeft, offsetTop} = el
				el.style.left = `${offsetLeft - parseFloat(marginLeft, 10)}px`
				el.style.top = `${offsetTop - parseFloat(marginTop, 10)}px`
				el.style.width = width
				el.style.height = height
			})
			this.staggerIndex = 0
		}
	},
	updated () {
		this.applyTransitionOffsetStyles()
	},
	mounted () {
		this.applyTransitionOffsetStyles()
	},
}
</script>



<style scoped>
.BingoBoard3 {
	position: relative;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: repeat(3, 33.33333vw);
	padding-bottom: 0.5rem;
	z-index: 1;
}

.tile-container {
}

.tile {
	height: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding: 8px;
	font-size: 3.75vw;
	box-shadow: 0 0.5rem 0 0 var(--dark, var(--gray-lightest));
	border-radius: 16px;
	background-color: var(--light, white);
	border: solid 2px var(--dark, var(--gray-lightest));
	border-top: solid 2px var(--lighter, white);
}
.tile::before {
	position: absolute;
	content: '';
	left: 0;
	top: 0;
	width: 100%;
	height: calc(100% + 0.5rem);
	border: solid 2px var(--light);
	opacity: 0.4;
	border-radius: inherit;
	mix-blend-mode: screen;
}
.tile.-selected {
	--light: var(--red);
	--lighter: var(--red-light);
	--dark: var(--red-dark);
	color: white;
}
.tile.-star {
	background-color: var(--red);
	color: inherit;
}

.icon {
	font-size: 20vw;
}

.BingoBoard3-enter-active,
.BingoBoard3-enter-to,
.BingoBoard3-leave-active {
	--stagger-delay: calc(var(--stagger-index, 0) * 30ms);
	--duration-transform: .35s;
	--duration-delay: 0.2s;
	--duration-opacity: 0.25s;
	--easing-transform: cubic-bezier(0.740, 0.010, 0.455, 1.290);
	transform-origin: center;
}
.BingoBoard3-enter-active,
.BingoBoard3-enter-to {
	transition:
		opacity var(--duration-opacity) ease var(--stagger-delay),
		transform var(--duration-transform) var(--easing-transform) calc(var(--duration-opacity) + var(--duration-delay) + var(--stagger-delay));
}
.BingoBoard3-leave-active {
	transition:
		opacity var(--duration-opacity) ease calc(var(--duration-transform) + var(--duration-delay) + var(--stagger-delay)),
		transform var(--duration-transform) var(--easing-transform) var(--stagger-delay);
}

.BingoBoard3-leave,
.BingoBoard3-leave-active { 
	position: absolute !important;
	z-index: 100 !important;
}
.BingoBoard3 > *:not(.BingoBoard3-leave-active) {
	/* override these when not leaving, so we can set screen position for all tile-containers in `updated` lifecycle method */
	top: auto !important;
	left: auto !important;
	width: auto !important;
	height: auto !important;
}

.BingoBoard3-enter {
	opacity: 0;
	transform: translateY(1rem);
}
.BingoBoard3-leave-to {
	opacity: 0;
	transform: translateY(-8rem);
}

.BingoBoard3-move:not(.BingoBoard3-leave-active):not(.BingoBoard3-enter-active) {
	transition: transform 0.35s ease;
	z-index: 1;
}
</style>

</style>
