import type { settingsEn } from '../en/settings';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const settingsTh = {
    page: {
        title: 'การตั้งค่า',
        subtitle: 'จัดการค่าบัญชี การตั้งค่าการใช้งาน และการแจ้งเตือน',
        tabs: {
            general: 'ทั่วไป',
            alertRules: 'กฎแจ้งเตือน',
        },
    },
    general: {
        appearance: {
            title: 'รูปลักษณ์',
            description: 'ปรับแต่งหน้าตาและความรู้สึกของแดชบอร์ด',
            darkMode: {
                label: 'โหมดมืด',
                description: 'เปลี่ยนเป็นธีมมืดสำหรับการใช้งานในที่แสงน้อย',
            },
            compactView: {
                label: 'มุมมองกะทัดรัด',
                description: 'ลดระยะห่างเพื่อแสดงข้อมูลบนหน้าจอได้มากขึ้น',
            },
        },
        regional: {
            title: 'ภูมิภาค',
            description: 'ตั้งค่าภาษาและรูปแบบภูมิภาคที่ต้องการ',
            language: 'ภาษา',
            timezone: 'เขตเวลา',
            currency: 'สกุลเงิน',
            dateFormat: 'รูปแบบวันที่',
            languages: {
                th: 'ไทย (Thai)',
                en: 'English',
            },
            timezones: {
                asiaBangkok: 'เอเชีย/กรุงเทพฯ (UTC+7)',
                utc: 'เวลาสากลเชิงพิกัด (UTC)',
            },
            currencies: {
                thb: 'THB (฿)',
                usd: 'USD ($)',
            },
            dateFormats: {
                dmy: 'วว/ดด/ปปปป',
                mdy: 'ดด/วว/ปปปป',
                ymd: 'ปปปป-ดด-วว',
            },
        },
        notifications: {
            title: 'การแจ้งเตือน',
            description: 'เลือกช่องทางและรูปแบบการรับการแจ้งเตือน',
            inApp: {
                label: 'การแจ้งเตือนในแอป',
                description: 'แสดงการแจ้งเตือนภายในแดชบอร์ด',
            },
            email: {
                label: 'การแจ้งเตือนทางอีเมล',
                description: 'รับการแจ้งเตือนผ่านอีเมล',
            },
            line: {
                label: 'การแจ้งเตือนผ่าน LINE',
                description: 'รับการแจ้งเตือนผ่าน LINE',
            },
        },
    },
    alertRules: {
        header: {
            title: 'กฎเฝ้าระวัง',
            description:
                'ติดตามแคมเปญอัตโนมัติและแจ้งเตือนเมื่อค่าตัวชี้วัดเกินเงื่อนไขที่กำหนด',
            addRule: 'เพิ่มกฎ',
        },
        empty: {
            title: 'ยังไม่มีกฎแจ้งเตือน',
            description:
                'สร้างกฎแจ้งเตือนแรกของคุณเพื่อติดตามตัวชี้วัดแคมเปญอัตโนมัติและรับการแจ้งเตือนเมื่อค่าเกินเงื่อนไข',
            createRule: 'สร้างกฎ',
        },
        table: {
            active: 'เปิดใช้งาน',
            name: 'ชื่อ',
            condition: 'เงื่อนไข',
            severity: 'ระดับ',
            type: 'ประเภท',
            actions: 'การทำงาน',
        },
        status: {
            loadFailed: 'โหลดกฎไม่สำเร็จ โปรดลองอีกครั้ง',
        },
        metrics: {
            ctr: 'CTR',
            cpc: 'CPC',
            roas: 'ROAS',
            spend: 'ค่าใช้จ่าย',
            impressions: 'การแสดงผล',
            clicks: 'คลิก',
            conversions: 'คอนเวอร์ชัน',
        },
        metricOptions: {
            ctr: 'CTR (อัตราคลิกผ่าน)',
            cpc: 'CPC (ต้นทุนต่อคลิก)',
            roas: 'ROAS (ผลตอบแทนจากค่าโฆษณา)',
            spend: 'ค่าใช้จ่าย (ต้นทุนรวม)',
            impressions: 'การแสดงผล',
            clicks: 'คลิก',
            conversions: 'คอนเวอร์ชัน',
        },
        operators: {
            gt: 'มากกว่า (>)',
            lt: 'น้อยกว่า (<)',
            gte: 'มากกว่าหรือเท่ากับ (≥)',
            lte: 'น้อยกว่าหรือเท่ากับ (≤)',
            eq: 'เท่ากับ (=)',
        },
        severity: {
            critical: 'วิกฤต',
            warning: 'เตือน',
            info: 'ข้อมูล',
        },
        types: {
            preset: 'ค่าตั้งต้น',
            custom: 'กำหนดเอง',
        },
        tooltips: {
            presetEdit: 'กฎตั้งต้นไม่สามารถแก้ไขได้',
            edit: 'แก้ไขกฎ',
            presetDelete: 'กฎตั้งต้นไม่สามารถลบได้',
            delete: 'ลบกฎ',
        },
        toasts: {
            created: 'สร้างกฎแล้ว',
            createdDescription: 'สร้างกฎแจ้งเตือนสำเร็จแล้ว',
            createFailed: 'สร้างกฎไม่สำเร็จ',
            updated: 'อัปเดตกฎแล้ว',
            updatedDescription: 'อัปเดตกฎแจ้งเตือนแล้ว',
            updateFailed: 'อัปเดตกฎไม่สำเร็จ',
            toggleFailed: 'เปลี่ยนสถานะกฎไม่สำเร็จ',
            deleted: 'ลบกฎแล้ว',
            deletedDescription: 'ลบกฎแจ้งเตือนแล้ว',
            deleteFailed: 'ลบกฎไม่สำเร็จ',
            unknownError: 'ไม่ทราบข้อผิดพลาด',
        },
        deleteDialog: {
            title: 'ลบกฎแจ้งเตือน',
            description:
                'คุณแน่ใจหรือไม่ว่าต้องการลบ "{name}"? การกระทำนี้ไม่สามารถย้อนกลับได้',
            cancel: 'ยกเลิก',
            delete: 'ลบ',
        },
        form: {
            createTitle: 'สร้างกฎแจ้งเตือน',
            editTitle: 'แก้ไขกฎแจ้งเตือน',
            createDescription: 'สร้างกฎใหม่เพื่อติดตามแคมเปญของคุณ',
            editDescription: 'แก้ไขการตั้งค่าของกฎแจ้งเตือน',
            fields: {
                name: 'ชื่อกฎ',
                metric: 'ตัวชี้วัด',
                condition: 'เงื่อนไข',
                threshold: 'ค่าเกณฑ์',
                severity: 'ระดับ',
                description: 'คำอธิบาย (ไม่บังคับ)',
            },
            placeholders: {
                name: 'เช่น แจ้งเตือน CTR ต่ำ',
                metric: 'เลือกตัวชี้วัด',
                operator: 'เลือกเงื่อนไข',
                threshold: '1.0',
                severity: 'เลือกระดับ',
                description: 'อธิบายว่ากฎนี้ใช้ติดตามอะไร...',
            },
            help: {
                threshold: 'ค่าที่ใช้สำหรับเปรียบเทียบ',
            },
            actions: {
                cancel: 'ยกเลิก',
                saveChanges: 'บันทึกการเปลี่ยนแปลง',
                createRule: 'สร้างกฎ',
            },
            validation: {
                nameRequired: 'กรุณากรอกชื่อ',
                nameTooLong: 'ชื่อยาวเกินไป',
                metricRequired: 'กรุณาเลือกตัวชี้วัด',
                operatorRequired: 'กรุณาเลือกเงื่อนไข',
                thresholdPositive: 'ค่าเกณฑ์ต้องเป็นค่าบวก',
            },
        },
    },
} as const satisfies TranslationShape<typeof settingsEn>;
