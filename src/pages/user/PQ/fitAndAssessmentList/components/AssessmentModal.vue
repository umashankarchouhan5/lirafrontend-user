<template>
    <Popup :value="isVisible" :closable="false" :mask-closable="false" title="Fill the form below" :width="640">
        <ValidationObserver ref="validator">
            <Loader v-if="isLoading" />
            <br>
            <FormRow>
                <div class="col-sm-6">
                    <FormAutoComplete label="PQ ID"
                                      v-model="pq.UniqueRef"
                                      :items="pq_list"
                                      item-value="UniqueRef"
                                      item-name="UniqueRef"
                                      rules="required"
                                      :isLoading="loaders.pqId"
                                      :onSelect="onSelectPQ" 
                                      @keyup.native="searchForPQHandler"
                                      @focusout="searchForPQHandler('tab')"
                                      />
                </div>
                <div class="col-sm-6">
                    <FormAutoComplete label="Name"
                                      v-model="pq.Name"
                                      :items="pq_list"
                                      item-value="UniqueRef"
                                      item-name="Name"
                                      :isLoading="loaders.pqName"
                                      rules="required"
                                      :onSelect="onSelectPQ" />
                </div>
            </FormRow>
            <!-- <FormRow>
                <div class="col-sm-3">
                    Existing Licensee
                </div>
                <div class="col-sm-6">
                    <RadioGroup v-model="data.Licensee">
                        <Radio label="Y">
                            Yes
                        </Radio>
                        <Radio label="N">
                            No
                        </Radio>
                    </RadioGroup>
                </div>
            </FormRow> -->
            <FormRow >
                <template v-if="userData.icsp_id && userData.icsp_id !== '' && userData.icsp_id !== null && userData.icsp_name !== ''">
                    <div class="col-sm-12">
                        <InputText label="Name of Licensee" readonly v-model="userData.icsp_name" rules="required" />
                    </div>
                </template>
                <template v-else>
                    <div class="col-sm-12">
                        <InputText label="Name of Licensee"  v-model="data.Licensee" rules="required" />
                    </div>
                </template>
                <!-- <CompanySearch v-else @onSelectCompany="selectCompanyHandler" /> -->
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <FormSelect label="Position for which applying"
                                item-name="Name"
                                item-value="id"
                                rules="required"
                                v-model="data.position_id"
                                :items="positions" />
                </div>
            </FormRow>
        </ValidationObserver>
        <ButtonGroup slot="footer">
            <FormButton @click="submit" type="success">Submit</FormButton>
            <FormButton @click="cancel">Cancel</FormButton>
        </ButtonGroup>
    </Popup>
</template>

<script>

    import { fetchPQPosition, submitForAssessment, searchForPQ } from '../config/api'
    import loadingMixin from 'Mixins/loadingMixin'
    // import { RadioGroup, Radio } from 'view-design'
    // import CompanySearch from 'Components/companySearch/CompanySearch'
    import { ValidationObserver } from 'vee-validate';
    import FormAutoComplete from 'Components/form/FormAutoComplete';

    export default {
        name: "AssessmentModal",
        mixins: [loadingMixin],
        data() {
            return {
                loaders: {
                    pqId: false,
                    pqName: false
                },
                pq: {
                    UniqueRef: '',
                    Name: '',
                    id: ''
                },
                pq_list: [],
                positions: [],
                data: {
                    position_id: null,
                    Licensee: null,
                    icsp_id: null,
                    name: null,
                }
            }
        },
        props: {
            isVisible: Boolean,
        },
        computed:{
            userData() {
                return this.$store.state.user.user
            },
        },
        watch: {
            'pq.Name': function(newVal) {
                if (this.validateValue(newVal)) {
                    this.loaders.pqName = true;
                    this.searchForPQHandler1()
                }
            },
        },
        components: {
            // RadioGroup,
            // Radio,
            // CompanySearch,
            ValidationObserver,
            FormAutoComplete
        },
        created() {
            this.getPositions();
        },
        methods: {
            selectCompanyHandler(company) {
                this.data.icsp_id = company.id;
                this.data.name = company.Name;
            },
            onSelectPQ(pq_id) {
                this.pq = this.pq_list.find(item => item.UniqueRef === pq_id)
            },
            searchForPQHandler(event) {
                if(event.keyCode === 9 ||  event.keyCode === 13){
                    if (this.validateValueNew()) {
                        this.loaders.pqId = true;
                        const { Name, UniqueRef } = this.pq;
                        searchForPQ({
                            UniqueRef,
                            Name,
                        }).then(res => {
                            this.loaders.pqName = false;
                            this.loaders.pqId = false;
                            this.pq_list = res.data[0];
                        })
                    }
                }
            },
            searchForPQHandler1() {
                this.loaders.pqId = true;
                const { Name, UniqueRef } = this.pq;
                searchForPQ({
                    UniqueRef,
                    Name,
                }).then(res => {
                    this.loaders.pqName = false;
                    this.loaders.pqId = false;
                    this.pq_list = res.data[0];
                })
            },
            validateValueNew() {
                return this.pq.UniqueRef.length >=1
            },
            validateValue(value) {
                return value.length >=3
            },
            reset() {
                this.pq = {
                    UniqueRef: '',
                    Name: '',
                    id: ''
                };
                this.data = {
                    position_id: null,
                    Licensee: null,
                    icsp_id: null,
                    name: null,
                }
            },
            async getPositions() {
                const positions = await fetchPQPosition();
                this.positions = positions.data;
            },
            async submit() {
                const result = await this.$refs.validator.validate();
                if (result) {
                    try {
                        this.showLoader();
                        const data = {
                            pqform_id: this.pq.pq_id,
                            Licensee: this.userData.icsp_id ? this.userData.icsp_name : this.data.Licensee,
                            icsp_id: this.userData.icsp_id ? this.userData.icsp_id : '',
                            position_id: this.data.position_id
                        };
                        const response = await submitForAssessment(data);
                        const ticketReference = response.data[1][0].TicketReference;
                        this.hideLoader();
                        this.$emit('onTicketReference', ticketReference);
                        this.reset();
                    } catch(err) {
                        this.hideLoader();
                    }
                }
            },
            cancel() {
                this.reset();
                this.$emit('onClose');
            }
        }
    }
</script>
