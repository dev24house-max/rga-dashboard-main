import type { reportsEn } from '../en/reports';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const reportsTh = {
    page: {
        title: 'รายงานและการส่งออก',
        subtitle: 'ดาวน์โหลดข้อมูลแคมเปญและตัวชี้วัดประสิทธิภาพ',
    },
    filters: {
        title: 'ตัวกรองการส่งออก',
        description: 'ตั้งค่าตัวกรองก่อนส่งออกรายงาน',
        period: 'ช่วงเวลา',
        platform: 'แพลตฟอร์ม',
        status: 'สถานะแคมเปญ',
        placeholders: {
            period: 'เลือกช่วงเวลา',
            platform: 'เลือกแพลตฟอร์ม',
            status: 'เลือกสถานะ',
        },
    },
    periods: {
        '1d': 'วันนี้',
        '7d': '7 วันที่ผ่านมา',
        '14d': '14 วันที่ผ่านมา',
        '30d': '30 วันที่ผ่านมา',
        '90d': '90 วันที่ผ่านมา',
        '365d': '1 ปีที่ผ่านมา',
    },
    platforms: {
        all: 'ทุกแพลตฟอร์ม',
        allPlatformsLower: 'ทุกแพลตฟอร์ม',
        googleAds: 'Google Ads',
        facebookAds: 'Facebook Ads',
        tiktokAds: 'TikTok Ads',
        lineAds: 'LINE Ads',
    },
    statuses: {
        all: 'ทุกสถานะ',
        active: 'ใช้งานอยู่',
        paused: 'หยุดชั่วคราว',
        ended: 'สิ้นสุดแล้ว',
        draft: 'แบบร่าง',
    },
    exportCards: {
        csv: {
            title: 'ข้อมูลแคมเปญ (CSV)',
            description: 'ส่งออกแคมเปญทั้งหมดพร้อมตัวชี้วัด',
            includes: 'ประกอบด้วย:',
            items: {
                campaignDetails: 'ชื่อแคมเปญ แพลตฟอร์ม และสถานะ',
                performance: 'การแสดงผล คลิก และค่าใช้จ่าย',
                conversion: 'คอนเวอร์ชัน รายได้ และ ROAS',
                costMetrics: 'ตัวชี้วัด CTR และ CPC',
            },
            exporting: 'กำลังส่งออก...',
            download: 'ดาวน์โหลด CSV',
        },
        pdf: {
            title: 'รายงานประสิทธิภาพ (PDF)',
            description: 'รายงานสรุปพร้อมแนวโน้ม',
            includes: 'ประกอบด้วย:',
            items: {
                summaryTable: 'ตารางสรุปประสิทธิภาพ',
                comparison: 'การเปรียบเทียบช่วงเวลา (เทียบกับช่วงก่อนหน้า)',
                dailyBreakdown: 'รายละเอียดตัวชี้วัดรายวัน',
                trends: 'เปอร์เซ็นต์แนวโน้ม',
            },
            generating: 'กำลังสร้าง...',
            download: 'ดาวน์โหลด PDF',
            periodNote: 'PDF ใช้ช่วงเวลา {period}',
        },
    },
    info: {
        title: 'เกี่ยวกับรายงาน',
        description:
            'การส่งออก CSV จะมีข้อมูลแคมเปญดิบตามแพลตฟอร์มและสถานะที่เลือก ส่วนรายงาน PDF จะเป็นสรุปที่จัดรูปแบบแล้วพร้อมการเปรียบเทียบกับช่วงก่อนหน้า',
    },
    toasts: {
        csvSuccess: 'ส่งออก CSV สำเร็จ',
        csvSuccessDescription:
            'ดาวน์โหลดรายงานแคมเปญช่วง {period} โดยใช้ตัวกรอง {platform} แล้ว',
        csvFailed: 'ส่งออก CSV ไม่สำเร็จ',
        pdfSuccess: 'ส่งออกรายงาน PDF สำเร็จ',
        pdfSuccessDescriptionAll: 'ดาวน์โหลดรายงานตัวชี้วัดช่วง {period} แล้ว',
        pdfSuccessDescriptionPlatform:
            'ดาวน์โหลดรายงานตัวชี้วัดช่วง {period} สำหรับ {platform} แล้ว',
        pdfFailed: 'ส่งออก PDF ไม่สำเร็จ',
        retryDescription: 'โปรดตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง',
    },
} as const satisfies TranslationShape<typeof reportsEn>;
