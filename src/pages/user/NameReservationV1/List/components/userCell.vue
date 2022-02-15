<template>
    <div :class="cssClass">
        {{ row.user }}
    </div>
</template>

<script>

    export default {
        name: "UserCall",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        computed: {
            cssClass() {
                return this.row.user ? this.$style[this.row.user.toLowerCase()] : null
            }
        },
    }
</script>

<style lang="scss" module>
    .fsa {
        font-weight: 700;
        color: #8b2424;
    }
    .you {
        font-weight: 700;
        color: #72afd2
    }
</style>
