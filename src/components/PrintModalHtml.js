export const getMerged = list => {
  let data = ``;
  list?.map((e, i) => {
    data += `${e}`;
  });
  return data;
};

export const PrintModalTable = props => {
  const rows = props.body?.map(
    (e, i) =>
      `<tr style="
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
  ">
      ${getMerged(
        e.map(
          (h, index) =>
            `<td style="width: ${
              props.head?.findIndex(v => v === "Item") === index ? "100" : index === 0 ? "43" : "32"
            }%;text-align: start;">${h}</td>`
        )
      )}
    </tr>`
  );

  const foot_rows = props.foot?.map(
    (e, i) =>
      `<td style="width: ${
        props.head?.findIndex(v => v === "Item") === i ? "100" : i === 0 ? "43" : "32"
      }%;text-align: start;color: black; " >${e}</td>`
  );

  const foot_multiple_rows = props.foots?.map(
    (e, i) =>
      `<tr style="
      width: 100%;
      display: flex;
      font-weight: bold";
      justify-content: center;
      align-items: center;
  ">
      ${getMerged(
        e.map(
          (h, index) =>
            `<td style="width: ${
              props.head?.findIndex(v => v === "Item") === index ? "100" : index === 0 ? "43" : "32"
            }%;text-align: start;color: black;" >
          ${h}
        </td>`
        )
      )}
    </tr>`
  );

  return `
    <div style="width: 100%;">
      <div style="margin-top: 10px;width: 100%;">
        ${props.children}
        <table style="display: flex;font-size: 18px;margin: 2px;border-collapse: collapse;margin-top: 10px;border: 1px solid black;flex-direction: column;">
          <thead style="background: white;">
            <tr style="
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        ">
              ${getMerged(
                props.head?.map(
                  (e, i) =>
                    `<th  style="width: ${
                      e === "Item" ? "100" : i === 0 ? "43" : "32"
                    }%;text-align: start;">
                    ${e}
                    </th>`
                )
              )}
            </tr>
          </thead>
          <tbody style="font-weight: bold";">${getMerged(rows)}</tbody>
          <tfoot style="font-weight: bold";">
            ${foot_multiple_rows ? getMerged(foot_multiple_rows) : ""}
            <tr style="
            width: 100%;
            display: flex;
            font-weight: bold";
            justify-content: center;
            align-items: center;
        ">${getMerged(foot_rows)}</tr>
          </tfoot>
        </table>
      </div>
    </div>`;
};

export const PrintModalHtml = props => {
  const rows = props.body?.map(
    (e, i) =>
      `<tr style="
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
  ">
      ${getMerged(
        e.map(
          (h, index) =>
            `<td style="width: ${
              props.head?.findIndex(v => v === "Item") === index ? "100" : index === 0 ? "43" : "32"
            }%;text-align: start;">${h}</td>`
        )
      )}
    </tr>`
  );

  const foot_rows = props.foot?.map(
    (e, i) =>
      `<td style="width: ${
        props.head?.findIndex(v => v === "Item") === i ? "100" : i === 0 ? "43" : "32"
      }%;text-align: start;color: black; " >${e}</td>`
  );

  const foot_multiple_rows = props.foots?.map(
    (e, i) =>
      `<tr style="
      width: 100%;
      display: flex;
      font-weight: bold";
      justify-content: center;
      align-items: center;
  ">
      ${getMerged(
        e.map(
          (h, index) =>
            `<td style="width: ${
              props.head?.findIndex(v => v === "Item") === index ? "100" : index === 0 ? "43" : "32"
            }%;text-align: start;color: black;" >
          ${h}
        </td>`
        )
      )}
    </tr>`
  );

  return `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>King App</title>
        <style>
            @media print {
                body {
                    width: 104mm !important;
                    margin: 0.4mm 0.4mm 0.4mm 0.4mm !important;
                    /* change the margins as you want them to be. */
                }
            }
            @page {
            width: 104mm !important;
            margin: 0.4mm 0.4mm 0.4mm 0.4mm !important;
            /* change the margins as you want them to be. */
        }
        p{
            margin: 0px !important;
        }
        </style>
    </head>

    <body style="font-family:  Calibri, sans-serif;padding: 2px;">
    <div style="width: 100%;">
      <div style="width: 100%;">
        ${
          props.title
            ? `<div style="width: 100%;display: flex;align-items: center;justify-content:center;flex-direction: column;gap:5px;">
            <h1 style="color:black;font-size: 18px;font-weight:600;">
              ${props.title}
            </h1>
          </div>`
            : `<div></div>`
        }
        ${props.children}
        <table style="display: flex;font-size: 18px;margin: 2px;border-collapse: collapse;margin-top: 10px;border: 1px solid black;flex-direction: column;">
          <thead style="background: white;">
            <tr style="
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        ">
              ${getMerged(
                props.head?.map(
                  (e, i) =>
                    `<th  style="width: ${
                      e === "Item" ? "100" : i === 0 ? "43" : "32"
                    }%;text-align: start;">
                    ${e}
                    </th>`
                )
              )}
            </tr>
          </thead>
          <tbody style="font-weight: bold;">${getMerged(rows)}</tbody>
          <tfoot style="font-weight: bold;">
            ${foot_multiple_rows ? getMerged(foot_multiple_rows) : ""}
            <tr style="
            width: 100%;
            display: flex;
            font-weight: bold";
            justify-content: center;
            align-items: center;
        ">${getMerged(foot_rows)}</tr>
          </tfoot>
        </table>
      </div>
    </div>
  </body>
  </html>`;
};
