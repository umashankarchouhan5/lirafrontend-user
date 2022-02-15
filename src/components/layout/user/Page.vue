<template>
    <div :class="cssClass">
        <Header />
        <div :class="$style.content">
            <aside :class="$style.sidebar">
                <Sidebar />
            </aside>
            <main :class="$style.main">
                <slot/>
            </main>
        </div>
        <Footer auth />
    </div>
</template>

<script>

    import Header from 'Components/layout/user/Header'
    import Footer from 'Components/layout/Footer'
    import Sidebar from 'Components/layout/user/sidebar/Sidebar'

    export default {
        name: "Page",
        components: {
            Header,
            Footer,
            Sidebar
        },
        computed: {
            isMenuCollapsed() {
                return this.$store.state.common.isMenuCollapsed
            },
            cssClass() {
                return [this.$style.page, this.isMenuCollapsed ? this.$style.pageCollapsed : '']
            }
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
    .sidebar {
        flex-grow: 0;
        flex-shrink: 0;
        background: #eeedf2;
        width: 230px;
        padding-bottom: 37px;
        transition: width 200ms ease;
        .pageCollapsed & {
            width: 50px;
        }
    }
    .main {
        flex-grow: 1;
        padding: 15px 15px 50px;
        background: #fff;
    }
</style>
