<template>
    <section class="ModalAction" @click="$emit('close')">
        <GlobalEvents @keydown.esc="$emit('close')"/>
        <div class="content" @click.stop>
            <header class="header">
                <p class="title">{{ title }}</p>
                <p class="description">{{ description }}</p>
                <Icon class="x" icon="times" @click="$emit('close')"/>
            </header>
            <div class="slot-content">
                <slot/>
            </div>
        </div>
    </section>
</template>

<script>
import GlobalEvents from 'vue-global-events'
export default {
    name: 'ModalAction',
    components: {
        GlobalEvents
    },
    props: {
        title: String,
        description: String,
    }
}
</script>

<style scoped>
.ModalAction {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000000;
    width: 100%;
    height: 100%;
    display: flex;
    padding: 12px;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.6);
}

.content {
    --border-scale: 0.75;
    --tile-padding: 0px;
    /* 
	set min-width and -height to override default tile sizing behavior
	allowing consistently sized tiles.
	*/
	min-width: 0;
	min-height: 0;
    width: 20rem;
    max-width: 100%;
	position: relative;
    border-image-source: url('../assets/images/tile-white.svg');
	border-image-slice: 36% 36% 50% 36% fill;
	border-image-width: calc(var(--border-scale) * 36px) calc(var(--border-scale) * 36px) calc(var(--border-scale) * 50px) calc(var(--border-scale) * 36px);
	border-image-repeat: stretch;
	border-image-outset: 0px 0px calc(var(--border-scale) * 14.88px) 0px;
	border-style: solid;
	padding: var(--tile-padding);
	line-height: 1.15;
	touch-action: manipulation;
	-webkit-tap-highlight-color: rgba(0,0,0,0);
}

.header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-column-gap: 20px;
    grid-template-areas:
        "title       x"
        "description x";
    border-bottom: solid 1px var(--white);
    padding: 16px 16px;
}

.title {
    grid-area: title;
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
}

.description {
    grid-area: description;
    margin: 0;
    font-size: 14px;
}

.x {
    width: 2rem;
    height: 2rem;
    padding: 0.5rem;
    border-radius: 99999px;
    background-color: var(--gray-light);
    grid-area: x;
}

.slot-content {
    padding: 16px 16px;
}
</style>
