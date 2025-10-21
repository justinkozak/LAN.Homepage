# Server Status Indicators

## Overview
The dashboard now displays real-time online/offline status indicators for each server's URL and Local IP address. A small colored dot appears next to each field showing whether the server is reachable.

## Visual Indicators

### Status Colors
- **🟢 Green**: Server is online and responding
- **🔴 Red**: Server is offline or not responding
- **⚪ Grey**: Status is being checked (initial state)

### Display Location
Status indicators appear as small colored circles (●) positioned:
- To the left of the URL field
- To the left of the Local IP field

## How It Works

### Backend Status Checking
The server checks each URL/IP by making an HTTP HEAD request with:
- **Timeout**: 3 seconds per request
- **Protocol Support**: Both HTTP and HTTPS
- **Status Codes**: Accepts 200-499 as "online" (any response means the server is up)

### Frontend Updates
- **Initial Check**: Runs 500ms after page load
- **Auto-Refresh**: Every 30 seconds
- **Visual Feedback**: Smooth color transitions with subtle glow effect

## API Endpoints

### Check All Servers
```
GET /api/servers/status/all
```

**Response:**
```json
{
  "statuses": [
    {
      "id": "server_id",
      "urlStatus": true,
      "localIpStatus": false
    }
  ]
}
```

### Check Single Server
```
GET /api/servers/:id/status
```

**Response:**
```json
{
  "id": "server_id",
  "urlStatus": true,
  "localIpStatus": true
}
```

## Technical Details

### Status Check Logic
1. Empty or missing URLs are marked as offline
2. URLs are parsed to determine HTTP vs HTTPS protocol
3. HTTP HEAD request is sent (lightweight, doesn't download content)
4. Any HTTP status code 200-499 is considered "online"
5. Network errors or timeouts result in "offline" status

### Local IP Handling
- If the local IP doesn't start with `http://` or `https://`, `http://` is automatically prepended
- This allows you to enter either:
  - `192.168.1.100:8080`
  - `http://192.168.1.100:8080`

### Performance Considerations
- All status checks run in parallel using `Promise.all()`
- 3-second timeout prevents slow servers from hanging the dashboard
- Checks are non-blocking and won't freeze the UI
- Status updates happen smoothly with CSS transitions

## User Experience

### Tooltip Information
Hover over any status indicator to see:
- "Online" - Server is responding
- "Offline" - Server is not responding
- "Checking..." - Status is being determined

### Visual Effects
- **Glow Effect**: Online/offline indicators have a subtle glow
  - Green glow for online servers
  - Red glow for offline servers
- **Smooth Transitions**: Color changes animate over 0.3 seconds

## Customization

### Adjust Check Frequency
Edit `index.html` line where `setInterval` is called:
```javascript
setInterval(checkServerStatuses, 30000); // 30000 = 30 seconds
```

### Modify Timeout
Edit `server.js` in the `checkUrlStatus` function:
```javascript
const options = {
    method: 'HEAD',
    timeout: 3000, // 3000 = 3 seconds
    ...
};
```

### Change Indicator Colors
Edit `styles.css`:
```css
.status-indicator.online {
    color: #10b981; /* Green */
}

.status-indicator.offline {
    color: #ef4444; /* Red */
}
```

## Troubleshooting

### Indicator Always Shows Offline
- Verify the URL/IP is correct and includes the protocol (http:// or https://)
- Check if the server requires authentication (basic auth will fail the check)
- Ensure CORS is not blocking the request
- Check server firewall settings

### Slow Status Updates
- The initial check runs 500ms after page load
- Subsequent checks run every 30 seconds
- Manually refresh the page to trigger an immediate check

### Mixed Results
- It's normal for URL to be online and Local IP to be offline (or vice versa)
- This happens when:
  - The public URL is accessible but local network is different
  - Local server is running but public domain is down
  - Network routing or firewall rules differ between endpoints

## Browser Compatibility
Works on all modern browsers:
- Chrome/Edge ✓
- Firefox ✓
- Safari ✓
- Opera ✓

Requires JavaScript enabled to function.

