const { EventEmitter } = require('events');
const notificationService = require('./notificationService');
const mediaControlService = require('./mediaControlService');
const processManagerService = require('./processManagerService');
const systemActionService = require('./systemActionService');

class TimerService extends EventEmitter {
    constructor() {
        super();
        this.timer = null;
        this.remainingSeconds = 0;
        this.isTestMode = false;
        this.config = null;
    }

    start(durationSeconds, config, isTestMode = false) {
        if (this.timer) {
            this.stop();
        }

        this.remainingSeconds = durationSeconds;
        this.config = config;
        this.isTestMode = isTestMode;
        
        this.emit('tick', this.remainingSeconds);

        this.timer = setInterval(async () => {
            this.remainingSeconds--;
            
            // Notifications at specific intervals
            if (this.remainingSeconds === 5 * 60) {
                notificationService.showNotification('Auto Sleeper', '5 minutes remaining before shutdown sequence.');
            } else if (this.remainingSeconds === 60) {
                notificationService.showNotification('Auto Sleeper', '1 minute remaining before shutdown sequence.');
            }

            this.emit('tick', this.remainingSeconds);

            if (this.remainingSeconds <= 0) {
                this.stop();
                await this.executeSequence();
            }
        }, 1000);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            this.emit('stopped');
        }
    }

    async executeSequence() {
        this.emit('executing', 'Pausing Media...');
        await mediaControlService.pauseMedia();

        // Short delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        this.emit('executing', 'Closing Applications...');
        const results = await processManagerService.closeApplications(this.config.targetApplications);
        console.log('App closing results:', results);

        // Short delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (this.isTestMode) {
            notificationService.showNotification('Auto Sleeper - Test Mode', 'Sequence completed successfully. No system action executed.');
            this.emit('completed', 'Test mode finished successfully.');
            return;
        }

        this.emit('executing', `Executing System Action: ${this.config.defaultAction}...`);
        try {
            await systemActionService.executeAction(this.config.defaultAction);
            this.emit('completed', 'Action executed.');
        } catch (error) {
            this.emit('error', `Failed to execute action: ${error.message}`);
        }
    }
}

module.exports = new TimerService();
