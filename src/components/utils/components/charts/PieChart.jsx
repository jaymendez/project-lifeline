import React from "react";
import { ResponsivePie } from "@nivo/pie";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const PieChart = () => {
  const data = [
    {
      id: "Male",
      label: "Male",
      value: 180,
      color: "hsl(86, 70%, 50%)",
    },
    {
      id: "Female",
      label: "Female",
      value: 287,
      // color: "hsl(349, 70%, 50%)",
    },
    // {
    //   id: "sass",
    //   label: "sass",
    //   value: 233,
    //   color: "hsl(173, 70%, 50%)",
    // },
    // {
    //   id: "rust",
    //   label: "rust",
    //   value: 505,
    //   color: "hsl(120, 70%, 50%)",
    // },
    // {
    //   id: "hack",
    //   label: "hack",
    //   value: 350,
    //   color: "hsl(6, 70%, 50%)",
    // },
  ];
  const colors = { 'Female': "rgb(70, 179, 230)", '2018': 'red', 'Male': "rgb(81, 90, 109)"}
  const getColor = bar => colors[bar.id]

  return (
    <ResponsivePie
      theme={{
        labels: {
          text: {
            textColor: "#eee",
            fontSize: 22,
            tickColor: "#eee",
          },
        },
        legends: {
          text: {
            fontSize: 20,
          }
        }
      }}
      data={data}
      margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
      // padding={{ top: 100, right: 100, bottom: 100, left: 100 }}
      startAngle={-90}
      // padding={{}}
      innerRadius={0.35}
      padAngle={1.5}
      cornerRadius={3}
      // colors={{ scheme: "nivo" }}
      colors={getColor}
      borderWidth={1}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      // colors={{}}
      radialLabelsSkipAngle={10}
      radialLabelsTextXOffset={6}
      radialLabelsTextColor="#333333"
      radialLabelsLinkOffset={0}
      radialLabelsLinkDiagonalLength={16}
      radialLabelsLinkHorizontalLength={24}
      radialLabelsLinkStrokeWidth={1}
      radialLabelsLinkColor={{ from: "color" }}
      slicesLabelsSkipAngle={10}
      slicesLabelsTextColor="#333333"
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "python",
          },
          id: "dots",
        },
        {
          match: {
            id: "scala",
          },
          id: "lines",
        },
      ]}
      legends={[
        {
          anchor: "top",
          direction: "row",
          translateY: -20,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
