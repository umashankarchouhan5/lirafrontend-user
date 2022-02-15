<template>
    <div :class="cssClass">
        <div :class="$style.copyright">
            Copyright @ 2018 - {{ getCurrentYear }}
            <a href="#">
                <img src="../../assets/images/netedge-logo.png" alt=""/>
            </a>
            All Rights Reserved.
        </div>
    </div>
</template>

<script>
    export default {
        name: "Footer",
        computed: {
            cssClass() {
                return [this.$style.footer, this.auth ? this.$style.footerAuth : ''].join(' ')
            },
            getCurrentYear(){
                return new Date().getFullYear();
            }
        },
        props: {
            auth: {
                type: Boolean,
                default: false
            }
        }
    };
</script>

<style lang="scss" module>
    .footer {
        position: fixed;
        text-align: right;
        left: 0;
        bottom: 0;
        right: 0;
        background: #fff;
        padding: 8px 0 3px;

        &.footerAuth {
            background: #eeedf2;
        }
    }

    .copyright {
        font-size: 13px;
        color: #2e4a9b;
        padding-right: 20px;

        img {
            max-width: 65px;
            margin: 0 5px;
            vertical-align: middle;
        }
    }
</style>
