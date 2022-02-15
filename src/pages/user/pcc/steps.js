import GeneralInfo from 'Pages/user/commonPages/cslpccComponents/GeneralInfo';
import Management from 'Pages/user/commonPages/cslpccComponents/Management';
import Business from 'Pages/user/commonPages/cslpccComponents/Business';

import Payments from 'Components/layout/user/payment/Payments'

import { Documents } from 'Organisms/documents'

const steps = [
    {
        id: 1,
        title: 'General Info',
        isActive: true,
        component: GeneralInfo,
    },
    {
        id: 2,
        title: 'Managerial Staff',
        isActive: true,
        component: Management,
        isDisabled: true
    },
    {
        id: 3,
        title: 'Business Strategy',
        isActive: true,
        component: Business,
        isDisabled: true
    },
    {
        id: 4,
        title: 'Documents',
        isActive: false,
        component: Documents,
        isDisabled: true
    },
    
    {
        id: 5,
        title: 'Payments',
        component: Payments,
        isActive: false,
        isDisabled: true
    }
];

export default steps;