<template>
    <div v-if="innerValue" :class="$style.toastStyle">
        <slot />
    </div>
</template>

<script>

    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                innerValue: this.value
            };
        },
        watch: {
            innerValue(val) {
                this.$emit("input", val);
                if(val == true){
                    setTimeout(() => {this.innerValue = false},3000)
                }
            },
            value(newVal) {
                this.innerValue = newVal;
            }
        },
    }
</script>
<style lang="scss" module>
    .toastStyle {
        position: fixed;
        bottom: -100px;
        right: 50vw;
        transform: translateX(50%);
        background: white;
        z-index: 100;
        padding: 10px 40px;
        box-shadow: 0px 5px 15px rgba(0,0,0,0.3);
        border-radius: 8px;
        animation: toastAnimation 1s ease-out forwards;
        font-weight: 500;
        font-size: 14px;
    }
    @keyframes toastAnimation {
        0% {
            bottom: -100px;
        }
        100% {
            bottom: 50px;
        }
    }

</style>