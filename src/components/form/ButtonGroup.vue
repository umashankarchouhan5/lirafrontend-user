<template>
    <div :class="$style.buttons">
        <slot />
    </div>
</template>

<script>
    export default {
        name: "ButtonGroup"
    }
</script>

<style lang="scss" module>
    .buttons {
        > * {
            margin-right: 12px;
        }
    }
</style>
