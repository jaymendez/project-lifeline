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
      render: (rowData) => `${rowData.heart_rate || 0} bpm`,
    },
    {
      title: "Pulse Rate",
      field: "pulse_rate",
      render: (rowData) => `${rowData.pulse_rate || 0} bpm`,
    },
    {
      title: "SPO2",
      field: "spo2",
      render: (rowData) => `${rowData.spo2 || 0} %`,
    },
    {
      title: "Resp. Rate",
      field: "respiratory_rate",
      render: (rowData) => `${rowData.respiratory_rate || 0} brpm`,
    },
    {
      title: "Blood Pressure",
      field: "blood_pressure",
      render: (rowData) => `${rowData.blood_pressure || 0} mmHg`,
    },
    {
      title: "MAP",
      field: "map",
      render: (rowData) => `${rowData.map || 0} mmHg`,
    },
    {
      title: "Temperature",
      field: "temperature",
      render: (rowData) => {
        return (
          <>
            {rowData.temperature || 0} 
            <sup style={{marginLeft: 2}}>o</sup>C
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
      }}
      style={{ marginTop: 50 }}
    />
  );
};

export default VitalsTable;
