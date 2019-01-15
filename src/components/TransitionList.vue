<template>
	<transition-group class="TransitionList"
	                  name="TransitionList"
	                  tag="div"
	                  mode="out-in"
					  @before-leave="beforeLeave">
		<slot/>
	</transition-group>
</template>



<script>
export default {
	name: 'TransitionList',
	methods: {
		beforeLeave (el) {
			const docRect = document.body.getBoundingClientRect() // TODO: should be cached somehow.
			const elRect = el.getBoundingClientRect()
			el.style.width = elRect.width + 'px'
			el.style.height = elRect.height + 'px'
			el.style.left = `${elRect.left - docRect.left}px`
			el.style.top = `${elRect.top - docRect.top}px`
			document.body.appendChild(el)
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
		opacity 0.25s ease 0.35s,
		transform 0.35s ease;
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
