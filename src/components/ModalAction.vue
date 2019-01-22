<template>
    <section class="ModalAction">
        <div class="content">
            <header class="header">
                <p class="title">{{ title }}</p>
                <p class="description">{{ description }}</p>
                <Icon class="icon" icon="times"/>
            </header>
            <div class="slot-content">
                <slot/>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'ModalAction',
    props: {
        title: String,
        description: String,
    }
}
</script>

<style scoped>
.ModalAction {
    --border-scale: 0.75;
    --tile-padding: 12px;
    /* 
	set min-width and -height to override default tile sizing behavior
	allowing consistently sized tiles.
	*/
	min-width: 0;
	min-height: 0;
	position: relative;
    border-image-source: url('../assets/images/tile-white.svg');
	border-image-slice: 36% 36% 50% 36% fill;
	border-image-width: calc(var(--border-scale) * 36px) calc(var(--border-scale) * 36px) calc(var(--border-scale) * 50px) calc(var(--border-scale) * 36px);
	border-image-repeat: stretch;
	border-image-outset: 0px 0px calc(var(--border-scale) * 14.88px) 0px;
	border-style: solid;
	padding: var(--tile-padding);
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 14px;
	line-height: 1.15;
	touch-action: manipulation;
	-webkit-tap-highlight-color: rgba(0,0,0,0);
}
</style>
