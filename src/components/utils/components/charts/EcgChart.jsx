import React, { useEffect, useRef, useState } from "react";
import CanvasJSReact from "../../assets/js/canvasjs.react";
import ecgData from "./ecg-data.json";
const { CanvasJS, CanvasJSChart } = CanvasJSReact;

const EcgChart = (props) => {
  const dataPointsArray = ecgData;
  const chartRef = useRef(null);
  const [color] = useState("#EB0102");
  const [yAxisStripLines, setYAxisStripLines] = useState([]);
  const [xAxisStripLines, setXAxisStripLines] = useState([]);
  const [dps, setDps] = useState([]);
  const [opt, setOpt] = useState({
    theme: "light2",
    title: {
      text: "ECG",
      horizontalAlign: "left",
      fontColor: color,
    },
    subtitles: [
      {
        text: "Date / Timestamp 2018/08/19 11:45:01",
        horizontalAlign: "left",
      },
    ],
    axisY: {
      stripLines: [],
      gridColor: color,
      lineColor: color,
      tickThickness: 0,
      labelFormatter: (e) => {
        return "";
      },
    },
    axisX: {
      stripLines: [],
      gridColor: color,
      lineColor: color,
      tickThickness: 0,
      labelFormatter: (e) => {
        return "";
      },
    },
    data: [
      {
        type: "spline",
        color: "black",
        dataPoints: dps,
      },
    ],
  });

  const addDataPoints = () => {
    const updatedDps = [...dps];
    const updatedOpt = { ...opt };
    for (var i = 0; i < dataPointsArray.length; i++) {
      updatedDps.push({ y: dataPointsArray[i] });
    }
    // setDps(updatedDps);
    // chartRef.render();
    updatedOpt.data[0].dataPoints = updatedDps;
    setOpt(updatedOpt);
  };

  const addStripLines = () => {
    //StripLines
    const chart = chartRef.current;
    const updatedOpt = { ...opt };
    const xAxis = [...xAxisStripLines];
    const yAxis = [...yAxisStripLines];
    for(var i = chart.axisY[0].minimum;i < chart.axisY[0].maximum; i = i+(chart.axisY[0].interval/10)){
      if(i % chart.axisY[0].interval != 0) {
        yAxis.push({value:i,thickness:0.7, color: color});
      }
    }
    for(var i = chart.axisX[0].minimum;i < chart.axisX[0].maximum; i = i+(chart.axisX[0].interval/10)){
      if(i%chart.axisX[0].interval != 0) {
        xAxis.push({value:i,thickness:0.7, color: color});
      }
    }
    updatedOpt.axisY.stripLines = yAxis;
    updatedOpt.axisX.stripLines = xAxis;
    setOpt(updatedOpt);
  };

  useEffect(() => {
    addDataPoints();
    // addStripLines();
  }, []);

  useEffect(() => {
    addStripLines();
  }, [opt]);

  return (
    <>
      <CanvasJSChart options={opt} onRef={(ref) => (chartRef.current = ref)} />
    </>
  );
};

export default EcgChart;
