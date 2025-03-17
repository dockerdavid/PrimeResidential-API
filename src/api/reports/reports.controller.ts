import { Controller, Get, Param, ParseDatePipe, Res } from '@nestjs/common';

import { Response } from 'express';

import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('/reporte-general/:date')
  reporteGeneral(@Res() response: Response, @Param('date', new ParseDatePipe()) date: string) {
    const pdfDoc = this.reportsService.reporteSemana(date);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('/reporte-cleaner/:date')
  reporteCleaner(@Res() response: Response, @Param('date', new ParseDatePipe()) date: string) {
    const pdfDoc = this.reportsService.reporteSemana(date);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('/reporte-invoce/:date')
  reporteInvoice(@Res() response: Response, @Param('date', new ParseDatePipe()) date: string) {
    const pdfDoc = this.reportsService.reporteSemana(date);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('/reporte-semana/:date')
  reporteSemana(@Res() response: Response, @Param('date', new ParseDatePipe()) date: string) {
    const pdfDoc = this.reportsService.reporteSemana(date);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('/costos-semana/:date')
  async costosSemana(@Res() response: Response, @Param('date', new ParseDatePipe()) date: string) {
    const pdfDoc = await this.reportsService.costosSemana(date);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
