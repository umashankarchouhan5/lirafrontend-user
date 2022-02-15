<template>
    <div>
        <p v-if="formattedToAmount(amount) != 0">{{formattedToAmount(amount)}}</p>
        
    </div>
</template>

<script>
    export default {
        name: "AmountCell",
        props: {
            row: {
                type: Object,
                required: true
            },
            amount: [String,Number]
        },
        methods:{
            
            formattedToAmount(value) {
                value = value !== '.00' ? Number(value.replace(/,/g, '')) : '0.00';
                this.innerValue = Number(value);
                return this.innerValue === '' ? '' : new Intl.NumberFormat('en-IN').format(Number(this.innerValue))
            },
        }
    }
</script>
