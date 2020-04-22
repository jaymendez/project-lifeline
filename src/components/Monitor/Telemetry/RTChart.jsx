import React, { Component, useState, useEffect } from 'react'
import range from 'lodash/range'
import last from 'lodash/last'
import { generateDrinkStats } from '@nivo/generators'
import { ResponsiveLine } from '@nivo/line'
import { Defs } from '@nivo/core'
import { area, curveMonotoneX } from 'd3-shape'
import * as time from 'd3-time'
import { timeFormat } from 'd3-time-format'
const data = generateDrinkStats(18)
const commonProperties = {
  width: 550,
  height: 100,
  // margin: { top: 20, right: 20, bottom: 60, left: 80 },
  data,
  animate: true,
  enableSlices: 'x',
}

class RealTimeChart extends Component {
  constructor(props) {
    super(props);

    const date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    this.state = {
      dataA: range(100).map((i) => ({
        x: time.timeMinute.offset(date, i * 30),
        y: 10 + Math.round(Math.random() * 20),
      })),
      // dataB: range(100).map((i) => ({
      //   x: time.timeMinute.offset(date, i * 30),
      //   y: 30 + Math.round(Math.random() * 20),
      // })),
      // dataC: range(100).map((i) => ({
      //   x: time.timeMinute.offset(date, i * 30),
      //   y: 60 + Math.round(Math.random() * 20),
      // })),
    };

    this.formatTime = timeFormat("%Y %b %d");
  }

  componentDidMount() {
    this.timer = setInterval(this.next, 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  next = () => {
    const dataA = this.state.dataA.slice(1);
    dataA.push({
      x: time.timeMinute.offset(last(dataA).x, 30),
      y: 10 + Math.round(Math.random() * 20),
    });
    // const dataB = this.state.dataB.slice(1);
    // dataB.push({
    //   x: time.timeMinute.offset(last(dataB).x, 30),
    //   y: 30 + Math.round(Math.random() * 20),
    // });
    // const dataC = this.state.dataC.slice(1);
    // dataC.push({
    //   x: time.timeMinute.offset(last(dataC).x, 30),
    //   y: 60 + Math.round(Math.random() * 20),
    // });

    // this.setState({ dataA, dataB, dataC });
    this.setState({ dataA });
  };

  render() {
    const { dataA, dataB, dataC } = this.state;

    return (
      <ResponsiveLine
        {...commonProperties}
        // margin={{ top: 30, right: 50, bottom: 60, left: 50 }}
        data={[
          { id: "A", data: dataA },
          // { id: "B", data: dataB },
          // { id: "C", data: dataC },
        ]}
        xScale={{ type: "time", format: "native" }}
        yScale={{ type: "linear", max: 100 }}
        axisTop={null}
        // axisTop={{
        //   format: "%H:%M",
        //   tickValues: "every 4 hours",
        // }}
        // axisBottom={{
        //   format: "%H:%M",
        //   tickValues: "every 4 hours",
        //   legend: `${this.formatTime(dataA[0].x)} ——— ${this.formatTime(last(dataA).x)}`,
        //   legendPosition: "middle",
        //   legendOffset: 46,
        // }}
        axisBottom={null}
        axisRight={null}
        enablePoints={false}
        enableGridX={true}
        curve="monotoneX"
        animate={false}
        motionStiffness={120}
        motionDamping={50}
        isInteractive={false}
        enableSlices={false}
        useMesh={true}
        theme={{
          axis: { ticks: { text: { fontSize: 14 } } },
          grid: { line: { stroke: "#ddd", strokeDasharray: "1 2" } },
        }}
      />
    );
  }
}

export default RealTimeChart;
