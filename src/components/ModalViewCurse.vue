<template>
    <ModalAction class="ModalViewCurse" 
                 title="Cursed!"
	             description="Follow instructions to dispel!"
	             @close="$emit('close'); $store.commit('SET_VIEW_CURSE_INDEX', null)">
        <div class="curse">
            <h3 class="title">#{{ viewedCurse.id }}: {{ viewedCurse.text }}</h3>
            <p class="description">{{ viewedCurse.description }}</p>
        </div>
        <ButtonGroup>
            <ButtonSquare @select="dispel"
                          color="green">
                Dispel!
            </ButtonSquare>
            <ButtonSquare @select="giveUp"
                          color="red"
                          :cost="giveUpCost">
                Give Up
            </ButtonSquare>
        </ButtonGroup>
    </ModalAction>
</template>

<script>
import {mapState} from 'vuex'

import ModalAction from '@/components/ModalAction'
import PlayerList from '@/components/PlayerList'
import ButtonGroup from '@/components/ButtonGroup'
import ButtonSquare from '@/components/ButtonSquare'

export default {
    name: 'ModalViewCurse',
    components: {
        ModalAction,
        PlayerList,
        ButtonGroup,
        ButtonSquare,
    },
    computed: {
        ...mapState(['viewCurseIndex', 'playerData']),
        viewedCurse () {
			return this.playerData.tiles[this.viewCurseIndex]
        },        
        giveUpCost () {
            return Math.min(50, this.playerData.score)
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
.curse {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 8rem;
    padding: 16px;
}
.title {
    margin-bottom: 12px;
    font-size: 18px;
}
.description {
    font-size: 16px;
}
</style>
