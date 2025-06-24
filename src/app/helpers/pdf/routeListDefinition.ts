import { TDocumentDefinitions, Content, TableCell } from "pdfmake/interfaces";
import routes from "src/app/models/routes";

const routeListDefinition = (routes: routes): TDocumentDefinitions => {
  const doc: TDocumentDefinitions = {
    pageOrientation: "landscape",
    content: [],
    styles: {
      routeText: {
        alignment: "center",
        bold: true,
        fontSize: 16,
      },
      dateText: {
        bold: true,
        margin: [0, 20, 0, 0],
        alignment: "center",
        fontSize: 15,
      },
      nameInCell: {
        bold: true,
        fontSize: 10,
      },
      addressInCell: {
        fontSize: 8,
        color: "gray",
      },
      item: {
        fontSize: 16,
        lineHeight: 1.3,
      },
      padding: {
        margin: [10, 0, 10, 0],
      },
    },
  };

  const contents: Content[] = [];
  const items: { description: string; amount: number; unit: string }[] = [];

  for (let key in routes) {
    for (let school of routes[key].schools) {
      school.items.forEach((item) => {
        if (!items.find((it) => it.description === item.description))
          items.push(item);
      });
    }
  }

  for (let key in routes) {
    const routeContents: Content[] = [];
    const routeTitle: Content = {
      text: `Rota ${key}`,
      margin: [0, 0, 0, 15],
      style: "routeText",
      pageBreak:
        !routeContents.length && key !== Object.keys(routes)[0]
          ? "before"
          : undefined,
    };
    routeContents.push(routeTitle);
    const tableBase: Content = {
      table: {
        dontBreakRows: true,
        widths: [15, "*", ...Array(items.length).fill("auto")],
        body: [
          [
            {
              text: "nº",
              bold: true,
              alignment: "center",
              fontSize: 10,
            },
            {
              text: "Escola",
              bold: true,
              fontSize: 10,
            },
            ...items.map((it) => ({
              text: `${it.description} (${it.unit})`,
              alignment: "center",
              bold: true,
              fontSize: 10,
            })),
          ],
        ],
      },

      layout: "lightHorizontalLines",
    };
    routes[key].schools.forEach((school, i) => {
      const name = school.name;
      const address = school.address.geocodedAddr || school.address.rawAddr;

      const schoolItems = items.map((item) => {
        const currItem = school.items.find(
          (it) => it.description === item.description,
        );
        if (currItem) return currItem.amount;
        return 0;
      });
      const schoolInfoCell = {
        stack: [
          { text: name, style: "nameInCell" },
          { text: address, style: "addressInCell" },
        ],
      };
      const row: TableCell[] = [
        {
          text: i + 1,
          alignment: "center",
          margin: [0, 5, 0, 0],
          fontSize: 10,
        },
        schoolInfoCell,
        ...schoolItems.map((amount) => ({
          text: amount,
          alignment: "center",
          margin: [0, 5, 0, 0],
          fontSize: 10,
        })),
      ];
      tableBase.table.body.push(row);
    });
    routeContents.push(tableBase);
    contents.push(...routeContents);
  }
  doc.content = contents;
  return doc;
};

export default routeListDefinition;
