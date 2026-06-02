import type { aiInsightsEn } from '../en/ai-insights';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const aiInsightsTh = {
    assistant: {
        roles: {
            general: 'ทั่วไป',
            ads: 'โฆษณา',
            seo: 'SEO',
        },
        imageAlt: 'AI',
        toasts: {
            chatDeleted: 'ลบแชทแล้ว',
            deleteFailed: 'ลบแชทไม่สำเร็จ',
            chatRenamed: 'เปลี่ยนชื่อแชทแล้ว',
            renameFailed: 'เปลี่ยนชื่อแชทไม่สำเร็จ',
            invalidResponse:
                'AI ไม่ได้ส่งคำตอบที่ใช้งานได้กลับมา โปรดลองอีกครั้งหรือตรวจสอบ AI webhook ของคุณ',
            connectionFailed: 'เชื่อมต่อ AI ไม่สำเร็จ',
            aiError: 'ข้อผิดพลาด AI: {message} ',
        },
        speech: {
            unsupported: 'เบราว์เซอร์ไม่รองรับ Speech Recognition',
        },
        sidebar: {
            newChat: 'แชทใหม่',
            recentChats: 'แชทล่าสุด',
            noHistoryYet: 'ยังไม่มีประวัติ',
            renameChat: 'เปลี่ยนชื่อแชท',
            deleteChat: 'ลบแชท',
            viewChatHistory: 'ดูประวัติแชท',
        },
        summaryLoading: {
            title: 'กำลังโหลดสรุป AI',
            description:
                'กำลังสร้างสรุปเชิงกลยุทธ์ประจำวันของคุณ กระบวนการนี้เกิดขึ้นวันละครั้ง โปรดรอสักครู่...',
        },
        summaryErrors: {
            parseFailed: 'อ่านข้อมูลสรุป AI ไม่สำเร็จ',
            loadFailed: 'โหลดสรุปไม่สำเร็จ',
        },
        summaryFallback: {
            title: 'ยังไม่มีสรุป AI',
            message:
                'ขอให้ AI สร้างสรุปรายวันก่อน จากนั้นรีเฟรชหน้านี้เพื่อดูสรุปที่นี่',
            recommendation: '',
        },
        header: {
            title: 'AI Assistant',
            beta: 'เบต้า',
            webhookMissing:
                'ยังไม่ได้ตั้งค่า Webhook URL กำลังใช้ mock responses',
        },
        emptyState: {
            title: 'ให้ฉันช่วยอะไรได้บ้าง?',
            detailSummaryTitle: 'สรุปรายละเอียดโดย AI',
            detailSummaryDescription: 'วิเคราะห์เชิงลึกและรายงานเชิงกลยุทธ์',
            marketingCalculatorsTitle: 'เครื่องคำนวณการตลาด',
            marketingCalculatorsDescription:
                'เครื่องมือด่วนสำหรับโฆษณาและคอนเทนต์',
        },
        input: {
            listeningPlaceholder: 'กำลังฟัง...',
            askPlaceholder: 'ถามอะไรก็ได้...',
            stopListening: 'หยุดฟัง',
            startVoiceInput: 'เริ่มป้อนเสียง',
            disclaimer: 'AI อาจผิดพลาดได้ ควรตรวจสอบข้อมูลสำคัญอีกครั้ง',
        },
    },
    detailSummary: {
        backToAssistant: 'กลับไปที่ AI Assistant',
        loading: 'กำลังโหลดข้อมูลสรุป...',
        errorTitle: 'โหลดข้อมูลไม่สำเร็จ',
        errorDescription: 'ไม่สามารถดึงข้อมูลสรุปจากเซิร์ฟเวอร์ได้',
        heroBadge: 'รายงานที่สร้างโดย AI',
        heroTitle: 'สรุปเชิงกลยุทธ์ประจำวัน',
        heroDateLine:
            '{date} - สร้างอัตโนมัติจากแหล่งข้อมูลที่เชื่อมต่อทั้งหมด',
        noDataTitle: 'ไม่มีข้อมูลสรุป',
        noDataDescription:
            'ขอให้ AI Assistant สร้างรายงานสรุปก่อน แล้วกลับมาดูที่นี่',
        fromLastPeriod: 'จากช่วงก่อนหน้า',
        keyEvents: 'เหตุการณ์สำคัญ',
        trend: 'แนวโน้ม',
        aiForecast: 'คาดการณ์โดย AI',
    },
    tools: {
        backToAssistant: 'กลับไปที่ AI Assistant',
        title: 'เครื่องคำนวณการตลาด',
        subtitle: 'เครื่องคำนวณอย่างง่ายสำหรับตัวชี้วัดการตลาดดิจิทัลของคุณ',
        tip: 'เคล็ดลับ',
        tabs: {
            conversion: 'Conversion Rate',
            lead: 'Lead/Traffic',
            roi: 'ROI',
            profit: 'กำไร',
            cpl: 'CPL',
            cpa: 'CPA',
        },
        descriptions: {
            conversion:
                'คำนวณเปอร์เซ็นต์ของผู้เข้าชมที่ทำ action ที่ต้องการสำเร็จ',
            roi: 'ประเมินความคุ้มค่าของการลงทุนของคุณ',
            profit: 'คำนวณกำไรสุทธิโดยหักต้นทุนรวมออกจากรายได้รวม',
            cpl: 'ดูว่าลีดแต่ละรายมีต้นทุนเท่าไร',
            lead: 'ประมาณจำนวนลีดที่เป็นไปได้จากทราฟฟิกและ conversion rate',
            cpa: 'คำนวณต้นทุนในการได้ลูกค้าที่ชำระเงินหนึ่งราย',
        },
        tips: {
            conversion: 'พิจารณาเวลาโหลดและ CTA ที่ชัดเจน',
            roi: 'โฟกัสกิจกรรมที่ให้มูลค่าสูง',
            profit: 'ติดตามต้นทุนแฝงทั้งหมดให้ครบ',
            cpl: 'กำหนดกลุ่มเป้าหมายให้แม่นยำขึ้น',
            lead: 'ทราฟฟิกคุณภาพดีแปลงเป็นลีดได้ดีกว่า',
            cpa: 'Retargeting มักช่วยลด CPA',
        },
        labels: {
            numberOfActions: 'จำนวน Actions',
            totalVisitors: 'ผู้เข้าชมทั้งหมด',
            conversionRate: 'Conversion Rate',
            revenue: 'รายได้ ({currencyCode})',
            investmentCost: 'ต้นทุนการลงทุน ({currencyCode})',
            returnOnInvestment: 'ผลตอบแทนจากการลงทุน',
            totalRevenue: 'รายได้รวม ({currencyCode})',
            totalCost: 'ต้นทุนรวม ({currencyCode})',
            netProfit: 'กำไรสุทธิ',
            totalSpend: 'ยอดใช้จ่ายรวม ({currencyCode})',
            totalLeads: 'ลีดทั้งหมด',
            costPerLead: 'ต้นทุนต่อลีด',
            monthlyTraffic: 'ทราฟฟิกรายเดือน',
            expectedConversion: 'Conversion ที่คาดหวัง (%)',
            projectedLeads: 'ลีดที่คาดการณ์',
            leadsUnit: 'ลีด',
            totalCostUsed: 'ต้นทุนที่ใช้ทั้งหมด ({currencyCode})',
            numberOfCustomers: 'จำนวนลูกค้า',
            costPerCustomer: 'ต้นทุนต่อลูกค้า',
        },
    },
} as const satisfies TranslationShape<typeof aiInsightsEn>;
