<template >
    <div :class="$style.title">
        <h1>{{ title }}</h1>
        <div :class="$style.question" v-if="link">
            <a :href="link" target="_blank">
                <img src="../../assets/images/ques.png" alt="">
            </a>
        </div>
        <div :class="$style.pdf" v-if="pdf" @click="pdf">
            <!-- <a :href="pdf" target="_blank"> -->
                <img src="../../assets/images/PDF.png" alt="">
            <!-- </a> -->
        </div>
    </div>
</template>

<script>
    export default {
        name: "PageTitle",
        props: {
            title: {
                type: String,
                required: true
            },
            link: {
                type: String,
                default: ''
            },
            pdf: {
                type: [Function],
            }
        }
    };
</script>

<style lang="scss" module>
    .sticky{
        position: sticky;
        top: 0;

    }
    .title {
        box-shadow: 0 4px 5px rgba(0, 0, 0, 0.45);
        position: relative;
        background: #6da2f9;
        padding: 0 10px;

        > h1 {
            font-size: 14px;
            line-height: 35px;
            margin: 0;
            text-align: center;
            font-weight: 700;
        }
    }

    .question {
        position: absolute;
        right: 10px;
        top: 8px;

        img {
            max-width: 20px;
        }
    }
    .pdf {
        position: absolute;
        right: 40px;
        top: 8px;

        img {
            max-width: 20px;
            cursor: pointer;
        }
    }
</style>
