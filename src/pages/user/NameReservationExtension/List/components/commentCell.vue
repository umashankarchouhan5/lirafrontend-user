<template>
    <div>
        <span>{{ row.Comment }} </span>
        <a v-if="comments.length > 1" href="#" @click.prevent="showCommentLogPopup">More...</a>
    </div>
</template>

<script>

    import Event from 'Utils/event'

    export default {
        name: "CommentCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        computed: {
            comments() {
                return this.row.commentLog ? this.row.commentLog.filter(item => item.comments) : [];
            }
        },
        methods: {
            showCommentLogPopup() {
                Event.fire('showCommentLogPopup', this.comments)
            }
        }
    }
</script>
