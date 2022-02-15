<template>
    <nav :class="cssClass">
        <Loader v-if="isLoading" />
        <ul :class="$style.menu">
            <li v-for="menuItem in menu" :key="menuItem.id" :class="menuItem.isOpened ? $style.isOpened : ''">
                <a href="#" @click.prevent="() => handleClick(menuItem.id)" v-if="menuItem.submenu.length > 0" :title="menuItem.tooltip !== null ? menuItem.tooltip : ''">
                    <span :class="$style.image">
                        <img v-if="menuItem.image" :src="require(`../../../../assets/images/${menuItem.image}`)">
                        <img v-else src="../../../../assets/images/home-sp.png">
                    </span>
                    <span :class="$style.itemName">{{ menuItem.name }}</span>
                    <div :class="$style.arrow">
                        <Icon type="ios-arrow-down" />
                    </div>
                </a>
                <ul :class="$style.submenu">
                    <li v-for="sub in menuItem.submenu"
                        :title="sub.tooltip !== null ? sub.tooltip : ''"
                        :key="sub.id"
                        :class="( currentPath == sub.URL || $route.matched[1].path === sub.URL.path) ? $style.active : ''">
                        <router-link :to="sub.URL !== '' ? sub.URL : '#'">{{ sub.name }}</router-link>
                    </li>
                </ul>

                <router-link :to="menuItem.URL !== '' ? menuItem.URL : '#'" v-if="menuItem.submenu.length < 1"
                            :class="( $route.path === menuItem.URL || $route.matched[1].path === menuItem.URL ) ? $style.active :'' ">
                    <span :class="$style.image">
                        <img v-if="menuItem.Image" :src="require(`../../../../assets/images/${menuItem.Image}`)">
                        <img v-else src="../../../../assets/images/home-sp.png">
                    </span>
                    <span :class="$style.itemName" 
                        :title="menuItem.tooltip !== null ? menuItem.tooltip : ''">{{ menuItem.name }}</span>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>

    import { mapMutations } from 'vuex';
    import loadingMixin from 'Mixins/loadingMixin';
    import Loader from 'Components/layout/Loader';
    import { fetchMenu } from './sidebarActions'

    export default {
        name: 'Sidebar',
        computed: {
            currentPath(){
                return this.$route.path
            },
            menu() {
                return this.$store.state.menu.menu
            },
            userData() {
                return this.$store.state.user.user
            },
            isMenuCollapsed() {
                return this.$store.state.common.isMenuCollapsed
            },
            cssClass() {
                return [this.$style.sidebar, this.isMenuCollapsed ? this.$style.sidebarCollapsed : '']
            }
        },
        mixins: [loadingMixin],
        created(){
            this.fetchMenu();
        },
        components: {
            Loader
        },
        methods:{
            ...mapMutations([
                'setMenu',
                'handleClick'
            ]),
            fetchMenu() {
                this.showLoader();
                fetchMenu({ admin_id: this.userData.user_id, externalCategory_id: this.userData.ExternalUserCategory_id})
                    .then(this.handleSuccess)
                    .then(this.handleError)
            },
            mapMenu(menu) {
                return menu.map((item, i) => {
                    // TODO: temp, implement after server side
                    // if (i === 0 && item.name === "Incorporation") {
                    //     item.submenu.forEach((subItem, i) => {
                    //         subItem.URL = {
                    //             path: subItem.URL,
                    //             query: {
                    //                 status_id: subItem.URL === '/nameReservationIncorporation' ? 34 : (i === 0  ? 43 : 205),
                    //             }
                    //         }
                    //     })
                    // }
                    
                    return item;
                })
            },
            handleSuccess(response) {
                this.hideLoader();
                const menu = this.mapMenu(response.data);
                this.setMenu(menu);
            },
        }
    }
</script>

<style lang="scss" module>
    .active {
        // box-shadow: 5px 5px 0px rgba(0,0,0,0.08);
        background-color: #bfd0eb !important;
        a{
            background-color: #bfd0eb!important;
        }
    }
    .image {
        position: absolute;
        bottom: 0;
        top: 0;
        left: 0;
        width: 48px;
        > img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .sidebar {
        box-shadow: 0 2px 13px #0000008a;
        position: relative;
        &.sidebarCollapsed {
            height: 100%;
        }
    }

    .menu {
        margin: 0;
        padding: 0;
        list-style-type: none;
        background: #6da2f9;
        .sidebarCollapsed &{
            height: 100%;
        }
        a {
            color: #000;
            display: block;
            text-decoration: none;
            &:hover {
                background: #bfd0eb;
            }
        }

        > li {
            box-shadow: 1px 2px 4px #00000063;
            transition: box-shadow 200ms ease;
            position: relative;
            .sidebarCollapsed & {
                box-shadow: none;
                &:hover {
                    .submenu {
                        display: block;
                        z-index: 11;
                    }
                }
            }
            > a {
                padding: 7px 15px 5px 48px;
                position: relative;
                font-size: 14px;
                line-height: 17px;
                transition: padding 200ms ease;
                .sidebarCollapsed & {
                    padding: 7px 0 5px 0;
                    height: 34px;
                }
            }
        }
    }

    :global {
        .fade-enter-active, .fade-leave-active {
            max-height: 400px;
        }
        .fade-enter, .fade-leave-to {
            max-height: 0;
        }
    }

    .arrow {
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
        font-size: 20px;
        line-height: 32px;
        width: 30px;
        transition: transform 200ms ease-in;
        color: #405d8b;
        .sidebarCollapsed & {
            display: none;
        }
        .isOpened & {
            transform: rotate(180deg);
        }
    }

    .submenu {
        transition: max-height 200ms ease-in;
        will-change: max-height;
        padding: 0;
        margin: 0;
        list-style-type: none;
        overflow: hidden;
        background: #fff;
        max-height: 0;
        .isOpened & {
            max-height: 400px;
        }
        .sidebarCollapsed & {
            display: none;
            max-height: 999px;
            position: absolute;
            top: 0;
            min-width: 150px;
            box-shadow: 1px 2px 4px #00000063;
            border-radius: 3px;
            right: 0;
            z-index: 2;
            transition: none;
            overflow: visible;
            transform: translate(100%, 0);
            &:after {
                content: '';
                position: absolute;
                top: 10px;
                left: -4px;
                width: 0;
                height: 0;
                border-top: 4px solid transparent;
                border-bottom: 4px solid transparent;
                border-right: 4px solid #fff;
            }
        }
        a {
            padding: 5px 15px 4px 48px;
            font-size: 12px;
            line-height: 19px;
            .sidebarCollapsed & {
                padding-left: 15px;
                white-space: nowrap;
            }
        }
        // :global {
        //     .router-link-exact-active {
        //         // background: #cccccc;
        //     }
        // }
        li {
            &:nth-child(even) {
                a {
                    background-color: #f6f6f6;
                    &:hover {
                        background: #bfd0eb;
                    }
                }
                // :global {
                //     .router-link-exact-active {
                //         // background: #cccccc;
                //     }
                // }
            }
        }
    }

    .itemName {
        width: 100%;
        overflow: hidden;
        transition: width 200ms ease;
        will-change: width;
        display: inline-block;
        .sidebarCollapsed & {
            width: 0;
        }
    }

</style>
