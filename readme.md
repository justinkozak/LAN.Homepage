# Server Dashboard

A modern, aesthetic offline server management dashboard with a dark purple and grey color scheme, powered by Node.js and Express.

## Features

- 🎨 Modern, tech-inspired design with dark purple/grey theme
- 📋 Display server tiles with all essential information
- 🔗 Click-to-copy functionality for IPs and usernames
- 🚀 Quick "Go" buttons to open servers in browser
- ➕ Add new server entries (automatically saved)
- ✏️ Edit and delete existing servers (automatically saved)
- 🔄 Drag-and-drop to reorder servers (automatically saved)
- 💾 JSON-based data storage with automatic persistence
- 🖥️ Node.js backend for reliable data management

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Setup

1. **Download all project files** to a directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage

### Starting the Server

Run the server with:
```bash
npm start
```

Or for development with auto-restart on file changes:
```bash
npm run dev
```

The server will start on **http://localhost:3000**

### Accessing the Dashboard

Once the server is running, open your browser and go to:
```
http://localhost:3000/index.html
```

Or simply:
```
http://localhost:3000
```

### Managing Servers

#### Viewing Servers
The homepage displays all configured servers as tiles with:
- Server title
- URL/alias with copy and go buttons
- Local IP address with copy and go buttons
- SSH IP with copy and SSH command copy
- Admin username with copy button
- Brief description

#### Adding Servers
1. Click "**+ Add Server**" in the bottom right corner
2. Fill out the form (only **title** is required)
3. Click "Add Server"
4. You'll be automatically redirected to the homepage
5. Your new server will appear immediately!

#### Editing Servers
1. Click "**Manage**" in the bottom right corner
2. Click the edit (pencil) icon next to any server
3. Modify the information in the modal
4. Click "Save Changes"
5. Changes are saved automatically!

#### Deleting Servers
1. Click "**Manage**" in the bottom right corner
2. Click the delete (trash) icon next to any server
3. Confirm the deletion
4. Server is removed immediately!

#### Reordering Servers
1. Click "**Manage**" in the bottom right corner
2. Drag any server entry by the handle (three lines icon) on the left
3. Drop it in the desired position
4. Order is saved automatically and reflected everywhere!

## Project Structure

```
lan.homepage/
├── server.js           # Node.js Express server
├── package.json        # Node.js dependencies
├── data.json          # JSON data storage (auto-created)
├── index.html         # Main dashboard page
├── add.html           # Add server page
├── manage.html        # Manage servers page
├── styles.css         # All styling
├── script.js          # Shared JavaScript utilities
└── README.md          # This file
```

## API Endpoints

The server provides the following REST API endpoints:

- `GET /api/servers` - Get all servers
- `POST /api/servers` - Add a new server
- `PUT /api/servers/:id` - Update a server
- `DELETE /api/servers/:id` - Delete a server
- `POST /api/servers/reorder` - Reorder servers (drag-and-drop)

## Data Format

The `data.json` file stores all server information:

```json
{
  "servers": [
    {
      "id": "unique_timestamp",
      "title": "Server Name",
      "url": "https://example.com",
      "localIp": "192.168.1.100:8080",
      "sshIp": "192.168.1.100",
      "username": "admin",
      "description": "Server description"
    }
  ]
}
```

**Note**: The `data.json` file is automatically created when you start the server if it doesn't exist. All changes through the web interface are automatically saved to this file.

## Customization

### Changing the Port
Edit `server.js` and change the `PORT` constant:
```javascript
const PORT = 3000; // Change to your preferred port
```

### Colors
Edit `styles.css` and modify the CSS variables in `:root`:
```css
--bg-primary: #1a1625;
--accent-purple: #6b46c1;
/* etc. */
```

### Layout
Modify the grid columns in `styles.css`:
```css
.grid {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
}
```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Troubleshooting

### Server won't start
- Make sure you've run `npm install` first
- Check if port 3000 is already in use
- Try changing the PORT in `server.js`

### Changes aren't saving
- Make sure the server is running
- Check the browser console for errors
- Verify `data.json` has write permissions

### Can't access from other devices on LAN
Currently the server only listens on localhost. To access from other devices, modify `server.js`:
```javascript
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
```

## Running on Startup (Optional)

### Windows
Create a batch file `start-dashboard.bat`:
```batch
@echo off
cd /d "C:\path\to\lan.homepage"
npm start
```

### Linux/Mac
Add to your startup applications or create a systemd service.

## Dependencies

- **express**: Web framework for Node.js
- **body-parser**: Parse incoming request bodies
- **nodemon**: (dev) Auto-restart server on file changes

## License

ISC

---

Enjoy your server dashboard! 🚀
