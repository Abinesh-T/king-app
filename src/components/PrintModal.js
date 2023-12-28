import { Box, Container, Flex, Text, useMantineTheme } from "@mantine/core";
import moment from "moment/moment";
import React from "react";

export const PrintModal = React.forwardRef((props, ref) => {
  const theme = useMantineTheme();

  const rows = props.body?.map((e, i) => (
    <tr key={i + 1}>
      {e.map((h, index) => (
        <td key={index}>
          <div
            style={{ color: "black" }}
            dangerouslySetInnerHTML={{
              __html: h,
            }}
          />
        </td>
      ))}
    </tr>
  ));

  const foot_rows = props.foot?.map((e, i) => (
    <>
      {isNaN(e) || !props.cols?.includes(i, 0) ? (
        <td key={i}></td>
      ) : (
        <td key={i} style={{ color: "black", fontWeight: "bold" }}>
          {e?.toFixed(2)}
        </td>
      )}
    </>
  ));

  return (
    <div ref={ref}>
      <Container fluid mt={10}>
        <Flex align={"center"} justify={"center"} direction={"column"} gap={"lg"}>
          <Text color="black" fz={"lg"} fw={600}>
            {props.title}
          </Text>
        </Flex>
        <table width={"100%"} align="center" style={{ marginTop: "20px" }}>
          <thead
            style={{
              background: "white",
            }}
          >
            <tr>
              {props.head?.map((e, i) => (
                <th key={i}>
                  <Text color="black" size={"md"}>
                    {e}
                  </Text>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
          <tfoot>
            <tr>{foot_rows}</tr>
          </tfoot>
        </table>
      </Container>
    </div>
  );
});
