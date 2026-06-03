import type { exportControlsEn } from '../en/export-controls';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const exportControlsTh = {
    export: 'ส่งออก',
    exportCsv: 'ส่งออก CSV',
    exportPdf: 'ส่งออก PDF',
    saveAsImage: 'บันทึกเป็นรูปภาพ',
    saveAsPdf: 'บันทึกเป็น PDF',
    saveAsCsv: 'บันทึกเป็น CSV',
} as const satisfies TranslationShape<typeof exportControlsEn>;
