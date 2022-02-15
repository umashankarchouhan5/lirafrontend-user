<template>
    <div :class="border ? $style.wrapper : ''">
        <div :class="$style.title">
            <slot name="title" />
        </div>
        <div :class="$style.content">
            <slot />
        </div>
    </div>
</template>

<script>

    export default {
        name: "FormWrapper",
        props: {
            border: {
                type: Boolean,
                default: true,
            }
        }
    }
</script>

<style lang="scss" module>
    .title{
        position: sticky;
        top: 0;
        z-index: 10;
    }
    .wrapper {
        border: 1px solid #ccc;
        border-bottom: 3px solid #6da2f9;
    }
    .content {
        padding: 40px 30px 20px;
    }
</style>
