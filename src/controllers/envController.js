const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '..', '.env');

exports.getEnv = (req, res) => {
    try {
        if (!fs.existsSync(envPath)) {
            return res.json([]);
        }
        const envString = fs.readFileSync(envPath, 'utf8');
        const lines = envString.split(/\r?\n/);
        const envVars = [];

        lines.forEach(line => {
            if (line.trim() && !line.startsWith('#')) {
                const [key, ...valueParts] = line.split('=');
                if (key) {
                    envVars.push({ key: key.trim(), value: valueParts.join('=').trim() });
                }
            }
        });
        res.json(envVars);
    } catch (err) {
        res.status(500).json({ message: 'Error reading .env file', error: err.message });
    }
};

exports.updateEnv = (req, res) => {
    const envVars = req.body;
    if (!Array.isArray(envVars)) {
        return res.status(400).json({ message: 'Expected an array of key/value objects' });
    }

    try {
        const envString = envVars.map(v => `${v.key}=${v.value}`).join('\n');
        fs.writeFileSync(envPath, envString, 'utf8');
        res.json({ message: '.env file updated successfully. Please restart server for changes to take effect.' });
    } catch (err) {
        res.status(500).json({ message: 'Error writing .env file', error: err.message });
    }
};
