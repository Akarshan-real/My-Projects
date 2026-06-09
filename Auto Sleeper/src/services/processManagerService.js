const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class ProcessManagerService {
    async closeApplications(applications) {
        const results = [];
        for (const app of applications) {
            if (!app.enabled) continue;
            
            try {
                console.log(`Attempting to close ${app.name} (${app.process})...`);
                // taskkill /IM process.exe 
                // /IM is image name. Using graceful termination to ensure apps close stably.
                const { stdout, stderr } = await execPromise(`taskkill /IM "${app.process}"`);
                results.push({ name: app.name, status: 'closed', detail: stdout.trim() });
            } catch (error) {
                // Taskkill returns an error if process is not found
                if (error.message.includes('not found') || error.message.includes('No tasks are running')) {
                    results.push({ name: app.name, status: 'already_closed' });
                } else {
                    console.error(`Failed to close ${app.name}:`, error.message);
                    results.push({ name: app.name, status: 'error', detail: error.message });
                }
            }
        }
        return results;
    }
}

module.exports = new ProcessManagerService();
