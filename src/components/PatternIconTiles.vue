<template>
	<div class="PatternIconTiles">
        <div class="tile"
             v-for="tile in tiles" 
             :data-selected="tile === true">
        </div>
    </div>
</template>



<script>
export default {
	name: 'PatternIconTiles',
	props: {
		tiles: Array,
	},
}
</script>



<style scoped>
.PatternIconTiles {
    width: 2rem;
    height: 2rem;
    position: relative;
    background-color: var(--black);
    border: solid 1px var(--black);
    border-radius: 3px;
}

.tile {
    float: left;
    width: 33.333333%;
    height: 33.333333%;
    border: solid 1px var(--black);
    background: var(--white);
    border-radius: 3px;
}
.tile[data-selected] {
    background-color: var(--red);
}
</style>
