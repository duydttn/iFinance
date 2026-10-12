const ExcelJS = require('exceljs');

/**
 * TaxService — Xuất bảng kê thuế Việt Nam
 * Nhận TransactionModel qua DI để tránh circular dependency.
 */
module.exports = (TransactionModel) => ({
    /**
     * Generate VN Tax Purchase Ledger (Bảng kê mua vào)
     */
    async generateVNPurchaseLedger(startDate, endDate) {
        const transactions = TransactionModel.getAll({
            start_date: startDate,
            end_date: endDate,
            type: 'expense',
            scope: 'business',
            status: 'confirmed'
        });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Bảng kê mua vào');

        // Header
        sheet.addRow(['BẢNG KÊ HÓA ĐƠN, CHỨNG TỪ HÀNG HÓA, DỊCH VỤ MUA VÀO']);
        sheet.addRow([`Từ ngày: ${startDate} đến ngày: ${endDate}`]);
        sheet.addRow([]);

        const headerRow = sheet.addRow([
            'STT', 'Ngày', 'Số hóa đơn', 'Nội dung', 'Người bán',
            'Tiền chưa thuế', 'Thuế suất (%)', 'Tiền thuế', 'Tổng cộng'
        ]);

        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: 'center' };

        let totalAmount = 0;
        let totalTax = 0;

        transactions.forEach((tx, index) => {
            const amountNoTax = tx.amount - (tx.tax_amount || 0);
            const total = tx.amount;

            sheet.addRow([
                index + 1,
                tx.date,
                tx.invoice_no || '',
                tx.description,
                tx.partner_name || '',
                amountNoTax,
                tx.tax_rate || 0,
                tx.tax_amount || 0,
                total
            ]);

            totalAmount += amountNoTax;
            totalTax += (tx.tax_amount || 0);
        });

        sheet.addRow([]);
        const footer = sheet.addRow(['', '', '', 'TỔNG CỘNG', '', totalAmount, '', totalTax, totalAmount + totalTax]);
        footer.font = { bold: true };

        // Formatting
        sheet.getColumn(6).numFmt = '#,##0';
        sheet.getColumn(8).numFmt = '#,##0';
        sheet.getColumn(9).numFmt = '#,##0';
        sheet.columns.forEach(col => col.width = 15);
        sheet.getColumn(4).width = 30;
        sheet.getColumn(5).width = 25;

        return workbook;
    },

    /**
     * Generate VN Tax Sales Ledger (Bảng kê bán ra)
     */
    async generateVNSalesLedger(startDate, endDate) {
        const transactions = TransactionModel.getAll({
            start_date: startDate,
            end_date: endDate,
            type: 'income',
            scope: 'business',
            status: 'confirmed'
        });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Bảng kê bán ra');

        sheet.addRow(['BẢNG KÊ HÓA ĐƠN, CHỨNG TỪ HÀNG HÓA, DỊCH VỤ BÁN RA']);
        sheet.addRow([`Từ ngày: ${startDate} đến ngày: ${endDate}`]);
        sheet.addRow([]);

        const headerRow = sheet.addRow([
            'STT', 'Ngày', 'Số hóa đơn', 'Nội dung', 'Khách hàng',
            'Doanh thu chưa thuế', 'Thuế suất (%)', 'Tiền thuế', 'Tổng cộng'
        ]);

        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: 'center' };

        let totalAmount = 0;
        let totalTax = 0;

        transactions.forEach((tx, index) => {
            const amountNoTax = tx.amount - (tx.tax_amount || 0);
            const total = tx.amount;

            sheet.addRow([
                index + 1,
                tx.date,
                tx.invoice_no || '',
                tx.description,
                tx.partner_name || '',
                amountNoTax,
                tx.tax_rate || 0,
                tx.tax_amount || 0,
                total
            ]);

            totalAmount += amountNoTax;
            totalTax += (tx.tax_amount || 0);
        });

        sheet.addRow([]);
        const footer = sheet.addRow(['', '', '', 'TỔNG CỘNG', '', totalAmount, '', totalTax, totalAmount + totalTax]);
        footer.font = { bold: true };

        sheet.getColumn(6).numFmt = '#,##0';
        sheet.getColumn(8).numFmt = '#,##0';
        sheet.getColumn(9).numFmt = '#,##0';
        sheet.columns.forEach(col => col.width = 15);
        sheet.getColumn(4).width = 30;
        sheet.getColumn(5).width = 25;

        return workbook;
    }
});
