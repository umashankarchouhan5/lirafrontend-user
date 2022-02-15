<template>
    <div :class="{ [$style.step]: true, [$style.stepActive]: step.isActive, [$style.stepDisabled]: step.isDisabled }">
        <a @click.prevent="clickHandler" href="#">{{ step.id }}</a>
        <p>{{ step.title }}</p>
    </div>
</template>

<script>
    export default {
        name: "WizardStep",
        props: {
            step: {
                type: Object,
                required: true
            }
        },
        computed: {
            cssClass() {
                let css = 'btn btn-circle waves-effect waves-light btn-default';
                if (this.step.isActive) {
                    css += ' btn-primary';
                }
                return css;
            }
        },
        methods: {
            clickHandler() {
                if (this.step.isDisabled) {
                    return;
                }
                this.$emit('onClick', this.step.id)
            }
        }
    }
</script>

<style lang="scss" module>
    .step {
        display: table-cell;
        text-align: center;
        position: relative;
        &:before {
            position: absolute;
            left: 0;
            right: 0;
            top: 16px;
            content: '';
            display: block;
            border-bottom: 1px solid #ccc
        }
        &:first-child {
            &:before {
                left: auto;
                width: 50%;
                right: 0;
            }
        }
        &:last-child {
            &:before {
                left: 0;
                width: 50%;
                right: auto;
            }
        }
        &.stepActive {
            a {
                background-color: #6da2f9;
                color: #fff
            }
        }
        &.stepDisabled {
            color: #808080;
            a {
                background-color: #e8e8e8;
                cursor: not-allowed;
                color: #808080;
            }
        }
        a {
            display: inline-block;
            color: #000;
            width: 32px;
            height: 32px;
            text-align: center;
            font-size: 12px;
            line-height: 30px;
            border-radius: 50%;
            border: 1px solid #ddd;
            position: relative;
            z-index: 1;
            background: #fff;
            &:hover {
                box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15);
            }
        }
        p {
            margin-top: 10px;
        }
    }
</style>
