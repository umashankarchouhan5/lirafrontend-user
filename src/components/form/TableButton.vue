<template>
    <button :class="$style.button" @click="() => $emit('click')">
        <slot />
    </button>
</template>

<script>
    export default {
        name: "TableButton"
    }
</script>

<style lang="scss" module>
    .button {
        cursor: pointer;
        outline: none;
        transition: background-color 200ms ease;
        background: #fff;
        border: none;
        color: #212529;
        padding: 0 10px;
        line-height: 30px;
        min-width: 70px;
        font-size: 12px;
        position: relative;
        &:hover {
            background: #6da2f9;
        }
        img {
            vertical-align: sub;
            margin-right: 5px;
            max-width: 15px;
        }
    }
</style>