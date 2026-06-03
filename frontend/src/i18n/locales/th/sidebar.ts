import type { sidebarEn } from '../en/sidebar';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const sidebarTh = {
    logoAlt: 'โลโก้ RGA Data',
    groups: {
        analytics: 'การวิเคราะห์',
        intelligence: 'ข้อมูลเชิงลึก',
        system: 'ระบบ',
    },
    items: {
        overview: 'ภาพรวม',
        campaigns: 'แคมเปญ',
        dataSources: 'แหล่งข้อมูล',
        seoWeb: 'SEO และเว็บ',
        aiInsightsTools: 'วิเคราะห์ด้วย AI & เครื่องมือ',
        ecommerceInsights: 'แผนบริการ E-commerce',
        settings: 'การตั้งค่า',
        reports: 'รายงาน',
        users: 'ผู้ใช้',
    },
    badges: {
        soon: 'เร็ว ๆ นี้',
    },
    profile: {
        fallbackName: 'ผู้ใช้',
        fallbackRole: 'ผู้ชม',
        roles: {
            admin: 'ผู้ดูแลระบบ',
            manager: 'ผู้จัดการ',
            client: 'ลูกค้า',
            viewer: 'ผู้ชม',
        },
    },
    actions: {
        signOut: 'ออกจากระบบ',
    },
    logoutDialog: {
        title: 'ยืนยันการออกจากระบบ',
        description:
            'คุณต้องการออกจากระบบใช่หรือไม่? คุณสามารถเข้าสู่ระบบใหม่ได้ในภายหลัง',
        cancel: 'ยกเลิก',
        confirm: 'ออกจากระบบ',
    },
} as const satisfies TranslationShape<typeof sidebarEn>;
