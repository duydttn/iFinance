
const db = require('./connection');

function seed() {
    console.log('🌱 Bắt đầu tạo dữ liệu mẫu Doanh nghiệp (2024 - 2026)...');

    // Xóa dữ liệu cũ để tránh xung đột
    db.prepare('DELETE FROM transactions').run();
    db.prepare('DELETE FROM rules').run(); // Xóa rules trước vì nó tham chiếu đến categories
    db.prepare('DELETE FROM categories').run();

    // 1. Chuẩn bị Categories (Chỉ tập trung Business/Company)
    const categories = [
        // Thu nhập (Income)
        { name: 'Doanh thu Dự án', type: 'income', scope: 'business' },
        { name: 'Bán lẻ Phần mềm', type: 'income', scope: 'business' },
        { name: 'Dịch vụ Tư vấn', type: 'income', scope: 'business' },
        { name: 'Lãi tiền gửi', type: 'income', scope: 'business' },
        { name: 'Hoàn thuế', type: 'income', scope: 'business' },

        // Chi phí (Expense)
        { name: 'Tiền lương nhân viên', type: 'expense', scope: 'business' },
        { name: 'Marketing & Ads', type: 'expense', scope: 'business' },
        { name: 'Thuê văn phòng', type: 'expense', scope: 'business' },
        { name: 'Điện nước văn phòng', type: 'expense', scope: 'business' },
        { name: 'Internet doanh nghiệp', type: 'expense', scope: 'business' },
        { name: 'Công tác phí', type: 'expense', scope: 'business' },
        { name: 'Tiếp khách & Đối ngoại', type: 'expense', scope: 'business' },
        { name: 'Mua sắm thiết bị', type: 'expense', scope: 'business' },
        { name: 'Thuế & Phí', type: 'expense', scope: 'business' },
        { name: 'Bảo hiểm xã hội', type: 'expense', scope: 'business' },
        { name: 'Khác', type: 'expense', scope: 'business' }
    ];

    const insertCat = db.prepare('INSERT OR IGNORE INTO categories (name, scope) VALUES (?, ?)');
    for (const cat of categories) {
        insertCat.run(cat.name, cat.scope);
    }

    const catRows = db.prepare('SELECT id, name, scope FROM categories').all();
    const catMap = {};
    catRows.forEach(c => {
        catMap[c.name] = c.id;
    });

    // 2. Cấu hình thời gian
    const startYear = 2024;
    const endYear = 2026;
    const currentMonth = new Date().getMonth();

    const transactions = [];

    // 3. Logic tạo dữ liệu
    for (let year = startYear; year <= endYear; year++) {
        for (let month = 0; month < 12; month++) {
            if (year === endYear && month > currentMonth) break;

            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const monthStr = (month + 1).toString().padStart(2, '0');

            // Hệ số tăng trưởng doanh thu theo thời gian (Trend)
            const trendMultiplier = 1 + ((year - startYear) * 12 + month) * 0.03; // Tăng 3% mỗi tháng

            // --- A. Giao dịch cố định hàng tháng (Công ty) ---

            // Tiền thuê văn phòng (Ngày 1)
            transactions.push({
                date: `${year}-${monthStr}-01`,
                description: `Tiền thuê văn phòng trụ sở chính - Tháng ${month + 1}`,
                amount: 15000000,
                type: 'expense',
                scope: 'business',
                category_id: catMap['Thuê văn phòng'],
                status: 'confirmed',
                created_by: 1
            });

            // Bảo hiểm xã hội (Ngày 10)
            transactions.push({
                date: `${year}-${monthStr}-10`,
                description: `Đóng Bảo hiểm xã hội nhân viên - Tháng ${month + 1}`,
                amount: 12500000,
                type: 'expense',
                scope: 'business',
                category_id: catMap['Bảo hiểm xã hội'],
                status: 'confirmed',
                created_by: 1
            });

            // Điện nước & Internet (Ngày 15)
            transactions.push({
                date: `${year}-${monthStr}-15`,
                description: `Thanh toán điện nước & cáp quang - Tháng ${month + 1}`,
                amount: Math.floor(Math.random() * 1000000) + 2500000,
                type: 'expense',
                scope: 'business',
                category_id: catMap['Điện nước văn phòng'],
                status: 'confirmed',
                created_by: 1
            });

            // Trả lương nhân viên (Ngày cuối tháng)
            transactions.push({
                date: `${year}-${monthStr}-${daysInMonth}`,
                description: `Quyết toán lương cán bộ nhân viên - Tháng ${month + 1}`,
                amount: 85000000 * (1 + (year - startYear) * 0.15), // Tăng quỹ lương 15% mỗi năm
                type: 'expense',
                scope: 'business',
                category_id: catMap['Tiền lương nhân viên'],
                status: 'confirmed',
                created_by: 1
            });

            // --- B. Giao dịch Thu nhập đa chiều (Income) ---

            // 1. Doanh thu dự án (Ngày 20)
            transactions.push({
                date: `${year}-${monthStr}-20`,
                description: `Quyết toán dự án phần mềm ERP cho đối tác - Giai đoạn ${month + 1}`,
                amount: Math.floor(120000000 * trendMultiplier),
                type: 'income',
                scope: 'business',
                category_id: catMap['Doanh thu Dự án'],
                status: 'confirmed',
                created_by: 1
            });

            // 2. Bán lẻ Phần mềm (Ngẫu nhiên 3-5 lần/tháng)
            for (let i = 0; i < (Math.floor(Math.random() * 3) + 3); i++) {
                const day = Math.floor(Math.random() * daysInMonth) + 1;
                transactions.push({
                    date: `${year}-${monthStr}-${day.toString().padStart(2, '0')}`,
                    description: `Bán License phần mềm iFinance Pro cho KH #${1000 + i}`,
                    amount: Math.floor(Math.random() * 5000000) + 2000000,
                    type: 'income',
                    scope: 'business',
                    category_id: catMap['Bán lẻ Phần mềm'],
                    status: 'confirmed',
                    created_by: 1
                });
            }

            // 3. Dịch vụ Tư vấn (Thỉnh thoảng)
            if (month % 2 === 0) {
                transactions.push({
                    date: `${year}-${monthStr}-25`,
                    description: `Dịch vụ tư vấn chuyển đổi số doanh nghiệp`,
                    amount: Math.floor(25000000 * trendMultiplier),
                    type: 'income',
                    scope: 'business',
                    category_id: catMap['Dịch vụ Tư vấn'],
                    status: 'confirmed',
                    created_by: 1
                });
            }

            // --- C. Chi phí đa chiều (Expenses) ---

            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${monthStr}-${day.toString().padStart(2, '0')}`;

                // Tiếp khách (Thứ 6 hàng tuần)
                const d = new Date(year, month, day);
                if (d.getDay() === 5) {
                    transactions.push({
                        date: dateStr,
                        description: 'Tiếp khách hàng & Đối tác chiến lược',
                        amount: Math.floor(Math.random() * 3000000) + 1500000,
                        type: 'expense',
                        scope: 'business',
                        category_id: catMap['Tiếp khách & Đối ngoại'],
                        status: 'confirmed',
                        created_by: 1
                    });
                }

                // Marketing (Cách vài ngày)
                if (day % 7 === 0) {
                    transactions.push({
                        date: dateStr,
                        description: 'Ngân sách quảng cáo Facebook/LinkedIn Ads',
                        amount: Math.floor(Math.random() * 5000000) + 3000000,
                        type: 'expense',
                        scope: 'business',
                        category_id: catMap['Marketing & Ads'],
                        status: 'confirmed',
                        created_by: 1
                    });
                }

                // Công tác phí (Nếu có)
                if (day === 22 && month % 3 === 0) {
                    transactions.push({
                        date: dateStr,
                        description: 'Công tác phí khảo sát thị trường miền Nam',
                        amount: Math.floor(Math.random() * 5000000) + 5000000,
                        type: 'expense',
                        scope: 'business',
                        category_id: catMap['Công tác phí'],
                        status: 'confirmed',
                        created_by: 1
                    });
                }
            }

            // --- D. Giao dịch đặc biệt (Seasonality & Anomalies) ---

            // Thuế thu nhập doanh nghiệp (Quý)
            if ([2, 5, 8, 11].includes(month)) {
                transactions.push({
                    date: `${year}-${monthStr}-28`,
                    description: `Tạm nộp Thuế thu nhập doanh nghiệp Quý ${Math.floor(month / 3) + 1}`,
                    amount: Math.floor(Math.random() * 10000000) + 15000000,
                    type: 'expense',
                    scope: 'business',
                    category_id: catMap['Thuế & Phí'],
                    status: 'confirmed',
                    created_by: 1
                });
            }

            // Thưởng dự án (Nếu tháng có doanh thu cao)
            if (month === 11) { // Cuối năm
                transactions.push({
                    date: `${year}-${monthStr}-31`,
                    description: 'Thưởng KPI cuối năm cho toàn thể nhân viên',
                    amount: 150000000,
                    type: 'expense',
                    scope: 'business',
                    category_id: catMap['Tiền lương nhân viên'],
                    status: 'confirmed',
                    created_by: 1
                });
            }

            // Anomaly: Mua sắm server/thiết bị lớn
            if (month === 4 && year === 2025) {
                transactions.push({
                    date: `${year}-05-12`,
                    description: 'Nâng cấp hệ thống Server & Hạ tầng mạng',
                    amount: 350000000, // Đột biến
                    type: 'expense',
                    scope: 'business',
                    category_id: catMap['Mua sắm thiết bị'],
                    status: 'confirmed',
                    created_by: 1
                });
            }
        }
    }

    // 4. Lưu vào Database
    const insertTx = db.prepare(`
        INSERT INTO transactions 
        (date, description, amount, type, scope, category_id, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((data) => {
        for (const t of data) {
            insertTx.run(t.date, t.description, t.amount, t.type, t.scope, t.category_id, t.status, t.created_by);
        }
    });

    insertMany(transactions);
    console.log(`✅ Hoàn tất! Đã tạo ${transactions.length} giao dịch DOANH NGHIỆP từ năm ${startYear} đến ${endYear}.`);
}

try {
    seed();
} catch (e) {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
}
