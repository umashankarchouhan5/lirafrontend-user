<template>
    <header :class="cssClass">
        <a href="/dashboard" :class="$style.logo">
            <img src="../../../assets/images/lira-logo-web.png" alt="LiRA web Logo"/>
        </a>
        <div :class="$style.content">
            <div role="button" :class="$style.toggleButton" @click="toggleMenu">
                <Icon type="md-menu" />
            </div>
            <HeaderMenu />
        </div>
    </header>
</template>
<script>

    import HeaderMenu from './HeaderMenu'
    export default {
        name: 'app-header',
        data: function () {
            return {
                userData: ''
            };
        },
        components: {
            HeaderMenu
        },
        mounted() {
            if (localStorage.getItem('userData')) {
                this.userData = JSON.parse(localStorage.getItem('userData'));
            }
        },
        computed: {
            isMenuCollapsed() {
                return this.$store.state.common.isMenuCollapsed
            },
            cssClass() {
                return [this.$style.header, this.isMenuCollapsed ? this.$style.headerCollapsed : '']
            }
        },
        methods: {
            toggleMenu() {
                this.$store.commit('collapseMenu', !this.isMenuCollapsed)
            }
        }
    }
</script>
<style lang="scss" module>
    .header {
        height: 52px;
        display: flex;
        position: relative;
    }

    .logo {
        flex-shrink: 0;
        width: 230px;
        background: #eeedf2;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: width 200ms ease;
        img {
            max-width: 97px;
            display: block;
            transition: max-width 200ms ease;
            .headerCollapsed & {
                max-width: 40px;
            }
        }
        .headerCollapsed & {
            width: 50px;
        }
    }

    .content {
        background: #eeedf2;
        flex-grow: 1;
        position: relative;
        box-shadow: 0 12px 16px #bbbabd87;
    }
    .toggleButton {
        cursor: pointer;
        padding: 10px;
        font-size: 25px;
        color: #6da2f9;
        position: absolute;
        top: 4px;
        left: 5px;
        transition: color 200ms ease;
        &:hover {
            color: #fff
        }
    }
</style>
