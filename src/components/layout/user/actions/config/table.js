import DateUtil from 'Utils/dateUtil';
// import invoiceCell from './invoiceCell'

export default [
    {
        type: 'selection',
        width: 38,
        align: 'center'
    },
    {
        title: 'Invoice Id',
        width: 100,
        key: 'invoice_id',
        // render: (h, params) => {
        //     return h(invoiceCell, {
        //         props: {
        //             row: params.row
        //         }
        //     });
        // },
    },
	{
        title: 'Action Type',
        key: 'ActionType',
        width: 140
    },
    {
        title: 'Action Brief',
        key: 'ActionBrief',
        
    },

	// {
    //     title: 'Who',
    //     key: 'isAdmin',
    //     width: 140
    // },
    {
        title: 'Due Date',
        width: 150,
		sortable: true,
        render: (h, params) => {
            return h('span', params.row.Deadline ? DateUtil.formatDate(params.row.Deadline) : '');
        },
    },
    
    {
        title: 'Status',
        key: 'Status',
        width: 140
    },
    
]
