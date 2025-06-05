import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import moment from 'moment';
import type { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CostsEntity } from '../../entities/costs.entity';
import { Between, Repository } from 'typeorm';
import { ServicesEntity } from '../../entities/services.entity';
import { ExtrasByServiceEntity } from '../../entities/extras_by_service.entity';
import { PrinterService } from '../../printer/printer.service';

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

  private readonly hugoComission = 0.2;
  private readonly felixComission = 0.6;
  private readonly felixSonComission = 0.2;

  constructor(
    private readonly printerService: PrinterService,
    @InjectRepository(CostsEntity)
    private costsRepository: Repository<CostsEntity>,
    @InjectRepository(ServicesEntity)
    private readonly servicesRepository: Repository<ServicesEntity>,
  ) { }

  async reporteGeneral(date: string) {
    const startOfWeek = moment(date).startOf('isoWeek').format('YYYY-MM-DD');
    const endOfWeek = moment(date).endOf('isoWeek').format('YYYY-MM-DD');

    const today = moment();

    const queryBuilder = this.servicesRepository.createQueryBuilder('services');

    queryBuilder
      .leftJoinAndSelect('services.community', 'community')
      .leftJoinAndSelect('services.type', 'type')
      .leftJoinAndSelect('services.status', 'status')
      .leftJoinAndSelect('services.user', 'user')
      .leftJoinAndSelect('services.extrasByServices', 'extrasByServices')
      .leftJoinAndSelect('extrasByServices.extra', 'extra')
      .where('services.date BETWEEN :startOfWeek AND :endOfWeek', { startOfWeek, endOfWeek });

    const services = await queryBuilder.getMany();

    const servicesDashboard = services.map(service => {
      const totalExtrasByService = service.extrasByServices.reduce((acc, extraByService) => {
        return acc + Number(extraByService.extra.commission);
      }, 0);

      const totalCleaner = Number(totalExtrasByService) + Number(service.type.commission);
      const totalNotAdjusted = Number(service.type.price) - Number(service.type.commission) - Number(totalExtrasByService);

      const totalParner = totalNotAdjusted * 0.4;
      const total = totalNotAdjusted * 0.6;

      return {
        ...service,
        totalCleaner,
        totalParner,
        total,
      };
    });

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    // Totales
    const totalServicePrice = servicesDashboard.reduce((acc, service) => acc + Number(service.type.price), 0);
    const totalServiceCommission = servicesDashboard.reduce((acc, service) => acc + Number(service.type.commission), 0);
    const totalExtrasPrice = servicesDashboard.reduce((acc, service) =>
      acc + service.extrasByServices.reduce((sum, extraByService) => sum + Number(extraByService.extra.itemPrice), 0), 0);
    const totalExtrasCommission = servicesDashboard.reduce((acc, service) =>
      acc + service.extrasByServices.reduce((sum, extraByService) => sum + Number(extraByService.extra.commission), 0), 0);
    const totalCleanerSum = servicesDashboard.reduce((acc, service) => acc + service.totalCleaner, 0);
    const totalHugoSum = servicesDashboard.reduce((acc, service) => acc + (service.total * this.hugoComission), 0);
    const totalFelixSum = servicesDashboard.reduce((acc, service) => acc + (service.total * this.felixComission), 0);
    const totalFelixSonSum = servicesDashboard.reduce((acc, service) => acc + (service.total * this.felixSonComission), 0);

    const tableBody = [
      ['Date', 'Community', 'Unit number', 'Service Price', 'Service comission', 'Extras price', 'Extras comission', 'Total cleaner', 'Cleaner'],
      ...servicesDashboard.map(service => [
        moment(service.date).format('MM/DD/YYYY'),
        service.community.communityName,
        service.unitNumber,
        formatCurrency(Number(service.type.price)),
        formatCurrency(Number(service.type.commission)),
        formatCurrency(service.extrasByServices.reduce((acc, extraByService) => acc + Number(extraByService.extra.itemPrice), 0)),
        formatCurrency(service.extrasByServices.reduce((acc, extraByService) => acc + Number(extraByService.extra.commission), 0)),
        formatCurrency(Number(service.totalCleaner)),
        service.user?.name || 'N/A',
      ]),
      ['', '', 'Total',
        formatCurrency(totalServicePrice),
        formatCurrency(totalServiceCommission),
        formatCurrency(totalExtrasPrice),
        formatCurrency(totalExtrasCommission),
        formatCurrency(totalCleanerSum),
        '']
    ];

    // Nueva tabla de comisiones
    const comisionesTableBody = [
      ['Date', 'Community', 'Unit number', 'Total Service', 'Hugo (20%)', 'Felix (60%)', 'Felix hijo (20%)'],
      ...servicesDashboard.map(service => [
        moment(service.date).format('MM/DD/YYYY'),
        service.community.communityName,
        service.unitNumber,
        formatCurrency(service.total),
        formatCurrency(Number(service.total * this.hugoComission)),
        formatCurrency(Number(service.total * this.felixComission)),
        formatCurrency(Number(service.total * this.felixSonComission)),
      ]),
      ['', '', 'Total',
        formatCurrency(servicesDashboard.reduce((acc, service) => acc + service.total, 0)),
        formatCurrency(totalHugoSum),
        formatCurrency(totalFelixSum),
        formatCurrency(totalFelixSonSum)]
    ];

    // ---------- Sección de la tabla de Costos ----------
    const costs = [];

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

    const costosTableBody = [
      ['Date', 'Description', 'Amount'],
      ...costs.map(cost => [
        moment(cost.date).format('MM/DD/YYYY'),
        cost.description,
        `$${Number(cost.amount).toFixed(2)}`,
      ]),
      ['', 'Total', `$${costs.reduce((sum, cost) => sum + Number(cost.amount), 0).toFixed(2)}`]
    ];

    // Integrar todos los reportes en un solo PDF
    const docDefinition: TDocumentDefinitions = {
      styles,
      pageMargins: [40, 120, 40, 60],
      pageOrientation: 'landscape',
      pageSize: 'C3',
      header: {
        columns: [
          logo,
          {
            text: `General report week ${moment(startOfWeek).format('MM/DD/YYYY')} to ${moment(endOfWeek).format('MM/DD/YYYY')}`,
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
          text: 'Service Report',
          style: 'subheader',
          margin: [0, 10, 0, 10],
        },
        {
          layout: 'customLayout01',
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableBody
          }
        },
        {
          text: 'Comisiones Report',
          style: 'subheader',
          margin: [0, 20, 0, 10],
        },
        {
          layout: 'customLayout01',
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: comisionesTableBody
          }
        },
        {
          text: 'Weekly Costs',
          style: 'subheader',
          margin: [0, 20, 0, 10],
        },
        {
          layout: 'customLayout01',
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto'],
            body: costosTableBody
          }
        }
      ],
      footer: {
        text: `© ${moment().format('YYYY')} Services QPS. Este documento es confidencial y no puede ser compartido.`,
        style: 'footer',
      }
    };

    const doc = this.printerService.createPDF(docDefinition);

    doc.info.Title = `General Report ${startOfWeek} - ${endOfWeek}`;

    return doc;
  }



  async reporteCleaner(date: string) {
    const startOfWeek = moment(date).startOf('isoWeek').format('YYYY-MM-DD');
    const endOfWeek = moment(date).endOf('isoWeek').format('YYYY-MM-DD');
    const today = moment();

    const queryBuilder = this.servicesRepository.createQueryBuilder('services');

    queryBuilder
      .leftJoinAndSelect('services.community', 'community')
      .leftJoinAndSelect('services.type', 'type')
      .leftJoinAndSelect('services.status', 'status')
      .leftJoinAndSelect('services.user', 'user')
      .leftJoinAndSelect('services.extrasByServices', 'extrasByServices')
      .leftJoinAndSelect('extrasByServices.extra', 'extra')
      .where('services.date BETWEEN :startOfWeek AND :endOfWeek', { startOfWeek, endOfWeek });

    const services = await queryBuilder.getMany();

    // Agrupar por cleaner
    const cleanersMap = new Map<string, ServicesEntity[]>();
    services.forEach(service => {
      const cleanerName = service.user?.name || "N/A";
      if (!cleanersMap.has(cleanerName)) {
        cleanersMap.set(cleanerName, []);
      }
      cleanersMap.get(cleanerName).push(service);
    });

    const formatCurrency = (value: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    const content = [];

    cleanersMap.forEach((services, cleanerName) => {
      const servicesDashboard = services.map(service => {
        const totalExtrasByService = service.extrasByServices.reduce((acc, extraByService) => {
          return acc + Number(extraByService.extra.commission);
        }, 0);

        const totalCleaner = Number(totalExtrasByService) + Number(service.type.commission);
        const totalNotAdjusted = Number(service.type.price) - Number(service.type.commission) - Number(totalExtrasByService);

        const totalParner = totalNotAdjusted * 0.4;
        const total = totalNotAdjusted * 0.6;

        return {
          ...service,
          totalCleaner,
          totalParner,
          total,
        };
      });

      const tableBody = [
        ['Date', 'Community', 'Unit number', 'Type', 'Commission', 'Extras', 'Total'],
        ...servicesDashboard.map(service => [
          moment(service.date).format('MM/DD/YYYY'),
          service.community.communityName,
          service.unitNumber,
          'Total:',
          formatCurrency(Number(service.type.commission)),
          formatCurrency(service.extrasByServices.reduce((acc, extraByService) => acc + Number(extraByService.extra.commission), 0)),
          formatCurrency(Number(service.totalCleaner)),
        ]),
      ];

      content.push(
        {
          text: `Cleaner: ${cleanerName}`,
          style: 'subheader',
          margin: [0, 10, 0, 10],
          pageBreak: content.length > 0 ? 'before' : undefined,
        },
        {
          layout: 'customLayout01',
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableBody,
          },
        }
      );
    });

    const docDefinition: TDocumentDefinitions = {
      styles,
      pageMargins: [40, 120, 40, 60],
      pageOrientation: 'landscape',
      pageSize: 'LETTER',
      header: (currentPage, pageCount) => ({
        columns: [
          logo,
          {
            text: `Cleaner Report - Week ${moment(startOfWeek).format('MM/DD/YYYY')} to ${moment(endOfWeek).format('MM/DD/YYYY')}`,
            style: 'header',
          },
          {
            fontSize: 10,
            text: `Page ${currentPage} of ${pageCount} - ${today.format('LL')}`,
            italics: true,
            alignment: 'right',
            margin: [20, 20],
          },
        ],
      }),
      content,
      footer: (currentPage, pageCount) => ({
        text: `© ${moment().format('YYYY')} Services QPS. Este documento es confidencial y no puede ser compartido.`,
        style: 'footer',
        alignment: 'center',
        margin: [0, 10, 0, 0],
      }),
    };

    const doc = this.printerService.createPDF(docDefinition);
    doc.info.Title = `Costos semana ${startOfWeek} al ${endOfWeek}`;
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
