<template>
    <div>
        <div v-if="!items || !items.length">No data found</div>
        <a v-for="(item, index) in items" :key="'request' + index" :class="$style.item" @click="click(item, items)">
            <span>{{item.Description}}</span>
            <b>{{item.cnt}}</b>
        </a>
    </div>
</template>
<script>
    export default {
        props: {
            items: {
                type: Array,
                required: true,
                default: () => []
            },
        },
        methods: {
            click(item, items) {
                this.$emit('onClick', item, items);
            }
        }
    }
</script>
<style lang="scss" module>
    .item {
        display: flex;
        span {
            width: 100%;
        }

        b {
            white-space: nowrap;
        }
    }
</style>
