import noPhoto from '../common/img/PersonPlaceholder.96x96x32.png'
import ClockService from './ClockService';
import IUser from '../model/IUser';
import { ITeamService } from './TeamService';
import ITimeZone from '../model/ITimeZone';

export default class TeamServiceReal implements ITeamService {

    static async factory(): Promise<ITeamService> {
        const service = new TeamServiceReal();
        return Promise.resolve(service); //((resolve) => { resolve(service); });
    }

    async getCurrentUser(format: string) {

        const currentUser: IUser = {
            firstName: "Real",
            lastName: "Service",
            timeZone: "America/New_York",
            /* Preferred work week, 1 char/day, o=off, w=work */
            workDays: 'owwwwwo',
            /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
            workHours: 'nnnnnnneedddddddddeeeeen',
            photoUrl: "",
            timeFormat: "LTS",
            timeZoneObj: this.getDefaultTimeZone()
        }
        if (currentUser.photoUrl === "") {
            currentUser.photoUrl = noPhoto;
        }
        let clockService = await ClockService.factory();
        let members = [];
        members.push(currentUser);
        currentUser.timeZoneObj = clockService.getTimeZones(members)[0];
        return currentUser;
    };

    async getOtherTeamMembers(currentUser: IUser) {
        const allTeamMembers = await this.getTeamMembers('time');
        let otherTeamMembers: IUser[] = [];

        // Remove the current User
        // Need a better way of doing this
        allTeamMembers.forEach((m) => {
            if (m.firstName !== currentUser.firstName && m.lastName !== currentUser.lastName) {
                otherTeamMembers.push(m);
            }
        });

        return otherTeamMembers;
    }

    async getTeamMembers(sortOrder: string): Promise<IUser[]> {

        let mockMembers: IUser[] = [
            {
                firstName: "Derek",
                lastName: "Cash-Peterson",
                timeZone: "America/New_York",
                /* Preferred work week, 1 char/day, o=off, w=work */
                workDays: 'owwwwwo',
                /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                timeFormat: "h:mm:ss a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Ayca",
                lastName: "",
                timeZone: "Asia/Dubai",
                /* Preferred work week, 1 char/day, o=off, w=work */
                workDays: 'owwwwwo',
                /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                timeFormat: "h:mm:ss a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Barnam",
                lastName: "",
                timeZone: "Australia/Melbourne",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                timeFormat: "h:mm:ss a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Bob",
                lastName: "German",
                timeZone: "America/New_York",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                timeFormat: "h:mm:ss a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Dan",
                lastName: "",
                timeZone: "America/Phoenix",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                timeFormat: "h:mm:ss a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Emily",
                lastName: "",
                timeZone: "America/Los_Angeles",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                timeFormat: "h:mm:ss a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Matt",
                lastName: "",
                timeZone: "America/Los_Angeles",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                timeFormat: "h:mm:ss a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Rabia",
                lastName: "",
                timeZone: "Australia/Brisbane",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                timeFormat: "h:mm:ss a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Todd",
                lastName: "",
                timeZone: "America/Chicago",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                timeFormat: "h:mm:ss a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Tomomi",
                lastName: "",
                timeZone: "America/Los_Angeles",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                timeFormat: "h:mm:ss a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Waldek",
                lastName: "",
                timeZone: "Europe/Amsterdam",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                timeFormat: "h:mm:ss a",
                timeZoneObj: this.getDefaultTimeZone()
            },
        ];
        let clockService = new ClockService();
        mockMembers.forEach((m) => {
            m.photoUrl = m.photoUrl || noPhoto;
            m.timeZoneObj = clockService.getTimeZones([m])[0];
        });
        // I think the above foreach loop is the same ??
        // mockMembers.map((u) => {
        //     if (u.photoUrl === "") {
        //         u.photoUrl = noPhoto;
        //     }
        //     let members: IUser[] = [];
        //     members.push(u);
        //     u.timeZoneObj = clockService.getTimeZones(members);
        //     return u;
        // });

        // ??? DO we need to sort anymore? How ?
        // if (sortOrder === "time") {
        //     mockMembers.sort((a, b) => { return b.utcOffset - a.utcOffset })
        // } else {
        //     mockMembers.sort((a, b) => { return a.name < b.name ? -1 : 1 })
        // }
        return mockMembers;
    }

    private getDefaultTimeZone(): ITimeZone {
        return {
            timeZone: "Etc/UTC",
            abbreviation: "UTC",
            offset: 0,
            members: []
        };
    }

}