import { Box, Button, Flex, Grid, Modal, Radio, Text, useMantineTheme } from "@mantine/core";
import { IconPrinter } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { connectToDevice, listDevices, printDevice } from "services/bluetoothFunction";

const Printer = () => {
  const theme = useMantineTheme();
  const [modalOpened, setModalOpened] = useState(false);
  const [printerList, setPrinterList] = useState([]);
  const [printerSelected, setPrinterSelected] = useState();

  useEffect(() => {
    let selectedDevice = JSON.parse(localStorage.getItem("printer"));
    console.log(!selectedDevice);
    if (selectedDevice) {
      console.log(selectedDevice.name);
      setPrinterSelected(selectedDevice);
    } else {
      listDevices().then((result) => {
        setPrinterList(result);
        console.log(result);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("printer", printerSelected);
  // }, [printerSelected]);

  return (
    <Box p={5} mt={10}>
      <Flex align={"center"} justify={"center"} direction={"column"}>
        <Box p={5}>
          <Grid maw={500}>
            <Grid.Col>
              <Flex align={"center"} gap={"lg"}>
                <IconPrinter color={theme.colors.brand[8]} />
                <Text fw={"bold"}>{printerSelected?.name}</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col>
              <Flex align={"center"}>
                <Button
                  onClick={() => {
                    setModalOpened(true);
                  }}
                >
                  Select Printer
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
        </Box>
      </Flex>
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
        }}
        title="Select Printer"
      >
        <Flex direction={"column"} justify={"center"} gap={"lg"}>
          {printerList?.map((printer, index) => (
            <Radio
              key={index}
              fw={"bold"}
              label={printer.name}
              variant="outline"
              checked={printerSelected === printer}
              onChange={(event) => {
                console.log(event.currentTarget.checked ? printer : null);
                setPrinterSelected(event.currentTarget.checked ? printer : null);
                localStorage.setItem("printer", JSON.stringify(printer));
              }}
            />
          ))}
        </Flex>
      </Modal>
    </Box>
  );
};

export default Printer;
