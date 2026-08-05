import PDFDocument from 'pdfkit';
import orderRepository from '../repositories/order.repository.js';
import { cloudinary } from '../config/cloudinary.js';
import config from '../config/index.js';
import { logger } from '../config/logger.js';

class InvoiceService {
  async generateInvoiceNumber() {
    const now = new Date();
    const prefix = `INV-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const count = await orderRepository.model.countDocuments({ invoiceNumber: { $regex: prefix } });
    return `${prefix}-${String(count + 1).padStart(6, '0')}`;
  }

  async generateInvoiceHTML(order, user) {
    const shipping = order.shippingAddress || {};
    const taxBreakdown = this.calculateTaxBreakdown(order.items);
    return `<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;margin:0;padding:20px}.header{display:flex;justify-content:space-between;border-bottom:2px solid #2d5016;padding-bottom:20px}.company h1{color:#2d5016;margin:0}.totals table{margin-left:auto}table{width:100%;border-collapse:collapse}th,td{padding:8px;text-align:left;border-bottom:1px solid #ddd}th{background:#f5f5f5}.total-row{font-weight:bold;font-size:1.1em}</style></head><body><div class="header"><div class="company"><h1>ORPIND</h1><p>Orpind Foods Pvt. Ltd.<br>GSTIN: ${config.gstin || 'XXAAAA0000A1Z5'}<br> Punjab, India</p></div><div><h2>INVOICE</h2><p><strong>Invoice #:</strong> ${order.invoiceNumber}<br><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}<br><strong>Order #:</strong> ${order.orderNumber}</p></div></div><div style="margin:20px 0"><h3>Bill To:</h3><p>${user.firstName} ${user.lastName}<br>${shipping.addressLine1 || ''}<br>${shipping.addressLine2 || ''}<br>${shipping.city}, ${shipping.state} ${shipping.pincode}<br>${shipping.country || 'India'}<br>Phone: ${shipping.phone || ''}</p></div><table><thead><tr><th>Item</th><th>HSN</th><th>Qty</th><th>Rate</th><th>GST</th><th>Amount</th></tr></thead><tbody>${order.items.map(i => `<tr><td>${i.productName}</td><td>${i.hsnCode || '-'}</td><td>${i.quantity}</td><td>₹${i.price.toFixed(2)}</td><td>${i.gstRate || 0}%</td><td>₹${i.itemTotal.toFixed(2)}</td></tr>`).join('')}</tbody></table><table style="margin-top:20px"><tr><td></td><td style="width:300px"><table><tr><td>Subtotal</td><td style="text-align:right">₹${order.subtotal.toFixed(2)}</td></tr><tr><td>CGST</td><td style="text-align:right">₹${taxBreakdown.cgst.toFixed(2)}</td></tr><tr><td>SGST</td><td style="text-align:right">₹${taxBreakdown.sgst.toFixed(2)}</td></tr>${taxBreakdown.igst > 0 ? `<tr><td>IGST</td><td style="text-align:right">₹${taxBreakdown.igst.toFixed(2)}</td></tr>` : ''}<tr><td>Shipping</td><td style="text-align:right">₹${(order.shippingCost || 0).toFixed(2)}</td></tr>${order.discount ? `<tr><td>Discount</td><td style="text-align:right">-₹${order.discount.toFixed(2)}</td></tr>` : ''}<tr class="total-row"><td>Total</td><td style="text-align:right">₹${order.total.toFixed(2)}</td></tr></table></td></tr></table><p style="margin-top:40px;text-align:center;color:#666">Thank you for your purchase! | orpind.com</p></body></html>`;
  }

  calculateTaxBreakdown(items) {
    let cgst = 0, sgst = 0, igst = 0;
    for (const item of items) {
      const tax = item.tax || (item.price * item.quantity * (item.gstRate || 0) / 100);
      cgst += tax / 2;
      sgst += tax / 2;
    }
    return { cgst, sgst, igst };
  }

  async generateInvoicePDF(order, user) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      doc.fontSize(20).fillColor('#2d5016').text('ORPIND', 50, 50);
      doc.fontSize(10).fillColor('#333').text('Orpind Foods Pvt. Ltd.', 50, 75);
      doc.text(`GSTIN: ${config.gstin || 'XXAAAA0000A1Z5'}`);
      doc.fontSize(16).text('INVOICE', 400, 50, { align: 'right' });
      doc.fontSize(10).text(`Invoice #: ${order.invoiceNumber}`, { align: 'right' });
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, { align: 'right' });
      doc.text(`Order #: ${order.orderNumber}`, { align: 'right' });
      doc.moveTo(50, 150).lineTo(550, 150).stroke();
      doc.fontSize(10).text('Bill To:', 50, 165);
      doc.text(`${user.firstName} ${user.lastName}`);
      const addr = order.shippingAddress;
      if (addr) { doc.text(addr.addressLine1 || ''); doc.text(`${addr.city}, ${addr.state} ${addr.pincode}`); }
      doc.text(`Phone: ${addr?.phone || ''}`);
      let y = 260;
      doc.fontSize(10).text('Item', 50, y).text('Qty', 280, y).text('Rate', 350, y).text('Amount', 450, y);
      y += 20;
      for (const item of order.items) {
        doc.text(item.productName, 50, y).text(String(item.quantity), 280, y).text(`Rs.${item.price}`, 350, y).text(`Rs.${item.itemTotal}`, 450, y);
        y += 18;
      }
      y += 10;
      doc.moveTo(50, y).lineTo(550, y).stroke();
      y += 15;
      doc.text(`Subtotal: Rs.${order.subtotal}`, 350, y); y += 18;
      doc.text(`Tax: Rs.${order.tax || 0}`, 350, y); y += 18;
      doc.text(`Shipping: Rs.${order.shippingCost || 0}`, 350, y); y += 18;
      if (order.discount) { doc.text(`Discount: -Rs.${order.discount}`, 350, y); y += 18; }
      doc.fontSize(12).text(`Total: Rs.${order.total}`, 350, y);
      doc.fontSize(8).fillColor('#999').text('Thank you for your purchase! | orpind.com', 50, 700, { align: 'center' });
      doc.end();
    });
  }

  numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (num === 0) return 'Zero';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + this.numberToWords(num % 100) : '');
    if (num < 100000) return this.numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + this.numberToWords(num % 1000) : '');
    return this.numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + this.numberToWords(num % 100000) : '');
  }
}

export default new InvoiceService();
