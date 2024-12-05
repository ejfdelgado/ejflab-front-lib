import { Injectable } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';
import { MyDates } from '@ejfdelgado/ejflab-common/src/MyDates';

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
    },
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};

// extend NativeDateAdapter's format method to specify the date format.
@Injectable()
export class MMDDYYYYAdapter extends NativeDateAdapter {
    epochToText(value: number | null) {
        if (!value) { return ''; }
        const siguiente = new Date(value);
        const anio1 = siguiente.getFullYear();
        const mes1 = siguiente.getMonth() + 1;
        const dia1 = siguiente.getDate();
        return `${MyDates.lPad2(mes1)}/${MyDates.lPad2(dia1)}/${anio1}`;
    }

    textToEpoch(value: string): number | null {
        const partes = /(\d{1,2})[\/]?(\d{1,2})[\/]?(\d{4})/.exec(value);
        if (partes) {
            return new Date(parseInt(partes[3]), parseInt(partes[1]) - 1, parseInt(partes[2])).getTime();
        } else {
            return null;
        }
    }
    override format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            return this.epochToText(date.getTime());
        } else {
            return date.toDateString();
        }
    }
    override parse(value: any, parseFormat: string): Date | null {
        const epoch = this.textToEpoch(value);
        if (epoch) {
            return new Date(epoch);
        }
        return null;
    }
}

@Injectable()
export class YYYYMMDDAdapter extends NativeDateAdapter {
    epochToText(value: number | null) {
        if (!value) { return ''; }
        const siguiente = new Date(value);
        const anio1 = siguiente.getFullYear();
        const mes1 = siguiente.getMonth() + 1;
        const dia1 = siguiente.getDate();
        return `${anio1}/${MyDates.lPad2(mes1)}/${MyDates.lPad2(dia1)}`;
    }

    textToEpoch(value: string): number | null {
        const partes = /(\d{4})[\/]?(\d{1,2})[\/]?(\d{1,2})/.exec(value);
        if (partes) {
            return new Date(parseInt(partes[1]), parseInt(partes[2]) - 1, parseInt(partes[3])).getTime();
        } else {
            return null;
        }
    }
    override format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            return this.epochToText(date.getTime());
        } else {
            return date.toDateString();
        }
    }
    override parse(value: any, parseFormat: string): Date | null {
        const epoch = this.textToEpoch(value);
        if (epoch) {
            return new Date(epoch);
        }
        return null;
    }
}