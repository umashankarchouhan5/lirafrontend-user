
import DateUtil from 'Utils/dateUtil';
import amountCell from './amountCell';

export default [
    {
        title: 'Transaction Date',
        key: 'TransDate',
        // width: 150,
        render: (h, params) => {
            return h('span', params.row.TransDate !== null ? DateUtil.formatDate(params.row.TransDate) : '');
        },
    },
    {
        title: 'Details',
        key: 'narration',
    },
    {
        title: 'Withdrawal (USD)',
        key: 'withdrawal',
        // width: 100,
        // render:(h,params) =>{
        //     return h(amountCell,{
        //         props:{
        //             row: params.row,
        //             amount: params.row.withdrawal
        //         }
        //     })
        // },
        align: 'right'
    },
    {
        title: 'Deposit (USD)',
        key: 'Deposit',
        // width: 100,
        // render:(h,params) =>{
        //     return h(amountCell,{
        //         props:{
        //             row: params.row,
        //             amount: params.row.Deposit
        //         }
        //     })
        // },
        align: 'right'
    },
    // {
    //     title: 'Balance',
    //     key: 'balance',
    //     width: 100,
    //     align: 'right'
    // },
]
