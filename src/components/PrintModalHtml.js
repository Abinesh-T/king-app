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
      ${getMerged(e.map((h, index) => `<td style="width: 100%;text-align: start;">${h}</td>`))}
    </tr>`
  );

  const foot_rows = props.foot?.map(
    (e, i) => `<td style="width: 100%;text-align: start;color: black; font-weight: 500;" >${e}</td>`
  );

  const foot_multiple_rows = props.foots?.map(
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
            `<td style="width: 100%;text-align: start;color: black;font-weight: 500;" >
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
        <table style="display: flex;padding: 2px;border-collapse: collapse;margin-top: 10px;border: 1px solid black;flex-direction: column;">
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
                    `<th  style="width: 100%;text-align: start;">
                    ${e}
                </th>`
                )
              )}
            </tr>
          </thead>
          <tbody>${getMerged(rows)}</tbody>
          <tfoot>
            ${foot_multiple_rows ? getMerged(foot_multiple_rows) : ""}
            <tr style="
            width: 100%;
            display: flex;
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
      ${getMerged(e.map((h, index) => `<td style="width: 100%;text-align: start;">${h}</td>`))}
    </tr>`
  );

  const foot_rows = props.foot?.map(
    (e, i) => `<td style="width: 100%;text-align: start;color: black; font-weight: 500;" >${e}</td>`
  );

  const foot_multiple_rows = props.foots?.map(
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
            `<td style="width: 100%;text-align: start;color: black;font-weight: 500;" >
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
                    height: 3276mm !important;
                    margin: 0.2mm 0.2mm 0.2mm 0.2mm !important;
                    /* change the margins as you want them to be. */
                }
            }
            @page {
            width: 104mm !important;
            height: 3276mm !important;
            margin: 0.2mm 0.2mm 0.2mm 0.2mm !important;
            /* change the margins as you want them to be. */
        }
        p{
            margin: 0px !important;
        }
        </style>
    </head>

    <body style="font-family:  Calibri, sans-serif;padding: 2px;">
    <div style="width: 100%;">
      <div style="margin-top: 10px;width: 100%;">
        ${
          props.title
            ? `<div style="width: 100%;display: flex;align-items: center;justify-content:center;flex-direction: column;gap:10px;">
            <h1 style="color:black;font-size: 16px;font-weight:600;">
              ${props.title}
            </h1>
          </div>`
            : `<div></div>`
        }
        ${props.children}
        <table style="display: flex;margin: 2px;border-collapse: collapse;margin-top: 10px;border: 1px solid black;flex-direction: column;">
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
                    `<th  style="width: 100%;text-align: start;">
                    ${e}
                </th>`
                )
              )}
            </tr>
          </thead>
          <tbody>${getMerged(rows)}</tbody>
          <tfoot>
            ${foot_multiple_rows ? getMerged(foot_multiple_rows) : ""}
            <tr style="
            width: 100%;
            display: flex;
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
