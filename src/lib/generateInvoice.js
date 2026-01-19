import { jsPDF } from 'jspdf';

/**
 * Generate a PDF invoice for an order
 * @param {Object} order - Order data
 * @param {Object} companyInfo - Company information for the invoice header
 * @returns {jsPDF} - The generated PDF document
 */
export function generateInvoicePDF(order, companyInfo = {}) {
  const doc = new jsPDF();

  // Default company info
  const company = {
    name: companyInfo.name || 'Luxe Candles',
    address: companyInfo.address || '123 Candle Street, Mumbai, India',
    phone: companyInfo.phone || '+91 98765 43210',
    email: companyInfo.email || 'orders@luxecandles.com',
    website: companyInfo.website || 'www.luxecandles.com',
    gst: companyInfo.gst || 'GSTIN: 27AAAAA0000A1Z5',
  };

  // Colors
  const primaryColor = [139, 92, 246]; // Lavender
  const darkColor = [31, 41, 55];
  const grayColor = [107, 114, 128];
  const lightGray = [243, 244, 246];

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Helper function to add text
  const addText = (text, x, y, options = {}) => {
    const {
      fontSize = 10,
      color = darkColor,
      fontStyle = 'normal',
      align = 'left'
    } = options;

    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    doc.setFont('helvetica', fontStyle);

    if (align === 'right') {
      doc.text(text, x, y, { align: 'right' });
    } else if (align === 'center') {
      doc.text(text, x, y, { align: 'center' });
    } else {
      doc.text(text, x, y);
    }
  };

  // Header with company logo/name
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');

  addText(company.name, margin, 25, { fontSize: 24, color: [255, 255, 255], fontStyle: 'bold' });
  addText('INVOICE', pageWidth - margin, 25, { fontSize: 20, color: [255, 255, 255], fontStyle: 'bold', align: 'right' });

  // Company details (below header)
  yPos = 55;
  addText(company.address, margin, yPos, { fontSize: 9, color: grayColor });
  yPos += 5;
  addText(`Phone: ${company.phone} | Email: ${company.email}`, margin, yPos, { fontSize: 9, color: grayColor });
  yPos += 5;
  addText(company.gst, margin, yPos, { fontSize: 9, color: grayColor });

  // Invoice details (right side)
  yPos = 55;
  addText(`Invoice #: INV-${order.number || order.id}`, pageWidth - margin, yPos, { fontSize: 10, fontStyle: 'bold', align: 'right' });
  yPos += 6;
  addText(`Order #: ${order.number || order.id}`, pageWidth - margin, yPos, { fontSize: 9, color: grayColor, align: 'right' });
  yPos += 6;
  const orderDate = order.date_created ? new Date(order.date_created).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  addText(`Date: ${orderDate}`, pageWidth - margin, yPos, { fontSize: 9, color: grayColor, align: 'right' });
  yPos += 6;

  // Status badge
  const statusColors = {
    completed: [22, 163, 74],
    processing: [59, 130, 246],
    pending: [234, 179, 8],
    cancelled: [239, 68, 68],
  };
  const statusColor = statusColors[order.status] || grayColor;
  addText(`Status: ${(order.status || 'Pending').toUpperCase()}`, pageWidth - margin, yPos, { fontSize: 9, color: statusColor, fontStyle: 'bold', align: 'right' });

  // Divider line
  yPos = 85;
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // Billing and Shipping addresses
  yPos = 95;
  const billing = order.billing || {};
  const shipping = order.shipping || {};

  // Billing Address
  addText('Bill To:', margin, yPos, { fontSize: 10, fontStyle: 'bold', color: primaryColor });
  yPos += 7;
  addText(`${billing.first_name || ''} ${billing.last_name || ''}`.trim() || 'Customer', margin, yPos, { fontSize: 10, fontStyle: 'bold' });
  yPos += 5;
  if (billing.address_1) {
    addText(billing.address_1, margin, yPos, { fontSize: 9, color: grayColor });
    yPos += 5;
  }
  if (billing.address_2) {
    addText(billing.address_2, margin, yPos, { fontSize: 9, color: grayColor });
    yPos += 5;
  }
  if (billing.city || billing.state || billing.postcode) {
    addText(`${billing.city || ''}, ${billing.state || ''} ${billing.postcode || ''}`.trim(), margin, yPos, { fontSize: 9, color: grayColor });
    yPos += 5;
  }
  if (billing.country) {
    addText(billing.country, margin, yPos, { fontSize: 9, color: grayColor });
    yPos += 5;
  }
  if (billing.phone) {
    addText(`Phone: ${billing.phone}`, margin, yPos, { fontSize: 9, color: grayColor });
    yPos += 5;
  }
  if (billing.email) {
    addText(`Email: ${billing.email}`, margin, yPos, { fontSize: 9, color: grayColor });
  }

  // Shipping Address (right column)
  let shipYPos = 95;
  const shipX = pageWidth / 2 + 10;

  addText('Ship To:', shipX, shipYPos, { fontSize: 10, fontStyle: 'bold', color: primaryColor });
  shipYPos += 7;
  addText(`${shipping.first_name || billing.first_name || ''} ${shipping.last_name || billing.last_name || ''}`.trim() || 'Same as billing', shipX, shipYPos, { fontSize: 10, fontStyle: 'bold' });
  shipYPos += 5;
  if (shipping.address_1 || billing.address_1) {
    addText(shipping.address_1 || billing.address_1, shipX, shipYPos, { fontSize: 9, color: grayColor });
    shipYPos += 5;
  }
  if (shipping.address_2 || billing.address_2) {
    addText(shipping.address_2 || billing.address_2, shipX, shipYPos, { fontSize: 9, color: grayColor });
    shipYPos += 5;
  }
  if ((shipping.city || billing.city) || (shipping.state || billing.state)) {
    addText(`${shipping.city || billing.city || ''}, ${shipping.state || billing.state || ''} ${shipping.postcode || billing.postcode || ''}`.trim(), shipX, shipYPos, { fontSize: 9, color: grayColor });
    shipYPos += 5;
  }
  if (shipping.country || billing.country) {
    addText(shipping.country || billing.country, shipX, shipYPos, { fontSize: 9, color: grayColor });
  }

  // Items table
  yPos = Math.max(yPos, shipYPos) + 20;

  // Table header
  doc.setFillColor(...lightGray);
  doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 10, 'F');

  addText('Item', margin + 5, yPos, { fontSize: 9, fontStyle: 'bold' });
  addText('Qty', pageWidth - 80, yPos, { fontSize: 9, fontStyle: 'bold', align: 'center' });
  addText('Price', pageWidth - 50, yPos, { fontSize: 9, fontStyle: 'bold', align: 'right' });
  addText('Total', pageWidth - margin - 5, yPos, { fontSize: 9, fontStyle: 'bold', align: 'right' });

  yPos += 10;

  // Table rows
  const lineItems = order.line_items || [];
  // Use "Rs." instead of ₹ symbol as jsPDF doesn't render ₹ correctly
  const currencySymbol = order.currency_symbol === '₹' ? 'Rs.' : (order.currency_symbol || 'Rs.');

  lineItems.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 10, 'F');
    }

    const itemName = item.name || 'Product';
    const itemQty = item.quantity || 1;
    const itemPrice = parseFloat(item.price || item.subtotal / item.quantity || 0).toFixed(2);
    const itemTotal = parseFloat(item.total || item.subtotal || 0).toFixed(2);

    // Truncate long names
    const maxNameLength = 50;
    const displayName = itemName.length > maxNameLength ? itemName.substring(0, maxNameLength) + '...' : itemName;

    addText(displayName, margin + 5, yPos, { fontSize: 9 });
    addText(itemQty.toString(), pageWidth - 80, yPos, { fontSize: 9, align: 'center' });
    addText(`${currencySymbol}${itemPrice}`, pageWidth - 50, yPos, { fontSize: 9, align: 'right' });
    addText(`${currencySymbol}${itemTotal}`, pageWidth - margin - 5, yPos, { fontSize: 9, align: 'right' });

    yPos += 10;

    // Check for page break
    if (yPos > 250) {
      doc.addPage();
      yPos = 30;
    }
  });

  // Divider before totals
  yPos += 5;
  doc.setDrawColor(...lightGray);
  doc.line(pageWidth - 100, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Totals section
  const subtotal = parseFloat(order.subtotal || order.total || 0).toFixed(2);
  const shipping_total = parseFloat(order.shipping_total || 0).toFixed(2);
  const tax_total = parseFloat(order.total_tax || 0).toFixed(2);
  const discount_total = parseFloat(order.discount_total || 0).toFixed(2);
  const total = parseFloat(order.total || 0).toFixed(2);

  // Subtotal
  addText('Subtotal:', pageWidth - 70, yPos, { fontSize: 9, color: grayColor, align: 'right' });
  addText(`${currencySymbol}${subtotal}`, pageWidth - margin - 5, yPos, { fontSize: 9, align: 'right' });
  yPos += 7;

  // Shipping
  if (parseFloat(shipping_total) > 0) {
    addText('Shipping:', pageWidth - 70, yPos, { fontSize: 9, color: grayColor, align: 'right' });
    addText(`${currencySymbol}${shipping_total}`, pageWidth - margin - 5, yPos, { fontSize: 9, align: 'right' });
    yPos += 7;
  } else {
    addText('Shipping:', pageWidth - 70, yPos, { fontSize: 9, color: grayColor, align: 'right' });
    addText('FREE', pageWidth - margin - 5, yPos, { fontSize: 9, color: [22, 163, 74], align: 'right' });
    yPos += 7;
  }

  // Tax
  if (parseFloat(tax_total) > 0) {
    addText('Tax:', pageWidth - 70, yPos, { fontSize: 9, color: grayColor, align: 'right' });
    addText(`${currencySymbol}${tax_total}`, pageWidth - margin - 5, yPos, { fontSize: 9, align: 'right' });
    yPos += 7;
  }

  // Discount
  if (parseFloat(discount_total) > 0) {
    addText('Discount:', pageWidth - 70, yPos, { fontSize: 9, color: grayColor, align: 'right' });
    addText(`-${currencySymbol}${discount_total}`, pageWidth - margin - 5, yPos, { fontSize: 9, color: [22, 163, 74], align: 'right' });
    yPos += 7;
  }

  // Total
  yPos += 3;
  doc.setFillColor(...primaryColor);
  doc.rect(pageWidth - 100, yPos - 5, 100 - margin, 12, 'F');
  addText('TOTAL:', pageWidth - 70, yPos + 2, { fontSize: 11, fontStyle: 'bold', color: [255, 255, 255], align: 'right' });
  addText(`${currencySymbol}${total}`, pageWidth - margin - 5, yPos + 2, { fontSize: 11, fontStyle: 'bold', color: [255, 255, 255], align: 'right' });

  // Payment method
  yPos += 25;
  addText('Payment Method:', margin, yPos, { fontSize: 9, fontStyle: 'bold' });
  addText(order.payment_method_title || 'Cash on Delivery (COD)', margin + 35, yPos, { fontSize: 9, color: grayColor });

  // Order notes
  if (order.customer_note) {
    yPos += 15;
    addText('Order Notes:', margin, yPos, { fontSize: 9, fontStyle: 'bold' });
    yPos += 5;
    const noteLines = doc.splitTextToSize(order.customer_note, pageWidth - (margin * 2));
    addText(noteLines, margin, yPos, { fontSize: 9, color: grayColor });
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 25;
  doc.setDrawColor(...lightGray);
  doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

  addText('Thank you for shopping with Luxe Candles!', pageWidth / 2, footerY - 3, { fontSize: 10, fontStyle: 'italic', color: primaryColor, align: 'center' });
  addText(`${company.website} | ${company.email}`, pageWidth / 2, footerY + 4, { fontSize: 8, color: grayColor, align: 'center' });
  addText('This is a computer generated invoice.', pageWidth / 2, footerY + 10, { fontSize: 7, color: grayColor, align: 'center' });

  return doc;
}

/**
 * Download invoice PDF
 * @param {Object} order - Order data
 */
export function downloadInvoice(order) {
  const doc = generateInvoicePDF(order);
  doc.save(`Invoice-${order.number || order.id}.pdf`);
}

/**
 * Get invoice as blob for preview or upload
 * @param {Object} order - Order data
 * @returns {Blob} - PDF as blob
 */
export function getInvoiceBlob(order) {
  const doc = generateInvoicePDF(order);
  return doc.output('blob');
}

/**
 * Get invoice as base64 for API transmission
 * @param {Object} order - Order data
 * @returns {string} - PDF as base64 string
 */
export function getInvoiceBase64(order) {
  const doc = generateInvoicePDF(order);
  return doc.output('datauristring');
}

export default {
  generateInvoicePDF,
  downloadInvoice,
  getInvoiceBlob,
  getInvoiceBase64,
};
