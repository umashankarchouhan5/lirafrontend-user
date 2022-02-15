
import refCell from './refCell';

export default function(){
    const instance = this;
    return [
        
        {
            type: 'selection',
            width: 45,
            align: 'center'
        },
        
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
            title: 'Position',
            key:'position',
            
        },
        {
            title: 'Change Type',
            key:'ChangeType',
            
        },
        {
            title: 'Passport Number',
            key:'passportNumber',
            width: 150
        },
        
    
    ]
}