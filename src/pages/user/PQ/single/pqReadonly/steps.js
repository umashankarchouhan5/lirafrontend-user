import {
    PersonalDetail,
    ProposedRole,
    Qualifications,
    CareerHistory,
    CivilDisciplinary,
    DisclosureConflict,
} from '../components'

import { Documents } from 'Organisms/documents'

export default [
    {
        id: 1,
        title: 'Personal Details',
        component: PersonalDetail,
        isActive: true
    },
    {
        id: 2,
        title: 'Proposed Role',
        component: ProposedRole,
        isActive: false,
        isDisabled: false
    },
    {
        id: 3,
        title: 'Qualifications',
        component: Qualifications,
        isActive: false,
        isDisabled: false
    },
    {
        id: 4,
        title: 'Career History',
        component: CareerHistory,
        isActive: false,
        isDisabled: false
    },
    {
        id: 5,
        title: 'Civil and Disciplinary',
        component: CivilDisciplinary,
        isActive: false,
        isDisabled: false
    },
    {
        id: 6,
        title: 'Disclosure of Conflict of Interest',
        component: DisclosureConflict,
        isActive: false,
        isDisabled: false
    },
    {
        id: 7,
        title: 'Documents',
        component: Documents,
        isActive: false,
        isDisabled: false
    },
];
