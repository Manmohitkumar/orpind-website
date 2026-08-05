import { calculateGST, getHSNCode, generateInvoiceNumber } from '@/lib/tax';
import type { Order, OrderItem, Address } from '@/types';

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  orderNumber: string;
  orderDate: string;
  seller: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    gstin: string;
    pan: string;
    phone: string;
    email: string;
  };
  buyer: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    gstin?: string;
    phone: string;
  };
  items: Array<{
    description: string;
    hsnCode: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    discount: number;
    taxableAmount: number;
    gstRate: number;
    gstAmount: number;
    totalAmount: number;
  }>;
  totalTaxableAmount: number;
  totalGST: number;
  totalDiscount: number;
  shippingCharges: number;
  grandTotal: number;
  amountInWords: string;
  paymentMethod: string;
  bankDetails?: {
    name: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
  };
  termsAndConditions: string[];
}

// ─── Seller Details ──────────────────────────────────
const SELLER_DETAILS = {
  name: 'Orpind Foods Pvt. Ltd.',
  address: 'GT Road, Near Phagwara Bus Stand',
  city: 'Phagwara',
  state: 'Punjab',
  pincode: '144401',
  gstin: process.env.COMPANY_GSTIN || '03AABCO1234F1Z5',
  pan: process.env.COMPANY_PAN || 'AABCO1234F',
  phone: '+91 62833 48561',
  email: 'accounts@orpind.com',
};

// ─── Generate Invoice Data ───────────────────────────
export function generateInvoiceData(
  order: Order,
  orderItems: OrderItem[],
  shippingAddress: Address,
  billingAddress?: Address
): InvoiceData {
  const buyerAddress = billingAddress || shippingAddress;

  const items = orderItems.map(item => {
    const hsnCode = getHSNCode(item.productName, '');
    const basePrice = item.price * item.quantity;
    const discount = 0;
    const taxableAmount = basePrice - discount;
    const gstResult = calculateGST({
      basePrice: taxableAmount,
      hsnCode,
      originState: 'Punjab',
      destinationState: buyerAddress.state,
    });

    return {
      description: `${item.productName} (${item.weight})`,
      hsnCode,
      quantity: item.quantity,
      unit: 'PCS',
      unitPrice: item.price,
      discount,
      taxableAmount: gstResult.basePrice,
      gstRate: gstResult.gstRate,
      gstAmount: gstResult.totalGST,
      totalAmount: gstResult.totalPrice,
    };
  });

  const totalTaxableAmount = items.reduce((sum, item) => sum + item.taxableAmount, 0);
  const totalGST = items.reduce((sum, item) => sum + item.gstAmount, 0);
  const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
  const shippingCharges = (order as any).shippingCost || 0;
  const grandTotal = totalTaxableAmount + totalGST + shippingCharges;

  return {
    invoiceNumber: generateInvoiceNumber(order.orderNumber),
    invoiceDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    orderNumber: order.orderNumber,
    orderDate: new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    seller: SELLER_DETAILS,
    buyer: {
      name: buyerAddress.name,
      address: buyerAddress.line1 + (buyerAddress.line2 ? `, ${buyerAddress.line2}` : ''),
      city: buyerAddress.city,
      state: buyerAddress.state,
      pincode: buyerAddress.pincode,
      phone: buyerAddress.phone,
    },
    items,
    totalTaxableAmount: Math.round(totalTaxableAmount * 100) / 100,
    totalGST: Math.round(totalGST * 100) / 100,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    shippingCharges,
    grandTotal: Math.round(grandTotal * 100) / 100,
    amountInWords: numberToWords(Math.round(grandTotal)),
    paymentMethod: order.paymentMethod || 'Online Payment',
    termsAndConditions: [
      'Payment is due within 30 days of invoice date.',
      'Goods once sold will not be returned or exchanged.',
      'Subject to Phagwara (Punjab) jurisdiction.',
      'E. & O.E.',
    ],
  };
}

// ─── Number to Words (Indian numbering) ──────────────
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertBelow1000 = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertBelow1000(n % 100) : '');
  };

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  let result = '';
  if (crore) result += convertBelow1000(crore) + ' Crore ';
  if (lakh) result += convertBelow1000(lakh) + ' Lakh ';
  if (thousand) result += convertBelow1000(thousand) + ' Thousand ';
  if (remainder) result += convertBelow1000(remainder);

  return result.trim() + ' Rupees Only';
}

// ─── Generate Invoice HTML ───────────────────────────
export function generateInvoiceHTML(invoiceData: InvoiceData): string {
  const itemsRows = invoiceData.items.map((item, index) => `
    <tr>
      <td style="padding:8px;border:1px solid #ddd;text-align:center">${index + 1}</td>
      <td style="padding:8px;border:1px solid #ddd">${item.description}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:center">${item.hsnCode}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right">₹${item.unitPrice.toFixed(2)}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right">${item.discount > 0 ? '-₹' + item.discount.toFixed(2) : '-'}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right">₹${item.taxableAmount.toFixed(2)}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:center">${item.gstRate}%</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right">₹${item.gstAmount.toFixed(2)}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right;font-weight:bold">₹${item.totalAmount.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:20px;color:#333;font-size:12px}
  .invoice-header{display:flex;justify-content:space-between;margin-bottom:20px;border-bottom:2px solid #2A1F17;padding-bottom:15px}
  .invoice-title{font-size:24px;font-weight:bold;color:#2A1F17}
  table{width:100%;border-collapse:collapse;margin:15px 0}
  .total-row td{font-weight:bold;border-top:2px solid #2A1F17}
  .footer{margin-top:30px;padding-top:15px;border-top:1px solid #ddd;font-size:10px;color:#666}
  .stamp{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-15deg);opacity:0.1;font-size:48px;font-weight:bold;color:#C85215}
</style></head><body>
<div class="stamp">ORPIND</div>
<div class="invoice-header">
  <div>
    <div class="invoice-title">TAX INVOICE</div>
    <div><strong>${invoiceData.seller.name}</strong></div>
    <div>${invoiceData.seller.address}</div>
    <div>${invoiceData.seller.city}, ${invoiceData.seller.state} - ${invoiceData.seller.pincode}</div>
    <div>GSTIN: ${invoiceData.seller.gstin}</div>
    <div>PAN: ${invoiceData.seller.pan}</div>
    <div>Phone: ${invoiceData.seller.phone}</div>
  </div>
  <div style="text-align:right">
    <div><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</div>
    <div><strong>Date:</strong> ${invoiceData.invoiceDate}</div>
    <div><strong>Order #:</strong> ${invoiceData.orderNumber}</div>
    <div><strong>Order Date:</strong> ${invoiceData.orderDate}</div>
    <div><strong>Payment:</strong> ${invoiceData.paymentMethod}</div>
  </div>
</div>

<div style="display:flex;gap:20px;margin-bottom:20px">
  <div style="flex:1;padding:15px;background:#f9f9f9;border:1px solid #ddd">
    <h3 style="margin:0 0 10px 0;color:#2A1F17">Bill To:</h3>
    <div><strong>${invoiceData.buyer.name}</strong></div>
    <div>${invoiceData.buyer.address}</div>
    <div>${invoiceData.buyer.city}, ${invoiceData.buyer.state} - ${invoiceData.buyer.pincode}</div>
    ${invoiceData.buyer.gstin ? `<div>GSTIN: ${invoiceData.buyer.gstin}</div>` : ''}
    <div>Phone: ${invoiceData.buyer.phone}</div>
  </div>
</div>

<table>
  <thead>
    <tr style="background:#2A1F17;color:white">
      <th style="padding:8px;border:1px solid #ddd">#</th>
      <th style="padding:8px;border:1px solid #ddd;text-align:left">Description</th>
      <th style="padding:8px;border:1px solid #ddd">HSN</th>
      <th style="padding:8px;border:1px solid #ddd">Qty</th>
      <th style="padding:8px;border:1px solid #ddd;text-align:right">Unit Price</th>
      <th style="padding:8px;border:1px solid #ddd;text-align:right">Disc.</th>
      <th style="padding:8px;border:1px solid #ddd;text-align:right">Taxable</th>
      <th style="padding:8px;border:1px solid #ddd">GST %</th>
      <th style="padding:8px;border:1px solid #ddd;text-align:right">GST Amt</th>
      <th style="padding:8px;border:1px solid #ddd;text-align:right">Total</th>
    </tr>
  </thead>
  <tbody>
    ${itemsRows}
    <tr class="total-row">
      <td colspan="6" style="padding:8px;border:1px solid #ddd;text-align:right">Subtotal</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right">₹${invoiceData.totalTaxableAmount.toFixed(2)}</td>
      <td style="padding:8px;border:1px solid #ddd"></td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right">₹${invoiceData.totalGST.toFixed(2)}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right">₹${(invoiceData.totalTaxableAmount + invoiceData.totalGST).toFixed(2)}</td>
    </tr>
    ${invoiceData.shippingCharges > 0 ? `
    <tr>
      <td colspan="6" style="padding:8px;border:1px solid #ddd;text-align:right">Shipping Charges</td>
      <td colspan="3" style="padding:8px;border:1px solid #ddd"></td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right">₹${invoiceData.shippingCharges.toFixed(2)}</td>
    </tr>` : ''}
    <tr class="total-row">
      <td colspan="9" style="padding:10px;border:1px solid #ddd;text-align:right;font-size:14px">Grand Total</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:right;font-size:14px;color:#C85215">₹${invoiceData.grandTotal.toFixed(2)}</td>
    </tr>
  </tbody>
</table>

<div style="margin:15px 0;padding:10px;background:#f5f5f5;border:1px solid #ddd">
  <strong>Amount in Words:</strong> ${invoiceData.amountInWords}
</div>

<div style="display:flex;gap:20px;margin-top:30px">
  <div style="flex:1">
    <h4>Terms & Conditions:</h4>
    <ol style="font-size:11px;color:#666">
      ${invoiceData.termsAndConditions.map(t => `<li>${t}</li>`).join('')}
    </ol>
  </div>
  <div style="text-align:right">
    <div style="margin-top:60px;border-top:1px solid #333;padding-top:5px">
      For ${invoiceData.seller.name}<br>
      <strong>Authorized Signatory</strong>
    </div>
  </div>
</div>

<div class="footer">
  <p>This is a computer-generated invoice. No signature required.</p>
  <p>For queries, contact: ${invoiceData.seller.email} | ${invoiceData.seller.phone}</p>
</div>
</body></html>`;
}

// ─── Save Invoice to Database ────────────────────────
export async function saveInvoice(orderId: string, invoiceData: InvoiceData): Promise<string> {
  const { default: prisma } = await import('@/lib/db');
  const invoice = await prisma.$executeRaw`
    INSERT INTO invoices (id, "orderId", "invoiceNumber", "invoiceDate", data, "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), ${orderId}, ${invoiceData.invoiceNumber}, ${new Date().toISOString()}, ${JSON.stringify(invoiceData)}::jsonb, NOW(), NOW())
    RETURNING id
  `;
  return String(invoice);
}

// ─── Get Invoice by Order ID ─────────────────────────
export async function getInvoiceByOrderId(orderId: string): Promise<InvoiceData | null> {
  const { default: prisma } = await import('@/lib/db');
  const result = await prisma.$queryRaw`
    SELECT data FROM invoices WHERE "orderId" = ${orderId} LIMIT 1
  `;
  return (result as any)?.[0]?.data || null;
}
