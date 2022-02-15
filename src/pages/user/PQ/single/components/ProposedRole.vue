<template>
    <div :class="$style.wrapper">
        <FormRow>
            <div class="col-sm-9">
                <p>Is your role with the licence holder or licence applicant full time or part‐time?
                    <!--<span class="text-danger" v-if="!value.data.FullOrParttime">This field is required to select</span>-->
                </p>
            </div>
            <div class="col-sm-3">
                <FormSelect label="Select One"
                    v-model="value.data.FullOrParttime"
                    :items="time"
                    item-name="name"
                    rules="required"
                    :disabled="readonly"
                    vid="Select-1"
                    item-value="id" />
            </div>
        </FormRow>

        <FormRow v-if="value.data.FullOrParttime === 'P'">
            <div class="col-sm-9">
                <p>How much time do you give, or (if a new appointment) do you anticipate giving, to the work of the licence holder?</p>
                <!--<span class="text-danger" v-if="!value.data.LenOfTimeInSey">This field is required to select</span>-->
            </div>
            <div class="col-sm-3">
                <!-- <InputText v-model="value.data.LenOfTimeInSey" name="Duration" rules="required" :readonly="readonly"/> -->
                
                <FormSelect  label="Select One"
                    v-model="value.data.LenOfTimeInSey"
                    :disabled="readonly"
                    rules="required"
                    
                    vid="Select-Duration"
                    :items="period" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-9">
                <p>Would you be fulfilling the dual control requirement as specified under paragraph 4 of the Code of
                    Licencees of the ICSP ACT?<br>(For entities licenced under the International Corporate Service Providers Act, 2003 only)
                    <!--<span class="text-danger">This field is required to select</span>-->
                </p>
            </div>
            <div class="col-sm-3">
                <FormSelect  label="Select One"
                    :items="isDualControl"
                    v-model="value.data.DualYN"
                    item-value="value"
                    rules="required"
                    vid="Select-2"
                    :disabled="readonly"
                    item-name="label" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-9">
                <p>
                    Would you be based in Seychelles?
                    <!--<span class="text-danger">This field is required to select</span>-->
                </p>
            </div>
            <div class="col-sm-3">
                <FormSelect v-model="seyResident"
                    label="Select One"
                    itemValue="value"
                    rules="required"
                    itemName="label"
                    vid="Select-3"
                    v-if="isSeyResidentItems"
                    :onChange="changeValueOfResident"
                    :disabled="readonly"
                    :items="isSeyResidentItems" />
            </div>
        </FormRow>
        <template v-if="value.data.IsSeyResident === 0" >
            <FormRow class="row">
                <div class="col-sm-9">
                    <p>
                        Indicate the length of time to be spent in the Seychelles per year.
                    </p>

                </div>
                <div class="col-sm-3">
                    <FormSelect  label="Select One"
                        v-model="value.data.TimeExpectedToSpend"
                        :disabled="readonly"
                        rules="required"
                        
                        vid="Select-4"
                        :items="period" />
                </div>
            </FormRow>
        </template>
        <template v-if="value.data.IsSeyResident === 0">
            
            <FormRow>
                <div class="col-sm-9">
                    <p>Indicate the country where you will be based.
                        <!--<span class="text-danger">This field is required to select</span>-->
                    </p>
                </div>
                <div class="col-sm-3">
                    <FormSelect
                            :items="countries"
                            itemName="Name"
                            itemValue="id"
                            :disabled="readonly"
                            rules="required"
                            vid="Country-1"
                            v-model="value.data.CountryWhereExpected"
                            label="Country" />
                </div>
            </FormRow>
        </template>

        <template v-if="value.data.IsSeyResident === 0">

            <h6>Business Address</h6>

            <FormRow>
                <div class="col-sm-12">
                    <AddressInput v-if="value.data.IsSeyResident === 0" rules="required" :readonly="readonly" label="Address" v-model="value.data.AddressWhereExpected_id" />
                    <AddressInput v-if="value.data.IsSeyResident === 1" :readonly="readonly" label="Address" v-model="value.data.SeyAddress_id" />
                </div>
            </FormRow>
        </template>
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput'

    export default {
        name: "ProposedRole",
        props: ['value','readonly'], 
        data() {
            return {
                isDualControl: [
                    {
                        label: 'Yes',
                        value: 'Y'
                    },
                    {
                        label: 'No',
                        value: 'N'
                    },
                    {
                        label: 'Not Applicable',
                        value: 'A'
                    }
                ],
                isSeyResidentItems: [
                    {
                        label: 'Yes',
                        value: 'Y'
                    },
                    {
                        label: 'No',
                        value: 'N'
                    }
                ],
                time: [
                    {
                        id: 'F',
                        name: 'Full Time'
                    },
                    {
                        id: 'P',
                        name: 'Part Time'
                    }
                ],
                period: ['None', '1 month or less', '6 months or less'],
            }
        },
        components: {
            AddressInput
        },
        computed: {
            countries() {
                return this.$store.state.common.countries;
            },
            seyResident:{
                get(){
                    if(this.value.data.IsSeyResident == 0){
                        return 'N'
                    }
                    else if(this.value.data.IsSeyResident == 1){
                        return 'Y'
                    }
                    else{
                        return null;
                    }
                },
                set(value) {
                    if(this.value.data.IsSeyResident == 0){
                        return 'N'
                    }
                    else if(this.value.data.IsSeyResident == 1){
                        return 'Y'
                    }
                    else{
                        return null;
                    }
                }
            }
        },
        watch: {
            'value.data.IsSeyResident': function(val){
                if(val == 0) {
                    this.seyResident = 'N'
                } 
                else if(val == 1) {
                    this.seyResident = 'Y'
                }
            },
            seyResident(val) {
                if(val == "N") {
                    this.value.data.IsSeyResident = 0;
                }
                else if(val == 'Y'){
                    this.value.data.IsSeyResident = 1;
                }
            }
        },
        methods: {
            changeValueOfResident(val){
                if(val == "N") {
                    this.value.data.IsSeyResident = 0;
                }
                else if(val == 'Y'){
                    this.value.data.IsSeyResident = 1;
                }
            }
        }
    }
</script>

<style lang="scss" module>
    .wrapper {
        :global {
            .text-danger {
                display: block;
            }
        }
    }
</style>
