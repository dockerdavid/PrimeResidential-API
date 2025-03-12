import { Injectable } from '@nestjs/common';

import type { BufferOptions, TDocumentDefinitions } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';

const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf',
    }
};

@Injectable()
export class PrinterService {
    private printer = new PdfPrinter(fonts);

    createPDF(
        docDefinition: TDocumentDefinitions,
        options: BufferOptions = {}
    ): PDFKit.PDFDocument {
        return this.printer.createPdfKitDocument(docDefinition, options);
    }
}
