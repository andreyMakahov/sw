import { Types } from './constants';
import { Modes } from '../constants';

class Logger {

    mode: string;

    constructor(mode: string) {
        this.mode = mode;
    }

    report(message: string, type: Types): void {
        if (this.mode === Modes.Development) {
            switch (type) {
                case Types.Log: {
                    console.log(message);
                }
                    break;
                case Types.Info: {
                    console.info(message);
                }
                    break;
                case Types.Warning: {
                    console.warn(message);
                }
                    break;
                case Types.Error: {
                    console.error(message);
                }
                    break;
            }
        }
    }
}

export default Logger;