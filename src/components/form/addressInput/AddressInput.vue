<template>
    <div style="position: relative;" >
        <ValidationProvider :vid="vid" :rules="rules" mode="passive" :name="name || label" v-slot="{ errors }">
            <InputText @focus="handleFocus"
                :placeholder="placeholder"
                :readonly="readonly"
                :label="label"
                :name="name"
                :vid="vid"
                :rules="rules"
                :title="stringifyAddress"
                :value="stringifyAddress">
            </InputText>
            <div :class="$style.error" v-if="errors[0]">
                {{ errors[0] }} 
            </div>
        </ValidationProvider>
        <AddressModal :addressId="innerValue"
            :isModalVisible="isModalVisible"
            v-model="address"
            @onAddressSave="onAddressSave" @close="closeModal"/>
    </div>
</template>

<script>

    import { getAddressById } from 'Pages/master/masterActions'
    import AddressModal from './AddressModal'
    import validationMixin from 'Mixins/validationMixin'
    import valueMixin from 'Mixins/valueMixin'

    export default {
        name: "AddressInput",
        mixins: [validationMixin, valueMixin],
        data() {
            return {
                isModalVisible: false,
                address: {
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    zip: '',
                    country_id: 185,
                    countryname: ''
                }
            }
        },
        components: {
            AddressModal,
        },
        computed: {
            stringifyAddress() {
                return this.address ? Object.keys(this.address).reduce((acc, current) => {
                    if (this.address[current] && this.address[current] !== ' ' && current !== 'caddress' && current !== 'address_id' && current !== 'country_id' && this.address.address_id) {
                        if (acc) {
                            return `${acc}, ${this.address[current]}`
                        }
                        return `${this.address[current]}`
                    }
                    return `${acc}`
                }, '') : null
            }
        },
        watch: {
            innerValue: {
                deep: true,
                handler(newValue){
                    this.address =  {
                        address1: '',
                        address2: '',
                        city: '',
                        state: '',
                        zip: '',
                        country_id: 185,
                        countryname: ''
                    };
                    this.getAddress(newValue);
                }
            }
        },
        created() {
            this.getAddress(this.value)
        },
        props: {
            // value: [String, Number],
            label: [String],
            placeholder: [String],
            name: String,
            readonly: {
                type: Boolean,
                default: false
            },
            vid: String,
            rules: [String, Object]
        },
        methods: {
            getAddress(addressId) {
                if (addressId) {
                    getAddressById(addressId).then(this.handleRequest);
                }
            },
            handleFocus() {
                !this.readonly && (this.isModalVisible = true);
            },
            closeModal() {
                this.isModalVisible = false;
            },
            onAddressSave(addressId) {
                this.$emit('input', addressId);
                this.innerValue = addressId;
                // if(addressId){
                //     this.getAddress(addressId)
                // }
            },
            handleRequest(response) {
                this.address = response.data[0];
            },
        }
    }
</script>
<style lang="scss" module>
    
    .error {
        color: #ff3547;
        position: absolute;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        top: calc(100% + 2px);
        font-weight: 400;
    }
</style>