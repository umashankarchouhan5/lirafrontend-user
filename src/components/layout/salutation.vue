<template>
<div >
    <FormSelect
        :items="['Mr', 'Ms','Dr']"
        label="Title"
        :rules="rules" 
        :disabled="disabled || readonly"
        v-model="innerValue" />
</div>
</template>

<script>
    
    import valueMixin from 'Mixins/valueMixin';

    export default {
        name:'Salutation',
        mixins: [valueMixin],
        props:{
            value: String,
            disabled: Boolean,
            rules: String,
            label: String,
            readonly: Boolean
        }
    }
</script>