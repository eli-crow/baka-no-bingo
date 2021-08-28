<template>
    <transition name="ModalTransition" mode="out-in">
        <slot/>
    </transition>
</template>

<script>
export default {
    name: 'ModalTransition'
}
</script>

<style>

</style>
