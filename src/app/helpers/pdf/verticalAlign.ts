import { ContentTable, TableCell, ContextPageSize } from 'pdfmake/interfaces';

function findInlineHeight_(
  cell: TableCell,
  maxWidth: number,
  usedWidth = 0
): any {
  const calcLines = (
    inlines: { height: number; width: number; lineEnd: any }[]
  ) => {
    if (inlines == undefined)
      return {
        height: 0,
        width: 0,
      };
    let currentMaxHeight = 0;
    let lastHadLineEnd = false;
    for (const currentNode of inlines) {
      usedWidth += currentNode.width;
      if (usedWidth > maxWidth || lastHadLineEnd) {
        currentMaxHeight += currentNode.height;
        usedWidth = currentNode.width;
      } else {
        currentMaxHeight = Math.max(currentNode.height, currentMaxHeight);
      }
      lastHadLineEnd = !!currentNode.lineEnd;
    }
    return {
      height: currentMaxHeight,
      width: usedWidth,
    };
  };
  if ((cell as any)._offsets) {
    usedWidth += (cell as any)._offsets.total;
  }
  if ((cell as any)._inlines && (cell as any)._inlines.length) {
    return calcLines((cell as any)._inlines);
  } else if ((cell as any).stack && (cell as any).stack[0]) {
    return (cell as any).stack
      .map((item: TableCell) => {
        return findInlineHeight_(item, maxWidth);
      })
      .reduce((prev: ContextPageSize, next: ContextPageSize) => {
        return {
          height: prev.height + next.height,
          width: Math.max(prev.width + next.width),
        };
      });
  } else if ((cell as any).table) {
    let currentMaxHeight = 0;
    for (const currentTableBodies of (cell as any).table.body) {
      const innerTableHeights = currentTableBodies.map(
        (innerTableCell: TableCell) => {
          const findInlineHeight = findInlineHeight_(
            innerTableCell,
            maxWidth,
            usedWidth
          );

          usedWidth = findInlineHeight.width;
          return findInlineHeight.height;
        }
      );
      currentMaxHeight = Math.max(...innerTableHeights, currentMaxHeight);
    }
    return {
      height: currentMaxHeight,
      width: usedWidth,
    };
  } else if ((cell as any)._height) {
    usedWidth += (cell as any)._width;
    return {
      height: (cell as any)._height,
      width: usedWidth,
    };
  }

  return {
    height: null,
    width: usedWidth,
  };
}

function applyVerticalAlignment(
  node: ContentTable,
  rowIndex: number,
  align: string
): void {
  const allCellHeights = node.table.body[rowIndex].map(
    (innerNode, columnIndex) => {
      let width = 0;
      if (node.table.widths != undefined)
        width = (node.table.widths[columnIndex] as any)._calcWidth;
      return findInlineHeight_(innerNode, width).height;
    }
  );
  const maxRowHeight = Math.max(...allCellHeights);
  node.table.body[rowIndex].forEach((cell, ci) => {
    if (allCellHeights[ci] && maxRowHeight > allCellHeights[ci]) {
      let topMargin;
      let cellAlign = align;
      if (Array.isArray(align)) {
        cellAlign = align[ci];
      }
      if (align === 'bottom') {
        topMargin = maxRowHeight - allCellHeights[ci];
      } else if (align === 'center') {
        console.log(node, rowIndex);
        topMargin = (maxRowHeight - allCellHeights[ci]) / 2;
      }
      if (topMargin) {
        if ((cell as any)._margin) {
          (cell as any)._margin[1] = topMargin;
        } else {
          (cell as any)._margin = [0, topMargin, 0, 0];
        }
      }
    }
  });
}

export default applyVerticalAlignment;
