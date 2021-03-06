import { dayOfWeekText, weekRangeText } from 'core/utils';

export interface Department {
    id: string;
    name: string;
}

export interface BookingType {
    id: number;
    name: string;
    checker?: string;
}

export interface BookingSection {
    id: number;
    name: string;
    start: number;
    total: number;
    includes: number[];
}

export const bookingSectionMap: { [key: number]: BookingSection } = {};

export class BookingForm {
    id: number;
    term: number;
    userId: string;
    userName: string;
    extraInfo: string[];
    phoneNumber: string;
    department: Department;
    bookingType: BookingType;
    reason: string;
    numberOfUsers: number;
    status: string;
    workflowInstanceId: string;
    dateSubmitted: string;
    checker: string;
    dateChecked: string;
    approver: string;
    dateApproved: string;
    items: BookingItem[];
    removedItems: BookingItem[];

    constructor(dto: any) {
        this.id = dto.id;
        this.term = dto.term;
        this.userId = dto.userId;
        this.userName = dto.userName;
        this.extraInfo = dto.extraInfo;
        this.phoneNumber = dto.phoneNumber;
        this.department = {
            id: dto.departmentId,
            name: dto.departmentName,
        };
        this.bookingType = {
            id: dto.bookingTypeId,
            name: dto.bookingTypeName,
        };
        this.reason = dto.reason;
        this.numberOfUsers = dto.numberOfUsers;
        this.status = dto.status;
        this.workflowInstanceId = dto.workflowInstanceId;
        this.dateSubmitted = dto.dateSubmitted;
        this.checker = dto.checker;
        this.dateChecked = dto.dateChecked;
        this.approver = dto.approver;
        this.dateApproved = dto.dateApproved;
        this.items = dto.items.map((item: any) => new BookingItem(this, item));
        this.removedItems = [];
    }

    get title(): string {
        return this.id ? `教室借用单#${this.id}` : '教室借用单';
    }

    get workflowTitle(): string {
        return `教室借用单#${this.id}`;
    }

    get occupied(): boolean {
        return !!this.items.find(it => it.occupied);
    }
}

/* tslint:disable:max-classes-per-file */
export class BookingItem {
    form: BookingForm;
    id: number;
    place: {
        id: string;
        name: string;
        seat: number;
        type: string;
    };
    startWeek: number;
    endWeek: number;
    oddEven: number;
    dayOfWeek: number;
    section: BookingSection;
    occupied: boolean;

    constructor(form: BookingForm, dto: any) {
        this.form = form;
        this.id = dto.id;
        this.place = dto.place;
        this.startWeek = dto.startWeek;
        this.endWeek = dto.endWeek;
        this.oddEven = dto.oddEven;
        this.dayOfWeek = dto.dayOfWeek;
        this.section = dto.sectionId ? bookingSectionMap[dto.sectionId] : dto.section;
        this.occupied = dto.occupied;
    }

    get isExceedLimit(): boolean {
        if (this.form.bookingType.name && this.form.bookingType.name !== '教学活动') {
            if (this.place.seat <= 60) {
                return this.form.numberOfUsers < 10;
            } else if (this.place.seat <= 100) {
                return this.form.numberOfUsers < 30;
            } else {
                return this.form.numberOfUsers / this.place.seat < 0.5;
            }
        } else {
            return false;
        }
    }

    toString(): string {
        return `${weekRangeText(this)} 星期${dayOfWeekText(this.dayOfWeek)} ${this.section.name} ` +
            `${this.place.name}（${this.place.type} / ${this.place.seat}座）`;
    }
}
