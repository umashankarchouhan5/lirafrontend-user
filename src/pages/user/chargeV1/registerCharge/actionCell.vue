<template>
    <div>
        <FormButton @click="openChargeRegister()">Open</FormButton>
    </div>
</template>

<script>
    export default {
        name: 'ActionChargeCell',
        props:{
            row: Object,
            openCharge: Function,
        },
        methods:{
            openChargeRegister(){
                this.openCharge(this.row);
                
            }
        }
    }
</script>