import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '@/types/OrderType';

export const generateOrderInvoice = (order: Order & { note?: string }) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary Theme Colors (Farmer / Mandi Green: #00450d -> RGB [0, 69, 13])
  const primaryGreen: [number, number, number] = [0, 69, 13];
  const darkText: [number, number, number] = [27, 28, 28];
  const mutedText: [number, number, number] = [82, 94, 84];

  // Header Banner
  doc.setFillColor(...primaryGreen);
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('APNA SABZI MANDI', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Direct Mandi Se Ghar Tak • 100% Certified Graded Quality', 14, 18);

  // Right Header badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TAX INVOICE', pageWidth - 14, 12, { align: 'right' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Cash Memo / Retail Invoice', pageWidth - 14, 18, { align: 'right' });

  // Order meta block
  let currentY = 34;
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ORDER DETAILS', 14, currentY);
  doc.text('DELIVERY & CUSTOMER INFO', pageWidth / 2 + 5, currentY);

  currentY += 5;
  doc.setDrawColor(224, 230, 224);
  doc.setLineWidth(0.3);
  doc.line(14, currentY, pageWidth - 14, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  // Left Column: Order Info
  doc.setTextColor(...mutedText);
  doc.text('Order ID:', 14, currentY);
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'bold');
  doc.text(`${order.id}`, 38, currentY);

  // Right Column: Delivery To
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedText);
  doc.text('Delivery To:', pageWidth / 2 + 5, currentY);
  doc.setTextColor(...darkText);
  doc.text(`${order.deliveryAddress?.label || 'Home'}`, pageWidth / 2 + 30, currentY);

  currentY += 5;
  doc.setTextColor(...mutedText);
  doc.text('Date & Time:', 14, currentY);
  doc.setTextColor(...darkText);
  doc.text(`${order.placedAt}`, 38, currentY);

  doc.setTextColor(...mutedText);
  doc.text('Address:', pageWidth / 2 + 5, currentY);
  doc.setTextColor(...darkText);
  const addressText =
    [
      order.deliveryAddress?.flat,
      order.deliveryAddress?.landmark,
      order.deliveryAddress?.city,
      order.deliveryAddress?.pincode,
    ]
      .filter(Boolean)
      .join(', ') || 'Online Order Delivery';
  const splitAddress = doc.splitTextToSize(addressText, 65);
  doc.text(splitAddress, pageWidth / 2 + 30, currentY);

  currentY += 5;
  doc.setTextColor(...mutedText);
  doc.text('Payment Mode:', 14, currentY);
  doc.setTextColor(...darkText);
  const paymentLabel =
    order.paymentMethod === 'cod'
      ? 'Cash on Delivery (COD)'
      : (order.paymentMethod || 'COD').toUpperCase();
  doc.text(`${paymentLabel}`, 38, currentY);

  if (order.riderName) {
    currentY += 5;
    doc.setTextColor(...mutedText);
    doc.text('Delivery Partner:', 14, currentY);
    doc.setTextColor(...darkText);
    doc.text(
      `${order.riderName} ${order.riderPhone ? `(${order.riderPhone})` : ''}`,
      42,
      currentY
    );
  }

  currentY += Math.max(splitAddress.length * 4, 10);

  // Table of Items
  const tableData = (order.items || []).map((item, index) => [
    (index + 1).toString(),
    item.name,
    item.weight || '-',
    item.quantity.toString(),
    `Rs. ${Number(item.mrp || item.price).toFixed(2)}`,
    `Rs. ${Number(item.price * item.quantity).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Item Description', 'Weight / Pack', 'Qty', 'Rate', 'Total Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryGreen,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'left' },
      2: { halign: 'center', cellWidth: 28 },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'right', cellWidth: 25 },
      5: { halign: 'right', cellWidth: 28 },
    },
    styles: {
      fontSize: 8.5,
      textColor: darkText,
      cellPadding: 3,
      lineColor: [224, 230, 224],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [249, 251, 249],
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || currentY + 40;

  // Bill Summary Block on Right
  let summaryY = finalY + 6;
  const summaryBoxWidth = 85;
  const summaryX = pageWidth - 14 - summaryBoxWidth;

  // Border box for summary
  doc.setFillColor(252, 254, 252);
  doc.setDrawColor(224, 230, 224);
  doc.roundedRect(summaryX, summaryY, summaryBoxWidth, order.note ? 44 : 38, 2, 2, 'FD');

  const labelX = summaryX + 4;
  const valX = pageWidth - 18;

  let rowY = summaryY + 6;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedText);
  doc.text('Items Total:', labelX, rowY);
  doc.setTextColor(...darkText);
  doc.text(`Rs. ${Number(order.itemsTotal).toFixed(2)}`, valX, rowY, { align: 'right' });

  rowY += 5;
  doc.setTextColor(...mutedText);
  doc.text('Mandi Fresh Discount:', labelX, rowY);
  doc.setTextColor(0, 110, 30);
  doc.text(`-Rs. ${Number(order.discountTotal).toFixed(2)}`, valX, rowY, { align: 'right' });

  rowY += 5;
  doc.setTextColor(...mutedText);
  doc.text('Delivery Charge:', labelX, rowY);
  doc.setTextColor(0, 110, 30);
  doc.text(
    order.deliveryCharge === 0 ? 'FREE' : `Rs. ${order.deliveryCharge.toFixed(2)}`,
    valX,
    rowY,
    { align: 'right' }
  );

  rowY += 5;
  doc.setTextColor(...mutedText);
  doc.text('Digital Weighing & Packing:', labelX, rowY);
  doc.setTextColor(0, 110, 30);
  doc.text('Rs. 0.00 (Muft)', valX, rowY, { align: 'right' });

  rowY += 6;
  doc.setDrawColor(224, 230, 224);
  doc.line(labelX, rowY - 1, valX, rowY - 1);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryGreen);
  doc.text('Total Amount Paid:', labelX, rowY + 3);
  doc.text(`Rs. ${Number(order.totalPaid).toFixed(2)}`, valX, rowY + 3, { align: 'right' });

  if (order.note) {
    rowY += 8;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0, 100, 20);
    doc.text(`Note: ${order.note}`, labelX, rowY);
  }

  // Left Note / Guarantee Box
  const noteBoxWidth = summaryX - 20;
  doc.setFillColor(244, 248, 244);
  doc.roundedRect(14, summaryY, noteBoxWidth, 26, 2, 2, 'FD');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryGreen);
  doc.text('MANDI VISHWAS & FRESH GUARANTEE', 18, summaryY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedText);
  doc.text('• Haath se chuni hui graded vegetables (No daagi sabzi).', 18, summaryY + 11);
  doc.text('• 100% Certified Electronic Wazan (Kaata) verified.', 18, summaryY + 16);
  doc.text('• Doorstep replacement or 1-tap instant refund available.', 18, summaryY + 21);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(224, 230, 224);
  doc.line(14, footerY - 4, pageWidth - 14, footerY - 4);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedText);
  doc.text(
    'This is a computer-generated tax invoice and does not require a physical signature.',
    14,
    footerY
  );
  doc.text(
    'Toll-Free Helpline: 1800-419-MANDI | support@apnamandi.in',
    pageWidth - 14,
    footerY,
    { align: 'right' }
  );

  // Trigger Save / Download
  const cleanId = (order.id || 'order').replace(/[^a-zA-Z0-9]/g, '');
  doc.save(`Mandi_Tax_Invoice_${cleanId}.pdf`);
};
