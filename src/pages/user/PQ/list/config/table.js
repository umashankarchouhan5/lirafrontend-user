import statuses from './statuses'
import DateUtil from 'Utils/dateUtil'

const { pending, submitted, approved, rejected, request_for_info } = statuses;

const tableConfig = {
    [pending.value]: [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: 'PQ ID',
            key: 'UniqueRef',
            sortable: true,
            width: 200,
        },
        {
            title: 'Full Name',
            key: 'FullName',
            sortable: true,
        },
        {
            title: 'Submitted on',
            key: 'statusdate',
            sortable: true,
        },
    ],
    [submitted.value]: [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: 'Reference',
            key: 'pq_id'
        },
        {
            title: 'PQ ID',
            key: 'UniqueRef',
            width: 200,
        },
        {
            title: 'Full Name',
            key: 'FullName'
        },
        {
            title: 'Submitted on',
            key: 'statusdate',
            sortable: true,
        },
    ],
    [approved.value]: [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: 'PQ ID',
            key: 'UniqueRef',
            width: 200,
        },
        {
            title: 'Full Name',
            key: 'FullName'
        },
        {
            title: 'Approved on',
            key: 'approved_on',
            sortable: true,
        },
    ],
    [rejected.value]: [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: 'Reference',
            key: 'pq_id'
        },
        {
            title: 'PQ ID',
            key: 'UniqueRef',
            width: 200,
        },
        {
            title: 'Full Name',
            key: 'FullName'
        },
        {
            title: 'Submitted on',
            key: 'statusdate',
            sortable: true
        },
        {
            title: 'Reason for Rejection',
            key: 'reason_for_rejection'
        }
    ],
    [request_for_info.value]: [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: 'Reference',
            key: 'pq_id'
        },
        {
            title: 'PQ ID',
            key: 'UniqueRef',
            width: 200,
        },
        {
            title: 'Full Name',
            key: 'FullName'
        },
        {
            title: 'Submitted on',
            key: 'statusdate',
            sortable: true
        },
        // {
        //     title: 'Last Assessment Position',
        //     key: 'LastAssessmentPosition'
        // },
        // {
        //     title: 'Last Assessment Date',
        //     key: 'LastAssessmentDate',
        //     render: (h, params) => {
        //         return h('span', DateUtil.formatDate(params.row.LastAssessmentDate));
        //     },
        // },
    ]
};

export const tableConfigNew = [
    {
        type: 'selection',
        width: 45,
        align: 'center'
    },
    {
        title: 'PQ ID',
        key: 'UniqueRef',
		sortable: true,
        width: 120,
    },
    {
        title: 'Name',
        key: 'FullName',
		sortable: true,
    },
];

export default tableConfig
