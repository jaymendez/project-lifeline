import React from 'react'
import MaterialTable from "../utils/components/table/MaterialTable";

const VitalsTable = () => {
  const data = [
    {time: "12:00 AM"},
    {time: "1:00 AM"},
    {time: "2:00 AM"},
    {time: "3:00 AM"},
    {time: "4:00 AM"},
    {time: "5:00 AM"},
    {time: "6:00 AM"},
    {time: "7:00 AM"},
    {time: "8:00 AM"},
    {time: "9:00 AM"},
    {time: "10:00 AM"},
    {time: "11:00 AM"},
    {time: "12:00 PM"},
    {time: "1:00 PM"},
    {time: "2:00 PM"},
    {time: "3:00 PM"},
    {time: "4:00 PM"},
    {time: "5:00 PM"},
    {time: "6:00 PM"},
    {time: "7:00 PM"},
    {time: "8:00 PM"},
    {time: "9:00 PM"},
    {time: "10:00 PM"},
    {time: "11:00 PM"},
  ];
  const columns = [
    {
      title: "Time",
      field: "time",
      render: (rowData) => rowData.time,
    },
    {
      title: "Heart Rate",
      field: "heart_rate",
      render: (rowData) => ``,
    },
    {
      title: "Pulse Rate",
      field: "pulse_rate",
      render: (rowData) => ``,
    },
    {
      title: "SPO2",
      field: "spo2",
      render: (rowData) => ``,
    },
    {
      title: "Resp. Rate",
      field: "respiratory_rate",
      render: (rowData) => ``,
    },
    {
      title: "Blood Pressure",
      field: "blood_pressure",
      render: (rowData) => ``,
    },
    {
      title: "MAP",
      field: "map",
      render: (rowData) => ``,
    },
    {
      title: "Temperature",
      field: "temperature",
      render: (rowData) => ``,
    },

  ];

  return (
    <MaterialTable
      // other props
      columns={columns}
      data={data}
      options={{
        filtering: false,
        search: false,
        paging: false
      }}
      style={{marginTop: 50}}
    />
  )
}

export default VitalsTable
