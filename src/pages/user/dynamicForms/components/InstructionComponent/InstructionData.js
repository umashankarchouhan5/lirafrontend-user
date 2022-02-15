import { FUND_LICENSE,
    APPROVED_FOREIGN_ADMINISTRATOR,
    EXEMPT_FOREIGN,
    FUNDS_ADMINISTRATOR,
    SECURITY_LICENSE,
    SECURITY_IA_COMPANY,
    SECURITY_IA_INDIVIDUAL,
    SECURITY_EXCHANGE,
    SECURITY_FACILITY,
    SECURITY_CLEARING,
    SECURITY_EXEMPT,
    DOMESTIC_INSURER,
    SLOT_MACHINE,
    REPRESENTATIVE_LICENSE
} from 'Config/processIds';

export default {
    FUND_LICENSE : { 
        title: 'Funds License - Instruction',
        process_id: FUND_LICENSE,
        url: '/fundLicenseForm'
    },
    APPROVED_FOREIGN_ADMINISTRATOR : { 
        title: 'Approved Foriegn Administrator License - Instruction',
        process_id: APPROVED_FOREIGN_ADMINISTRATOR,
        url: '/foreignAdminForm'
    },
    EXEMPT_FOREIGN : { 
        title: 'Exempt Foreign Fund License - Instruction',
        process_id: EXEMPT_FOREIGN,
        url: '/exemptForeignFundForm'
    },
    FUNDS_ADMINISTRATOR : { 
        title: 'Fund Administrator License - Instruction',
        process_id: FUNDS_ADMINISTRATOR,
        url: '/fundAdminForm'
    },
    SECURITY_LICENSE : { 
        title: 'Security License - Instruction',
        process_id: SECURITY_LICENSE,
        url: '/securityLicenseForm'
    },
    REPRESENTATIVE_LICENSE : {
        title: 'Representive License - Instruction',
        process_id: REPRESENTATIVE_LICENSE,
        url: '/representativelicenseForm'
    },
    SECURITY_IA_COMPANY : { 
        title: 'Security IA Company - Instruction',
        process_id: SECURITY_IA_COMPANY,
        url: '/secIACompanyForm'
    },
    SECURITY_IA_INDIVIDUAL : { 
        title: 'Security IA Individual - Instruction',
        process_id: SECURITY_IA_INDIVIDUAL,
        url: '/secIAIndividualForm'
    },
    SECURITY_EXCHANGE : { 
        title: 'Security Exchange - Instruction',
        process_id: SECURITY_EXCHANGE,
        url: '/secExchangeForm'
    },
    SECURITY_FACILITY : { 
        title: 'Security Facility - Instruction',
        process_id: SECURITY_FACILITY,
        url: '/secFacilityForm'
    },
    SECURITY_CLEARING : { 
        title: 'Security Clearing - Instruction',
        process_id: SECURITY_CLEARING,
        url: '/secClearingForm'
    },
    SECURITY_EXEMPT : { 
        title: 'Security Exempt - Instruction',
        process_id: SECURITY_EXEMPT,
        url: '/secExemptForm'
    },
    DOMESTIC_INSURER : { 
        title: 'Domestic Insurer Application Form - Instruction',
        process_id: DOMESTIC_INSURER,
        url: '/domesticInsurerForm'
    },
    SLOT_MACHINE : { 
        title: 'Casino/Slot Machine Licence Application Form - Instruction',
        process_id: SLOT_MACHINE,
        url: '/slotMachineLicenseForm'
    },
}