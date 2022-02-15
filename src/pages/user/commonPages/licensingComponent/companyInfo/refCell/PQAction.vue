<template>
    <div>
        <!-- <a href="#" @click.prevent="handleClick">{{ row.UniqueRef }}</a> -->
        <p>{{ row.UniqueRef }}</p>
    </div>
</template>

<script>

    export default {
        name: "PQCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        methods: {
            handleClick() {
                window.open(`/pqReadonly/${this.row.PQid}`, '_blank');
                // this.$router.push()
            }
        }
    }
</script>