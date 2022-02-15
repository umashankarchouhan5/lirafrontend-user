<template>
    <div :class="$style.page">
        <main :class="$style.main">
            <slot/>
        </main>
        <Footer auth />
    </div>
</template>

<script>

    import Footer from 'Components/layout/Footer'

    export default {
        name: "Page",
        components: {
            Footer,
        },
    }
</script>

<style lang="scss" module>
    .page {
        min-height: 100%;
    }
    .content {
        display: flex;
        min-height: calc(100vh - 52px);
    }
    .main {
        flex-grow: 1;
        padding: 15px 15px 50px;
        background: #fff;
    }
</style>
