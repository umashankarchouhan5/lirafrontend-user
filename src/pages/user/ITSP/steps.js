import {
    GeneralInfo,
    CompanyPersons,
    FinancialInfo,
    MiscInfo
} from 'Pages/user/commonPages/licensingComponent';

// import {
//     MiscInfo
// } from './components/formSteps';

import Payments from 'Components/layout/user/payment/Payments'

import { Documents } from 'Organisms/documents'

const steps = [
    {
        id: 1,
        title: 'General Information',
        isActive: true,
        component: GeneralInfo,
    },
    {
        id: 2,
        title: 'Financial Information',
        isActive: false,
        component: FinancialInfo,
        isDisabled: true
    },
    {
        id: 3,
        title: 'Staffing',
        isActive: false,
        component: CompanyPersons,
        isDisabled: true
    },
    {
        id: 4,
        title: 'Training Details',
        isActive: false,
        component: MiscInfo,
        isDisabled: true
    },
    {
        id: 5,
        title: 'Supporting Documents',
        isActive: false,
        component: Documents,
        isDisabled: true
    },
    
    {
        id: 6,
        title: 'Payments',
        component: Payments,
        isActive: false,
        isDisabled: true
    }
];

export default steps;