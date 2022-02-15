import DateUtil from 'Utils/dateUtil';
import AmountCell from './amountCell';

export default [
    
    {
        title: 'Date',
        sortable: false,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.paymentDate));
        },
    },
    {
        title: 'Invoice ID',
        key: 'InvoiceNumber',
        sortable: false,
    },
    {
        title: 'Mode',
        key: 'modeName',
        sortable: false,
    },
    {
        title: 'Transaction ID',
        key: 'CCReference',
        sortable: false
    },
    {
        title: 'Amount',
        key: 'InvoiceDetail',
        sortable: false,
        render: (h, params) => {
            return h('div', [
                h(AmountCell, {
                    props: {
                        row: params.row,
                    }
                }),
            ]);
        }
    }
]
