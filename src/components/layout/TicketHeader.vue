<template>
    <div :class="$style.info" v-if="ticketValue">
        <div :class="$style.infoBlock" class="col-sm-4">
             {{ ticketValue.Referrence }}
        </div>
        <div :class="$style.infoBlock" class="col-sm-4">
            {{ ticketValue.CompanyName }}
        </div>
        <div :class="$style.infoBlock" class="col-sm-4">
            {{ ticketValue.EntityType }}
        </div>
    </div>
</template>
<script>

    export default {
        name: 'TicketHeader',
        props:{
            ticketValue:{
                type: Object,
            }
        },
        created(){
        }
        
    }
</script>
<style lang="scss" module>
    .info {
        background: #d7d6da;
        box-shadow: 0 2px 2px #00000059;
        padding: 0 15px;
        display: flex;
        font-size: 13px;
        margin: -38px -30px 30px;
        line-height: 35px;
        justify-content: space-between;
        position: sticky;
        top: 34.5px;
        z-index: 10;
        & .infoBlock:nth-child(2){
           text-align: center;
        }
        & .infoBlock:nth-child(3){
           text-align: right;
        }
    }
</style>