<template>
	<transition-group class="TransitionList"
	                  name="TransitionList"
	                  tag="div"
	                  mode="out-in"
					  @before-leave="beforeLeave"
					  @leave="leave"
					  @after-leave="afterLeave">
		<slot/>
	</transition-group>
</template>



<script>
export default {
	name: 'TransitionList',
	data () {
		return {
			leaveIndex: 0,
		}
	},
	methods: {
		beforeLeave (el) {
			const docRect = document.body.getBoundingClientRect() // TODO: should be cached somehow.
			const elRect = el.getBoundingClientRect()
			el.style.width = elRect.width + 'px'
			el.style.height = elRect.height + 'px'
			el.style.left = `${elRect.left - docRect.left}px`
			el.style.top = `${elRect.top - docRect.top}px`
			el.style['--stagger-delay'] = `${this.leaveIndex * 500}ms`
			this.leaveIndex++
		}, 
		leave (el) {
			document.body.appendChild(el)
		},
		afterLeave () {
			this.leaveIndex--
		},
	}
}
</script>



<style>
.TransitionList {
	position: relative;
}

.TransitionList:not(.TransitionList-leave-active):not(.OrderableList-item--clone) {
	left: auto !important;
	top: auto !important;
}

.TransitionList-enter-active {
	transition:
		opacity 0.25s ease,
		transform 0.35s ease 0.25s;
	transform-origin: center;
}
.TransitionList-leave-active {
	transition:
		opacity 0.25s ease calc(0.35s + var(--stager-delay, 0s)),
		transform 0.35s ease var(--stager-delay, 0s);
	transform-origin: center;
}

.TransitionList-leave-active {
	position: absolute !important;
	z-index: 100 !important;
}

.TransitionList-enter,
.TransitionList-leave-to {
	opacity: 0;
	transform: translateY(-8rem);
}

.TransitionList-move {
	transition: transform 0.35s ease;
	z-index: 1;
}
</style>
