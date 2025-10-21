const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

// Helper function to read data
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, create it with empty servers array
        const defaultData = { servers: [] };
        await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
}

// Helper function to write data
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// API Routes

// Get all servers
app.get('/api/servers', async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read servers' });
    }
});

// Add a new server
app.post('/api/servers', async (req, res) => {
    try {
        const data = await readData();
        const newServer = {
            id: Date.now().toString(),
            title: req.body.title || '',
            url: req.body.url || '',
            localIp: req.body.localIp || '',
            sshIp: req.body.sshIp || '',
            username: req.body.username || '',
            description: req.body.description || ''
        };
        
        data.servers.push(newServer);
        await writeData(data);
        res.json({ success: true, server: newServer });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add server' });
    }
});

// Update a server
app.put('/api/servers/:id', async (req, res) => {
    try {
        const data = await readData();
        const serverIndex = data.servers.findIndex(s => s.id === req.params.id);
        
        if (serverIndex === -1) {
            return res.status(404).json({ error: 'Server not found' });
        }
        
        data.servers[serverIndex] = {
            id: req.params.id,
            title: req.body.title || '',
            url: req.body.url || '',
            localIp: req.body.localIp || '',
            sshIp: req.body.sshIp || '',
            username: req.body.username || '',
            description: req.body.description || ''
        };
        
        await writeData(data);
        res.json({ success: true, server: data.servers[serverIndex] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update server' });
    }
});

// Delete a server
app.delete('/api/servers/:id', async (req, res) => {
    try {
        const data = await readData();
        const serverIndex = data.servers.findIndex(s => s.id === req.params.id);
        
        if (serverIndex === -1) {
            return res.status(404).json({ error: 'Server not found' });
        }
        
        data.servers.splice(serverIndex, 1);
        await writeData(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete server' });
    }
});

// Reorder servers
app.post('/api/servers/reorder', async (req, res) => {
    try {
        const { servers } = req.body;
        
        if (!servers || !Array.isArray(servers)) {
            return res.status(400).json({ error: 'Invalid servers array' });
        }
        
        const data = { servers };
        await writeData(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reorder servers' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server Dashboard running at http://localhost:${PORT}`);
    console.log(`📊 Access your dashboard at http://localhost:${PORT}/index.html`);
});

