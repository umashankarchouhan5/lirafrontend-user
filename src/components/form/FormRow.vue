<template>
    <div :class="`${$style.row} row`">
        <slot />
    </div>
</template>

<script>
    export default {
        name: "FormRow"
    }
</script>

<style module lang="scss">
    .row {
        margin-bottom: 25px;
        position: relative;
    }
</style>
