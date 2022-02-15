<template>
    <div :class="$style.wrapper" :style="{width: `${width}px`}">
        <slot />
    </div>
</template>

<script>
    export default {
        name: "CenterBlock",
        props: {
            width: {
                type: Number,
                default: 600
            }
        },
    }
</script>

<style lang="scss" module>
    .wrapper {
        margin: 0 auto;
    }
</style>
