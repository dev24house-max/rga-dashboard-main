import type { tutorialEn } from "../en/tutorial";

type TranslationShape<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : TranslationShape<T[K]>;
};

export const tutorialTh = {
  launcher: {
    ariaLabel: "เริ่มคำแนะนำหน้านี้",
    tooltip: "คำแนะนำ",
  },
  dialog: {
    ariaLabel: "คำแนะนำขั้นตอนที่ {current} จาก {total}: {title}",
  },
  controls: {
    stepCompact: "ขั้นตอน {current}/{total}",
    stepOf: "ขั้นตอน {current} จาก {total}",
    close: "ปิดคำแนะนำ",
    back: "ย้อนกลับ",
    skip: "ข้าม",
    next: "ถัดไป",
    done: "เสร็จสิ้น",
  },
  steps: {
    "dashboard-overview": {
      title: "ภาพรวมแดชบอร์ด",
      description:
        "หน้านี้สรุปภาพรวมประสิทธิภาพโฆษณา สุขภาพแคมเปญ และสถานะการเชื่อมต่อทั้งหมดไว้ในที่เดียว",
    },
    "dashboard-connect": {
      title: "เชื่อมต่อช่องทางของคุณ",
      description:
        "ใช้เช็กลิสต์นี้เพื่อตรวจสอบการเชื่อมต่อ และให้แดชบอร์ดมีข้อมูลแคมเปญจริงอยู่เสมอ",
    },
    "dashboard-metrics": {
      title: "ตัวชี้วัดประสิทธิภาพ",
      description:
        "การ์ดเหล่านี้สรุปค่าใช้จ่าย การแสดงผล คลิก คอนเวอร์ชัน และ ROAS เพื่อให้เห็นปัญหาได้เร็วขึ้น",
    },
    "dashboard-trend-chart": {
      title: "กราฟแนวโน้ม",
      description:
        "ติดตามการเปลี่ยนแปลงของค่าใช้จ่าย การแสดงผล คลิก และคอนเวอร์ชันในช่วงเวลาที่เลือก",
    },
    "dashboard-funnel": {
      title: "เส้นทางคอนเวอร์ชัน",
      description:
        "ดูการไหลจากการแสดงผลไปสู่คลิกและคอนเวอร์ชัน เพื่อหาจุดที่ผู้ใช้หลุดออกจาก funnel",
    },
    "data-sources-overview": {
      title: "ภาพรวมแหล่งข้อมูล",
      description:
        "เชื่อมต่อแพลตฟอร์มโฆษณาเพื่อให้ข้อมูลแคมเปญและค่าใช้จ่ายซิงก์เข้าแดชบอร์ดอัตโนมัติ",
    },
    "data-sources-grid": {
      title: "การเชื่อมต่อแพลตฟอร์ม",
      description:
        "แต่ละการ์ดแสดงสถานะการเชื่อมต่อ และให้คุณเชื่อมหรือยกเลิกการเชื่อมต่อบัญชีโฆษณาได้",
    },
    "campaigns-overview": {
      title: "ภาพรวมแคมเปญ",
      description:
        "หน้านี้ช่วยตรวจสอบประสิทธิภาพ สถานะ และการจัดการแคมเปญทั้งหมดจากที่เดียว",
    },
    "campaigns-toolbar": {
      title: "ค้นหาและตัวกรอง",
      description:
        "ใช้แถบเครื่องมือเพื่อค้นหาด้วยชื่อ กรองตามแพลตฟอร์มหรือสถานะ และปรับช่วงเวลาของแคมเปญ",
    },
    "campaigns-search": {
      title: "ค้นหาแคมเปญ",
      description:
        "ค้นหาจากชื่อแคมเปญหรือคีย์เวิร์ด เพื่อหาแคมเปญที่ต้องการดูหรือแก้ไขได้เร็วขึ้น",
    },
    "campaigns-filters": {
      title: "ตัวกรองสถานะและแพลตฟอร์ม",
      description:
        "กรองแคมเปญตามสถานะหรือแพลตฟอร์ม เพื่อจำกัดรายการให้เหลือเฉพาะแคมเปญที่ต้องการ",
    },
    "campaigns-selection-toggle": {
      title: "แสดงเฉพาะที่เลือก",
      description:
        "เปิดตัวเลือกนี้เพื่อดูเฉพาะแคมเปญที่เลือกไว้ ช่วยให้ตรวจสอบและจัดการแบบกลุ่มได้ง่ายขึ้น",
    },
    "campaigns-table": {
      title: "ตารางแคมเปญ",
      description:
        "ตารางนี้แสดงรายละเอียดแคมเปญ ให้คุณจัดเรียง เลือกรายการ และใช้คำสั่งแก้ไขหรือลบได้",
    },
    "campaigns-summary": {
      title: "สรุปประสิทธิภาพ",
      description:
        "ดูค่าใช้จ่าย การแสดงผล คลิก และอัตราคอนเวอร์ชันแบบรวมของแคมเปญที่แสดงอยู่",
    },
    "campaigns-visualization": {
      title: "ภาพข้อมูลแคมเปญ",
      description:
        "กราฟเหล่านี้แสดงประสิทธิภาพแคมเปญและการกระจายตามแพลตฟอร์ม เพื่อช่วยเปรียบเทียบแนวโน้ม",
    },
    "campaigns-analytics": {
      title: "การวิเคราะห์แคมเปญ",
      description:
        "วิเคราะห์ ROI ต้นทุนต่อคลิก และประสิทธิภาพคอนเวอร์ชัน เพื่อหาแคมเปญที่ควรปรับปรุง",
    },
    "ai-insights-overview": {
      title: "ภาพรวม AI Insights",
      description:
        "ถาม AI Assistant เกี่ยวกับกลยุทธ์แคมเปญ SEO หรือประสิทธิภาพทราฟฟิกได้จากที่เดียว",
    },
    "reports-overview": {
      title: "ภาพรวมรายงาน",
      description:
        "ดาวน์โหลดตัวชี้วัดแคมเปญและสรุปประสิทธิภาพที่พร้อมส่งออกได้จากหน้านี้",
    },
    "reports-filters": {
      title: "ตัวกรองการส่งออก",
      description:
        "เลือกช่วงเวลา แพลตฟอร์ม และสถานะแคมเปญก่อนส่งออกเป็น CSV หรือ PDF",
    },
    "reports-export-csv": {
      title: "ส่งออก CSV",
      description:
        "ส่งออกข้อมูลแคมเปญดิบ เช่น ค่าใช้จ่าย คลิก คอนเวอร์ชัน และ ROAS เพื่อวิเคราะห์ต่อภายนอก",
    },
    "reports-export-pdf": {
      title: "ส่งออก PDF",
      description:
        "ดาวน์โหลดรายงาน PDF ที่จัดรูปแบบพร้อมสรุปประสิทธิภาพและการเปรียบเทียบแต่ละช่วงเวลา",
    },
    "reports-info": {
      title: "รายละเอียดรายงาน",
      description:
        "ส่วนนี้อธิบายความต่างระหว่าง export ข้อมูลดิบกับรายงานสรุปที่จัดรูปแบบแล้ว",
    },
    "users-overview": {
      title: "ภาพรวมผู้ใช้",
      description:
        "จัดการบัญชีผู้ใช้ บทบาท และสิทธิ์การเข้าถึง workspace จากหน้า Users",
    },
    "users-metrics": {
      title: "ตัวชี้วัดบทบาท",
      description:
        "ดูจำนวน Admin, Manager และ Client เพื่อเข้าใจโครงสร้างทีมปัจจุบัน",
    },
    "users-table": {
      title: "รายชื่อผู้ใช้",
      description:
        "ดูผู้ใช้ บทบาท และวันที่สร้างบัญชีในตาราง พร้อมเข้าถึงคำสั่งจัดการจากคอลัมน์ action",
    },
    "users-search-filter": {
      title: "ค้นหาและกรอง",
      description:
        "ค้นหาด้วยชื่อหรืออีเมล หรือกรองตามบทบาท เพื่อหาบัญชีผู้ใช้ที่ต้องการได้เร็วขึ้น",
    },
    "users-add-button": {
      title: "เพิ่มผู้ใช้",
      description:
        "สร้างบัญชีผู้ใช้ใหม่และกำหนดบทบาทให้เหมาะกับระดับการเข้าถึง",
    },
    "users-actions": {
      title: "แก้ไขและลบผู้ใช้",
      description:
        "ใช้ปุ่มแก้ไขหรือลบเพื่ออัปเดตรายละเอียดผู้ใช้ หรือนำบัญชีที่ไม่จำเป็นออก",
    },
    "settings-overview": {
      title: "ภาพรวมการตั้งค่า",
      description:
        "จัดการค่าบัญชี รูปแบบภูมิภาค พฤติกรรมการแจ้งเตือน และการตั้งค่า alert จากหน้านี้",
    },
    "settings-tabs": {
      title: "หมวดการตั้งค่า",
      description: "สลับระหว่างการตั้งค่าทั่วไปและกฎแจ้งเตือนด้วยแท็บเหล่านี้",
    },
    "settings-appearance": {
      title: "รูปลักษณ์",
      description: "ควบคุมรูปแบบการแสดงผล เช่น โหมดมืดและมุมมองกะทัดรัด",
    },
    "settings-regional": {
      title: "การตั้งค่าภูมิภาค",
      description:
        "ตั้งค่าภาษา เขตเวลา สกุลเงิน และรูปแบบวันที่ เพื่อให้รายงานตรงกับบริบทการทำงานของคุณ",
    },
    "settings-notifications": {
      title: "การตั้งค่าการแจ้งเตือน",
      description:
        "เลือกช่องทางที่จะรับ alert ของแดชบอร์ดและการแจ้งเตือนของระบบ",
    },
    "settings-alert-rules-tab": {
      title: "กฎแจ้งเตือน",
      description:
        "เปิดแท็บนี้เพื่อสร้าง watchdog rules สำหรับติดตามตัวชี้วัดและแจ้งเตือนเมื่อเข้าเงื่อนไข",
    },
    "seo-overview": {
      title: "ภาพรวม SEO และเว็บอนาไลติกส์",
      description:
        "ติดตาม organic traffic และตัวชี้วัด engagement ของเว็บไซต์จากแดชบอร์ด SEO",
    },
    "seo-performance": {
      title: "สรุปประสิทธิภาพ",
      description:
        "ดู sessions, bounce rate, engagement และ goal completions เพื่อเข้าใจพฤติกรรมผู้ชม",
    },
    "seo-performance-trends": {
      title: "การวิเคราะห์แนวโน้ม",
      description:
        "ติดตามประสิทธิภาพ organic search ตามเวลา เพื่อดูว่าทราฟฟิกและ engagement เพิ่มขึ้นหรือลดลง",
    },
    "seo-keyword-analysis": {
      title: "การวิเคราะห์คีย์เวิร์ดและทราฟฟิก",
      description:
        "ดูว่าคีย์เวิร์ดใดสร้างทราฟฟิกมากที่สุด และ search intent ส่งผลต่อ organic reach อย่างไร",
    },
    "seo-offpage-metrics": {
      title: "ตัวชี้วัด Off-Page",
      description:
        "ตรวจสอบ backlink และ referring domain ที่ช่วยบอกความน่าเชื่อถือของเว็บไซต์",
    },
  },
} as const satisfies TranslationShape<typeof tutorialEn>;
