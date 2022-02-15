<template>
    <div>
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <EntityCompany :class="$style.indentClass" :i="i" v-model="value[i]" :readonly="readonly" />
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin1 from 'Mixins/recordMixin1';
    import EntityCompany from './EntityCompany';

    export default {
        name: "Entities",
        mixins: [ recordMixin1 ],
        components: {
            EntityCompany
        },
        data() {
            return {
                
            }
        },
        props:{
            readonly: Boolean,
        },
        watch:{
            value:{
                deep: true,

                handler(val){
                    this.$emit('companyChange');
                    if(this.value.length < 1){
                        this.pushEmptyValue();
                    }
                }
            },
        },
        methods: {
           
            pushEmptyValue() {
                this.value.push({
                    name:'',
                    CompanyRegNo: '',
                    id: null,
                })
            },
        }
    }
</script>

<style lang="scss" module>
    .indentClass{
        margin-left: 0px;
    }
</style>