// import statuses from './statuses'

// const { pending, submitted, approved, rejected, request_for_info } = statuses;
import ReferenceCell from '../components/referenceCell'
import DateUtil from 'Utils/dateUtil';

export default [
    {
        type: 'selection',
        width: 38,
        align: 'center'
    },
    {
        title: 'Reference',
        key: 'TicketReference',
        width: 140,
        render: (h, params) => {
            return h(ReferenceCell, {
                props: {
                    row: params.row
                }
            });
        },
		sortable: true,
    },
    
    {
        title: 'Entity Type',
        key: 'EntityType',
        width: 120,
		sortable: true,
    },
    {
        title: 'Process',
        key: 'processname',
		sortable: true,
        minWidth: 100
    },
    {
        title: 'CompanyName',
        key: 'CompanyName',
        width: 200,
		sortable: true,
    },
    {
        title: 'Status',
        key: 'status',
        width: 150,
		sortable: true,
    },
    {
        title: 'Deadline',
        width: 150,
        render: (h, params) => {
            return h('span', params.row.Deadline ? DateUtil.formatDate(params.row.Deadline) : '');
        },
		sortable: true,
    },
]
