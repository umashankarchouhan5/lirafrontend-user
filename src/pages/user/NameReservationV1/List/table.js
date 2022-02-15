import CommentCell from './components/commentCell'
import DocumentCell from './components/documentCell'
import ActionCell from './components/actionCell'
import TicketReferenceLinkCell from './components/TicketReferenceLinkCell'
import DateUtil from 'Utils/dateUtil'

const companyName = {
    title: 'Company Name',
    key: 'CompanyName',
    sortable: true,
    width: 140
};

const entityType = {
    title: 'Entity Type',
    key: 'EntityType',
    sortable: true,
    width: 110
};

const approvedOn = {
    title: 'Approved On',
    // key: 'StatusDate',
    sortable: true,
    width: 110,
    render: (h, params) => {
        return h('span', DateUtil.formatDate(params.row.StatusDate));
    },
};

const expiredOn = {
    title: 'Expiry Date',
    key: 'ExpiryDate',
    sortable: true,
    width: 110,
    render: (h, params) => {
        return h('span', DateUtil.formatDate(params.row.ExpiryDate));
    },
};

const ticketReference = {
    title: 'Reference',
    key: 'TicketReference',
    width: 120
};

const ticketReferenceLink = {
    title: 'Reference',
    key: 'TicketReference',
    render: (h, params) => {
        return h(TicketReferenceLinkCell, {
            props: {
                row: params.row
            }
        });
    },
    width: 120
};

const status = {
    title: 'Status',
    key: 'StatusDescription',
    width: 130
};

const proposedName = {
    title: 'Proposed Name',
    key: 'ProposedName',
    sortable: true,
};

const foreignName = {
    title: 'Foreign Name',
    key: 'ForeignName',
    sortable: true,
};

const fileName = {
    title: 'Translation File',
    render: (h, params) => {
        return h(DocumentCell, {
            props: {
                row: params.row
            }
        });
    },
};
const action = {
    title: 'Action',
    render: (h, params) => {
        return h(ActionCell,{
            props:{
                row: params.row
            }
        })
    },
    width: 70,
}
const selection = {
    type: 'selection',
    width: 38,
    align: 'center'
};

const submittedOn = {
    title: 'Submitted On',
    key: 'StatusDate',
    sortable: true,
    render: (h, params) => {
        return h('span', DateUtil.formatDate(params.row.StatusDate));
    },
};

const comment = {
    title: 'Comment',
    key: 'Comment',
    render: (h, params) => {
        return h(CommentCell, {
            props: {
                row: params.row
            }
        });
    },
};

export default {
    // Approved
    [30]: {
        columns: [
            // selection,
            // ticketReferenceLink,
            ticketReference,
            // companyName,
            proposedName,
            entityType,
            approvedOn,
            expiredOn,
            status
        ]
    },
    // Rejected
    [31]: {
        columns: [
            ticketReference,
            entityType,
            proposedName,
            foreignName,
            fileName,
            comment,
            action            
        ]
    },
    // RequestInfo
    [32]: {
        columns: [
            selection,
            ticketReference,
            entityType,
            proposedName,
            foreignName,
            fileName,
            comment,
            action
        ]
    },
    // Submitted
    [34]: {
        columns: [
            ticketReference,
            entityType,
            proposedName,
            foreignName,
            fileName,
            submittedOn,
            action
        ],
        sorting: {
            key: "StatusDate",
            order: "Desc"
        }
    },
    // PendingSubmission
    [43]: {
        columns: [
            selection,
            entityType,
            proposedName,
            foreignName,
            fileName,
            action
        ]
    }
};
