import { Types } from './constants';
import { Modes } from '../constants';
var Logger = /** @class */ (function () {
    function Logger(mode) {
        this.mode = mode;
    }
    Logger.prototype.report = function (message, type) {
        if (this.mode === Modes.Development) {
            switch (type) {
                case Types.Log:
                    {
                        console.log(message);
                    }
                    break;
                case Types.Info:
                    {
                        console.info(message);
                    }
                    break;
                case Types.Warning:
                    {
                        console.warn(message);
                    }
                    break;
                case Types.Error:
                    {
                        console.error(message);
                    }
                    break;
            }
        }
    };
    return Logger;
}());
export default Logger;
//# sourceMappingURL=index.js.map