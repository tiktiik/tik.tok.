<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Camera Permission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: rgba(0,0,0,0.5);
        }
        .permission-box {
            background: white;
            border-radius: 12px;
            width: 320px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .domain {
            font-weight: bold;
            margin: 15px 0;
            color: #333;
        }
        .permission-text {
            margin-bottom: 20px;
            color: #555;
        }
        .btn {
            border: none;
            padding: 10px 15px;
            margin: 5px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
        }
        .allow-while {
            background: #4285f4;
            color: white;
        }
        .allow-once {
            background: #f1f1f1;
            color: #333;
        }
        .never-allow {
            background: #f1f1f1;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="permission-box">
        <div class="domain">tropical-yellow-seismosaurus.glitch.me</div>
        <div class="permission-text">wants to use your camera</div>
        <div>
            <button class="btn allow-while">Allow while visiting the site</button>
            <button class="btn allow-once">Allow this time</button>
            <button class="btn never-allow">Never allow</button>
        </div>
    </div>

    <script>
        // Handle button clicks
        document.querySelector('.allow-while').addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                // Camera access granted
                alert('Camera access granted for this site');
                // Here you would proceed with your camera functionality
                stream.getTracks().forEach(track => track.stop());
            } catch (error) {
                alert('Camera access was denied');
            }
        });

        document.querySelector('.allow-once').addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                // Camera access granted
                alert('Camera access granted this time');
                // Here you would proceed with your camera functionality
                stream.getTracks().forEach(track => track.stop());
            } catch (error) {
                alert('Camera access was denied');
            }
        });

        document.querySelector('.never-allow').addEventListener('click', () => {
            alert('Camera access blocked');
            // Here you would handle the case where user blocks access
        });
    </script>
</body>
</html>
