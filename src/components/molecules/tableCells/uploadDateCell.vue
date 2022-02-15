<template>
    <div>
        <span :class="$style.brief" >
            {{ uploadDate }}
        </span>
        <br/>
        <br/>
    </div>
</template>

<script>

    export default {
        name: "UploadDateCell",
        props: {
            row: Object,
            uploadDate: [Number,String,Date]
        },
        methods: {
            onChangeHandler(value) {
                this.onChange(value, this.row)
            }
        }
    }
</script>

<style lang="scss" module>
    .brief{
        max-width: 30vw;
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        margin-top: 3px;
        font-weight: 400;
    }
</style>
