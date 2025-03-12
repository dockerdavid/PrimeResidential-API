import { Injectable } from '@nestjs/common';

import moment from 'moment';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrinterService } from 'src/printer/printer.service';

@Injectable()
export class ReportsService {

  constructor(
    private readonly printerService: PrinterService,
  ) { }

  reporteSemana(date: string) {
    const startOfWeek = moment(date).startOf('isoWeek').format('YYYY-MM-DD');
    const endOfWeek = moment(date).endOf('isoWeek').format('YYYY-MM-DD');

    const docDefinition: TDocumentDefinitions = {
      content: ['hello world'],
    }

    const doc = this.printerService.createPDF(docDefinition);

    doc.info.Title = `Reporte semana ${startOfWeek} al ${endOfWeek}`

    return doc;
  }

  costosSemana(date: string) {
    const startOfWeek = moment(date).startOf('isoWeek').format('YYYY-MM-DD');
    const endOfWeek = moment(date).endOf('isoWeek').format('YYYY-MM-DD');

    const docDefinition: TDocumentDefinitions = {
      content: ['hello world'],
    }

    const doc = this.printerService.createPDF(docDefinition);

    doc.info.Title = `Costos semana ${startOfWeek} al ${endOfWeek}`

    return doc;
  }
}
