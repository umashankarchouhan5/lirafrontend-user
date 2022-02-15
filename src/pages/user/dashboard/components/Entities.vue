<template>
    <div>
        <ve-pie :data="{rows: data}" :settings="computedSettings" :height="height" :grid="grid"  />
    </div>
</template>
<script>
    export default {
        props: {
            data: {
                type: Array,
                required: true,
                default: () => []
            },
            settings: {
                type: Object,
                default: () => {}
            },
            height: {
                type: String,
                default: '175px'
            },
        },
        data() {
            return {
                grid: {
                    left: '20px',
                    right: '20px',
                    top: '25px',
                    bottom: '10px',
                    containLabel: true
                }
            }
        },
        computed: {
            computedSettings() {
                return {
                    radius: 50,
                    offsetY: 110,
                    dimension: 'Description',
                    metrics: 'cnt',
                    ...(this.settings || {})
                }
            },
        }
    }
</script>
<style lang="scss" module>
</style>
