const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { Buffer } = require('buffer');

exports.handler = async (event, context) => {
    const data = JSON.parse(event.body);

    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage([600, 400]);
    
    const { companyDetails, rows, grandTotal } = data;

    page.drawText('Invoice', {
        x: 50,
        y: 350,
        size: 30,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });

    let yPosition = 320;
    page.drawText(`Invoice to: ${companyDetails.name}`, { x: 50, y: yPosition, size: 12, font: timesRomanFont });
    yPosition -= 15;
    page.drawText(`${companyDetails.address}`, { x: 50, y: yPosition, size: 12, font: timesRomanFont });
    yPosition -= 15;
    page.drawText(`${companyDetails.email}`, { x: 50, y: yPosition, size: 12, font: timesRomanFont });

    yPosition -= 30;
    page.drawText('Item', { x: 50, y: yPosition, size: 12, font: timesRomanFont });
    page.drawText('Quantity', { x: 200, y: yPosition, size: 12, font: timesRomanFont });
    page.drawText('Price', { x: 300, y: yPosition, size: 12, font: timesRomanFont });
    page.drawText('Total', { x: 400, y: yPosition, size: 12, font: timesRomanFont });

    rows.forEach((row, index) => {
        yPosition -= 15;
        page.drawText(row.item, { x: 50, y: yPosition, size: 12, font: timesRomanFont });
        page.drawText(row.quantity, { x: 200, y: yPosition, size: 12, font: timesRomanFont });
        page.drawText(row.price, { x: 300, y: yPosition, size: 12, font: timesRomanFont });
        page.drawText(row.total, { x: 400, y: yPosition, size: 12, font: timesRomanFont });
    });

    yPosition -= 30;
    page.drawText(`Grand Total: Kshs. ${grandTotal}`, { x: 50, y: yPosition, size: 12, font: timesRomanFont });

    const pdfBytes = await pdfDoc.save();

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=invoice.pdf',
        },
        body: pdfBytes.toString('base64'),
        isBase64Encoded: true,
    };
};
