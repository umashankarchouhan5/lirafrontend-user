import TicketReferenceLinkCell from './TicketReferenceLinkCell'
import DateUtil from 'Utils/dateUtil'

    const selection = {
        type: 'selection',
        width: 38,
        align: 'center'
    };

   const reference = {
        title: 'Reference',
        key: 'TicketReference', 
        width: 120,
        sortable: true,
	};
    const entityType = { 
        title: 'Entity Type',
        key: 'EntityType',
        width: 100,
        sortable: true
    };
    const entity = {
        title: 'Entity',
        key: 'CompanyName',
        sortable: true,
        maxWidth: 300,
    };
	const changeType = {
        title: 'Change Type',
        key: 'processname',
        sortable: true,
    };
    const status = {
        title: 'Status',
        key: 'status',
        width: 150,
        sortable: true,
    };
    const statusDate = {
        title: 'Status Date',
        key: 'StatusDate',
        sortable: true,
        width: 110,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.StatusDate));
        },
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
        width: 120,
        sortable: true,
    };

export default {
    [43]: {
        columns: [
            selection,
            entityType,
            entity,
            changeType,
            status,
            statusDate,
        ]
    }, 
    [30]: {
        columns: [
            selection,
            ticketReferenceLink,
            entityType,
            entity,
            changeType,
            status,
            statusDate,
        ]
    }, 
    [31]: {
        columns: [
            selection,
            ticketReferenceLink,
            entityType,
            entity,
            changeType,
            status,
            statusDate,
        ]
    },
    [32]: {
        columns: [
            selection,
            ticketReferenceLink,
            entityType,
            entity,
            changeType,
            status,
            statusDate,
        ]
    },
    [34]: {
        columns: [
            selection,
            ticketReferenceLink,
            entityType,
            entity,
            changeType,
            status,
            statusDate,
        ]
    },  
    [500]: {
        columns: [
            selection,
            entityType,
            entity,
            changeType,
            status,
            statusDate,
        ]
    },
}
