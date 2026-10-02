// Export Service - Download Account Statement as CSV and PDF
import { Transaction } from '../types';
import { calculateSummaryMetrics } from '../utils/insightUtils';

export class ExportService {
  /**
   * Convert transactions into CSV format and trigger file download
   */
  static exportToCSV(transactions: Transaction[], filename = 'Upay_BD_Account_Statement.csv'): boolean {
    try {
      const headers = [
        'Transaction ID',
        'Type',
        'Title (EN)',
        'Title (BN)',
        'Counterparty',
        'Amount (BDT)',
        'Fee (BDT)',
        'Total (BDT)',
        'Balance After (BDT)',
        'Status',
        'Timestamp',
        'Note',
      ];

      const rows = transactions.map((tx) => [
        `"${tx.id}"`,
        `"${tx.type}"`,
        `"${(tx.titleEn || '').replace(/"/g, '""')}"`,
        `"${(tx.titleBn || '').replace(/"/g, '""')}"`,
        `"${(tx.counterparty || '').replace(/"/g, '""')}"`,
        tx.amount.toFixed(2),
        (tx.fee || 0).toFixed(2),
        (tx.total || tx.amount + (tx.fee || 0)).toFixed(2),
        tx.balanceAfter !== undefined ? tx.balanceAfter.toFixed(2) : 'N/A',
        `"${tx.status}"`,
        `"${tx.timestamp}"`,
        `"${(tx.note || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
      }
    } catch (err) {
      console.error('Failed to export CSV:', err);
    }
    return false;
  }

  /**
   * Generate an official PDF statement layout and trigger browser printing / PDF save
   */
  static exportToPDF(transactions: Transaction[], title = 'Upay BD Official Account Statement'): boolean {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') return false;

      const summary = calculateSummaryMetrics(transactions);
      const printWindow = window.open('', '_blank');
      if (!printWindow) return false;

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 24px; margin: 0; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0B4DA2; padding-bottom: 12px; margin-bottom: 20px; }
            .brand { font-size: 26px; font-weight: 900; color: #0B4DA2; }
            .brand span { color: #FFD600; background: #0B4DA2; padding: 2px 8px; border-radius: 4px; margin-left: 4px; }
            .doc-title { font-size: 14px; font-weight: 700; color: #64748b; text-align: right; }
            .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .summary-card { font-size: 12px; }
            .summary-card div { color: #64748b; margin-bottom: 4px; }
            .summary-card strong { font-size: 16px; font-weight: 800; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
            th { background: #0B4DA2; color: #fff; text-align: left; padding: 10px; font-weight: 700; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
            .badge-success { color: #059669; font-weight: 800; }
            .badge-failed { color: #dc2626; font-weight: 800; }
            .amount-positive { color: #059669; font-weight: 800; }
            .amount-negative { color: #0f172a; font-weight: 800; }
            .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">upay <span>BD</span></div>
            <div class="doc-title">
              ACCOUNT STATEMENT<br/>
              <small>Generated on ${new Date().toLocaleDateString()}</small>
            </div>
          </div>

          <div class="summary-grid">
            <div class="summary-card"><div>Total Sent</div><strong>৳${summary.totalSent.toFixed(2)}</strong></div>
            <div class="summary-card"><div>Total Received</div><strong style="color:#059669">৳${summary.totalReceived.toFixed(2)}</strong></div>
            <div class="summary-card"><div>Total Fees</div><strong>৳${summary.totalFees.toFixed(2)}</strong></div>
            <div class="summary-card"><div>Total Transactions</div><strong>${summary.txCount}</strong></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Trx ID</th>
                <th>Type</th>
                <th>Counterparty</th>
                <th>Amount (BDT)</th>
                <th>Fee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${transactions
                .map(
                  (tx) => `
                <tr>
                  <td>${tx.timestamp}</td>
                  <td><code>${tx.id}</code></td>
                  <td>${tx.titleEn || tx.type}</td>
                  <td>${tx.counterparty}</td>
                  <td class="${tx.type === 'add_money' ? 'amount-positive' : 'amount-negative'}">
                    ${tx.type === 'add_money' ? '+' : '-'}৳${tx.amount.toFixed(2)}
                  </td>
                  <td>৳${(tx.fee || 0).toFixed(2)}</td>
                  <td class="${tx.status === 'success' ? 'badge-success' : 'badge-failed'}">
                    ${tx.status.toUpperCase()}
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="footer">
            Official upay BD Simulated Bank Statement • Powered by ImpactIQ • Confidential & Automated
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
      return true;
    } catch (err) {
      console.error('Failed to export PDF:', err);
    }
    return false;
  }
}
