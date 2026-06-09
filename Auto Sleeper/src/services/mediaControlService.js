const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class MediaControlService {
    async pauseMedia() {
        console.log('Attempting to pause media...');
        
        // We use PowerShell with embedded C# to call the Windows API directly.
        // 0xB3 is the virtual key code for Media Play/Pause.
        const psCommand = `
            Add-Type -TypeDefinition @"
            using System;
            using System.Runtime.InteropServices;
            public class Keyboard {
                [DllImport("user32.dll", SetLastError = true)]
                public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
                public static void MediaPlayPause() {
                    keybd_event(0xB3, 0, 0, UIntPtr.Zero);
                    keybd_event(0xB3, 0, 2, UIntPtr.Zero);
                }
            }
"@
            [Keyboard]::MediaPlayPause()
        `;
        
        try {
            await execPromise(`powershell -command "${psCommand.replace(/\n/g, '; ')}"`);
        } catch (error) {
            console.error('Failed to send media key via PowerShell:', error);
        }
    }
}

module.exports = new MediaControlService();
