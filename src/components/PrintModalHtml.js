export const PrintModalHtml = props => {
  const rows = props.body?.map(
    (e, i) =>
      `<tr>
      ${e.map(
        (h, index) =>
          `<td>
          <div
          style="color: black;"
          >${h}</div>
        </td>`
      )}
    </tr>`
  );

  const foot_rows = props.foot?.map(
    (e, i) => `<td style="color: black; font-weight: 500;" >${e}</td>`
  );

  const foot_multiple_rows = props.foots?.map(
    (e, i) =>
      `<tr>
      ${e.map(
        (h, index) =>
          `<td style="color: black; font-weight: 500;" >
          ${h}
        </td>`
      )}
    </tr>`
  );

  return `<div style="width: 400px;">
      <div style="margin-top: 10px;width: 100%;">
        ${
          props.title
            ? `<div style="width: 100%;display: flex;align-items: center;justify-content:center;flex-direction: column;gap:10px;">
            <h1 style="color:black;font-size: 10px;font-weight:600;">
              ${props.title}
            </h1>
          </div>`
            : `<div></div>`
        }
        ${props.children}
        <table style="width: 100%;display: flex;align-items: center; margin-top: 10px;border: 1px solid black;">
          <thead style="background: white;">
            <tr>
              ${props.head?.map(
                (e, i) =>
                  `<th>
                  <p style="color:black;text-align:justify;font-size:10px">
                    ${e}
                  </p>
                </th>`
              )}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            ${foot_multiple_rows}
            <tr>${foot_rows}</tr>
          </tfoot>
        </table>
      </div>
    </div>`;
};
