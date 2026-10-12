
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dbPath = path.join(__dirname, 'ifinance.db');
const dbShmPath = path.join(__dirname, 'ifinance.db-shm');
const dbWalPath = path.join(__dirname, 'ifinance.db-wal');

console.log('🗑️  Xóa cơ sở dữ liệu cũ...');
[dbPath, dbShmPath, dbWalPath].forEach(p => {
    if (fs.existsSync(p)) {
        try {
            fs.unlinkSync(p);
            console.log(`- Đã xóa: ${path.basename(p)}`);
        } catch (e) {
            console.error(`- Lỗi khi xóa ${path.basename(p)}:`, e.message);
        }
    }
});

console.log('🚀 Khởi tạo lại database và chạy Seed...');
try {
    const electronPath = path.resolve(__dirname, '../../node_modules/.bin/electron');
    const output = execSync(`"${electronPath}" backend/database/seed_data.js`, { 
        env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
        cwd: path.resolve(__dirname, '../../')
    });
    console.log(output.toString());
    console.log('✅ Hoàn tất quá trình Reset và Seed dữ liệu!');
} catch (e) {
    console.error('❌ Lỗi khi chạy Seed:', e.message);
    if (e.stdout) console.log(e.stdout.toString());
    if (e.stderr) console.error(e.stderr.toString());
}