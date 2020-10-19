import React, { useState, useEffect } from "react";
import MaterialTable from "../utils/components/table/MaterialTable";

const VitalsTable = ({ data }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(data);
  }, [data]);
  const columns = [
    {
      title: "Time",
      field: "time",
      render: (rowData) => rowData.time,
    },
    {
      title: "Heart Rate",
      field: "heart_rate",
      render: (rowData) => (rowData.heart_rate ? `${rowData.heart_rate} bpm` : ""),
    },
    {
      title: "Pulse Rate",
      field: "pulse_rate",
      render: (rowData) => (rowData.pulse_rate ? `${rowData.pulse_rate} bpm` : ""),
    },
    {
      title: "SPO2",
      field: "spo2",
      render: (rowData) => (rowData.spo2 ? `${rowData.spo2} %` : ""),
    },
    {
      title: "Resp. Rate",
      field: "respiratory_rate",
      render: (rowData) => (rowData.respiratory_rate ? `${rowData.respiratory_rate} brpm` : ""),
    },
    {
      title: "Blood Pressure",
      field: "blood_pressure",
      render: (rowData) => (rowData.blood_pressure ? `${rowData.blood_pressure} mmHg` : ""),
    },
    {
      title: "MAP",
      field: "map",
      render: (rowData) => (rowData.map ? `${rowData.map} mmHg` : ""),
    },
    {
      title: "Temperature",
      field: "temperature",
      render: (rowData) => {
        const symbol = (
          <>
            <sup style={{ marginLeft: 2 }}>o</sup>C{" "}
          </>
        );
        return (
          <>
            {rowData.temperature ? (
              <>
                {rowData.temperature} <sup style={{ marginLeft: 2 }}>o</sup>C
              </>
            ) : (
              ""
            )}
          </>
        );
      },
    },
  ];

  return (
    <MaterialTable
      // other props
      columns={columns}
      data={tableData}
      options={{
        filtering: false,
        search: false,
        paging: false,
        sorting: false,
        toolbar: false,
        rowStyle: rowData => {
          if (rowData.tableData.id % 2 === 0) {
            return { backgroundColor: "rgba(242,242,242,0.5)" }
          }
        }
      }}
      style={{ marginTop: 50, overflowY: "auto", height: 750 }}
    />
  );
};

export default VitalsTable;
