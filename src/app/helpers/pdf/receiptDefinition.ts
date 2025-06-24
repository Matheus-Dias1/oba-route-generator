import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import Logo from "../../../assets/logo_b64";
import routes from "src/app/models/routes";

const getDateMargin = (num: number) => {
  let topMargin = 20;
  if (num > 3) {
    topMargin = (num - 3) * 28 + topMargin;
  }

  return [0, topMargin, 0, 0];
};

const receiptDocDefinition = (
  routes: routes,
  selectedItems: string[],
  date: string | null,
): TDocumentDefinitions => {
  const dateStr = date ? date.split("-").reverse().join("/") : "";
  const doc: TDocumentDefinitions = {
    content: [],
    styles: {
      routeText: {
        alignment: "center",
        bold: true,
        fontSize: 16,
      },
      dateText: {
        bold: true,
        fontSize: 10,
        color: "#787878",
      },
      date: {
        fillColor: "#fbfbfb",
      },
      name: {
        bold: true,
        fontSize: 12,
      },
      address: {
        fontSize: 10,
        margin: [0, 2, 0, 0],
      },
      companyName: {
        fontSize: 8,
        bold: true,
        color: "#787878",
        margin: [0, 0, 0, 0],
      },
      companyInfo: {
        fontSize: 8,
        color: "#787878",
        margin: [0, 5, 0, 0],
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
      },
      tableCell: {
        fontSize: 10,
      },
    },
    images: {
      logo: Logo,
    },
  };

  const contents: Content[] = [];
  for (let key in routes) {
    const routeContents: Content[] = [];
    routes[key].schools.forEach((school) => {
      const name = school.name;
      const address = school.address.geocodedAddr || school.address.rawAddr;
      const items = school.items.filter((item) =>
        selectedItems.includes(item.description),
      );

      // Skip if no items match
      if (items.length === 0) return;
      if (items.length < 3) {
        // we add extra items to make the receipt look better
        items.push(
          ...Array(3 - items.length).fill({
            description: "_",
            amount: "",
            unit: "",
          }),
        );
      }

      // Create items table rows
      const tableRows = [];
      // Header row
      tableRows.push([
        { text: "Item", style: "tableHeader" },
        { text: "Quantidade", style: "tableHeader", alignment: "center" },
        { text: "Unidade", style: "tableHeader", alignment: "center" },
      ]);

      // Item rows
      items.forEach((item) => {
        tableRows.push([
          {
            text: item.description,
            style: "tableCell",
            color: item.description === "_" ? "#F8F8F8" : "black",
          },
          { text: item.amount, style: "tableCell", alignment: "center" },
          { text: item.unit, style: "tableCell", alignment: "center" },
        ]);
      });

      const receiptContent: Content = {
        table: {
          widths: ["*"],
          body: [
            [
              {
                stack: [
                  // Route title with page break if needed
                  {
                    text: !routeContents.length ? `Rota ${key}` : "",
                    style: "routeText",
                    pageBreak:
                      !routeContents.length && key !== Object.keys(routes)[0]
                        ? "before"
                        : undefined,
                    margin: [0, 0, 0, 15],
                  },
                  // Main content table
                  {
                    unbreakable: true,
                    table: {
                      widths: ["*"],
                      body: [
                        [
                          {
                            table: {
                              widths: ["auto", "*"],
                              body: [
                                [
                                  // Left column - Company info
                                  {
                                    stack: [
                                      {
                                        image: "logo",
                                        width: 60,
                                        margin: [0, 0, 0, 5],
                                      },
                                      {
                                        text: "OBAGREEN COMERCIO LTDA",
                                        style: "companyName",
                                        noWrap: true,
                                      },
                                      {
                                        text: "CNPJ: 35.810.505/0001-04",
                                        style: "companyInfo",
                                        margin: [0, 0, 0, 4], // Increased spacing after CNPJ
                                      },
                                      {
                                        text: "Avenida Atlântica, 20.\nBairro Pres. Roosevelt.\nUberlândia - MG",
                                        style: "companyInfo",
                                      },
                                      {
                                        text: "Data",
                                        style: "dateText",
                                        margin: getDateMargin(items.length),
                                      },
                                      {
                                        canvas: [
                                          {
                                            type: "rect",
                                            x: 0,
                                            y: 0,
                                            w: 100,
                                            h: 30,
                                            r: 4,
                                            lineColor: "white",
                                            color: "#F8F8F8",
                                          },
                                        ],
                                      },
                                      {
                                        text: dateStr,
                                        style: "date",
                                        relativePosition: { x: 16, y: -22 },
                                      },
                                    ],
                                    border: [false, false, false, false],
                                  },
                                  // Right column - School info and items
                                  {
                                    stack: [
                                      {
                                        text: name,
                                        style: "name",
                                        alignment: "right",
                                      },
                                      {
                                        text: address,
                                        style: "address",
                                        alignment: "right",
                                        margin: [0, 2, 0, 20], // Added margin before table
                                      },
                                      // Items table
                                      {
                                        table: {
                                          widths: ["*", "auto", "auto"],
                                          body: tableRows,
                                          headerRows: 1,
                                        },
                                        layout: {
                                          hLineWidth: function (i, node) {
                                            // Only show horizontal lines for data rows, not between header cells
                                            return i > 1 &&
                                              i < node.table.body.length
                                              ? 0.5
                                              : 0;
                                          },
                                          vLineWidth: function (i, node) {
                                            // No vertical lines
                                            return 0;
                                          },
                                          hLineColor: function (i, node) {
                                            return "#EBEBEB";
                                          },
                                          fillColor: function (i, node) {
                                            // Apply background color only to header row
                                            return i > 0 ? "#F8F8F8" : null;
                                          },
                                          paddingLeft: function (i) {
                                            return 8;
                                          },
                                          paddingRight: function (i) {
                                            return 8;
                                          },
                                          paddingTop: function (i) {
                                            return 8;
                                          },
                                          paddingBottom: function (i) {
                                            return 8;
                                          },
                                          borderRadius: 4,
                                          roundedCorners: [
                                            "topLeft",
                                            "topRight",
                                            "bottomLeft",
                                            "bottomRight",
                                          ],
                                        },
                                      },
                                    ],
                                    border: [false, false, false, false],
                                  },
                                ],
                              ],
                            },
                            layout: "noBorders",
                          },
                        ],
                      ],
                    },
                    layout: {
                      hLineWidth: function () {
                        return 0.5;
                      },
                      vLineWidth: function () {
                        return 0.5;
                      },
                      paddingLeft: function () {
                        return 10;
                      },
                      paddingRight: function () {
                        return 10;
                      },
                      paddingTop: function () {
                        return 10;
                      },
                      paddingBottom: function () {
                        return 10;
                      },
                    },
                  },
                ],
                margin: [20, 20, 20, 20],
              },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 0],
      };

      routeContents.push(receiptContent);
    });
    contents.push(...routeContents);
  }
  doc.content = contents;
  return doc;
};

export default receiptDocDefinition;
