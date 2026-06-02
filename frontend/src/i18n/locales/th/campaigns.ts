import type { campaignsEn } from '../en/campaigns';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const campaignsTh = {
    page: {
        title: 'แคมเปญ',
        subtitle: 'จัดการแคมเปญโฆษณาของคุณในทุกแพลตฟอร์ม',
        timeWindow: {
            metricsFrom: 'ข้อมูลตั้งแต่',
            to: 'ถึง',
            updating: 'กำลังอัปเดตข้อมูล...',
        },
        errors: {
            loadCampaigns: 'โหลดแคมเปญไม่สำเร็จ:',
            unknownError: 'ข้อผิดพลาดที่ไม่ทราบสาเหตุ',
            retry: 'ลองอีกครั้ง',
        },
        toasts: {
            selectionLimitTitle: 'ถึงขีดจำกัดการเลือกแล้ว',
            selectionLimitDescription:
                'คุณเลือกแคมเปญได้สูงสุด {limit} แคมเปญเท่านั้น',
            selectionAlreadyDescription: 'คุณเลือกไว้แล้ว {limit} แคมเปญ',
            selectionCappedTitle: 'จำกัดจำนวนรายการที่เลือก',
            selectionCappedDescription:
                'เลือกได้เฉพาะบางรายการเพื่อให้อยู่ภายในขีดจำกัด 10 รายการ',
            bulkPauseTitle: 'หยุดหลายรายการชั่วคราว',
            bulkEnableTitle: 'เปิดใช้งานหลายรายการ',
            bulkDeleteTitle: 'ลบหลายรายการ',
            featureComingSoon: 'ฟีเจอร์นี้กำลังจะมาเร็ว ๆ นี้',
            exportSuccessTitle: 'ส่งออกสำเร็จ',
            exportSuccessDescription: 'ดาวน์โหลด {filename} แล้ว',
            exportFailedTitle: 'ส่งออกไม่สำเร็จ',
            exportFailedDescription: 'ไม่สามารถดาวน์โหลดรายงาน CSV ได้',
        },
        deleteDialog: {
            title: 'ลบแคมเปญ',
            description:
                'คุณแน่ใจไหมว่าต้องการลบ "{name}"? การดำเนินการนี้ไม่สามารถย้อนกลับได้',
            cancel: 'ยกเลิก',
            delete: 'ลบ',
            deleting: 'กำลังลบ...',
        },
    },
    table: {
        empty: {
            title: 'ไม่พบแคมเปญ',
            description: 'ลองปรับตัวกรองหรือสร้างแคมเปญใหม่',
        },
        pagination: {
            showing: 'แสดง',
            to: 'ถึง',
            of: 'จาก',
            entries: 'รายการ',
            prev: '< ก่อนหน้า',
            prevShort: '<',
            next: 'ถัดไป >',
            nextShort: '>',
        },
        columnsToggle: 'คอลัมน์',
        dragToReorder: 'ลากเพื่อจัดลำดับใหม่',
        selectAll: 'เลือกทั้งหมด',
        columns: {
            campaign: 'แคมเปญ',
            status: 'สถานะ',
            platform: 'แพลตฟอร์ม',
            objective: 'ประเภท',
            budget: 'งบประมาณ',
            spend: 'ใช้จ่ายแล้ว',
            revenue: 'รายได้',
            impressions: 'การแสดงผล',
            clicks: 'คลิก',
            ctr: 'CTR',
            cpc: 'CPC',
            cpm: 'CPM',
            roas: 'ROAS',
            roi: 'ROI',
            date: 'วันที่',
        },
        status: {
            active: 'ใช้งาน',
            paused: 'พักไว้',
            completed: 'เสร็จสิ้น',
            pending: 'รอดำเนินการ',
            ended: 'สิ้นสุดแล้ว',
            deleted: 'ลบแล้ว',
        },
    },
    toolbar: {
        status: 'สถานะ',
        platform: 'แพลตฟอร์ม',
        filterByStatus: 'กรองตามสถานะ',
        allStatuses: 'ทุกสถานะ',
        filterByPlatform: 'กรองตามแพลตฟอร์ม',
        allPlatforms: 'ทุกแพลตฟอร์ม',
        filters: 'ตัวกรอง',
        all: 'ทั้งหมด',
        clearAll: 'ล้างทั้งหมด',
        searchPlaceholder: 'ค้นหาแคมเปญ...',
        search: 'ค้นหา',
        selected: 'ที่เลือก',
        statusOptions: {
            active: 'ใช้งาน',
            paused: 'พักไว้',
            completed: 'เสร็จสิ้น',
        },
    },
    sheet: {
        titleEdit: 'แก้ไขแคมเปญ',
        titleCreate: 'สร้างแคมเปญ',
        descriptionEdit:
            'อัปเดตรายละเอียดแคมเปญด้านล่างเพื่อปรับปรุงประสิทธิภาพ',
        descriptionCreate:
            'เริ่มแคมเปญโฆษณาประสิทธิภาพสูงใหม่ได้ในไม่กี่วินาที',
        close: 'ปิด',
        fields: {
            campaignName: 'ชื่อแคมเปญ',
            campaignNamePlaceholder: 'เช่น Summer Sale 2026',
            platform: 'แพลตฟอร์ม',
            selectPlatform: 'เลือกแพลตฟอร์ม',
            status: 'สถานะ',
            completed: 'เสร็จสิ้น',
            active: 'ใช้งาน',
            paused: 'พักไว้',
            budgetLimit: 'วงเงินงบประมาณ ({currencyCode})',
            budgetPlaceholder: '50,000',
            budgetDescription: 'วงเงินใช้จ่ายรายเดือนสำหรับแคมเปญนี้',
            startDate: 'วันที่เริ่มต้น',
            endDate: 'วันที่สิ้นสุด',
            optional: '(ไม่บังคับ)',
            pickDate: 'เลือกวันที่',
        },
        actions: {
            cancel: 'ยกเลิก',
            reset: 'รีเซ็ต',
            saving: 'กำลังบันทึก...',
            creating: 'กำลังสร้าง...',
            saveChanges: 'บันทึกการเปลี่ยนแปลง',
            createCampaign: 'สร้างแคมเปญ',
        },
        resetDebug: {
            refName: 'ref.name',
            beforeReset: 'before reset',
            afterReset: 'after reset',
            hasInit: 'hasInit',
        },
    },
    bulkActionBar: {
        clearSelection: 'ล้างรายการที่เลือก',
        selectedSingular: 'เลือก {count} แคมเปญ',
        selectedPlural: 'เลือก {count} แคมเปญ',
    },
    summary: {
        trendLabel: 'เทียบกับช่วงก่อนหน้า',
        cards: {
            totalBudget: 'งบประมาณรวม',
            totalSpend: 'ยอดใช้จ่ายรวม',
            totalRevenue: 'รายได้รวม',
            roi: 'ROI (ผลตอบแทนจากการลงทุน)',
            totalImpressions: 'การแสดงผลรวม',
            totalClicks: 'คลิกรวม',
            ctr: 'CTR (อัตราการคลิก)',
            roas: 'ROAS (ผลตอบแทนจากค่าโฆษณา)',
            cpc: 'CPC (ต้นทุนต่อคลิก)',
            cpm: 'CPM (ต้นทุนต่อการแสดงผลพันครั้ง)',
        },
        tooltips: {
            budget: {
                explanation:
                    'จำนวนเงินสูงสุดที่จัดสรรไว้สำหรับการใช้จ่ายโฆษณาในทุกแคมเปญ',
                formula: 'ผลรวมงบประมาณของทุกแคมเปญ',
                interpretation:
                    'นี่คือวงเงินใช้จ่ายของคุณ เปรียบเทียบกับยอดใช้จ่ายจริงเพื่อติดตามการใช้งบประมาณ',
                goodRange: 'ยอดใช้จ่ายไม่ควรเกินจำนวนนี้',
                watchOutOverspending:
                    'ตรวจพบการใช้จ่ายเกินงบ ควรพิจารณาหยุดแคมเปญชั่วคราว',
                watchOutWithin: 'ยังอยู่ภายในวงเงินงบประมาณ',
                contextualOverspending:
                    'แคมเปญของคุณใช้จ่ายเกินงบประมาณที่จัดสรรไว้แล้ว โปรดตรวจสอบและปรับวงเงินใช้จ่าย',
                contextualWithin: 'การใช้งบประมาณยังอยู่ในระดับที่ปลอดภัย',
            },
            spend: {
                explanation:
                    'จำนวนเงินจริงที่ใช้ไปกับโฆษณาในทุกแคมเปญและแพลตฟอร์ม',
                interpretation:
                    'เงินลงทุนโฆษณารวม เปรียบเทียบกับรายได้เพื่อคำนวณ ROI',
                goodRange:
                    'โดยทั่วไปควรใช้งบประมาณประมาณ 80-95% เพื่อประสิทธิภาพที่เหมาะสม',
                watchOutNoSpend: 'ยังไม่พบยอดใช้จ่าย แคมเปญอาจถูกหยุดชั่วคราว',
                watchOutActive: 'มีการใช้จ่ายอยู่',
                contextualNoSpend:
                    'ยังไม่มีบันทึกยอดใช้จ่ายโฆษณา ตรวจสอบว่าแคมเปญเปิดใช้งานและเชื่อมต่ออย่างถูกต้อง',
                contextualPercent: 'ใช้ไปแล้ว {percent}% ของงบประมาณที่จัดสรร',
                contextualUnavailable:
                    'มีบันทึกยอดใช้จ่าย แต่ไม่มีข้อมูลงบประมาณ',
            },
            revenue: {
                explanation:
                    'รายได้รวมที่เกิดจากคอนเวอร์ชันซึ่งเชื่อมโยงกับแคมเปญโฆษณาของคุณ',
                interpretation:
                    'รายได้จากยอดขายหรือการกระทำที่เกิดจากโฆษณา เป็นเมตริกสำคัญในการคำนวณ ROI',
                goodRange: 'รายได้ > ยอดใช้จ่าย = ผลตอบแทนเป็นบวก',
                watchOutNoRevenue:
                    'ยังไม่มีรายได้ โปรดตรวจสอบการติดตามคอนเวอร์ชัน',
                watchOutGenerated: 'มีรายได้เกิดขึ้นแล้ว',
                contextualNoRevenue:
                    'ยังไม่มีรายได้จากคอนเวอร์ชัน โปรดตรวจสอบว่าตั้งค่าการติดตามคอนเวอร์ชันถูกต้อง',
                contextualReturn: 'สร้างผลตอบแทนจากค่าโฆษณา {percent}%',
                contextualUnavailable:
                    'มีบันทึกรายได้ แต่ไม่มีข้อมูลยอดใช้จ่าย โปรดตรวจสอบการติดตามแคมเปญ',
            },
            roi: {
                explanation:
                    'ผลตอบแทนจากการลงทุน: เปอร์เซ็นต์กำไรหรือขาดทุนจากแคมเปญโฆษณาของคุณ',
                formula: '((รายได้ - ยอดใช้จ่าย) / ยอดใช้จ่าย) × 100',
                interpretation:
                    '100% = ได้เงินลงทุนคืนเป็นสองเท่า 0% = คุ้มทุน ค่าติดลบ = ขาดทุน',
                goodRange: '>100% แสดงว่าแคมเปญทำกำไร',
                watchOutNegative: 'ROI ติดลบ แคมเปญกำลังขาดทุน',
                watchOutPositive: 'ROI เป็นบวก',
                contextualNegative:
                    'แคมเปญกำลังขาดทุน {percent}% ของเงินลงทุน ควรปรับกลุ่มเป้าหมายหรือครีเอทีฟ',
                contextualPositive: 'แคมเปญทำกำไรด้วยผลตอบแทน {percent}%',
            },
            impressions: {
                explanation: 'จำนวนครั้งรวมที่โฆษณาของคุณถูกแสดงให้ผู้ใช้เห็น',
                interpretation:
                    'วัดการมองเห็นและการเข้าถึงของโฆษณา การแสดงผลที่สูงขึ้นหมายถึงการเข้าถึงผู้ชมที่กว้างขึ้น',
                goodRange: 'ขึ้นอยู่กับเป้าหมายและงบประมาณของแคมเปญ',
                watchOutNone: 'ไม่มีการแสดงผล โฆษณาอาจยังไม่ทำงาน',
                watchOutShown: 'โฆษณากำลังถูกแสดง',
                contextualNone:
                    'โฆษณายังไม่ถูกแสดง โปรดตรวจสอบสถานะแคมเปญและการกำหนดเป้าหมาย',
                contextualShown: 'มีผู้เห็นโฆษณาของคุณ {count} ครั้ง',
            },
            clicks: {
                explanation: 'จำนวนครั้งรวมที่ผู้ใช้คลิกโฆษณาของคุณ',
                interpretation:
                    'วัดการมีส่วนร่วมของผู้ใช้ คลิกมากขึ้นหมายถึงทราฟฟิกไปยังเว็บไซต์มากขึ้น',
                goodRange: 'ขึ้นอยู่กับคุณภาพโฆษณาและการกำหนดเป้าหมาย',
                watchOutNone:
                    'ไม่มีคลิก อาจเกิดจากประสิทธิภาพโฆษณาหรือการกำหนดเป้าหมายที่ไม่ดี',
                watchOutClicking: 'ผู้ใช้กำลังคลิก',
                contextualNone:
                    'ยังไม่มีบันทึกคลิก โปรดตรวจสอบครีเอทีฟ กลุ่มเป้าหมาย หรือสถานะแคมเปญ',
                contextualClicking:
                    'มีผู้ใช้มีส่วนร่วมกับโฆษณาของคุณ {count} ครั้ง',
            },
            ctr: {
                explanation:
                    'Click-Through Rate: เปอร์เซ็นต์ของผู้ใช้ที่คลิกหลังเห็นโฆษณา',
                formula: '(คลิก / การแสดงผล) × 100',
                interpretationNoImpressions:
                    'คำนวณไม่ได้ เพราะยังไม่มีการแสดงผล',
                interpretation:
                    'วัดความเกี่ยวข้องและความน่าสนใจของโฆษณา CTR ที่สูงขึ้นหมายถึงการมีส่วนร่วมที่ดีขึ้น',
                goodRangeTypical: 'โดยทั่วไปอยู่ที่ 2-5%',
                goodRangeExcellent:
                    'โดยทั่วไปอยู่ที่ 2-5%, มากกว่า 3% ถือว่ายอดเยี่ยม',
                watchOutNoImpressions: 'ยังไม่มีการแสดงผลสำหรับวัด CTR',
                watchOutLow: 'CTR ต่ำ ควรตรวจสอบครีเอทีฟและการกำหนดเป้าหมาย',
                watchOutGood: 'การมีส่วนร่วมดี',
                contextualNoImpressions:
                    'โฆษณาต้องมีการแสดงผลก่อนจึงจะคำนวณ CTR ได้ โปรดตรวจสอบการส่งโฆษณา',
                contextualLow:
                    'CTR {value}% ต่ำกว่าค่าเฉลี่ย ควรทดสอบข้อความโฆษณาหรือรูปภาพแบบอื่น',
                contextualGood:
                    'CTR {value}% แข็งแรง แสดงว่าโฆษณาดึงดูดผู้ใช้ได้ดี',
            },
            roas: {
                explanation:
                    'Return on Ad Spend: รายได้ที่ได้รับต่อเงินโฆษณา 1 หน่วย',
                formula: 'รายได้ / ยอดใช้จ่าย',
                interpretationNoSpend: 'คำนวณไม่ได้ เพราะยังไม่มียอดใช้จ่าย',
                interpretation:
                    '2.0x หมายถึงรายได้ $2 ต่อค่าโฆษณา $1 ใช้วัดประสิทธิภาพแคมเปญ',
                goodRangeExcellent: '>2.0x ถือว่ายอดเยี่ยม',
                goodRangeGood: '>2.0x ถือว่ายอดเยี่ยม, >1.5x ถือว่าดี',
                watchOutNoSpend: 'ยังไม่มียอดใช้จ่ายสำหรับวัด ROAS',
                watchOutLow: 'ROAS < 1.0 กำลังขาดทุนจากโฆษณา',
                watchOutProfitable: 'แคมเปญทำกำไร',
                contextualNoSpend:
                    'ROAS ต้องมียอดใช้จ่ายโฆษณาเพื่อคำนวณ โปรดตรวจสอบงบประมาณและสถานะแคมเปญ',
                contextualLow:
                    'ROAS {value}x หมายความว่าคุณกำลังขาดทุน ควรปรับกลุ่มเป้าหมายหรือลดยอดใช้จ่าย',
                contextualExcellent:
                    'ROAS {value}x ยอดเยี่ยม ให้ผลตอบแทนจากการลงทุนดีมาก',
            },
            cpc: {
                explanation:
                    'Cost Per Click: ค่าใช้จ่ายเฉลี่ยต่อหนึ่งคลิกโฆษณา',
                formula: 'ยอดใช้จ่าย / คลิก',
                interpretationNoClicks: 'คำนวณไม่ได้ เพราะยังไม่มีคลิก',
                interpretation:
                    'CPC ที่ต่ำลงหมายถึงการใช้จ่ายมีประสิทธิภาพมากขึ้น ใช้เปรียบเทียบข้ามแพลตฟอร์มได้',
                goodRangeShort: '<$1-5 ขึ้นอยู่กับอุตสาหกรรม',
                goodRange: '<$1-5 ขึ้นอยู่กับอุตสาหกรรมและการแข่งขัน',
                watchOutNoClicks: 'ยังไม่มีคลิกสำหรับวัด CPC',
                watchOutHigh: 'CPC สูง คลิกมีต้นทุนแพง',
                watchOutReasonable: 'ต้นทุนคลิกอยู่ในระดับสมเหตุสมผล',
                contextualNoClicks:
                    'CPC ต้องมีคลิกเพื่อคำนวณ ควรโฟกัสการปรับปรุง CTR ก่อน',
                contextualHigh: 'CPC {amount} สูง ควรพิจารณาปรับกลุ่มเป้าหมาย',
                contextualEfficient: 'CPC {amount} มีประสิทธิภาพ',
            },
            cpm: {
                explanation:
                    'Cost Per Mille: ค่าใช้จ่ายในการแสดงโฆษณา 1,000 ครั้ง',
                formula: '(ยอดใช้จ่าย / การแสดงผล) × 1000',
                interpretationNoImpressions:
                    'คำนวณไม่ได้ เพราะยังไม่มีการแสดงผล',
                interpretation:
                    'วัดประสิทธิภาพต้นทุนสำหรับการเข้าถึง CPM ที่ต่ำลงหมายถึงการแสดงผลที่ถูกลง',
                goodRangeShort: '<$5-15 ขึ้นอยู่กับแพลตฟอร์ม',
                goodRange: '<$5-15 ขึ้นอยู่กับแพลตฟอร์มและการกำหนดเป้าหมาย',
                watchOutNoImpressions: 'ยังไม่มีการแสดงผลสำหรับวัด CPM',
                watchOutHigh: 'CPM สูง การเข้าถึงมีต้นทุนแพง',
                watchOutReasonable: 'ต้นทุนการเข้าถึงอยู่ในระดับสมเหตุสมผล',
                contextualNoImpressions:
                    'CPM ต้องมีการแสดงผลเพื่อคำนวณ โปรดตรวจสอบสถานะการส่งโฆษณา',
                contextualHigh: 'CPM {amount} สูง ควรพิจารณาขยายกลุ่มเป้าหมาย',
                contextualEfficient: 'CPM {amount} มีประสิทธิภาพ',
            },
            default: {
                explanation: 'ยังไม่มีคำอธิบายเมตริกนี้',
                interpretation:
                    'โปรดตรวจสอบเอกสารประกอบสำหรับรายละเอียดเพิ่มเติม',
                contextual:
                    'ติดต่อฝ่ายสนับสนุนหากต้องการความช่วยเหลือในการทำความเข้าใจเมตริกนี้',
            },
        },
    },
    visualization: {
        title: 'สรุปประสิทธิภาพ',
        subtitle: 'ติดตามการกระจายงบประมาณและประสิทธิภาพ ROI แบบรวดเร็ว',
        chartTitle: 'ประสิทธิภาพ (งบประมาณ vs ยอดใช้จ่าย vs รายได้)',
        chartSubtitle: '5 แคมเปญที่มียอดใช้จ่ายสูงสุด',
        liveData: 'ข้อมูลสด',
        labels: {
            budget: 'งบประมาณ',
            spend: 'ยอดใช้จ่าย',
            revenue: 'รายได้',
        },
        highlightsTitle: 'ไฮไลต์ประสิทธิภาพ',
        highlightsSubtitle: 'ดูยอดใช้จ่ายและแคมเปญที่ทำผลงานดีที่สุดแบบรวดเร็ว',
        totalSpend: 'ยอดใช้จ่ายรวม',
        exactAmount: 'จำนวนจริง',
        topRoi: 'ROI สูงสุด',
        bestCampaign: 'แคมเปญที่ดีที่สุด',
        roiLabel: 'ROI {value}%',
        activeCampaigns: 'แคมเปญที่ใช้งานอยู่',
        runningNow: 'กำลังทำงานอยู่',
    },
    analytics: {
        conversionRate: 'อัตราคอนเวอร์ชัน',
        subtitle: 'สรุปโดย AI แยกตามช่องทาง',
        activeChannel: 'ช่องทางที่ใช้งานอยู่',
        analyzing: 'กำลังวิเคราะห์...',
        insight: 'สรุปโดย AI:',
        benchmark: 'เกณฑ์เปรียบเทียบ',
        top: 'สูงสุด:',
        lowest: 'ต่ำสุด:',
        keepAbove: 'รักษา {campaignName} ให้สูงกว่า {rate}% เพื่อให้แข่งขันได้',
        action: 'แนวทางดำเนินการ',
        platformBreakdown: 'สรุปตามแพลตฟอร์ม',
        platformSubtitle: 'เมตริกหลักและการใช้งบประมาณ',
        bestValue: 'คุ้มค่าที่สุด',
        share: 'สัดส่วน',
        cpa: 'CPA',
        tooltip: {
            conversionRate: {
                description:
                    'เปอร์เซ็นต์ของผู้ใช้ที่ทำ action ที่ต้องการสำเร็จ เช่น ซื้อสินค้า สมัครสมาชิก ฯลฯ หลังจากคลิกโฆษณาของคุณ',
                formulaLabel: 'สูตร:',
                formula: '(คอนเวอร์ชัน / คลิก) × 100',
                goodRangeLabel: 'ช่วงที่ดี:',
                goodRange: '2-5% สำหรับอุตสาหกรรมส่วนใหญ่',
                insightLabel: 'สรุปโดย AI:',
                insight:
                    'อัตราคอนเวอร์ชันที่สูงขึ้นหมายถึงโฆษณามีความเกี่ยวข้องและหน้า landing page ถูกปรับให้เหมาะสมมากขึ้น',
            },
            platformBreakdown: {
                description:
                    'เปรียบเทียบยอดใช้จ่าย คอนเวอร์ชัน และต้นทุนต่อการได้ลูกค้าระหว่าง Facebook, Google, TikTok และ Line',
                shareLabel: 'สัดส่วน:',
                share: 'เปอร์เซ็นต์ของงบประมาณรวมที่ใช้ในแต่ละแพลตฟอร์ม',
                cpaLabel: 'CPA:',
                cpa: 'Cost Per Acquisition - ยิ่งต่ำยิ่งดี',
                tipLabel: 'คำแนะนำ:',
                tip: 'โฟกัสงบประมาณไปที่แพลตฟอร์มที่มี CPA ดีที่สุด พร้อมทดสอบช่องทางที่ยังทำผลงานต่ำกว่าเป้า',
            },
        },
        performance: {
            prefix: 'มีผลลัพธ์',
            steadily: 'คงที่',
            diff: '{diff}% {direction}',
            higher: 'สูงกว่า',
            lower: 'ต่ำกว่า',
            aroundAverage: ' ใกล้เคียงค่าเฉลี่ย',
            thanAverage: 'ค่าเฉลี่ย',
            high: ' แคมเปญนี้ทำผลงานได้ยอดเยี่ยมจากการกำหนดเป้าหมายที่ถูกปรับให้เหมาะสม',
            medium: ' ประสิทธิภาพอยู่ในระดับคงที่ ควรมองหาโอกาสปรับปรุงแบบค่อยเป็นค่อยไป',
            low: ' ควรตรวจสอบครีเอทีฟโฆษณาหรือความเกี่ยวข้องของ landing page เพื่อปรับปรุงประสิทธิภาพ',
        },
        actions: {
            high: 'เพิ่มน้ำหนักกับครีเอทีฟที่ทำผลงานดีใน {campaignName} และเพิ่มงบประมาณ 10-15% เพื่อเพิ่ม ROI โดยยังรักษาประสิทธิภาพไว้',
            medium: 'คงการตั้งค่าปัจจุบันของ {campaignName} พร้อมทดสอบข้อความโฆษณาแบบย่อยเพื่อเพิ่มอัตราคอนเวอร์ชันเล็กน้อย',
            low: 'ทดสอบข้อเสนอรูปแบบใหม่เพื่อลดช่องว่างกับ {campaignName} และวิเคราะห์การแบ่งกลุ่มผู้ชมเพื่อหาความไม่ตรงกัน',
        },
        tips: {
            zeroConversions:
                ' กำลังใช้งบโดยยังไม่มีผลลัพธ์ ระบบ tracking ทำงานถูกต้องไหม? ควรหยุดชั่วคราวเพื่อตรวจสอบการตั้งค่าโฆษณาหรือกลุ่มเป้าหมายทันที',
            highEfficiency:
                ' มีประสิทธิภาพสูงมาก (CPA {amount}) เพิ่มงบรายวัน 15-20% เพื่อขยายคอนเวอร์ชันต้นทุนต่ำเหล่านี้',
            highCpa:
                ' มีต้นทุนสูง (CPA {amount}) ปรับกลุ่มเป้าหมายหรือรีเฟรชครีเอทีฟเพื่อลดต้นทุนให้ใกล้ค่าเฉลี่ย',
            lowSpend:
                ' มีศักยภาพ กำลังสร้างคอนเวอร์ชันด้วยยอดใช้จ่ายต่ำ ควรเพิ่มงบเพื่อทดสอบปริมาณ',
            stable: ' ทำผลงานได้คงที่ รักษากลยุทธ์ปัจจุบันไว้แต่ติดตามความถี่เพื่อหลีกเลี่ยง ad fatigue',
            fallback:
                'เริ่มแคมเปญในหลายแพลตฟอร์มเพื่อดูอินไซต์เปรียบเทียบจาก AI ที่นี่',
        },
        tipLabels: {
            warning: 'คำเตือนด้านประสิทธิภาพ',
            opportunity: 'โอกาสในการปรับปรุง',
            info: 'คำแนะนำเพื่อการเติบโต',
        },
        navigation: {
            previous: 'ก่อนหน้า',
            next: 'ถัดไป',
        },
    },
} as const satisfies TranslationShape<typeof campaignsEn>;
