// ─── GST (Goods & Services Tax) Engine ───────────────
// For Indian e-commerce - HSN code based tax calculation

interface GSTResult {
  basePrice: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGST: number;
  totalPrice: number;
  isInterState: boolean;
}

interface HSNCode {
  code: string;
  description: string;
  gstRate: number; // percentage
}

// HSN Codes for spices and food products (GST rates)
const HSN_CODES: Record<string, HSNCode> = {
  '0904': { code: '0904', description: 'Pepper (black/white)', gstRate: 5 },
  '0906': { code: '0906', description: 'Cinnamon & Cinnamon-tree flowers', gstRate: 5 },
  '0908': { code: '0908', description: 'Nutmeg, Mace & Cardamoms', gstRate: 5 },
  '0909': { code: '0909', description: 'Seeds of anise, coriander, cumin', gstRate: 5 },
  '0910': { code: '0910', description: 'Ginger, Turmeric, Thyme, Bay leaves', gstRate: 5 },
  '0713': { code: '0713', description: 'Dried leguminous vegetables (pulses)', gstRate: 0 },
  '1006': { code: '1006', description: 'Rice', gstRate: 5 },
  '1101': { code: '1101', description: 'Wheat flour (atta)', gstRate: 0 },
  '2106': { code: '2106', description: 'Spice mixes / Masala blends', gstRate: 12 },
  '1901': { code: '1901', description: 'Food preparations', gstRate: 18 },
};

// Default GST rate for unlisted items
const DEFAULT_GST_RATE = 5;

// States in India with their codes for GST calculation
const UNION_TERRITORIES = ['Chandigarh', 'Delhi', 'Puducherry', 'Andaman & Nicobar Islands', 'Dadra & Nagar Haveli', 'Daman & Diu'];

// ─── Calculate GST ───────────────────────────────────
export function calculateGST(data: {
  basePrice: number;
  hsnCode?: string;
  quantity?: number;
  originState: string;
  destinationState: string;
  isB2B?: boolean;
}): GSTResult {
  const quantity = data.quantity || 1;
  const basePrice = data.basePrice * quantity;
  const hsn = data.hsnCode ? HSN_CODES[data.hsnCode] : null;
  const gstRate = hsn?.gstRate || DEFAULT_GST_RATE;

  // Check if inter-state or intra-state
  const isInterState = data.originState !== data.destinationState ||
    UNION_TERRITORIES.includes(data.destinationState);

  const totalGST = (basePrice * gstRate) / 100;
  let cgst = 0, sgst = 0, igst = 0;

  if (isInterState) {
    igst = totalGST;
  } else {
    cgst = totalGST / 2;
    sgst = totalGST / 2;
  }

  return {
    basePrice,
    gstRate,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    totalGST: Math.round(totalGST * 100) / 100,
    totalPrice: Math.round((basePrice + totalGST) * 100) / 100,
    isInterState,
  };
}

// ─── Get GST Rate for Product Category ───────────────
export function getGSTRateForCategory(categoryName: string): number {
  const name = categoryName.toLowerCase();
  if (name.includes('spice') || name.includes('masala') || name.includes('herb')) return 5;
  if (name.includes('grain') || name.includes('rice') || name.includes('flour')) return 0;
  if (name.includes('flour') || name.includes('atta')) return 0;
  if (name.includes('pulao') || name.includes('biryani') || name.includes('recipe')) return 12;
  return DEFAULT_GST_RATE;
}

// ─── Get HSN Code for Product ────────────────────────
export function getHSNCode(productName: string, category: string): string {
  const name = productName.toLowerCase();
  const cat = category.toLowerCase();

  if (name.includes('turmeric') || name.includes('haldi')) return '0910';
  if (name.includes('chilli') || name.includes('mirch') || name.includes('red chilli')) return '0904';
  if (name.includes('coriander') || name.includes('dhania')) return '0909';
  if (name.includes('cumin') || name.includes('jeera')) return '0909';
  if (name.includes('cardamom') || name.includes('elaichi')) return '0908';
  if (name.includes('cinnamon') || name.includes('dalchini')) return '0906';
  if (name.includes('pepper') || name.includes('kali mirch')) return '0904';
  if (name.includes('rice') || name.includes('chawal')) return '1006';
  if (name.includes('flour') || name.includes('atta')) return '1101';
  if (name.includes('masala') || name.includes('spice mix')) return '2106';
  if (name.includes('pulse') || name.includes('dal') || name.includes('leguminous')) return '0713';
  return '0910'; // Default to spices
}

// ─── Generate Invoice Number ─────────────────────────
export function generateInvoiceNumber(orderNumber: string): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `INV-${year}${month}-${orderNumber}`;
}

// ─── Format GST Details for Invoice ──────────────────
export function formatGSTForInvoice(gstResult: GSTResult): string {
  if (gstResult.isInterState) {
    return `IGST @ ${gstResult.gstRate}%: ₹${gstResult.igst.toFixed(2)}`;
  }
  return `CGST @ ${gstResult.gstRate / 2}%: ₹${gstResult.cgst.toFixed(2)} | SGST @ ${gstResult.gstRate / 2}%: ₹${gstResult.sgst.toFixed(2)}`;
}
