import type { dataSourcesEn } from '../en/data-sources';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const dataSourcesTh = {
    page: {
        title: 'แหล่งข้อมูล',
        subtitle: 'เชื่อมต่อแพลตฟอร์มโฆษณาของคุณเพื่อซิงก์ข้อมูล',
        connectedPlatforms: 'แพลตฟอร์มที่เชื่อมต่อ',
        connectedPlatformsTooltip:
            'เชื่อมต่อแพลตฟอร์มโฆษณาเพื่อนำเข้าแคมเปญ ข้อมูลการใช้จ่าย และเมตริกประสิทธิภาพโดยอัตโนมัติ คุณสามารถจัดการและยกเลิกการเชื่อมต่อแพลตฟอร์มได้ทุกเมื่อ',
        disconnectDialog: {
            title: 'ยกเลิกการเชื่อมต่อนี้?',
            description:
                'การดำเนินการนี้จะลบการเชื่อมต่อกับ {platformName} ข้อมูลที่ซิงก์ไว้จะยังคงอยู่ แต่จะไม่มีการนำเข้าข้อมูลใหม่อีก',
            fallbackPlatform: 'แพลตฟอร์มนี้',
            cancel: 'ยกเลิก',
            disconnect: 'ยกเลิกการเชื่อมต่อ',
        },
    },
    platforms: {
        adPlatform: 'แพลตฟอร์มโฆษณา',
        google: {
            name: 'Google Ads',
            description:
                'เชื่อมต่อบัญชี Google Ads ของคุณเพื่อซิงก์แคมเปญและเมตริก',
        },
        'google-analytics': {
            name: 'Google Analytics 4',
            description:
                'เชื่อมต่อพร็อพเพอร์ตี GA4 ของคุณเพื่อซิงก์ข้อมูลวิเคราะห์เว็บไซต์',
        },
        'search-console': {
            name: 'Google Search Console',
            description:
                'เชื่อมต่อ Search Console เพื่อซิงก์ประสิทธิภาพการค้นหาแบบ organic',
        },
        facebook: {
            name: 'Facebook Ads',
            description: 'เชื่อมต่อบัญชี Facebook Ads ของคุณเพื่อซิงก์แคมเปญ',
        },
        tiktok: {
            name: 'TikTok Ads',
            description: 'เชื่อมต่อบัญชี TikTok Ads ของคุณเพื่อซิงก์แคมเปญ',
        },
        line: {
            name: 'LINE Ads',
            description: 'เชื่อมต่อบัญชี LINE Ads ของคุณเพื่อซิงก์แคมเปญ',
        },
    },
    card: {
        connected: 'เชื่อมต่อแล้ว',
        notConnected: 'ไม่ได้เชื่อมต่อ',
        never: 'ไม่เคยซิงก์',
        lastSync: 'ซิงก์ล่าสุด: {date}',
        moreAccounts: '+อีก {count} บัญชี',
        connectDescription:
            'เชื่อมต่อบัญชี {platformName} ของคุณเพื่อซิงก์แคมเปญและเมตริก',
        disconnect: 'ยกเลิกการเชื่อมต่อ',
        openDashboard: 'เปิดแดชบอร์ด',
        connectPlatform: 'เชื่อมต่อ {platformName}',
    },
    accountDialog: {
        title: 'เลือกบัญชี {platformName}',
        description:
            'เลือกบัญชีหรือพร็อพเพอร์ตีที่ต้องการเชื่อมต่อ คุณสามารถเปลี่ยนได้ภายหลังในการตั้งค่า',
        empty: 'ไม่พบบัญชี โปรดตรวจสอบสิทธิ์การเข้าถึงของคุณ',
        idLabel: 'ID:',
        statusSeparator: '•',
        cancel: 'ยกเลิก',
        connecting: 'กำลังเชื่อมต่อ...',
        connect: 'เชื่อมต่อ',
    },
    toasts: {
        integrationError: 'เกิดข้อผิดพลาดในการเชื่อมต่อ: {error}',
        platformConnected: 'เชื่อมต่อ {platformName} สำเร็จแล้ว',
        unknownPlatform: 'ไม่พบแพลตฟอร์มใน callback',
        noAccountsFound: 'ไม่พบบัญชี โปรดตรวจสอบสิทธิ์การเข้าถึงของคุณ',
        fetchAccountsFailed: 'ดึงข้อมูลบัญชีไม่สำเร็จ โปรดลองอีกครั้ง',
        connectionFailed: 'เชื่อมต่อ {platformName} ไม่สำเร็จ: {message}',
        tiktokSandboxConnected: 'เชื่อมต่อ TikTok Sandbox สำเร็จแล้ว',
        noAuthUrl: 'ไม่ได้รับ auth URL',
        facebookNotConfigured:
            'ยังไม่ได้ตั้งค่า Facebook integration โปรดติดต่อผู้ดูแลระบบเพื่อตั้งค่า Facebook App credentials',
        unknownError: 'ข้อผิดพลาดที่ไม่ทราบสาเหตุ',
        startConnectionFailed:
            'เริ่มการเชื่อมต่อ {platformName} ไม่สำเร็จ: {message}',
        platformDisconnected: 'ยกเลิกการเชื่อมต่อ {platformName} แล้ว',
        disconnectFailed: 'ยกเลิกการเชื่อมต่อ {platformName} ไม่สำเร็จ',
    },
} as const satisfies TranslationShape<typeof dataSourcesEn>;
