const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const http = require('http');
const https = require('https');

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

// Helper function to check if a URL is online
async function checkUrlStatus(url) {
    if (!url || url.trim() === '') {
        return false;
    }

    return new Promise((resolve) => {
        try {
            const urlObj = new URL(url);
            const protocol = urlObj.protocol === 'https:' ? https : http;
            
            const options = {
                method: 'HEAD',
                timeout: 3000,
                headers: {
                    'User-Agent': 'Server-Dashboard-Status-Checker'
                }
            };

            const req = protocol.request(url, options, (res) => {
                resolve(res.statusCode >= 200 && res.statusCode < 500);
            });

            req.on('error', () => resolve(false));
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });

            req.end();
        } catch (error) {
            resolve(false);
        }
    });
}

// Check status of a single server
app.get('/api/servers/:id/status', async (req, res) => {
    try {
        const data = await readData();
        const server = data.servers.find(s => s.id === req.params.id);
        
        if (!server) {
            return res.status(404).json({ error: 'Server not found' });
        }

        const [urlStatus, localIpStatus] = await Promise.all([
            checkUrlStatus(server.url),
            checkUrlStatus(server.localIp.startsWith('http') ? server.localIp : `http://${server.localIp}`)
        ]);

        res.json({
            id: server.id,
            urlStatus,
            localIpStatus
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check status' });
    }
});

// Check status of all servers
app.get('/api/servers/status/all', async (req, res) => {
    try {
        const data = await readData();
        const statusChecks = await Promise.all(
            data.servers.map(async (server) => {
                const [urlStatus, localIpStatus] = await Promise.all([
                    checkUrlStatus(server.url),
                    checkUrlStatus(server.localIp.startsWith('http') ? server.localIp : `http://${server.localIp}`)
                ]);

                return {
                    id: server.id,
                    urlStatus,
                    localIpStatus
                };
            })
        );

        res.json({ statuses: statusChecks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check statuses' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server Dashboard running at http://localhost:${PORT}`);
    console.log(`📊 Access your dashboard at http://localhost:${PORT}/index.html`);
});

