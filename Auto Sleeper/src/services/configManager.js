const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class ConfigManager {
    constructor() {
        this.configPath = path.join(app.getPath('userData'), 'config.json');
        this.defaultConfig = {
            targetApplications: [
                { name: 'Brave', process: 'brave.exe', enabled: true },
                { name: 'Discord', process: 'Discord.exe', enabled: true },
                { name: 'VS Code', process: 'Code.exe', enabled: true },
                { name: 'ChatGPT', process: 'ChatGPT.exe', enabled: true },
                { name: 'Claude', process: 'Claude.exe', enabled: true },
                { name: 'File Explorer', process: 'explorer.exe', enabled: true }
            ],
            defaultAction: 'Shutdown' // Restart, Sleep, Hibernate, Lock
        };
        this.loadConfig();
    }

    loadConfig() {
        try {
            if (!fs.existsSync(this.configPath)) {
                this.saveConfig(this.defaultConfig);
                this.config = this.defaultConfig;
            } else {
                const data = fs.readFileSync(this.configPath, 'utf8');
                this.config = JSON.parse(data);
                
                // Merge with default if new keys added
                let updated = false;
                for (const key of Object.keys(this.defaultConfig)) {
                    if (this.config[key] === undefined) {
                        this.config[key] = this.defaultConfig[key];
                        updated = true;
                    }
                }
                if (updated) this.saveConfig(this.config);
            }
        } catch (error) {
            console.error('Error loading config:', error);
            this.config = this.defaultConfig;
        }
    }

    saveConfig(config) {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(config, null, 4));
            this.config = config;
        } catch (error) {
            console.error('Error saving config:', error);
        }
    }

    getConfig() {
        return this.config;
    }

    updateConfig(newConfig) {
        this.saveConfig({ ...this.config, ...newConfig });
    }
}

module.exports = new ConfigManager();
