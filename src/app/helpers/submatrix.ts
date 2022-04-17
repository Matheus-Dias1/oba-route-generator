type bounds = {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
};

class SquareMatrixDivider {
  private matrix: any[][];

  constructor(matrix: any[][]) {
    this.matrix = matrix;
  }

  getBounds(SUB_MATRIX_SIZE: number) {
    const mSize = this.matrix.length;

    const mBounds: bounds[] = [];

    // Matrix smaller than submatrix return whole matrix
    if (SUB_MATRIX_SIZE >= mSize) {
      mBounds.push({
        start: {
          x: 0,
          y: 0,
        },
        end: {
          x: mSize - 1,
          y: mSize - 1,
        },
      });

      return mBounds;
    }

    // Complete submatrixes
    const matrixPerLine = Math.floor(mSize / SUB_MATRIX_SIZE);
    for (let i = 0; i < matrixPerLine; i++) {
      for (let j = 0; j < matrixPerLine; j++) {
        mBounds.push({
          start: {
            x: i * SUB_MATRIX_SIZE,
            y: j * SUB_MATRIX_SIZE,
          },
          end: {
            x: (i + 1) * SUB_MATRIX_SIZE - 1,
            y: (j + 1) * SUB_MATRIX_SIZE - 1,
          },
        });
      }
    }

    const isIncomplete = mSize % SUB_MATRIX_SIZE;
    if (!isIncomplete) return mBounds;
    // Incomplete submatrixes
    let i = mSize - (mSize % SUB_MATRIX_SIZE);
    let j = 0;

    while (j < mSize) {
      if (j + SUB_MATRIX_SIZE - 1 < mSize) {
        mBounds.push({
          start: {
            x: i,
            y: j,
          },
          end: {
            x: mSize - 1,
            y: j + SUB_MATRIX_SIZE - 1,
          },
        });

        mBounds.push({
          start: {
            x: j,
            y: i,
          },
          end: {
            x: j + SUB_MATRIX_SIZE - 1,
            y: mSize - 1,
          },
        });
      }
      j += SUB_MATRIX_SIZE;
    }

    // Last submatrix
    const remaining = mSize % SUB_MATRIX_SIZE;
    mBounds.push({
      start: {
        x: mSize - remaining,
        y: mSize - remaining,
      },
      end: {
        x: mSize - 1,
        y: mSize - 1,
      },
    });

    return mBounds;
  }

  // printSubmatrixes(boundsArr: bounds[], mSize: number) {
  //   const matrix: string[][] = [];
  //   function nextChar(c: string) {
  //     return String.fromCharCode(c.charCodeAt(0) + 1);
  //   }

  //   let nextLetter = 'A';
  //   for (let i = 0; i < mSize; i++) {
  //     matrix.push([]);
  //     for (let j = 0; j < mSize; j++) {
  //       matrix[i].push('😋');
  //     }
  //   }

  //   boundsArr.forEach((bounds) => {
  //     for (let i = bounds.start.x; i <= bounds.end.x; i++) {
  //       for (let j = bounds.start.y; j <= bounds.end.y; j++) {
  //         matrix[i][j] = nextLetter;
  //       }
  //     }
  //     nextLetter = nextChar(nextLetter);
  //   });

  //   matrix.forEach((row) => {
  //     row.forEach((elem) => process.stdout.write(`${elem}\t`));
  //     console.log('\n');
  //   });
  // }
}

export default SquareMatrixDivider;

// const m = [
//   [1, 2, 3, 4, 5],
//   [6, 7, 8, 9, 10],
//   [11, 12, 13, 14, 15],
//   [16, 17, 18, 19, 20],
//   [21, 22, 23, 24, 25],
// ];

// const m = [
//   [1, 2, 3, 4],
//   [6, 7, 8, 9],
//   [11, 12, 13, 14],
//   [16, 17, 18, 19],
// ];

// const smd = new SquareMatrixDivider(m);
// const bounds = smd.getBounds(4);
// console.log(bounds);
// smd.printSubmatrixes(bounds, m.length);
