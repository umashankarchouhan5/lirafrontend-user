<template>
    <div :class="$style.page">
        <Header/>
        <div :class="$style.content">
            <slot/>
        </div>
    </div>
</template>

<script>
    import Header from "Components/layout/public/Header";

    export default {
        name: "Page",
        components: {
            Header,
        }
    };
</script>

<style lang="scss" module>
    .page {
        min-height: 100%;
    }
    .content {
        background: #fff;
        height: calc(100vh - 52px);
        overflow: hidden;
        overflow-y: auto;
        padding: 20px 30px 50px;
    }
</style>
