module.exports = (TransactionModel) => ({
    detectAnomalies(categoryId, amount, type, scope, allStats = []) {
        if (!categoryId) {
            return { isAnomaly: false };
        }

        // Tìm thông số thống kê phù hợp với Category, Type và Scope
        const categoryStats = allStats.find(
            s => s.id === categoryId && s.type === type && s.scope === scope
        );

        if (!categoryStats || categoryStats.count < 3) {
            return { isAnomaly: false, reason: 'Insufficient data (need at least 3 transactions in this category/scope)' };
        }

        const mean = categoryStats.average;
        const stdDev = categoryStats.std_dev || 0;

        // Ưu tiên dùng 2*stdDev nếu có biến động, nếu không dùng 3x mean làm ngưỡng cứng
        const threshold = stdDev > 0 ? mean + (2 * stdDev) : mean * 3;

        if (type === 'expense' && amount > threshold) {
            return {
                isAnomaly: true,
                reason: amount > mean * 3 ? 'Amount more than 3x average' : 'Amount significantly higher than average',
                average: mean,
                threshold: threshold,
                deviation: ((amount - mean) / mean * 100).toFixed(1) + '%'
            };
        }

        // LG-03: Phát hiện thu nhập đột biến (positive anomaly)
        if (type === 'income' && amount > threshold) {
            return {
                isAnomaly: true,
                reason: amount > mean * 3 ? 'Income more than 3x average' : 'Income significantly higher than average',
                average: mean,
                threshold: threshold,
                deviation: ((amount - mean) / mean * 100).toFixed(1) + '%'
            };
        }

        return { isAnomaly: false };
    },

    getAnomalousTransactions(startDate, endDate, team = null, applyTeamFilter = false) {
        const transactions = TransactionModel.getAll({
            start_date: startDate,
            end_date: endDate,
            status: ['confirmed', 'pending'],
            team: team,
            applyTeamFilter: applyTeamFilter
        });

        const allStats = TransactionModel.getCategoryStats({
            start_date: startDate,
            end_date: endDate,
            team: team,
            applyTeamFilter: applyTeamFilter
        });

        const anomalies = [];

        for (const transaction of transactions) {
            const result = this.detectAnomalies(
                transaction.category_id,
                transaction.amount,
                transaction.type,
                transaction.scope,
                allStats
            );

            if (result.isAnomaly || transaction.is_anomaly) {
                anomalies.push({
                    ...transaction,
                    anomaly_reason: transaction.is_anomaly ? (transaction.anomaly_note || 'Báo cáo thủ công') : result.reason,
                    anomaly_details: result,
                    is_manual: !!transaction.is_anomaly
                });
            }
        }

        return anomalies;
    }
});
