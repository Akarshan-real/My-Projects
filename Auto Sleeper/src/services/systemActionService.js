const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class SystemActionService {
    async executeAction(action) {
        try {
            console.log(`Executing system action: ${action}`);
            switch (action.toLowerCase()) {
                case 'shutdown':
                    await execPromise('shutdown /s /t 0 /f');
                    break;
                case 'restart':
                    await execPromise('shutdown /r /t 0 /f');
                    break;
                case 'sleep':
                    await execPromise('rundll32.exe powrprof.dll,SetSuspendState 0,1,0');
                    break;
                case 'hibernate':
                    await execPromise('rundll32.exe powrprof.dll,SetSuspendState 1,1,0');
                    break;
                case 'lock':
                    await execPromise('rundll32.exe user32.dll,LockWorkStation');
                    break;
                default:
                    throw new Error(`Unknown action: ${action}`);
            }
        } catch (error) {
            console.error(`Failed to execute system action ${action}:`, error);
            throw error;
        }
    }
}

module.exports = new SystemActionService();
