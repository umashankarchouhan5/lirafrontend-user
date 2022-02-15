
import refCell from './refCell';
import DateUtil from 'Utils/dateUtil';

export default function(){
    const instance = this;
    return [
        
        {
            title: 'Name',
            key: 'Name',
            render: (h, params) => {
                return h('div', [
                    h(refCell, {
                        props: {
                            row: params.row,
                            openPop: instance.openPop
                        }
                    }),
                ]);
            }
        },
        {
            title: 'Change Action',
            key: 'ChangeAction',
            width: 180
        },
        {
            title: 'Effective Date',
            render: (h, params) => {
                return h('span', DateUtil.formatDate(params.row.effectivedate));
            },
            align: 'left',
            width: 180
        },
        
    
    ]
}