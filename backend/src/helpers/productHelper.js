const calculateDiscountPercentage = (price, comparePrice) => {
  if (!price || !comparePrice || comparePrice <= price) return 0;
  const discount = ((comparePrice - price) / comparePrice) * 100;
  return Math.round(discount);
};

const getPrimaryImage = (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) return null;
  const primary = images.find((img) => img.isPrimary);
  if (primary) return primary.url || primary;
  return images[0]?.url || images[0] || null;
};

const calculateProfitMargin = (costPrice, sellingPrice) => {
  if (!costPrice || costPrice <= 0 || !sellingPrice || sellingPrice <= 0) return 0;
  const profit = sellingPrice - costPrice;
  const margin = (profit / sellingPrice) * 100;
  return Math.round(margin * 100) / 100;
};

const generateSKU = (category, name, variant) => {
  const catCode = (category || 'GEN').replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 3);
  const nameCode = (name || '')
    .replace(/[^A-Z0-9\s]/gi, '')
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 4);
  const varCode = (variant || '').replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 3);
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  let sku = catCode + nameCode;
  if (varCode) sku += '-' + varCode;
  sku += '-' + random;
  return sku;
};

export { calculateDiscountPercentage, getPrimaryImage, calculateProfitMargin, generateSKU };
