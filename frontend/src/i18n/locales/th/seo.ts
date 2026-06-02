import type { seoEn } from '../en/seo';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const seoTh = {
    page: {
        title: 'SEO และ Web Analytics',
        subtitle:
            'ติดตามประสิทธิภาพการค้นหาแบบออร์แกนิกและการมีส่วนร่วมบนเว็บไซต์ของคุณ',
        refreshData: 'รีเฟรชข้อมูล',
        syncing: 'กำลังซิงก์...',
        sections: {
            performanceSummary: 'สรุปประสิทธิภาพ',
            performanceSummaryTooltip:
                'ตัวชี้วัดหลักจาก Google Analytics เช่น เซสชันออร์แกนิก เวลาการมีส่วนร่วม อัตราตีกลับ และ goal completions',
            performanceTrends: 'แนวโน้มประสิทธิภาพ',
            performanceTrendsTooltip:
                'ติดตามตัวชี้วัดประสิทธิภาพการค้นหาแบบออร์แกนิกตามเวลา รวมถึงเซสชัน คลิก และอันดับ',
            keywordTrafficAnalysis: 'การวิเคราะห์คีย์เวิร์ดและทราฟฟิก',
            keywordTrafficAnalysisTooltip:
                'การวิเคราะห์คีย์เวิร์ดออร์แกนิก แหล่งที่มาของทราฟฟิก เจตนาการค้นหา และรูปแบบ anchor text แบบครอบคลุม',
            topOrganicKeywords: 'คีย์เวิร์ดออร์แกนิกอันดับต้น',
            topOrganicKeywordsTooltip:
                'คีย์เวิร์ดที่ทำผลงานดีที่สุดในการค้นหาแบบออร์แกนิก จัดอันดับตามทราฟฟิกและตำแหน่ง',
            trafficByLocation: 'ทราฟฟิกตามพื้นที่',
            trafficByLocationTooltip:
                'การกระจายทราฟฟิกออร์แกนิกตามภูมิศาสตร์ แสดงว่าพื้นที่ใดสร้างเซสชันมากที่สุด',
            keywordsByIntent: 'คีย์เวิร์ดตามเจตนา',
            keywordsByIntentTooltip:
                'คีย์เวิร์ดที่จัดกลุ่มตามประเภทเจตนาการค้นหา เช่น ข้อมูล การนำทาง และธุรกรรม',
            anchorTextAnalysis: 'การวิเคราะห์ Anchor Text',
            anchorTextAnalysisTooltip:
                'การวิเคราะห์ anchor text ที่ใช้ใน backlinks ที่ชี้มายังเว็บไซต์ของคุณ เพื่อช่วยระบุรูปแบบการลิงก์และโอกาส',
            offPageAuthority: 'Off-Page และ Authority',
            offPageAuthorityTooltip:
                'ปัจจัย SEO ภายนอก รวมถึง domain authority, backlink profile, referring domains และการวิเคราะห์คุณภาพลิงก์จากข้อมูล Ahrefs',
            authorityMetrics: 'ตัวชี้วัด Authority',
            backlinkProfile: 'Backlink Profile',
        },
        toasts: {
            syncGaSuccess: 'ซิงก์ข้อมูล Google Analytics สำเร็จ',
            syncGaFailed: 'ซิงก์ข้อมูล Google Analytics ไม่สำเร็จ',
            syncGscSuccess: 'ซิงก์ข้อมูล Google Search Console สำเร็จ',
            syncGscFailed: 'ซิงก์ข้อมูล Google Search Console ไม่สำเร็จ',
        },
    },
    connection: {
        checking: 'กำลังตรวจสอบการเชื่อมต่อ Google Analytics...',
        unableToVerify: 'ไม่สามารถตรวจสอบการเชื่อมต่อ Google Analytics ได้',
        connected: 'เชื่อมต่อ Google Analytics แล้ว',
        notConnected: 'ยังไม่ได้เชื่อมต่อ Google Analytics',
        goToDataSources: 'ไปที่ Data Sources เพื่อเชื่อมต่อ',
    },
    summaryCards: {
        duration: '{minutes}น. {seconds}วิ',
        trendVsPrev: '{trend}% เทียบกับช่วงก่อนหน้า',
        titles: {
            organicSessions: 'เซสชันออร์แกนิก',
            goalCompletions: 'เป้าหมายที่สำเร็จ',
            avgPosition: 'อันดับเฉลี่ย',
            avgTimeOnPage: 'เวลาเฉลี่ยบนหน้า',
            activeUsers: 'ผู้ใช้ที่ใช้งานอยู่',
            screenPageViews: 'ยอดการเข้าชมหน้าเว็บ',
            engagementRate: 'อัตราการมีส่วนร่วม',
            bounceRate: 'อัตราตีกลับ',
        },
        descriptions: {
            organicSessions: 'เซสชันทราฟฟิกออร์แกนิกรวม',
            goalCompletions: 'เป้าหมาย Conversion ที่สำเร็จ',
            avgPosition: 'อันดับเฉลี่ยในผลการค้นหา',
            avgTimeOnPage: 'ระยะเวลาเซสชันเฉลี่ยเทียบกับช่วงเวลาก่อนหน้า',
            activeUsers: 'จำนวนผู้ใช้ที่ใช้งานอยู่ทั้งหมด',
            screenPageViews: 'จำนวน screen page views ทั้งหมด',
            engagementRate: 'เปอร์เซ็นต์ของเซสชันที่มีการมีส่วนร่วม',
            bounceRate: 'เปอร์เซ็นต์ของเซสชันที่เข้าชมหน้าเดียว',
        },
        tooltipHeaders: {
            organicSessions: 'เซสชันออร์แกนิก',
            goalCompletions: 'GOAL COMPLETIONS',
            avgPosition: 'อันดับเฉลี่ย',
            avgTimeOnPage: 'เวลาเฉลี่ยบนหน้า',
            activeUsers: 'ผู้ใช้ที่ใช้งานอยู่',
            screenPageViews: 'SCREEN PAGE VIEWS',
            engagementRate: 'อัตราการมีส่วนร่วม',
            bounceRate: 'อัตราตีกลับ',
        },
        tooltips: {
            organicSessions: {
                explanation:
                    'เซสชันออร์แกนิก: จำนวนการเข้าชมทั้งหมดจากผลการค้นหาแบบออร์แกนิก',
                contextualEmpty:
                    'ยังไม่พบทราฟฟิกออร์แกนิก ตรวจสอบว่า Google Analytics เชื่อมต่อถูกต้องหรือไม่',
                contextualValue:
                    'ผู้เข้าชม {count} คนพบเว็บไซต์ของคุณผ่านเครื่องมือค้นหา',
            },
            goalCompletions: {
                explanation:
                    'Goal Completions: จำนวนครั้งที่ผู้เข้าชมทำเป้าหมาย Conversion ที่คุณกำหนดไว้สำเร็จ',
                contextualEmpty:
                    'ยังไม่มีเป้าหมายที่สำเร็จ ตั้งค่า conversion goals ใน Google Analytics เพื่อติดตามการกระทำของผู้ใช้',
                contextualValue:
                    'ผู้เข้าชม {count} คนทำเป้าหมายของคุณสำเร็จ ผลลัพธ์ Conversion ดีมาก',
            },
            avgPosition: {
                explanation:
                    'อันดับเฉลี่ย: อันดับเฉลี่ยของเว็บไซต์ของคุณในผลการค้นหา',
                contextualEmpty:
                    'ยังไม่มีข้อมูลอันดับ โดยทั่วไปอันดับจะเริ่มแสดงหลังจากเว็บไซต์มีทราฟฟิกออร์แกนิก',
                contextualExcellent:
                    'ยอดเยี่ยม อันดับ {position} ทำให้คุณอยู่บนหน้าแรก',
                contextualGood:
                    'อันดับดีที่ {position} ลองปรับให้เข้าใกล้ 3 อันดับแรกมากขึ้น',
                contextualLow:
                    'อันดับอยู่ที่ {position} โฟกัสการปรับ SEO เพื่อให้เข้า top 10',
            },
            avgTimeOnPage: {
                explanation:
                    'เวลาเฉลี่ยบนหน้า: ระยะเวลาที่ผู้เข้าชมใช้บนหน้าเว็บไซต์ของคุณ',
                contextualLow:
                    'ผู้เข้าชมใช้เวลาเพียง {seconds} วินาที ควรปรับคอนเทนต์ให้น่าสนใจขึ้น',
                contextualDecent:
                    'การมีส่วนร่วมอยู่ในระดับดี โดยมีเวลาเฉลี่ย {minutes}น. {seconds}วิ',
                contextualExcellent:
                    'การมีส่วนร่วมยอดเยี่ยม ผู้เข้าชมใช้เวลาเฉลี่ย {minutes}น. {seconds}วิ',
            },
            activeUsers: {
                explanation:
                    'ผู้ใช้ที่ใช้งานอยู่: จำนวนผู้ใช้ที่มีส่วนร่วมกับเว็บไซต์ในช่วงรายงาน',
                contextualEmpty:
                    'ไม่มีข้อมูลผู้ใช้ที่ใช้งานอยู่สำหรับช่วงเวลานี้',
                contextualValue:
                    'ผู้ใช้ที่ใช้งานอยู่ {count} คนมีส่วนร่วมกับเว็บไซต์ของคุณ',
            },
            screenPageViews: {
                explanation:
                    'Page Views: จำนวนหน้าหรือหน้าจอทั้งหมดที่ผู้เข้าชมดู',
                contextualEmpty: 'ไม่มีข้อมูล page view สำหรับช่วงเวลานี้',
                contextualValue:
                    'มีการเข้าชมหน้า {count} ครั้งในช่วงเวลารายงาน',
            },
            engagementRate: {
                explanation:
                    'อัตราการมีส่วนร่วม: เปอร์เซ็นต์ของเซสชันที่ถือว่ามีการมีส่วนร่วม',
                contextualEmpty: 'ไม่มีข้อมูลอัตราการมีส่วนร่วม',
                contextualValue:
                    'อัตราการมีส่วนร่วมของคุณคือ {rate}% ค่าที่สูงขึ้นสะท้อนการโต้ตอบของผู้เข้าชมที่แข็งแรงขึ้น',
            },
            bounceRate: {
                explanation:
                    'อัตราตีกลับ: เปอร์เซ็นต์ของเซสชันที่เข้าชมหน้าเดียวโดยไม่มีการโต้ตอบ',
                contextualEmpty: 'ไม่มีข้อมูลอัตราตีกลับ',
                contextualLow:
                    'อัตราตีกลับต่ำที่ {rate}% การมีส่วนร่วมยอดเยี่ยม',
                contextualModerate:
                    'อัตราตีกลับปานกลางที่ {rate}% ควรทบทวนความเกี่ยวข้องของหน้าและ UX',
                contextualHigh:
                    'อัตราตีกลับสูงที่ {rate}% ควรปรับ landing pages และ calls to action',
            },
            default: {
                explanation: 'ยังไม่มีคำอธิบายตัวชี้วัด SEO นี้',
                contextual:
                    'ติดต่อฝ่ายสนับสนุนหากต้องการความช่วยเหลือในการทำความเข้าใจตัวชี้วัดนี้',
            },
        },
    },
    premiumCards: {
        backlinks: 'Backlinks',
        totalBacklinks: 'Backlinks ทั้งหมด',
        referringDomains: 'Referring Domains',
        keywords: 'คีย์เวิร์ด',
        trafficCost: 'ต้นทุนทราฟฟิก',
        organicSearch: 'Organic Search',
        totalTraffic: 'ทราฟฟิกทั้งหมด',
        tooltipHeaders: {
            ur: 'UR',
            dr: 'DR',
            backlinks: 'BACKLINKS',
            organicSearch: 'ORGANIC SEARCH',
        },
        tooltips: {
            ur: {
                explanation:
                    'URL Rating: คะแนนจาก Ahrefs ที่วัดความแข็งแรงของ backlink profile ของหน้าเป้าหมาย',
                contextualEmpty:
                    'ไม่มีข้อมูล URL rating โดยปกติคะแนน UR อยู่ในช่วง 0-100',
                contextualExcellent: 'คะแนน UR {score} ยอดเยี่ยม',
                contextualGood: 'คะแนน UR {score} ดี',
                contextualFair: 'คะแนน UR {score} พอใช้',
                contextualLow: 'คะแนน UR {score} ต่ำ',
            },
            dr: {
                explanation:
                    'Domain Rating: คะแนนจาก Ahrefs ที่วัดความแข็งแรงของ backlink profile ทั้งโดเมนของคุณ',
                contextualEmpty:
                    'ไม่มีข้อมูล domain rating โดยปกติคะแนน DR อยู่ในช่วง 0-100',
                contextualOutstanding: 'คะแนน DR {score} โดดเด่นมาก',
                contextualStrong: 'คะแนน DR {score} แข็งแรง',
                contextualModerate: 'คะแนน DR {score} ปานกลาง',
                contextualLow: 'คะแนน DR {score} ต่ำ',
            },
            backlinks: {
                explanation:
                    'Backlinks: จำนวนลิงก์ภายนอกทั้งหมดที่ชี้มายังเว็บไซต์ของคุณ',
                contextualEmpty: 'ยังไม่พบ backlinks',
                contextualValue: '{backlinks} backlinks จาก {domains} domains',
            },
            organicSearch: {
                explanation:
                    'Organic Search: ทราฟฟิกเว็บไซต์จากผลการค้นหาที่ไม่เสียค่าโฆษณา',
                contextualEmpty: 'ไม่มีทราฟฟิก organic search',
                contextualValue: 'ผู้เข้าชมออร์แกนิก {count} คน',
            },
            default: {
                explanation: 'ยังไม่มีคำอธิบายตัวชี้วัด SEO นี้',
                contextual: 'ติดต่อฝ่ายสนับสนุนหากต้องการความช่วยเหลือ',
            },
        },
    },
    performanceChart: {
        title: 'แนวโน้มประสิทธิภาพ',
        empty: 'ไม่มีข้อมูลสำหรับช่วงเวลาที่เลือก',
        metrics: {
            organicTraffic: 'ทราฟฟิกออร์แกนิก',
            paidTraffic: 'ทราฟฟิกแบบชำระเงิน',
            impressions: 'การแสดงผล',
            paidTrafficCost: 'ต้นทุนทราฟฟิกแบบชำระเงิน',
            avgPosition: 'อันดับเฉลี่ย',
            referringDomains: 'Referring Domains',
            dr: 'Domain Rating',
            ur: 'URL Rating',
            organicTrafficValue: 'มูลค่าทราฟฟิกออร์แกนิก',
            organicPages: 'หน้าออร์แกนิก',
            crawledPages: 'หน้าที่ถูก crawl',
        },
    },
    topKeywords: {
        title: 'คีย์เวิร์ดออร์แกนิกอันดับต้น',
        beta: 'เบต้า',
        loading: 'กำลังโหลด...',
        columns: {
            keywords: 'คีย์เวิร์ด',
            position: 'อันดับ',
            volume: 'Volume',
            cpc: 'CPC(USD)',
            trafficPercent: 'ทราฟฟิก, %',
        },
    },
    trafficLocation: {
        title: 'ทราฟฟิกตามพื้นที่',
        columns: {
            location: 'พื้นที่',
            traffic: 'ทราฟฟิก',
            share: 'สัดส่วน',
            keywords: 'คีย์เวิร์ด',
        },
        empty: 'ไม่มีข้อมูลพื้นที่',
    },
    keywordIntent: {
        title: 'คีย์เวิร์ดออร์แกนิกตามเจตนา',
        columns: {
            intent: 'เจตนา',
            keywords: 'คีย์เวิร์ด',
            traffic: 'ทราฟฟิก',
        },
        labels: {
            branded: 'แบรนด์',
            nonBranded: 'ไม่ใช่แบรนด์',
            informational: 'เชิงข้อมูล',
            navigational: 'เชิงนำทาง',
            commercial: 'เชิงพาณิชย์',
            transactional: 'เชิงธุรกรรม',
        },
    },
    anchorText: {
        title: 'Anchors',
        beta: 'เบต้า',
        referringDomains: 'Referring domains',
        loading: 'กำลังโหลด...',
    },
    offpage: {
        beta: 'เบต้า',
        crawledPages: 'หน้าที่ถูก crawl',
        totalTitle: '{title} ทั้งหมด',
        pages: {
            backlinks: 'Backlinks',
            referringDomains: 'Referring Domains',
            networkRatings: 'Network & Ratings',
        },
        labels: {
            dofollow: 'Dofollow',
            nofollow: 'Nofollow',
            ugc: 'UGC',
            sponsored: 'Sponsored',
            text: 'Text',
            redirect: 'Redirect',
            image: 'Image',
            form: 'Form',
            governmental: 'Governmental',
            educational: 'Educational',
            gov: '.gov',
            edu: '.edu',
            com: '.com',
            net: '.net',
            org: '.org',
            referringPages: 'Referring pages',
            referringIps: 'Referring Ips',
            referringSubnets: 'Referring subnets',
            ur81100: 'UR 81-100',
            ur6180: 'UR 61-80',
            ur4160: 'UR 41-60',
            ur2140: 'UR 21-40',
            ur120: 'UR 1-20',
        },
    },
} as const satisfies TranslationShape<typeof seoEn>;
