import type { usersEn } from '../en/users';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const usersTh = {
    page: {
        title: 'ผู้ใช้',
        subtitle: 'จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึงในพื้นที่ทำงานของคุณ',
    },
    entityName: 'ผู้ใช้',
    roles: {
        client: {
            label: 'ลูกค้า',
            description: 'ดูข้อมูลเท่านั้น',
        },
        manager: {
            label: 'ผู้จัดการ',
            description: 'แก้ไขข้อมูลได้',
        },
        admin: {
            label: 'ผู้ดูแลระบบ',
            description: 'เข้าถึงได้ทั้งหมด',
        },
    },
    dialog: {
        createTitle: 'เพิ่มผู้ใช้ใหม่',
        editTitle: 'แก้ไขผู้ใช้',
        createDescription: 'สร้างบัญชีใหม่และกำหนดบทบาทให้ผู้ใช้',
        editDescription: 'อัปเดตข้อมูลบัญชีและบทบาทของผู้ใช้',
        fields: {
            email: 'อีเมล',
            firstName: 'ชื่อ',
            lastName: 'นามสกุล',
            password: 'รหัสผ่าน',
            role: 'บทบาท',
        },
        optional: '(ไม่บังคับ)',
        emailLocked: 'ไม่สามารถเปลี่ยนอีเมลได้หลังจากสร้างบัญชีแล้ว',
        placeholders: {
            email: 'user@company.com',
            firstName: 'Jane',
            lastName: 'Smith',
            passwordCreate: 'อย่างน้อย 6 ตัวอักษร',
            passwordEdit: 'เว้นว่างไว้เพื่อใช้รหัสผ่านเดิม',
        },
        aria: {
            hidePassword: 'ซ่อนรหัสผ่าน',
            showPassword: 'แสดงรหัสผ่าน',
        },
        actions: {
            cancel: 'ยกเลิก',
            saveChanges: 'บันทึกการเปลี่ยนแปลง',
            addUser: 'เพิ่มผู้ใช้',
        },
    },
    deleteDialog: {
        fallbackUser: 'ผู้ใช้นี้',
        title: 'ลบผู้ใช้',
        step: 'ขั้นตอนที่ {step} จาก 2 - {label}',
        intentStep: 'ยืนยันความตั้งใจ',
        finalStep: 'ยืนยันขั้นสุดท้าย',
        warningTitle: 'การกระทำนี้ไม่สามารถย้อนกลับได้',
        warningDescription:
            'ข้อมูลทั้งหมดที่เกี่ยวข้องกับบัญชีนี้จะถูกลบออกจากระบบอย่างถาวร',
        userToBeDeleted: 'ผู้ใช้ที่จะถูกลบ',
        proceed:
            'คุณแน่ใจหรือไม่ว่าต้องการดำเนินการต่อ? คุณจะต้องยืนยันอีกครั้งในขั้นตอนถัดไป',
        confirmationWord: 'delete',
        typePrefix: 'พิมพ์',
        typeMiddle: 'ด้านล่างเพื่อลบ',
        typeSuffix: ' แบบถาวร',
        typeLabel: 'พิมพ์ "{word}" เพื่อยืนยัน',
        actions: {
            cancel: 'ยกเลิก',
            continueDelete: 'ใช่ ลบผู้ใช้นี้',
            permanentlyDelete: 'ลบถาวร',
        },
    },
    metrics: {
        totalUsers: 'ผู้ใช้ทั้งหมด',
        totalDescription: 'ทั้งหมด: {total}',
        admins: 'ผู้ดูแลระบบ',
        managers: 'ผู้จัดการ',
        clients: 'ลูกค้า',
    },
    table: {
        title: 'ผู้ใช้ทั้งหมด',
        description: 'ดูและจัดการบัญชีผู้ใช้ทั้งหมด',
        addUser: 'เพิ่มผู้ใช้',
        searchPlaceholder: 'ค้นหาด้วยชื่อหรืออีเมล...',
        filterPlaceholder: 'กรองตามบทบาท',
        allRoles: 'ทุกบทบาท',
        headers: {
            name: 'ชื่อ',
            email: 'อีเมล',
            role: 'บทบาท',
            createdAt: 'สร้างเมื่อ',
            actions: 'การทำงาน',
        },
        emptySearch: 'ไม่พบผู้ใช้ที่ตรงกับตัวกรอง',
        empty: 'ยังไม่มีผู้ใช้ เพิ่มผู้ใช้แรกของคุณได้เลย',
        pagination: 'แสดง {from} ถึง {to} จาก {total} รายการ',
        previous: 'ก่อนหน้า',
        next: 'ถัดไป',
        aria: {
            editUser: 'แก้ไขผู้ใช้',
            deleteUser: 'ลบผู้ใช้',
        },
    },
    validation: {
        emailRequired: 'กรุณากรอกอีเมล',
        emailInvalid: 'กรุณากรอกอีเมลให้ถูกต้อง',
        firstNameRequired: 'กรุณากรอกชื่อ',
        firstNameMin: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร',
        firstNameMax: 'ชื่อต้องน้อยกว่า 100 ตัวอักษร',
        lastNameMax: 'นามสกุลต้องน้อยกว่า 100 ตัวอักษร',
        passwordRequired: 'กรุณากรอกรหัสผ่าน',
        passwordMin: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
        roleRequired: 'กรุณาเลือกบทบาท',
        roleInvalid: 'บทบาทต้องเป็นหนึ่งใน: ADMIN, MANAGER, CLIENT',
    },
} as const satisfies TranslationShape<typeof usersEn>;
