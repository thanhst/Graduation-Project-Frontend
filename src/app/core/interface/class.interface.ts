import { Classroom } from "../models/classroom/classroom";

export interface ClassroomWithSrc {
    classroom: Classroom;
    src: string[];
}