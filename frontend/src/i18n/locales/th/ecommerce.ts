import { ecommerceEn } from '../en/ecommerce';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const ecommerceTh = {
    ...ecommerceEn,
    hero: {
        ...ecommerceEn.hero,
        description:
            'แดชบอร์ดวิเคราะห์ยอดขายและแคมเปญแบบเรียลไทม์ ช่วยให้ทีมการตลาดตัดสินใจได้เร็วขึ้นด้วยอินไซต์ที่ชัดเจนในหน้าเดียว',
    },
    productStack: {
        ...ecommerceEn.productStack,
        products: {
            tshirt: {
                ...ecommerceEn.productStack.products.tshirt,
                description:
                    'ม็อกอัปเสื้อยืดคุณภาพสูง ช่วยให้เห็นภาพงานออกแบบของคุณก่อนเข้าสู่การผลิต',
            },
            shirt: {
                ...ecommerceEn.productStack.products.shirt,
                description:
                    'ม็อกอัปเสื้อเชิ้ตคุณภาพสูง ช่วยให้เห็นภาพงานออกแบบของคุณก่อนเข้าสู่การผลิต',
            },
            trousers: {
                ...ecommerceEn.productStack.products.trousers,
                description:
                    'ม็อกอัปกางเกงคุณภาพสูง ช่วยให้เห็นภาพงานออกแบบของคุณก่อนเข้าสู่การผลิต',
            },
        },
    },
    intro: {
        ...ecommerceEn.intro,
        description:
            'แดชบอร์ดวิเคราะห์แบบเรียลไทม์ที่ช่วยให้คุณตัดสินใจเรื่องค่าโฆษณาและสต็อกได้เร็วและแม่นยำขึ้น',
        features: {
            dashboardOverview: 'ภาพรวมแดชบอร์ดในที่เดียว',
            campaignPerformance: 'สรุปประสิทธิภาพแคมเปญ',
            anomalyAlerts: 'แจ้งเตือนความผิดปกติที่ปรับแต่งได้',
            exportReports: 'ส่งออกรายงาน CSV/PDF',
            userAccess: 'สิทธิ์ผู้ใช้หลายระดับ',
            dataSyncing: 'ซิงก์ข้อมูลข้ามแพลตฟอร์ม',
        },
    },
    pricing: {
        ...ecommerceEn.pricing,
        subtitle: 'ไม่มีค่าธรรมเนียมแอบแฝง เลือกแพ็กเกจที่เหมาะกับธุรกิจของคุณ',
        plans: {
            starter: {
                ...ecommerceEn.pricing.plans.starter,
                description:
                    'เหมาะสำหรับผู้ใช้งานรายบุคคลและธุรกิจขนาดเล็กที่เพิ่งเริ่มต้น',
                features: {
                    dashboard: 'แดชบอร์ดรวมในที่เดียว',
                    platforms: 'เชื่อมต่อได้สูงสุด 2 แพลตฟอร์ม',
                    metrics: 'ตัวชี้วัดประสิทธิภาพพื้นฐาน',
                    pdfReports: 'ส่งออกรายงาน PDF',
                    support: 'ซัพพอร์ตทางอีเมล',
                },
            },
            pro: {
                ...ecommerceEn.pricing.plans.pro,
                description:
                    'สำหรับทีมที่กำลังเติบโตและต้องการอินไซต์ที่ลึกขึ้นพร้อมความยืดหยุ่นมากกว่าเดิม',
                features: {
                    starterPlus: 'ทุกอย่างใน Starter และเพิ่มเติม:',
                    unlimitedPlatforms: 'เชื่อมต่อแพลตฟอร์มได้ไม่จำกัด',
                    campaignManagement: 'จัดการแคมเปญ',
                    seoAnalytics: 'วิเคราะห์ SEO และเว็บไซต์',
                    alerts: 'แจ้งเตือนที่ปรับแต่งได้',
                    csvExcelReports: 'ส่งออกรายงาน CSV/Excel',
                },
            },
            enterprise: {
                ...ecommerceEn.pricing.plans.enterprise,
                description: 'โซลูชันขั้นสูงสำหรับองค์กรขนาดใหญ่และเอเจนซี',
                features: {
                    proPlus: 'ทุกอย่างใน Pro และเพิ่มเติม:',
                    aiInsights: 'อินไซต์และแชตที่ขับเคลื่อนด้วย AI',
                    trendAnalysis: 'วิเคราะห์แนวโน้มและคาดการณ์',
                    teamRoles: 'บทบาทและสิทธิ์ของทีม',
                    prioritySupport: 'ซัพพอร์ตเร่งด่วน 24/7',
                    onboarding: 'เซสชัน Onboarding',
                },
            },
        },
    },
    testimonials: {
        ...ecommerceEn.testimonials,
        subtitle: 'ธุรกิจจำนวนมากไว้วางใจ NovaPulse เพื่อช่วยให้เติบโต',
        reviews: {
            dew: {
                ...ecommerceEn.testimonials.reviews.dew,
                role: 'เจ้าของแบรนด์แฟชั่น',
                content:
                    'หลังจากใช้ NovaPulse ยอดขายของฉันเพิ่มขึ้น 30% ในเดือนแรก ฉันรู้ทันทีว่าควรดันโฆษณาตัวไหน ไม่ต้องเดาอีกต่อไป',
            },
            un: {
                ...ecommerceEn.testimonials.reviews.un,
                role: 'ผู้จัดการการตลาด',
                content:
                    'ฉันชอบฟีเจอร์แชตรวมมาก ตอบลูกค้าได้เร็วขึ้นเยอะ รายงานก็อ่านง่าย หัวหน้าชอบมาก แนะนำสำหรับทีมการตลาดเลย',
            },
            dong: {
                ...ecommerceEn.testimonials.reviews.dong,
                role: 'ผู้ขายออนไลน์ SME',
                content:
                    'ระบบหลังบ้านเสถียรมาก เชื่อมต่อ Shopee และ Lazada ได้ลื่นไหล ไม่มีสะดุด ทีมซัพพอร์ตตอบเร็วและแก้ปัญหาได้ทันที',
            },
        },
    },
    footer: {
        ...ecommerceEn.footer,
        description:
            'แพลตฟอร์มวิเคราะห์การตลาดแบบครบวงจร ช่วยให้ธุรกิจของคุณเติบโตด้วยข้อมูลที่แม่นยำและรวดเร็ว',
    },
} as const satisfies TranslationShape<typeof ecommerceEn>;
