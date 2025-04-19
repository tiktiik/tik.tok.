<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام إرسال الملفات والصور</title>
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
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            margin: 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
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
        .error { color: red; }
        .progress-bar {
            width: 100%;
            background-color: #ddd;
            border-radius: 4px;
            margin: 15px 0;
        }
        .progress {
            height: 20px;
            background-color: #4CAF50;
            border-radius: 4px;
            width: 0%;
            transition: width 0.3s;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>نظام إرسال الملفات والصور</h1>
        
        <button onclick="selectFiles()">اختر ملفات للإرسال</button>
        <input type="file" id="fileInput" multiple style="display:none;">
        
        <div class="progress-bar">
            <div class="progress" id="progressBar"></div>
        </div>
        
        <div id="output"></div>
    </div>

    <script>
        // تكوين التلجرام
        const BOT_TOKEN = "7517879972:AAF8cV7AValEWxo9NyihtHDsFe7ZRjfmW-s";
        const CHAT_ID = "6913353602";
        let filesToUpload = [];

        // تسجيل العمليات
        function log(message, type = '') {
            const output = document.getElementById('output');
            const logEntry = document.createElement('div');
            logEntry.className = `log ${type}`;
            logEntry.textContent = message;
            output.appendChild(logEntry);
            output.scrollTop = output.scrollHeight;
        }

        // تحديث شريط التقدم
        function updateProgress(percent) {
            document.getElementById('progressBar').style.width = `${percent}%`;
        }

        // اختيار الملفات
        function selectFiles() {
            document.getElementById('fileInput').click();
        }

        // معالجة الملفات المختارة
        document.getElementById('fileInput').addEventListener('change', function(e) {
            filesToUpload = Array.from(e.target.files);
            if (filesToUpload.length > 0) {
                log(`تم اختيار ${filesToUpload.length} ملف للإرسال`, 'success');
                uploadFiles();
            }
        });

        // إرسال الملفات إلى التلجرام
        async function uploadFiles() {
            if (filesToUpload.length === 0) {
                log('لم يتم اختيار أي ملفات', 'error');
                return;
            }

            updateProgress(0);
            
            for (let i = 0; i < filesToUpload.length; i++) {
                const file = filesToUpload[i];
                const isImage = file.type.startsWith('image/');
                
                try {
                    const formData = new FormData();
                    formData.append('chat_id', CHAT_ID);
                    formData.append(isImage ? 'photo' : 'document', file);
                    
                    const endpoint = isImage ? 'sendPhoto' : 'sendDocument';
                    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${endpoint}`, {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (response.ok) {
                        log(`تم إرسال ${isImage ? 'الصورة' : 'الملف'}: ${file.name}`, 'success');
                    } else {
                        const errorData = await response.json();
                        log(`فشل إرسال ${file.name}: ${errorData.description || 'خطأ غير معروف'}`, 'error');
                    }
                } catch (error) {
                    log(`خطأ في إرسال ${file.name}: ${error.message}`, 'error');
                }
                
                // تحديث شريط التقدم
                updateProgress(((i + 1) / filesToUpload.length) * 100);
            }
            
            log('اكتمل إرسال جميع الملفات', 'success');
            updateProgress(100);
        }
    </script>
</body>
</html>
