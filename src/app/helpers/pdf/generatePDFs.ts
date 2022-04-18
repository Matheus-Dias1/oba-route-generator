import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import receiptDocDefinition from './receiptDefinition';
import routeListDefinition from './routeListDefinition';
import routes from 'src/app/models/routes';

export const getReceipt = (routes: routes, selectedItems: string[]) => {
  if (selectedItems.length === 0) return;
  (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
  const doc = receiptDocDefinition(routes, selectedItems);
  const pdf = pdfMake.createPdf(doc);

  pdf.download('Canhotos');
};

export const getRoutesList = (routes: routes) => {
  (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
  const doc = routeListDefinition(routes);
  const pdf = pdfMake.createPdf(doc);

  pdf.download('Rotas');
};
