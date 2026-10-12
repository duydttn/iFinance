const si = require('systeminformation');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip');
const { spawn } = require('child_process');

module.exports = (SettingModel, config) => ({
    process: null,
    _starting: false,
    io: null,
    engineUrl: 'https://github.com/ggml-org/llama.cpp/releases/download/b8497/llama-b8497-bin-win-vulkan-x64.zip',
    modelUrl: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf',

    validateStoragePath(inputPath) {
        if (inputPath.includes('..')) throw new Error('ai_storage_path không được chứa ".."');
        const resolved = path.resolve(inputPath);
        if (!path.isAbsolute(resolved)) throw new Error('ai_storage_path phải là đường dẫn tuyệt đối');
        const lowerPath = resolved.toLowerCase().replace(/\\/g, '/');
        const blacklist = [
            'c:/windows', 'c:/program files', 'c:/programdata',
            '/etc', '/bin', '/usr', '/var', '/root', '/boot'
        ];

        for (const restricted of blacklist) {
            if (lowerPath.startsWith(restricted) || lowerPath === restricted) {
                throw new Error('ai_storage_path không được trỏ đến thư mục hệ thống');
            }
        }

        return resolved;
    },

    updatePaths() {
        let rootDir = path.join(__dirname, '../');
        try {
            const customPath = SettingModel.get('ai_storage_path');
            if (customPath) rootDir = this.validateStoragePath(customPath);
        } catch (e) {
            console.error('Invalid ai_storage_path, using default:', e.message);
        }

        const exeName = process.platform === 'win32' ? 'llama-server.exe' : 'llama-server';

        this.binDir = path.join(rootDir, 'bin');
        this.modelsDir = path.join(rootDir, 'models_bin');
        this.enginePath = path.join(this.binDir, exeName);
        this.modelPath = path.join(this.modelsDir, 'qwen2.5-1.5b-instruct-q4_k_m.gguf');

        if (!fs.existsSync(this.binDir)) fs.mkdirSync(this.binDir, { recursive: true });
        if (!fs.existsSync(this.modelsDir)) fs.mkdirSync(this.modelsDir, { recursive: true });
    },

    setSocket(io) {
        this.io = io;
    },

    async getSystemSpecs() {
        try {
            const [cpu, mem, graphics, disk] = await Promise.all([
                si.cpu(),
                si.mem(),
                si.graphics(),
                si.fsSize()
            ]);

            const gpus = graphics.controllers.filter(g =>
                !g.model.toLowerCase().includes('virtual') &&
                !g.vendor.toLowerCase().includes('microsoft')
            );

            const bestGpu = gpus.sort((a, b) => (b.vram || 0) - (a.vram || 0))[0] || graphics.controllers[0];
            const vram = bestGpu?.vram || 0;

            const customPath = SettingModel.get('ai_storage_path');
            const rootDir = customPath || path.join(__dirname, '../');
            const targetDrive = path.parse(path.resolve(rootDir)).root;

            const driveInfo = disk.find(d =>
                path.parse(path.resolve(d.mount)).root === targetDrive ||
                d.mount === targetDrive.replace(/\\$/, '')
            ) || disk[0];

            const freeDisk = driveInfo?.available || 0;

            return {
                cpu: `${cpu.manufacturer} ${cpu.brand}`,
                ram: `${(mem.total / 1024 / 1024 / 1024).toFixed(1)} GB`,
                gpu: bestGpu?.model || 'N/A',
                vram: `${(vram / 1024).toFixed(1)} GB`,
                freeDisk: `${(freeDisk / 1024 / 1024 / 1024).toFixed(1)} GB`,
                isGpuHealthy: vram > 2000,
                isRamHealthy: mem.total > 7 * 1024 * 1024 * 1024,
                isDiskHealthy: freeDisk > 10 * 1024 * 1024 * 1024
            };
        } catch (e) {
            console.error('System specs error:', e);
            return null;
        }
    },

    async downloadFile(url, dest, eventName) {
        const ALLOWED_DOMAINS = ['github.com', 'huggingface.co', 'objects.githubusercontent.com'];
        try {
            const parsed = new URL(url);
            if (!ALLOWED_DOMAINS.includes(parsed.hostname)) {
                throw new Error(`Domain ${parsed.hostname} is not allowed for downloads`);
            }
        } catch (e) {
            throw new Error(`Invalid download URL: ${e.message}`);
        }

        const writer = fs.createWriteStream(dest);
        const response = await axios({ url, method: 'GET', responseType: 'stream' });

        const totalLength = response.headers['content-length'];
        let downloadedLength = 0;

        response.data.on('data', (chunk) => {
            downloadedLength += chunk.length;
            const progress = ((downloadedLength / totalLength) * 100).toFixed(1);
            if (this.io) {
                this.io.emit('ai_download_progress', { eventName, progress, bytes: downloadedLength });
            }
        });

        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    },

    async setupEngine() {
        this.updatePaths();
        const zipPath = path.join(this.binDir, 'engine.zip');
        await this.downloadFile(this.engineUrl, zipPath, 'engine');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(this.binDir, true);
        fs.unlinkSync(zipPath);
        return true;
    },

    async setupModel() {
        this.updatePaths();
        await this.downloadFile(this.modelUrl, this.modelPath, 'model');
        return true;
    },

    startServer() {
        if (this.process || this._starting) return;
        this._starting = true;
        this.updatePaths();

        const env = {
            ...process.env,
            LLAMA_ARG_PORT: '1234',
            LLAMA_ARG_N_GPU_LAYERS: '99',
            LLAMA_ARG_CTX_SIZE: '16384',
            LLAMA_ARG_MODEL: this.modelPath
        };

        this.process = spawn(this.enginePath, [], { env });
        this._starting = false;

        this.process.stdout.on('data', (data) => {
            console.log(`[AI Engine]: ${data}`);
            if (this.io) this.io.emit('ai_engine_log', data.toString());
        });

        this.process.stderr.on('data', (data) => {
            console.error(`[AI Engine Error]: ${data}`);
            if (this.io) this.io.emit('ai_engine_log', data.toString());
        });

        this.process.on('close', (code) => {
            console.log(`AI Engine process exited with code ${code}`);
            this.process = null;
            this._starting = false;
            if (this.io) this.io.emit('ai_engine_status', 'stopped');
        });

        if (this.io) this.io.emit('ai_engine_status', 'running');

        this.waitForEngine(30000).then(ready => {
            if (ready && this.io) this.io.emit('ai_engine_status', 'ready');
        });
    },

    async waitForEngine(timeoutMs = 30000) {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            try {
                const res = await fetch('http://127.0.0.1:1234/health');
                if (res.ok) return true;
            } catch { /* not ready yet */ }
            await new Promise(r => setTimeout(r, 1000));
        }
        return false;
    },

    stopServer() {
        if (this.process) {
            this.process.kill();
            this.process = null;
        }
    },

    getStatus() {
        this.updatePaths();
        return {
            engineExists: fs.existsSync(this.enginePath),
            modelExists: fs.existsSync(this.modelPath),
            isRunning: !!this.process
        };
    }
});