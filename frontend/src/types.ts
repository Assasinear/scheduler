export interface Group {
    _id: string;
    number: string;
}

export interface Teacher {
    _id: string;
    name: string;
    position: string;
}

export interface Room {
    _id: string;
    number: string;
}

export interface ScheduleItem {
    group: Group;
    teacher: Teacher;
    room: Room;
    subject: string;
    startTime: string; // using string to simplify date handling
    endTime: string;
}

export interface Schedule {
    _id: string;
    name: string;
    items: ScheduleItem[];
}