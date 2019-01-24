<template>
    <a class="ButtonSquare Button" 
       @click="$emit('select')"
       :href="href"
       :style="{
           '--bg': `var(--${color})`,
           '--bg-dark': `var(--${color}-dark)`,
           '--fg': `var(--white)`,
       }"
       >
       <Icon class="icon" v-if="icon" :icon="icon"/>
       <span class="slot-content"><slot/></span>
       <span class="cost" v-if="cost === 0 || cost">-{{ cost }}</span>
    </a>
</template>

<script>
export default {
    name: "ButtonSquare",
    props: {
        color: {
            type: String,
            default: "green",
        },
        icon: {
            type: String,
            required: false,
        },
        cost: {
            type: [String, Number],
            required: false,
        },
        href: {
            type: String,
            required: false,
        }
    },
}
</script>

<style scoped>
.ButtonSquare {
    width: max-content;
    max-width: 100%;
    display: flex;
    padding: 12px 16px;
    border-radius: var(--radius-small);
    background: var(--bg);
    box-shadow: 0 6px 0 0 var(--bg-dark);
    color: var(--fg);
    font-size: 16px;
    font-weight: 700;
}
.icon {
    color: var(--fg);
    font-size: 20px;
    margin-right: 12px;
}
.slot-content {

}
.cost {
    margin-left: 12px;
    color: black;
}
</style>
