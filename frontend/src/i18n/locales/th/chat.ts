import type { chatEn } from '../en/chat';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const chatTh = {
    widget: {
        assistantTitle: 'ผู้ช่วย AI',
        beta: 'เบต้า',
        imageAlt: 'AI',
        status: {
            online: 'ออนไลน์',
        },
        initialMessage:
            'สวัสดีครับ 👋 ผมคือผู้ช่วย AI ของคุณ มีอะไรเกี่ยวกับแดชบอร์ดให้ช่วยไหมครับ?',
        actions: {
            startNewChat: 'เริ่มแชทใหม่',
        },
        input: {
            listeningPlaceholder: 'กำลังฟัง...',
            askPlaceholder: 'ถามมาได้เลย...',
        },
        speech: {
            unsupported: 'เบราว์เซอร์ของคุณไม่รองรับการรู้จำเสียงพูด',
        },
        disclaimer: 'AI อาจผิดพลาดได้ โปรดตรวจสอบข้อมูลสำคัญอีกครั้ง',
    },
} as const satisfies TranslationShape<typeof chatEn>;
