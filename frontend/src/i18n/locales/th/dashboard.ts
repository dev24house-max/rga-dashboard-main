import type { dashboardEn } from '../en/dashboard';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const dashboardTh = {
    page: {
        title: 'แดชบอร์ด',
        subtitle: 'ติดตามประสิทธิภาพโฆษณาของคุณในทุกแพลตฟอร์ม',
        sections: {
            integrationChecklist: 'เช็กลิสต์การเชื่อมต่อ',
            keyPerformanceMetrics: 'ตัวชี้วัดหลัก',
            keyPerformanceMetricsTooltip:
                'ติดตามตัวชี้วัดโฆษณาสำคัญ เช่น ค่าใช้จ่ายรวม คลิก การแสดงผล คอนเวอร์ชัน และ ROAS ในทุกแพลตฟอร์มภายในช่วงเวลาที่เลือก',
            aiSummaries: 'สรุปโดย AI',
            aiSummariesTooltip:
                'การวิเคราะห์ประสิทธิภาพโฆษณาที่สร้างโดย AI พร้อมคำแนะนำที่นำไปใช้ได้จริงเพื่อปรับปรุงแคมเปญของคุณ',
            performanceTrendsAndRecentCampaigns:
                'แนวโน้มประสิทธิภาพและแคมเปญล่าสุด',
            financialOverviewAndConversionFunnel:
                'ภาพรวมการเงิน',
            financialOverviewAndConversionFunnelTooltip:
                'วิเคราะห์ค่าใช้จ่ายโฆษณาตามแพลตฟอร์ม ดูตัวชี้วัดทางการเงินรวมถึงประมาณการรายได้และกำไรจาก ROAS และติดตามฟันเนลคอนเวอร์ชันตั้งแต่การแสดงผลไปจนถึงคอนเวอร์ชัน',
        },
        errors: {
            loadDashboardData: 'โหลดข้อมูลแดชบอร์ดไม่สำเร็จ',
            unexpected: 'เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้ง',
            retry: 'ลองอีกครั้ง',
        },
    },
    comparison: {
        previousDay: 'เทียบกับวันก่อนหน้า',
        previousDays: 'เทียบกับ {days} วันก่อนหน้า',
        yesterday: 'เทียบกับเมื่อวาน',
        lastWeek: 'เทียบกับสัปดาห์ที่แล้ว',
        previousWeek: 'เทียบกับสัปดาห์ก่อนหน้า',
        previous7Days: 'เทียบกับ 7 วันก่อนหน้า',
        previous14Days: 'เทียบกับ 14 วันก่อนหน้า',
        previous30Days: 'เทียบกับ 30 วันก่อนหน้า',
        previous90Days: 'เทียบกับ 90 วันก่อนหน้า',
        previous365Days: 'เทียบกับ 365 วันก่อนหน้า',
        lastMonth: 'เทียบกับเดือนที่แล้ว',
        previousMonth: 'เทียบกับเดือนก่อนหน้า',
        previous3Months: 'เทียบกับ 3 เดือนก่อนหน้า',
        previousPeriod: 'เทียบกับช่วงก่อนหน้า',
        lastPeriod: 'เทียบกับช่วงก่อนหน้า',
    },
    metrics: {
        totalSpend: 'ค่าใช้จ่ายรวม',
        impressions: 'การแสดงผล',
        clicks: 'คลิก',
        conversions: 'คอนเวอร์ชัน',
    },
    aiSummaries: {
        title: 'สรุปโดย AI',
        subtitle: 'ประสิทธิภาพของตัวชี้วัดหลัก',
        unableToLoad: 'ไม่สามารถโหลดสรุปโดย AI ได้ในขณะนี้',
        offlineData: 'กำลังแสดงข้อมูลออฟไลน์ รีเฟรชเพื่อรับอัปเดตล่าสุด',
        cpm: 'CPM',
        ctr: 'CTR',
        roas: 'ROAS',
        roi: 'ROI',
    },
    trendChart: {
        title: 'แนวโน้มประสิทธิภาพ',
        empty: 'ไม่มีข้อมูลสำหรับช่วงเวลาที่เลือก',
        infoTitle: 'แนวโน้มประสิทธิภาพ',
        infoDescription:
            'กราฟนี้แสดงข้อมูลแนวโน้มตามช่วงเวลาสำหรับตัวชี้วัดแคมเปญสำคัญ เช่น ค่าใช้จ่าย การแสดงผล คลิก และคอนเวอร์ชัน ช่วยติดตามการเปลี่ยนแปลงของประสิทธิภาพ เปรียบเทียบการเติบโตของตัวชี้วัด และค้นหาโอกาสในการปรับปรุง',
        cost: 'ค่าใช้จ่าย',
        impressions: 'การแสดงผล',
        clicks: 'คลิก',
        conversions: 'คอนเวอร์ชัน',
    },
    recentCampaigns: {
        title: 'แคมเปญล่าสุด',
        infoTitle: 'แคมเปญล่าสุด',
        infoDescription:
            'ส่วนนี้แสดง 5 แคมเปญล่าสุด ช่วยติดตามสถานะแคมเปญ แพลตฟอร์มโฆษณา จำนวนเงินที่ใช้ และการใช้งบประมาณ เพื่อให้คุณตรวจสอบประสิทธิภาพแคมเปญปัจจุบันได้อย่างรวดเร็ว',
        countSingular: '{count} แคมเปญล่าสุด',
        countPlural: '{count} แคมเปญล่าสุด',
        emptyDescription: 'ไม่พบแคมเปญ',
        empty: 'ไม่มีข้อมูลแคมเปญ',
        budgetUsedSuffix: '% ใช้แล้ว',
        status: {
            active: 'ใช้งาน',
            paused: 'พักไว้',
            pending: 'รอดำเนินการ',
            completed: 'เสร็จสิ้น',
            ended: 'สิ้นสุด',
            deleted: 'ลบแล้ว',
        },
    },
    conversionFunnel: {
        title: 'เส้นทางคอนเวอร์ชัน',
        description: 'ประสิทธิภาพของเส้นทางผู้ใช้',
        infoTitle: 'เส้นทางคอนเวอร์ชัน',
        infoDescription:
            'กราฟนี้แสดงการเคลื่อนผ่านแต่ละขั้นของเส้นทางลูกค้า ตั้งแต่การแสดงผลไปจนถึงคลิกและคอนเวอร์ชัน ช่วยค้นหาจุดที่ผู้ใช้หลุดออก วัดประสิทธิภาพคอนเวอร์ชัน และปรับปรุงประสิทธิภาพแคมเปญ',
        conversionSuffix: 'คอนเวอร์ชัน',
        platformPerformance: 'ประสิทธิภาพตามแพลตฟอร์ม',
        impressionsShort: 'แสดงผล',
        clicks: 'คลิก',
        conversionsShort: 'คอนเวอร์ชัน',
        noDataTitle: 'ยังไม่มีข้อมูลฟันเนล',
        noDataDescription: 'เชื่อมต่อแหล่งข้อมูลเพื่อเริ่มเห็นตัวชี้วัดฟันเนล',
    },
    financialOverview: {
        title: 'ภาพรวมการเงิน',
        subtitle: 'ROI',
        roasSubtitle: 'ROAS',
        total: 'รวม',
        noData: 'ไม่มีข้อมูล',
        paid: 'โฆษณา',
        organic: 'ออร์แกนิก',
        referral: 'อ้างอิง',
        revenue: 'รายได้',
        profit: 'กำไร',
        cost: 'ค่าใช้จ่าย',
    },
    integrationChecklist: {
        loading: 'กำลังโหลดสถานะการเชื่อมต่อ...',
        title: 'เช็คลิสต์การเชื่อมต่อ',
        description: 'เชื่อมต่อแหล่งข้อมูลเพื่อดูข้อมูลแบบเรียลไทม์',
        infoTitle: 'เช็คลิสต์การเชื่อมต่อ',
        infoDescription:
            'ส่วนนี้แสดงสถานะการเชื่อมต่อของแต่ละแพลตฟอร์มโฆษณา แพลตฟอร์มที่เชื่อมต่อแล้วจะซิงก์ข้อมูลแบบเรียลไทม์สำหรับแดชบอร์ด การวิเคราะห์ การติดตามแคมเปญ และอินไซต์รายงาน',
        open: 'เปิด',
        close: 'ปิด',
        ads: 'โฆษณา',
    },
} as const satisfies TranslationShape<typeof dashboardEn>;
