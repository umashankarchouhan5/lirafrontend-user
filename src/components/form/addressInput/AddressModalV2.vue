<template>
    <Popup :value="isModalVisible" width="400" @close="onClose"   >
        <ValidationObserver ref="observer" v-if="isModalVisible" v-slot="{ passes }">
            <div :class="$style.wrapper">
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Address Line 1" :focused="true" v-model="value.address1" :rules="{required: isModalVisible}" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Address Line 2" v-model="value.address2" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Address Line 3" v-model="value.city" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Address Line 4" v-model="value.state" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Address Line 5" v-model="value.zip" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <FormSelect
                            :onChange="onCountryChange"
                            v-model="value.country_id"
                            :items="countries"
                            itemName="Name"
                            itemValue="id"
                            label="Country"
                            :rules="{required: isModalVisible}" />
                    </div>
                </FormRow>
            </div>
            <ButtonGroup slot="footer">
                <div :class="$style.wrapperFooter">
                    <FormButton type="primary" text="Save" @click="passes(saveAddress)">Save</FormButton>
                </div>
            </ButtonGroup>
        </ValidationObserver>
    </Popup>
</template>

<script>

    import { addUpdateAddressRequest } from 'Pages/master/masterActions'
    import countriesMixin from 'Mixins/countriesMixin'
    import { ValidationObserver } from "vee-validate"

    export default {
        name: "AddressModal",
        mixins: [countriesMixin],
        props: {
            isModalVisible: {
                required: true,
                type: Boolean
            },
            value: Object,
            addressId: [Number, String]
        },
        computed: {
            countries() {
                return this.$store.state.common.countries;
            }
        },
        components:{
            ValidationObserver
        },
        methods: {
            saveAddress() {
                const data = {
                    Address_id: this.addressId || null,
                    Address1: this.value.address1,
                    Address2: this.value.address2,
                    City: this.value.city,
                    Country_id: this.value.country_id,
                    State: this.value.state,
                    Zip: this.value.zip,
                };
                addUpdateAddressRequest(data).then(this.onSuccessHandler)
            },
            onSuccessHandler(response) {
                this.$emit('onAddressSave', response.data[0].Address_id);
                this.$emit('close')
            },
            onClose() {
                this.$emit('close')
            },
            onCountryChange(value) {
                if (value){
                    this.value.countryname = this.countries.find(country => {
                        return country.id === +value
                    }).Name;
                }
            }

        }
    }
</script>

<style lang="scss" module>
    .wrapper {
        padding: 10px 10px 0;
        margin-bottom: -15px;
    }
    .wrapperFooter {
        padding: 5px 10px;
    }
</style>
