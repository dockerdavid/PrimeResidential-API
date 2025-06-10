import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import moment from 'moment';
import type { Content, StyleDictionary, TDocumentDefinitions, BufferOptions, CustomTableLayout } from 'pdfmake/interfaces';
import { CostsEntity } from '../../entities/costs.entity';
import { Between, Repository } from 'typeorm';
import { ServicesEntity } from '../../entities/services.entity';
import { ExtrasByServiceEntity } from '../../entities/extras_by_service.entity';
import { PrinterService } from '../../printer/printer.service';
import { CommunitiesEntity } from '../../entities/communities.entity';
const PdfPrinter = require('pdfmake');

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

const customTableLayouts: Record<string, CustomTableLayout> = {
    customLayout01: {
        hLineWidth: function (i, node) {
            if (i === 0 || i === node.table.body.length) {
                return 0;
            }
            return i === node.table.headerRows ? 2 : 1;
        },
        vLineWidth: function (i) {
            return 0;
        },
        hLineColor: function (i) {
            return i === 1 ? 'black' : '#bbbbbb';
        },
        paddingLeft: function (i) {
            return i === 0 ? 0 : 8;
        },
        paddingRight: function (i, node) {
            return i === node.table.widths.length - 1 ? 0 : 8;
        },
        fillColor: function (rowIndex, node, columnIndex) {
            // Si es el encabezado
            if (rowIndex === 0) {
                return '#7b90be';
            }
            // Si es la última fila (totales)
            if (rowIndex === node.table.body.length - 1) {
                return '#acb3c1';
            }
            
            // Obtener el contenido de la celda de Unit number (columna 2)
            const row = node.table.body[rowIndex];
            if (row && Array.isArray(row) && row[2] === 'Leasing center') {
                return '#ff0000';
            }
            
            // Patrón zebra para las demás filas
            return rowIndex % 2 === 0 ? '#f3f3f3' : null;
        }
    },
};

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
    @InjectRepository(CommunitiesEntity)
    private readonly communityRepository: Repository<CommunitiesEntity>,
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
      const totalExtrasByService = service.extrasByServices?.reduce((acc, extraByService) => {
        const commission = extraByService?.extra?.commission ?? 0;
        return acc + Number(commission);
      }, 0) ?? 0;

      const typeCommission = service.type?.commission ?? 0;
      const typePrice = service.type?.price ?? 0;

      const totalCleaner = Number(totalExtrasByService) + Number(typeCommission);
      const totalNotAdjusted = Number(typePrice) - Number(typeCommission) - Number(totalExtrasByService);

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
    const totalServicePrice = servicesDashboard.reduce((acc, service) => acc + Number(service.type?.price ?? 0), 0);
    const totalServiceCommission = servicesDashboard.reduce((acc, service) => acc + Number(service.type?.commission ?? 0), 0);
    const totalExtrasPrice = servicesDashboard.reduce((acc, service) =>
      acc + (service.extrasByServices?.reduce((sum, extraByService) => sum + Number(extraByService?.extra?.itemPrice ?? 0), 0) ?? 0), 0);
    const totalExtrasCommission = servicesDashboard.reduce((acc, service) =>
      acc + (service.extrasByServices?.reduce((sum, extraByService) => sum + Number(extraByService?.extra?.commission ?? 0), 0) ?? 0), 0);
    const totalCleanerSum = servicesDashboard.reduce((acc, service) => acc + (service.totalCleaner ?? 0), 0);
    const totalHugoSum = servicesDashboard.reduce((acc, service) => acc + ((service.total ?? 0) * this.hugoComission), 0);
    const totalFelixSum = servicesDashboard.reduce((acc, service) => acc + ((service.total ?? 0) * this.felixComission), 0);
    const totalFelixSonSum = servicesDashboard.reduce((acc, service) => acc + ((service.total ?? 0) * this.felixSonComission), 0);

    const tableBody = [
      ['Date', 'Community', 'Unit number', 'Service Price', 'Service comission', 'Extras price', 'Extras comission', 'Total cleaner', 'Cleaner'].map(header => ({
        text: header,
        fillColor: '#7b90be',
        color: '#ffffff'
      })),
      ...servicesDashboard.map(service => {
        const isLeasingCenter = service.unitNumber === 'Leasing center';
        const textColor = isLeasingCenter ? '#ff0000' : null;
        
        return [
          { text: moment(service.date).format('MM/DD/YYYY'), color: textColor },
          { text: service.community?.communityName ?? 'N/A', color: textColor },
          { text: service.unitNumber ?? 'N/A', color: textColor },
          { text: formatCurrency(Number(service.type?.price ?? 0)), color: textColor },
          { text: formatCurrency(Number(service.type?.commission ?? 0)), color: textColor },
          { text: formatCurrency(service.extrasByServices?.reduce((acc, extraByService) => acc + Number(extraByService?.extra?.itemPrice ?? 0), 0) ?? 0), color: textColor },
          { text: formatCurrency(service.extrasByServices?.reduce((acc, extraByService) => acc + Number(extraByService?.extra?.commission ?? 0), 0) ?? 0), color: textColor },
          { text: formatCurrency(Number(service.totalCleaner ?? 0)), color: textColor },
          { text: service.user?.name ?? 'N/A', color: textColor }
        ];
      }),
      ['', '', 'Total',
        formatCurrency(totalServicePrice),
        formatCurrency(totalServiceCommission),
        formatCurrency(totalExtrasPrice),
        formatCurrency(totalExtrasCommission),
        formatCurrency(totalCleanerSum),
        ''
      ].map(cell => ({
        text: cell,
        fillColor: '#acb3c1'
      }))
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

    const totalCosts = costs.reduce((sum, cost) => sum + Number(cost.amount), 0);
    const costPerShareholder = totalCosts / 3; // 33% para cada accionista

    // Nueva tabla de comisiones con costos
    const comisionesTableBody = [
      ['Accionista', 'Porcentaje', 'Ganancia Bruta', 'Costos (33%)', 'Ganancia Neta'],
      [
        'Hugo',
        '20%',
        formatCurrency(totalHugoSum),
        formatCurrency(costPerShareholder),
        formatCurrency(totalHugoSum - costPerShareholder)
      ],
      [
        'Felix',
        '60%',
        formatCurrency(totalFelixSum),
        formatCurrency(costPerShareholder),
        formatCurrency(totalFelixSum - costPerShareholder)
      ],
      [
        'Felix hijo',
        '20%',
        formatCurrency(totalFelixSonSum),
        formatCurrency(costPerShareholder),
        formatCurrency(totalFelixSonSum - costPerShareholder)
      ],
      [
        'Total',
        '100%',
        formatCurrency(totalHugoSum + totalFelixSum + totalFelixSonSum),
        formatCurrency(totalCosts),
        formatCurrency((totalHugoSum + totalFelixSum + totalFelixSonSum) - totalCosts)
      ]
    ];

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
            text: `Service Report - Week ${moment(startOfWeek).format('MM/DD/YYYY')} to ${moment(endOfWeek).format('MM/DD/YYYY')}`,
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
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableBody
          }
        },
        {
          text: 'Reporte de Comisiones por Accionista',
          style: 'subheader',
          margin: [0, 20, 0, 10],
        },
        {
          layout: 'customLayout01',
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
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

    doc.info.Title = `Service Report ${startOfWeek} - ${endOfWeek}`;

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
        const totalExtrasByService = service.extrasByServices?.reduce((acc, extraByService) => {
          const commission = extraByService?.extra?.commission ?? 0;
          return acc + Number(commission);
        }, 0) ?? 0;

        const typeCommission = service.type?.commission ?? 0;
        const typePrice = service.type?.price ?? 0;

        const totalCleaner = Number(totalExtrasByService) + Number(typeCommission);
        const totalNotAdjusted = Number(typePrice) - Number(typeCommission) - Number(totalExtrasByService);

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
          service.community?.communityName ?? 'N/A',
          service.unitNumber ?? 'N/A',
          'Total:',
          formatCurrency(Number(service.type?.commission ?? 0)),
          formatCurrency(service.extrasByServices?.reduce((acc, extraByService) => acc + Number(extraByService?.extra?.commission ?? 0), 0) ?? 0),
          formatCurrency(Number(service.totalCleaner ?? 0)),
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

  async reportByCommunity(communityId: string) {
    const today = moment();

    const queryBuilder = this.servicesRepository.createQueryBuilder('services');

    queryBuilder
      .leftJoinAndSelect('services.community', 'community')
      .leftJoinAndSelect('services.type', 'type')
      .leftJoinAndSelect('services.status', 'status')
      .leftJoinAndSelect('services.user', 'user')
      .where('services.community_id = :communityId', { communityId });

    const services = await queryBuilder.getMany();

    const tableBody = [
      ['Date', 'Schedule', 'Unit number', 'Unity size', 'Type', 'Status', 'Cleaner', 'Comment'].map(header => ({
        text: header,
        fillColor: '#7b90be',
        color: '#ffffff'
      })),
      ...services.map(service => {
        const isLeasingCenter = service.unitNumber === 'Leasing center';
        const textColor = isLeasingCenter ? '#ff0000' : null;
        
        return [
          { text: moment(service.date).format('MM/DD/YYYY'), color: textColor },
          { text: service.schedule ? moment(service.schedule, 'HH:mm:ss').format('hh:mm A') : 'N/A', color: textColor },
          { text: service.unitNumber ?? 'N/A', color: textColor },
          { text: service.unitySize ?? 'N/A', color: textColor },
          { text: service.type?.name ?? 'N/A', color: textColor },
          { text: service.status?.name ?? 'N/A', color: textColor },
          { text: service.user?.name ?? 'N/A', color: textColor },
          { text: service.comment ?? 'N/A', color: textColor }
        ];
      })
    ];

    const community = await this.communityRepository.findOne({ where: { id: communityId } });

    const docDefinition: TDocumentDefinitions = {
      styles,
      pageMargins: [40, 120, 40, 60],
      pageOrientation: 'landscape',
      pageSize: 'C3',
      header: {
        columns: [
          logo,
          {
            text: `Service Report - ${community?.communityName ?? 'Community'}`,
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
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
            body: tableBody
          }
        }
      ],
      footer: {
        text: `© ${moment().format('YYYY')} Services QPS. Este documento es confidencial y no puede ser compartido.`,
        style: 'footer',
      }
    };

    const doc = this.printerService.createPDF(docDefinition);

    doc.info.Title = `Service Report - ${community?.communityName ?? 'Community'}`;

    return doc;
  }
}
