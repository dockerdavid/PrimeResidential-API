import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import moment from 'moment';
import type { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrinterService } from 'src/printer/printer.service';
import { CostsEntity } from '../../entities/costs.entity';
import { Between, Repository } from 'typeorm';

const styles: StyleDictionary = {
  header: {
    fontSize: 10,
    bold: true,
    alignment: 'center',
    margin: [0, 60, 0, 20],
  },
  body: {
    alignment: 'justify',
    margin: [0, 0, 0, 70],
  },
  footer: {
    fontSize: 10,
    italics: true,
    alignment: 'center',
    margin: [0, 0, 0, 20],
  }
}

const logo: Content = {
  image: 'src/assets/logo.png',
  width: 150,
  alignment: 'center',
}

@Injectable()
export class ReportsService {

  constructor(
    private readonly printerService: PrinterService,
    @InjectRepository(CostsEntity)
    private costsRepository: Repository<CostsEntity>,
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

  async costosSemana(date: string) {
    const startOfWeek = moment(date).startOf('isoWeek').format('YYYY-MM-DD');
    const endOfWeek = moment(date).endOf('isoWeek').format('YYYY-MM-DD');

    const today = moment();
    const costs = []

    const costsVariables = await this.costsRepository.find({
      where: {
        date: Between(startOfWeek, endOfWeek),
      },
    });

    const extraCosts = [
      { date: today.format('MM/DD/YYYY'), description: 'GoDaddy (email QPS)', amount: 2.5 },
      { date: today.format('MM/DD/YYYY'), description: 'Savings Navidad', amount: 75 },
      { date: today.format('MM/DD/YYYY'), description: 'Kemper (Insurance)', amount: 105.75 },
      { date: today.format('MM/DD/YYYY'), description: 'Next Insurance G/L', amount: 20 },
    ];

    costs.push(
      ...extraCosts.map(cost => ({
        date: moment(cost.date).format('YYYY-MM-DD'),
        description: cost.description,
        amount: cost.amount,
      })),
      ...costsVariables,
    );

    const docDefinition: TDocumentDefinitions = {
      styles,
      pageMargins: [40, 120, 40, 60],
      header: {
        columns: [
          logo,
          {
            text: `Costs week ${moment(startOfWeek).format('MM/DD/YYYY')} to ${moment(endOfWeek).format('MM/DD/YYYY')}`,
            style: 'header',
          },
          {
            fontSize: 10,
            text: today.format('LL'),
            italics: true,
            alignment: 'right',
            margin: [20, 20],
          }
        ],
      },
      content: [
        {
          layout: 'customLayout01',
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto'],
            body: [
              ['Date', 'Description', 'Amount'],
              ...costs.map(cost => [
                moment(cost.date).format('MM/DD/YYYY'),
                cost.description,
                `$${Number(cost.amount).toFixed(2)}`,
              ]),
              ['', 'Total', `$${costs.reduce((sum, cost) => sum + Number(cost.amount), 0).toFixed(2)}`]
            ]
          }
        }
      ],
      footer: {
        text: `© ${moment().format('YYYY')} Services QPS. Este documento es confidencial y no puede ser compartido.`,
        style: 'footer',
      }
    };

    const doc = this.printerService.createPDF(docDefinition);

    doc.info.Title = `Costos semana ${startOfWeek} al ${endOfWeek}`

    return doc;
  }
}
