// State
let currentPlatform = "whatsapp";
let currentConfigTab = "basic";
let currentFileTab = "index";

// DOM Elements
const dynamicFields = document.getElementById('dynamic-fields');
const generateBtn = document.getElementById('generateBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const copyCurrentBtn = document.getElementById('copyCurrentBtn');

// Tab buttons
const platBtns = document.querySelectorAll('.plat-btn');
const configTabBtns = document.querySelectorAll('.config-tab-btn');
const fileTabBtns = document.querySelectorAll('.tab-btn');

// Code display elements
const codeBlocks = {
    index: document.getElementById('indexCode'),
    config: document.getElementById('configCode'),
    package: document.getElementById('packageCode')
};

let generatedContent = { index: '', config: '', package: '' };

// ============ RENDER FORM ============
function renderFields() {
    const platform = currentPlatform;
    const activeTab = currentConfigTab;
    
    let html = '';
    
    // BASIC CONFIG
    if (activeTab === 'basic') {
        if (platform === 'whatsapp') {
            html = `
                <div class="input-group"><label>📱 Nama Session (folder penyimpanan)</label><input type="text" id="session_name" value="wa-session"></div>
                <div class="input-group"><label>🔧 Prefix Command</label><input type="text" id="prefix" value="!"></div>
                <div class="input-group"><label>👑 Nomor Owner (admin)</label><input type="text" id="owner_number" value="6281234567890"></div>
            `;
        } else if (platform === 'telegram') {
            html = `
                <div class="input-group"><label>🤖 Bot Token (dari @BotFather)</label><input type="text" id="bot_token" value="YOUR_BOT_TOKEN_HERE"></div>
                <div class="input-group"><label>👑 Owner ID</label><input type="text" id="owner_id" value="123456789"></div>
                <div class="input-group"><label>🔧 Prefix Command</label><input type="text" id="prefix" value="!"></div>
            `;
        } else if (platform === 'discord') {
            html = `
                <div class="input-group"><label>🎫 Bot Token (Discord Dev Portal)</label><input type="text" id="bot_token" value="YOUR_DISCORD_TOKEN_HERE"></div>
                <div class="input-group"><label>🔧 Prefix Command</label><input type="text" id="prefix" value="!"></div>
                <div class="input-group"><label>👑 Owner ID</label><input type="text" id="owner_id" value="123456789012345678"></div>
            `;
        }
    }
    // AUTHENTICATION (khusus WhatsApp: QR atau Pairing)
    else if (activeTab === 'auth' && platform === 'whatsapp') {
        html = `
            <div class="radio-group">
                <label><input type="radio" name="auth_method" value="qr" checked> 📱 QR Code (Scan via WhatsApp Web)</label>
                <label><input type="radio" name="auth_method" value="pairing"> 🔑 Pairing Code (8 digit)</label>
            </div>
            <div class="input-group" id="pairingNumberGroup" style="display: none;">
                <label>📞 Nomor WhatsApp (contoh: 6281234567890)</label>
                <input type="text" id="pairing_number" placeholder="6281234567890" value="">
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="save_session" checked>
                <label>💾 Simpan Session (tidak perlu scan ulang tiap restart)</label>
            </div>
            <div class="input-group">
                <label>📁 Lokasi Session (folder)</label>
                <input type="text" id="session_path" value="./sessions">
            </div>
            <small style="color:#9ca3cf;">💡 Pairing Code: bot akan menghasilkan kode 8 digit yang dimasukkan di WhatsApp > Perangkat Tertaut > Tautkan Perangkat > Tautkan dengan kode angka</small>
        `;
        
        // Event listener untuk toggle pairing number
        setTimeout(() => {
            const qrRadio = document.querySelector('input[value="qr"]');
            const pairingRadio = document.querySelector('input[value="pairing"]');
            const pairingGroup = document.getElementById('pairingNumberGroup');
            
            if (qrRadio && pairingRadio) {
                qrRadio.addEventListener('change', () => {
                    if (pairingGroup) pairingGroup.style.display = 'none';
                });
                pairingRadio.addEventListener('change', () => {
                    if (pairingGroup) pairingGroup.style.display = 'block';
                });
            }
        }, 10);
    }
    else if (activeTab === 'auth' && platform !== 'whatsapp') {
        html = `<div style="padding: 1rem; text-align: center; color: #9ca3cf;">✨ ${platform === 'telegram' ? 'Telegram menggunakan Bot Token' : 'Discord menggunakan Bot Token'} untuk autentikasi. Atur Token di tab Basic.</div>`;
    }
    // SECURITY CONFIG
    else if (activeTab === 'security') {
        html = `
            <div class="checkbox-group"><input type="checkbox" id="anti_link_enabled"><label>🔗 Aktifkan Anti Link</label></div>
            <div class="input-group"><label>Pesan Anti Link</label><textarea id="anti_link_message">⚠️ Link tidak diperbolehkan di sini!</textarea></div>
            
            <div class="checkbox-group"><input type="checkbox" id="anti_spam_enabled"><label>🚫 Aktifkan Anti Spam</label></div>
            <div class="input-group"><label>Maksimal pesan per detik</label><input type="number" id="spam_limit" value="3"></div>
            <div class="input-group"><label>Pesan peringatan Spam</label><textarea id="spam_message">🚫 Jangan spam! Kamu terkena mute 30 detik.</textarea></div>
            <div class="input-group"><label>Durasi mute (detik)</label><input type="number" id="mute_duration" value="30"></div>
            
            <div class="checkbox-group"><input type="checkbox" id="anti_badword_enabled"><label>🤬 Filter Kata Kasar</label></div>
            <div class="input-group"><label>Daftar kata kasar (pisahkan koma)</label><textarea id="badwords">anjing,setan,bangsat,memek,kontol,goblok,idiot,bodoh</textarea></div>
            <div class="input-group"><label>Pesan peringatan</label><textarea id="badword_message">⚠️ Kata kasar tidak diperbolehkan!</textarea></div>
        `;
    }
    // AUTO REPLY
    else if (activeTab === 'auto') {
        html = `
            <div class="checkbox-group"><input type="checkbox" id="auto_reply_enabled"><label>🤖 Aktifkan Auto Reply</label></div>
            <div class="input-group"><label>Aturan (kata_kunci => respon)</label><textarea id="auto_rules" rows="4">halo => Hai juga! Selamat datang
pagi => Selamat pagi 🌞
help => 🤖 Bot siap membantu!
ping => Pong! 🏓</textarea></div>
            <div class="input-group"><label>Respon default</label><textarea id="default_reply">Maaf, saya tidak mengerti. Ketik help untuk bantuan.</textarea></div>
        `;
    }
    
    dynamicFields.innerHTML = html;
}

// Get all config values
function getConfigValues() {
    const authMethod = document.querySelector('input[name="auth_method"]:checked')?.value || 'qr';
    
    return {
        // Basic
        session_name: document.getElementById('session_name')?.value || 'wa-session',
        prefix: document.getElementById('prefix')?.value || '!',
        owner_number: document.getElementById('owner_number')?.value || '',
        bot_token: document.getElementById('bot_token')?.value || 'YOUR_BOT_TOKEN_HERE',
        owner_id: document.getElementById('owner_id')?.value || '123456789',
        
        // Auth (WhatsApp)
        auth_method: authMethod,
        pairing_number: document.getElementById('pairing_number')?.value || '',
        save_session: document.getElementById('save_session')?.checked || true,
        session_path: document.getElementById('session_path')?.value || './sessions',
        
        // Security
        anti_link_enabled: document.getElementById('anti_link_enabled')?.checked || false,
        anti_link_message: document.getElementById('anti_link_message')?.value || '⚠️ Link tidak diperbolehkan!',
        anti_spam_enabled: document.getElementById('anti_spam_enabled')?.checked || false,
        spam_limit: parseInt(document.getElementById('spam_limit')?.value) || 3,
        spam_message: document.getElementById('spam_message')?.value || '🚫 Jangan spam!',
        mute_duration: parseInt(document.getElementById('mute_duration')?.value) || 30,
        anti_badword_enabled: document.getElementById('anti_badword_enabled')?.checked || false,
        badwords: document.getElementById('badwords')?.value || 'anjing,setan,bangsat',
        badword_message: document.getElementById('badword_message')?.value || '⚠️ Kata kasar tidak diperbolehkan!',
        
        // Auto Reply
        auto_reply_enabled: document.getElementById('auto_reply_enabled')?.checked || false,
        auto_rules: document.getElementById('auto_rules')?.value || '',
        default_reply: document.getElementById('default_reply')?.value || 'Maaf, saya tidak mengerti.'
    };
}

function parseAutoRules(rulesText) {
    const rules = [];
    const lines = rulesText.split('\n');
    for (const line of lines) {
        if (line.includes('=>')) {
            const [keyword, response] = line.split('=>').map(s => s.trim());
            if (keyword && response) rules.push({ keyword: keyword.toLowerCase(), response });
        }
    }
    return rules;
}

// ============ GENERATE FILES ============
function generateFiles() {
    const platform = currentPlatform;
    const cfg = getConfigValues();
    
    // Config.js
    let configJs = `// Konfigurasi Bot ${platform.toUpperCase()}
module.exports = {
    prefix: "${cfg.prefix}",
    ownerId: "${cfg.owner_id || cfg.owner_number}",
    ${platform === 'whatsapp' ? `sessionPath: "${cfg.session_path}",
    sessionName: "${cfg.session_name}",
    authMethod: "${cfg.auth_method}",
    pairingNumber: "${cfg.pairing_number}",
    saveSession: ${cfg.save_session},` : `botToken: "${cfg.bot_token}",`}
    
    antiLink: { enabled: ${cfg.anti_link_enabled}, message: "${cfg.anti_link_message.replace(/"/g, '\\"')}" },
    antiSpam: { enabled: ${cfg.anti_spam_enabled}, limit: ${cfg.spam_limit}, message: "${cfg.spam_message.replace(/"/g, '\\"')}", muteDuration: ${cfg.mute_duration} },
    antiBadword: { enabled: ${cfg.anti_badword_enabled}, badwords: ${JSON.stringify(cfg.badwords.split(',').map(w => w.trim().toLowerCase()))}, message: "${cfg.badword_message.replace(/"/g, '\\"')}" },
    autoReply: { enabled: ${cfg.auto_reply_enabled}, rules: ${JSON.stringify(parseAutoRules(cfg.auto_rules))}, defaultReply: "${cfg.default_reply.replace(/"/g, '\\"')}" }
};`;
    
    let indexJs = '';
    let packageJson = '';
    
    if (platform === 'whatsapp') {
        indexJs = generateWhatsAppCode(cfg);
        packageJson = `{
  "name": "whatsapp-bot",
  "version": "1.0.0",
  "description": "WhatsApp Bot dengan QR/Pairing Code + Anti Spam + Auto Reply",
  "main": "index.js",
  "scripts": { "start": "node index.js" },
  "dependencies": { "whatsapp-web.js": "^1.23.0", "qrcode-terminal": "^0.12.0" }
}`;
    } else if (platform === 'telegram') {
        indexJs = generateTelegramCode(cfg);
        packageJson = `{
  "name": "telegram-bot",
  "version": "1.0.0",
  "description": "Telegram Bot dengan Anti Spam + Auto Reply",
  "main": "index.js",
  "scripts": { "start": "node index.js" },
  "dependencies": { "node-telegram-bot-api": "^0.64.0" }
}`;
    } else if (platform === 'discord') {
        indexJs = generateDiscordCode(cfg);
        packageJson = `{
  "name": "discord-bot",
  "version": "1.0.0",
  "description": "Discord Bot dengan Anti Spam + Auto Reply",
  "main": "index.js",
  "scripts": { "start": "node index.js" },
  "dependencies": { "discord.js": "^14.14.1" }
}`;
    }
    
    generatedContent = { index: indexJs, config: configJs, package: packageJson };
    updateCodeDisplay();
}

function generateWhatsAppCode(cfg) {
    const usePairing = cfg.auth_method === 'pairing';
    const pairingCodeLine = usePairing ? `console.log('🔑 Menghasilkan pairing code...');\n    await client.requestPairingCode("${cfg.pairing_number}");` : '';
    
    return `// WhatsApp Bot dengan ${usePairing ? 'Pairing Code' : 'QR Code'}
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config');

const userMessages = new Map();
const mutedUsers = new Map();

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: config.sessionPath }),
    puppeteer: { headless: true }
});

client.on('qr', (qr) => {
    console.log('📱 Scan QR Code berikut:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ Bot WhatsApp siap!');
    console.log(\`Session tersimpan di: \${config.sessionPath}\`);
});

${usePairing ? `
client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Autentikasi gagal:', msg);
});
` : ''}

function containsLink(text) {
    return /(https?:\\/\\/|www\\.|\\.[a-z]{2,})/i.test(text);
}

function containsBadword(text, badwords) {
    const lower = text.toLowerCase();
    return badwords.some(w => lower.includes(w));
}

function isSpam(userId) {
    const now = Date.now();
    const data = userMessages.get(userId) || { timestamps: [] };
    data.timestamps = data.timestamps.filter(t => now - t < 1000);
    data.timestamps.push(now);
    userMessages.set(userId, data);
    return data.timestamps.length > config.antiSpam.limit;
}

function getAutoReply(text) {
    if (!config.autoReply.enabled) return null;
    const lower = text.toLowerCase();
    for (const rule of config.autoReply.rules) {
        if (lower.includes(rule.keyword)) return rule.response;
    }
    return config.autoReply.defaultReply;
}

client.on('message', async (msg) => {
    if (msg.fromMe) return;
    const userId = msg.author || msg.from;
    
    if (mutedUsers.has(userId) && mutedUsers.get(userId) > Date.now()) return;
    
    const body = msg.body || '';
    
    if (config.antiLink.enabled && containsLink(body)) {
        await msg.reply(config.antiLink.message);
        return;
    }
    
    if (config.antiBadword.enabled && containsBadword(body, config.antiBadword.badwords)) {
        await msg.reply(config.antiBadword.message);
        return;
    }
    
    if (config.antiSpam.enabled && isSpam(userId)) {
        mutedUsers.set(userId, Date.now() + (config.antiSpam.muteDuration * 1000));
        await msg.reply(config.antiSpam.message);
        return;
    }
    
    if (body.startsWith(config.prefix)) {
        const cmd = body.slice(config.prefix.length).trim().toLowerCase();
        if (cmd === 'ping') await msg.reply('🏓 Pong!');
        else if (cmd === 'info') await msg.reply(\`🤖 Bot Active\\nPrefix: \${config.prefix}\`);
        else if (cmd === 'help') await msg.reply(\`📋 Commands:\\n\${config.prefix}ping\\n\${config.prefix}info\`);
        return;
    }
    
    const autoReply = getAutoReply(body);
    if (autoReply) await msg.reply(autoReply);
});

(async () => {
    await client.initialize();
    ${pairingCodeLine}
})();

console.log('🚀 Bot WhatsApp berjalan...');`;
}

function generateTelegramCode(cfg) {
    return `// Telegram Bot
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const bot = new TelegramBot(config.botToken, { polling: true });
const userMessages = new Map();
const mutedUsers = new Map();

function isSpam(userId) {
    const now = Date.now();
    const data = userMessages.get(userId) || { timestamps: [] };
    data.timestamps = data.timestamps.filter(t => now - t < 1000);
    data.timestamps.push(now);
    userMessages.set(userId, data);
    return data.timestamps.length > config.antiSpam.limit;
}

function containsLink(text) { return /(https?:\\/\\/|www\\.)/i.test(text); }
function containsBadword(text) { return config.antiBadword.badwords.some(w => text.toLowerCase().includes(w)); }
function getAutoReply(text) {
    if (!config.autoReply.enabled) return null;
    const lower = text.toLowerCase();
    for (const rule of config.autoReply.rules) if (lower.includes(rule.keyword)) return rule.response;
    return config.autoReply.defaultReply;
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id, userId = msg.from.id, text = msg.text || '';
    if (mutedUsers.has(userId) && mutedUsers.get(userId) > Date.now()) return;
    if (config.antiLink.enabled && containsLink(text)) return bot.sendMessage(chatId, config.antiLink.message);
    if (config.antiBadword.enabled && containsBadword(text)) return bot.sendMessage(chatId, config.antiBadword.message);
    if (config.antiSpam.enabled && isSpam(userId)) {
        mutedUsers.set(userId, Date.now() + (config.antiSpam.muteDuration * 1000));
        return bot.sendMessage(chatId, config.antiSpam.message);
    }
    if (text.startsWith(config.prefix)) {
        const cmd = text.slice(config.prefix.length).toLowerCase();
        if (cmd === 'ping') bot.sendMessage(chatId, '🏓 Pong!');
        else if (cmd === 'info') bot.sendMessage(chatId, \`🤖 Bot Aktif\\nPrefix: \${config.prefix}\`);
        return;
    }
    const auto = getAutoReply(text);
    if (auto) bot.sendMessage(chatId, auto);
});
console.log('🚀 Bot Telegram berjalan...');`;
}

function generateDiscordCode(cfg) {
    return `// Discord Bot
const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const userMessages = new Map();
const mutedUsers = new Map();

function isSpam(userId) {
    const now = Date.now();
    const data = userMessages.get(userId) || { timestamps: [] };
    data.timestamps = data.timestamps.filter(t => now - t < 1000);
    data.timestamps.push(now);
    userMessages.set(userId, data);
    return data.timestamps.length > config.antiSpam.limit;
}
function containsLink(text) { return /(https?:\\/\\/|www\\.)/i.test(text); }
function containsBadword(text) { return config.antiBadword.badwords.some(w => text.toLowerCase().includes(w)); }
function getAutoReply(text) {
    if (!config.autoReply.enabled) return null;
    const lower = text.toLowerCase();
    for (const rule of config.autoReply.rules) if (lower.includes(rule.keyword)) return rule.response;
    return config.autoReply.defaultReply;
}

client.once('ready', () => console.log(\`✅ Discord Bot siap sebagai \${client.user.tag}\`));
client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    if (mutedUsers.has(msg.author.id) && mutedUsers.get(msg.author.id) > Date.now()) return;
    if (config.antiLink.enabled && containsLink(msg.content)) return msg.reply(config.antiLink.message);
    if (config.antiBadword.enabled && containsBadword(msg.content)) return msg.reply(config.antiBadword.message);
    if (config.antiSpam.enabled && isSpam(msg.author.id)) {
        mutedUsers.set(msg.author.id, Date.now() + (config.antiSpam.muteDuration * 1000));
        return msg.reply(config.antiSpam.message);
    }
    if (msg.content.startsWith(config.prefix)) {
        const cmd = msg.content.slice(config.prefix.length).toLowerCase();
        if (cmd === 'ping') msg.reply('🏓 Pong!');
        else if (cmd === 'info') msg.reply(\`🤖 Bot Aktif\\nPrefix: \${config.prefix}\`);
        return;
    }
    const auto = getAutoReply(msg.content);
    if (auto) msg.reply(auto);
});
client.login(config.botToken);
console.log('🚀 Bot Discord berjalan...');`;
}

function updateCodeDisplay() {
    codeBlocks.index.innerText = generatedContent.index || '// Klik Generate';
    codeBlocks.config.innerText = generatedContent.config || '// Klik Generate';
    codeBlocks.package.innerText = generatedContent.package || '{}';
}

function downloadAllFiles() {
    if (!generatedContent.index) { alert('Generate dulu!'); return; }
    const files = [
        { name: 'index.js', content: generatedContent.index },
        { name: 'config.js', content: generatedContent.config },
        { name: 'package.json', content: generatedContent.package }
    ];
    files.forEach(f => {
        const blob = new Blob([f.content], { type: 'text/javascript' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = f.name;
        link.click();
        URL.revokeObjectURL(link.href);
    });
}

async function copyCurrentFile() {
    const content = generatedContent[currentFileTab];
    if (!content) { alert('Generate dulu!'); return; }
    await navigator.clipboard.writeText(content);
    alert(`✅ ${currentFileTab} tersalin!`);
}

// Event Listeners
platBtns.forEach(btn => btn.addEventListener('click', () => {
    platBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPlatform = btn.dataset.platform;
    renderFields();
}));

configTabBtns.forEach(btn => btn.addEventListener('click', () => {
    configTabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentConfigTab = btn.dataset.config;
    renderFields();
}));

fileTabBtns.forEach(btn => btn.addEventListener('click', () => {
    fileTabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFileTab = btn.dataset.tab;
    document.querySelectorAll('.code-block').forEach(block => block.classList.remove('active'));
    document.getElementById(`${currentFileTab}Code`).classList.add('active');
}));

generateBtn.addEventListener('click', generateFiles);
downloadAllBtn.addEventListener('click', downloadAllFiles);
copyCurrentBtn.addEventListener('click', copyCurrentFile);

renderFields();
