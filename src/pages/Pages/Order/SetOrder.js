import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Grid,
  Modal,
  NumberInput,
  Select,
  Table,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { IconCirclePlus, IconDeviceFloppy, IconPrinter, IconX } from "@tabler/icons";
import { MantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { showErrorToast, showSuccessToast } from "utilities/Toast";

import { api_add_order, api_edit_order } from "./order.service";
import { api_all_item } from "../Item/item.service";
import { api_all_rate } from "../Settings/rate.service";

const SetOrder = props => {
  const theme = useMantineTheme();

  const [orderData, setOrderData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [itemData, setItemData] = useState([]);
  const [errorParty, setErrorParty] = useState(null);

  const [toParty, setToParty] = useState(null);
  const [footer, setFooter] = useState(["", "Total", "", "", "", ""]);
  const [render, setRender] = useState(false);
  const [rate, setRate] = useState({ box_rate: 0, pcs_rate: 0, crate_rate: 0 });
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    api_all_rate()
      .then(res => {
        if (res.success) {
          console.log(res);
          if (res?.data?.id !== undefined) {
            rate["box_rate"] = res?.data?.box;
            rate["pcs_rate"] = res?.data?.pcs;
            rate["crate_rate"] = res?.data?.crate;
          }
        } else {
          showErrorToast({ title: "Error", message: res.message });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const fetch_item = useQuery("fetch_item", api_all_item, {
    refetchOnWindowFocus: false,
    onSuccess: res => {
      setItemData(res.data);
      let order = [];
      res.data?.map((e, i) => {
        order.push({
          code: e.code,
          item_id: e.id,
        });
      });
      if (props.editingData !== null) {
        setToParty(props.editingData?.reciever);
        setDate(new Date(props.editingData?.date + ", 00:00:00 AM"));

        console.log(props.editingData, order);

        props.editingData?.order_items?.map((e, i) => {
          order.map((v, i) => {
            if (v.item_id === e.item) {
              v["amount"] = e.amount;
              v["box"] = e.box;
              v["pcs"] = e.pcs;
              v["crate"] = e.crate;
              v["supplier_party"] = e.supplier;
              v["id"] = e.id;
            }
          });
        });

        setOrderData(order);
      } else {
        setOrderData(order);
      }
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "supplier_party",
        header: "Supplier Party",
        size: 70,
        Cell: ({ cell }) => {
          return (
            <div>
              <Select
                searchable
                dropdownPosition="bottom"
                value={cell.row.original[cell.column.id]}
                onChange={e => {
                  cell.row._valuesCache[cell.column.id] = e;
                  cell.row.original[cell.column.id] = e;
                  setRender(e => !e);
                }}
                placeholder="Select Party"
                data={props.partyData.filter((e, i) => e.type === "supplier")}
              />
            </div>
          );
        },
      },
      {
        accessorKey: "code",
        header: "Item Code",
        size: 70,
        Footer: ({ table }) => {
          return (
            <>
              <Text>{"Total"}</Text>
            </>
          );
        },
      },
      {
        accessorKey: "box",
        header: "Box",
        size: 50,
        Cell: cell => {
          return (
            <div>
              <NumberInput
                miw={"40px"}
                value={cell.row.original[cell.column.id]}
                onChange={e => {
                  cell.row._valuesCache[cell.column.id] = e;
                  cell.row.original[cell.column.id] = e;
                  cell.row.original["amount"] =
                    rate.box_rate * e +
                    rate.pcs_rate *
                      (isNaN(cell.row.original["pcs"]) ? 0 : cell.row.original["pcs"]);
                  setRender(e => !e);
                }}
                min={0}
                hideControls
                placeholder="Box"
              />
            </div>
          );
        },
        Footer: ({ table }) => {
          let rows = table.getPaginationRowModel().rows;
          let sum_box = 0;
          rows.map((e, i) => {
            if (!isNaN(e.original.box)) sum_box += e.original.box;
          });
          let f = footer;
          f[2] = sum_box;
          setFooter(f);
          return (
            <>
              <Text>{sum_box}</Text>
            </>
          );
        },
      },
      {
        accessorKey: "pcs",
        header: "Pcs",
        size: 50,
        Cell: cell => {
          return (
            <div>
              <NumberInput
                miw={"40px"}
                value={cell.row.original[cell.column.id]}
                onChange={e => {
                  cell.row._valuesCache[cell.column.id] = e;
                  cell.row.original[cell.column.id] = e;
                  cell.row.original["amount"] =
                    rate.box_rate *
                      (isNaN(cell.row.original["box"]) ? 0 : cell.row.original["box"]) +
                    rate.pcs_rate * e;
                  setRender(e => !e);
                }}
                hideControls
                min={0}
                placeholder="Pcs"
              />
            </div>
          );
        },
        Footer: ({ table }) => {
          let rows = table.getPaginationRowModel().rows;
          let sum_pcs = 0;
          rows.map((e, i) => {
            if (!isNaN(e.original.pcs)) sum_pcs += e.original.pcs;
          });
          let f = footer;
          f[3] = sum_pcs;
          setFooter(f);
          return (
            <>
              <Text>{sum_pcs}</Text>
            </>
          );
        },
      },
      {
        accessorKey: "crate",
        header: "Crate",
        size: 50,
        Cell: cell => {
          return (
            <div>
              <NumberInput
                miw={"40px"}
                value={cell.row.original[cell.column.id]}
                onChange={e => {
                  cell.row._valuesCache[cell.column.id] = e;
                  cell.row.original[cell.column.id] = e;
                  cell.row.original["amount"] =
                    rate.crate_rate * e +
                    rate.box_rate *
                      (isNaN(cell.row.original["box"]) ? 0 : cell.row.original["box"]) +
                    rate.pcs_rate *
                      (isNaN(cell.row.original["pcs"]) ? 0 : cell.row.original["pcs"]);
                  setRender(e => !e);
                }}
                hideControls
                min={0}
                placeholder="Crate"
              />
            </div>
          );
        },
        Footer: ({ table }) => {
          let rows = table.getPaginationRowModel().rows;
          let sum_crate = 0;
          rows.map((e, i) => {
            if (!isNaN(e.original.crate)) sum_crate += e.original.crate;
          });
          let f = footer;
          f[4] = sum_crate;
          setFooter(f);
          return (
            <>
              <Text>{sum_crate}</Text>
            </>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        size: 50,
        Cell: cell => {
          let amount = cell.row.original[cell.column.id];
          cell.row.original[cell.column.id] = isNaN(amount) ? 0 : amount;
          return (
            <div>
              <Text>{cell.row.original[cell.column.id]}</Text>
            </div>
          );
        },
        Footer: ({ table }) => {
          let rows = table.getPaginationRowModel().rows;
          let sum_amount = 0;
          rows.map((e, i) => {
            if (!isNaN(e.original.amount)) sum_amount += e.original.amount;
          });
          let f = footer;
          f[5] = sum_amount;
          setFooter(f);
          setTableData(rows);
          setIsSelected(false);
          return (
            <>
              <Text>{sum_amount}</Text>
            </>
          );
        },
      },
    ],
    []
  );

  const addItem = async (orderData, footer, toParty, date) => {
    // console.log(orderData, footer, toParty, date);
    let order_items = orderData?.filter((e, i) => e.amount > 0 && e.supplier_party);
    // console.log(order_items);

    let order_item = [];
    if (props.editingData !== null) {
      order_items.map((e, i) => {
        let item_obj = {
          supplier_id: e.supplier_party,
          box: e.box,
          pcs: e.pcs,
          crate: e.crate,
          amount: e.amount,
        };
        if (e.id !== undefined) {
          item_obj["id"] = e.id;
        } else {
          item_obj["item_id"] = e.item_id;
        }
        order_item.push(item_obj);
      });
    } else {
      order_items.map((e, i) => {
        order_item.push({
          item_id: e.item_id,
          supplier_id: e.supplier_party,
          box: e.box,
          pcs: e.pcs,
          crate: e.crate,
          amount: e.amount,
        });
      });
    }

    const payload = {
      order: {
        reciever_id: toParty,
        date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        box: footer[2],
        pcs: footer[3],
        crate: footer[4],
        amount: footer[5],
      },
      order_item: order_item,
    };

    if (props.editingData !== null) {
      payload.order["id"] = props.editingData?.id;
    }

    console.log(payload);

    if (props.editingData !== null) {
      await api_edit_order(payload)
        .then(res => {
          if (res.success) {
            console.log(res);
            props.setFetchDate(date);
            props.setEditingData(null);
            showSuccessToast({ title: "Success", message: res.message });
            props.setIsSetOrder(false);
          } else {
            showErrorToast({ title: "Error", message: res.message });
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      await api_add_order(payload)
        .then(res => {
          if (res.success) {
            console.log(res);
            props.setFetchDate(date);
            props.setEditingData(null);
            showSuccessToast({ title: "Success", message: res.message });
            props.setIsSetOrder(false);
          } else {
            showErrorToast({ title: "Error", message: res.message });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  console.log(props.partyData);

  return (
    <>
      <Box p={5} style={{ overflow: "hidden" }}>
        <Grid mb={5}>
          <Grid.Col span={6}>
            <Select
              value={toParty}
              onChange={setToParty}
              label="To Party"
              placeholder="Select To Party"
              searchable
              error={errorParty}
              data={props.partyData.filter((e, i) => e.type === "receiver")}
            />
            <DatePickerInput miw={110} label="Select Date" value={date} onChange={setDate} />
          </Grid.Col>
          <Grid.Col span={6}>
            <Flex h={"100%"} direction={"column"} align={"center"} justify={"space-evenly"}>
              <Button
                w={100}
                size="xs"
                leftIcon={<IconDeviceFloppy />}
                onClick={() => {
                  let order_items = orderData?.filter((e, i) => e.amount > 0 && e.supplier_party);

                  if (toParty !== null && order_items.length) {
                    addItem(orderData, footer, toParty, date);
                    setErrorParty(null);
                  } else {
                    if (toParty === null) {
                      setErrorParty("Party Invalid");
                    } else {
                      showErrorToast({ title: "Error", message: "Items not selected" });
                      setErrorParty(null);
                    }
                  }
                }}
              >
                SAVE
              </Button>
              <Button
                w={100}
                size="xs"
                variant="outline"
                leftIcon={<IconX />}
                onClick={() => {
                  props.setEditingData(null);
                  setErrorParty(null);
                  props.setIsSetOrder(false);
                }}
              >
                CANCEL
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
        <MantineReactTable
          columns={columns}
          data={orderData}
          enableColumnActions={false}
          enablePagination={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          // enableStickyFooter
          // enableStickyHeader
          mantineTableContainerProps={{
            sx: {},
          }}
          mantineTableBodyProps={{
            sx: {
              //stripe the rows, make odd rows a darker color
              "& td:nth-of-type(odd)": {
                padding: 0,
                paddingLeft: 1,
              },
              "& td:nth-of-type(even)": {
                padding: 0,
                paddingLeft: 1,
              },
            },
          }}
          mantineTableProps={{
            sx: {
              tableLayout: "fixed",
            },
          }}
          mantineTableHeadProps={{
            sx: {
              //stripe the rows, make odd rows a darker color
              "& th:nth-of-type(odd)": {
                padding: 0,
                paddingLeft: 1,
                paddingTop: 5,
                paddingBottom: 5,
              },
              "& th:nth-of-type(even)": {
                padding: 0,
                paddingLeft: 1,
                paddingTop: 5,
                paddingBottom: 5,
              },
            },
          }}
          mantineTableFooterProps={{
            sx: {
              //stripe the rows, make odd rows a darker color
              "& th:nth-of-type(odd)": {
                padding: 0,
                paddingLeft: 1,
                paddingTop: 5,
                paddingBottom: 5,
                width: "100%",
              },
              "& th:nth-of-type(even)": {
                padding: 0,
                paddingLeft: 1,
                paddingTop: 5,
                paddingBottom: 5,
                width: "100%",
              },
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
            },
          }}
        />
      </Box>
    </>
  );
};

export default SetOrder;
