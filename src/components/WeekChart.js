//----- React Components --------/
import React, { Component } from "react";
import PropTypes from "prop-types";

//----- 3rd-party Components ------/
import {
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryPie,
  VictoryLine,
  VictoryLabel,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer
} from "victory";
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap.css';

//------ My Images! --------/
import btcGood from "../images/btc_happy.jpg";
import btcMeh from "../images/btc_meh.jpeg";
import btcBad from "../images/btc_bad.jpg";

//just for showing the happy/meh/sad Satoshi face
class SatoshiFace extends Component {
  render() {
    let { sentWeekPercent } = this.props;

    return (
      <Tooltip
          placement='rightTop'
          mouseEnterDelay={0}
          mouseLeaveDelay={0.1}
          destroyTooltipOnHide='false'
          trigger='hover'
          overlay={<div style={{ height: 50, width: 50 }}>{
              sentWeekPercent > 35
                ? sentWeekPercent > 70 ? 'BTC looking good!' : 'Huh. Could be better.'
                : 'Bitcoin Cash is the real Bitcoin!'
            }</div>}
          align={{
            offset: [4,0],
          }}
        >
          <img
            src={
              sentWeekPercent > 35
                ? sentWeekPercent > 70 ? btcGood : btcMeh
                : btcBad
            }
            className="avatar"
          />
        </Tooltip>
    )
  }
}

//shows the weekly Victory chart, comprising a left pane with a pie chart / Satoshi's sentimenting face, the right pane shows the line graph for the 7 days.
class WeekChart extends Component {
  render() {
    let { sentiment, posNegPieArr, sentWeekPercent } = this.props;
    let dayAxis = [];

    //colour array for pie chart
    const colors = {
      pie: ["#84BCDA", "#D56062"]
    };

    //create array of dates corresponding to sentiment array numbers
    for (let i = 1; i < 8; i++) {
      let rightNow = new Date();
      dayAxis.unshift(
        new Date(rightNow.setDate(rightNow.getDate() - i))
          .toISOString()
          .slice(0, 10)
      );
    }

    return (
      <div className="WeekChart">
        <div className="leftPane">
          <svg viewBox="0 0 450 400" width="450" height="400">
            <VictoryPie
              data={posNegPieArr}
              x="type"
              y="numberDays"
              width={450}
              height={400}
              standalone={false}
              innerRadius={115}
              colorScale={colors["pie"]}
              style={{
                labels: { fontSize: 0 }
              }}
            />
            <VictoryLabel
              textAnchor="middle"
              style={{
                fontSize: 40,
                fontWeight: 100,
                color: "blue"
              }}
              x={225}
              y={180}
              text={sentWeekPercent + "%"}
            />
            <VictoryLabel
              textAnchor="middle"
              style={{ fontSize: 20 }}
              x={225}
              y={210}
              text="positive"
            />
            <VictoryLabel
              textAnchor="middle"
              style={{ fontSize: 12 }}
              x={225}
              y={235}
              text={`(${posNegPieArr[0].numberDays} out of ${posNegPieArr[0]
                .numberDays + posNegPieArr[1].numberDays})`}
            />
          </svg>
          <SatoshiFace 
            sentWeekPercent={sentWeekPercent}
          />
        </div>

        <VictoryChart
          theme={VictoryTheme.material}
          width={1200}
          height={850}
          containerComponent={<VictoryVoronoiContainer />}
        >
          <VictoryAxis
            tickValues={[1, 2, 3, 4, 5, 6, 7]}
            tickFormat={dayAxis}
            style={{
              tickLabels: {
                fontSize: 24,
                padding: 5,
                fontColor: "#6D8A96",
                fontWeight: 100
              }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: {
                fontSize: 24,
                padding: 5,
                fontColor: "#6D8A96",
                fontWeight: 100
              },
              grid: { stroke: t => (t < 0 ? "tomato" : "grey") }
            }}
          />
          <VictoryLine
            style={{
              data: { stroke: "#84BCDA" },
              parent: { border: "1px solid #ccc" },
              strokeWidth: 5
            }}
            x="day"
            y="sentTot"
            data={sentiment}
            animate={{ duration: 100 }}
          />
          <VictoryScatter
            style={{
              data: { fill: "#c43a31" },
              labels: { fill: d => (d.y > 0 ? "green" : "tomato") },
              fontSize: 24
            }}
            labels={d => d.y}
            labelComponent={<VictoryTooltip />}
            size={5}
            x="day"
            y="sentTot"
            data={sentiment}
          />
        </VictoryChart>
      </div>
    );
  }
}

//prop types
WeekChart.propTypes = {
  sentiment: PropTypes.array.isRequired
};

//default props
WeekChart.defaultProps = {
  sentiment: [
    { day: 1, sentTot: 0 },
    { day: 2, sentTot: 0 },
    { day: 3, sentTot: 0 },
    { day: 4, sentTot: 0 },
    { day: 5, sentTot: 0 },
    { day: 6, sentTot: 0 },
    { day: 7, sentTot: 0 }
  ]
};

export default WeekChart;
