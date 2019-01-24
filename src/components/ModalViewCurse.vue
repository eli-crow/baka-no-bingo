<template>
    <ModalAction class="ModalViewCurse" 
                 title="Cursed!"
	             description="Follow instructions to dispel!"
	             @close="$emit('close'); $store.commit('SET_VIEW_CURSE_INDEX', null)">
        {{ viewedCurse.text }}
        {{ viewedCurse.description }}
        <button @click="dispel">Dispel!</button>
        <button @click="giveUp">Give up {{giveUpCost}}</button>
    </ModalAction>
</template>

<script>
import {mapState} from 'vuex'

import ModalAction from '@/components/ModalAction'
import PlayerList from '@/components/PlayerList'

export default {
    name: 'ModalViewCurse',
    components: {
        ModalAction,
        PlayerList,
    },
    computed: {
        ...mapState(['viewCurseIndex', 'playerData']),
        viewedCurse () {
			return this.playerData.tiles[this.viewCurseIndex]
        },        
        giveUpCost () {
            return Math.max(-50, -this.playerData.score)
        }
    },
    methods: {
        dispel () {
            this.$store.dispatch('DISPEL_CURSE', this.viewCurseIndex)
            this.$emit('close')
        },
        giveUp () {
            this.$store.dispatch('DISPEL_CURSE', this.viewCurseIndex)
            this.$store.commit('ADJUST_SCORE', this.giveUpCost)
            this.$emit('close')
        },
    }
}
</script>

<style scoped>

</style>
