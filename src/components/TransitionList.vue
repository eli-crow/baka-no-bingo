<template>
	<transition-group class="TransitionList"
				name="TransitionList"
	                  tag="div"
				mode="out-in">
		<slot/>
	</transition-group>
</template>



<script>
export default {
	name: 'TransitionList',
	beforeUpdate () {
		Array.from(this.$el.children).forEach(el => {
			const {marginLeft, marginTop, width, height} = window.getComputedStyle(el)
			el.style.width = width
			el.style.height = height
			el.style.left = `${el.offsetLeft - window.parseFloat(marginLeft)}px`
			el.style.top = `${el.offsetTop - window.parseFloat(marginTop)}px`
		})
	},
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

.TransitionList-enter-active,
.TransitionList-leave-active {
	transition-property: opacity, transform;
	transition-duration: 0.8s;
	transition-timing-function: ease;
	transform-origin: center;
}

.TransitionList-leave-active {
	position: absolute !important;
	z-index: 100 !important;
}

.TransitionList-enter,
.TransitionList-leave-to {
	opacity: 0;
	transform: scale(0.95);
}

.TransitionList-move {
	transition: transform 0.35s ease;
	z-index: 1;
}
</style>
