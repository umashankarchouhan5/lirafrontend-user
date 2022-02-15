<template>
    <div :class="$style.card">
        <div :class="$style.title">
           {{ title }}
        </div>
        <div :class="$style.body">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        name: "Card",
        props: {
            title: String
        }
    }
</script>

<style lang="scss" module>
    .card {
        box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);
        min-height: 240px;
    }
    .title {
        background: #6da2f9;
        padding: 0 10px;
        line-height: 30px;
        margin-bottom: 0;
        font-size: 13px;
        font-weight: 400;
        box-shadow: 0 2px 5px 0 rgba(0,0,0,.65), 0 2px 10px 0 rgba(0,0,0,.12);
        text-align: center;
    }
    .body {
        padding: 15px 20px 20px;
        font-size: 12px;
        font-weight: 500;
    }
</style>
