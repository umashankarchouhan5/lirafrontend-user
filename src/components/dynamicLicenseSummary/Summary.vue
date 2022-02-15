<template>
    <div >
        <br />
        <Card >
            <h3 :class="$style.formName"><b>Summary : </b> {{formName}}</h3>

            <div :class="$style.pdf" v-if="generatePdf" @click="generatePdf">
                <img src="../../assets/images/PDF.png" alt="">
            </div>

            <div v-for="(page,index) in formattedData" :key="index" :class="$style.infoBox" >
                <div :class="$style.flexBox">
                    <h4 :class="$style.infoHeading"><strong>{{index +1}}: {{page.title}}</strong> </h4>
                    <template v-if="page.title.toLowerCase() !== 'documents'">
                        <div v-for="(detail,i) in getDetails(page.data)" :key="i" :class="$style.detailStyle">
                            <div :class="detail.completed == detail.total ? $style.greenBox : $style.redBox ">
                                <p>{{ detail.title }} Completed <span>{{detail.completed}}</span> of <span>{{detail.total}}</span></p>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div v-for="(detail,i) in getDocDetails()" :key="i" :class="$style.detailStyle">
                            <div :class="detail.completed == detail.total ? $style.greenBox : $style.redBox ">
                                <p>{{ detail.title }} Completed <span>{{detail.completed}}</span> of <span>{{detail.total}}</span></p>
                            </div>
                        </div>
                    </template>

                    <div>
                        <FormButton @click="gotoStep(index +1)">Go</FormButton>
                    </div>
                </div>
                
            </div>
        </Card>
    </div>
</template>

<script>
    
    import Card from './Card';

    export default {
        name: 'DynamicSummaryLicense',
        props: {
            licenseData: {
                type: Array,
                default: () => []
            },
            stepsData: {
                type: [Array, Object],
                default: () => []
            },
            documents: {
                type: Array,
                default: () => []
            },
            generatePdf: Function
        },
        components: {
            Card
        },
        data() {
            return {

            }
        },
        computed: {
            formName() {
                return this.licenseData[0] ? this.licenseData[0][0].FormTitle : ''
            },
            formattedData() {
                if(this.licenseData[1]){
                    let mod = this.stepsData.map( ele => {
                        let obj = {};
                        obj.title = ele.title;
                        obj.data = this.licenseData[1].filter(item => {
                            return item.Page == ele.id;
                        } )
                        if(obj.title.toLowerCase() !== 'payments' ) return obj;
                        else return false;
                    })
                    mod = mod.filter(ele => ele != false)
                    return mod;
                }
                return []
            }
        },
        methods: {
            gotoStep(step) {
                this.$emit('stepToGo',step);
            },
            getDocDetails(){
                const totalLength = this.documents.length;
                const completedLength = this.documents.filter( item => {
                    return item.name && item.name !== null;
                }).length;
                const dataToReturn = [
                    {
                        title: 'Questions',
                        completed: completedLength,
                        total: totalLength
                    }
                ];
                return dataToReturn;
            },
            getDetails(data) {
                const actualQuestions = data.filter( item => item.BlockJson == null);
                const mandatory = actualQuestions.filter( item => item.isMandatory == 1 );
                const optional = actualQuestions.filter( item => item.isMandatory == 0);
                const totalCompleted = actualQuestions.filter( ele => {
                    if(ele.ValueTextArea == null && ele.ValueInt == null && ele.ValueDate == null && (ele.isNA == null || ele.isNA == false) && ele.FieldType !== 'table' && ( ele.FieldType !== 'table' && ele.isMandatory == 1) ){
                        return false
                    }
                    else if(ele.FieldType == 'table'){
                        const formatJson = JSON.parse(ele.FieldJson);
                        const tableValue = JSON.parse(ele.TableJson);
                        const filled = formatJson.every( item => {
                            if(item.required != true){
                                return true;
                            }
                            else{
                                try {

                                    if(tableValue[0][item.field].trim() !== '' ){
                                        return true;
                                    }
                                    return false;
                                    
                                } catch (error) {
                                    return true;
                                }
                            }
                            return false;
                        })
                        if( filled || ele.isNA == true || ele.isNA == 1 ){
                            return true;
                        }
                        return false
                    }
                    return true;
                })
                const mandatoryCompleted = mandatory.filter( ele => {
                    if(ele.ValueTextArea == null && ele.ValueInt == null && ele.ValueDate == null){
                        return false
                    }
                    return ele
                })
                const optionalCompleted = optional.filter( ele => {
                    if(ele.ValueTextArea == null && ele.ValueInt == null && ele.ValueDate == null){
                        return false
                    }
                    return ele
                })
                const dataToReturn = [
                    {
                        title: 'Questions',
                        completed: totalCompleted.length,
                        total: actualQuestions.length
                    }
                ];
                return dataToReturn;
            }

        }
        
    }
</script>

<style lang="scss" module>
    .pdf {
        position: absolute;
        right: 22px;
        top: 18px;

        img {
            max-width: 20px;
            cursor: pointer;
        }
    }
    .formName {
        letter-spacing: 2px;
        text-transform: uppercase;
        text-decoration-line: underline;
        text-underline-position: under;
        text-underline-offset: 5px;
        margin-bottom: 20px;
        line-height: 26px;
    }
    .infoBox {
        border-radius: 8px;
        padding: 10px;
        margin: 10px 0px;
        box-shadow: 0px 5px 5px rgba( 0, 0, 0, 0.1 );
    }
    .detailStyle {
        margin: 0px 20px;
        width: 50%;
        p {
            font-weight: 500;
            text-shadow: 2px 2px 3px rgba(122, 119, 119, 0.2);
            margin: 5px 0px;
            >span {
                font-size: 14px;
                color: rgb(46, 46, 46);
                margin: 0px 3px;
                text-shadow: 2px 2px 4px  rgba(34, 34, 34, 0.5);
            } 
        }
    }
    .greenBox {
        background: rgba(23, 255, 89, 0.8);
        padding: 0px 10px;
        border-radius: 8px;
        border: 1px solid #62ca01;
    }
    .redBox {
        background: rgba(253, 84, 72, 0.8);
        padding: 0px 10px;
        border-radius: 8px;
        border: 1px solid #ff1a1a;
    }
    .flexBox {
        display: flex;
        align-items: center;
        .infoHeading {
            min-width: 150px;
            letter-spacing: 1.2px;
        }
    }

</style>