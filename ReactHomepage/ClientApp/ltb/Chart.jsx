import React, { Component } from 'react';
import '../../wwwroot/Scripts/jqxcore';
import '../../wwwroot/Scripts/jqxdraw';
import '../../wwwroot/Scripts/jqxchart.core';
import '../../wwwroot/Scripts/jqxdata';
import JqxChart from '../../wwwroot/Scripts/react_jqxchart';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: this.props.update,
      sampleData: this.props.sampleData,
      xAxis: {
        dataField: 'Year',
        unitInterval: 1,
        axisSize: 'auto',
        tickMarks: {
          visible: true,
          interval: 1,
          color: '#BCBCBC'
        },
        gridLines: {
          visible: true,
          interval: 1,
          color: '#BCBCBC'
        }
      },
      valueAxis: {
        unitInterval: 10,
        minValue: 0,
        maxValue: 120,
        title: { text: 'Number of units' },
        labels: { horizontalAlignment: 'left' },
        tickMarks: { color: '#BCBCBC' }
      },
      seriesGroups: [
        {
          type: 'stackedcolumn',
          columnsGapPercent: 20,
          seriesGapPercent: 0,
          series: [
            { dataField: 'Regionalstock', displayText: 'Regional stock' },
            { dataField: 'Stock', displayText: 'Stock level (50%)' },
            { dataField: 'Safety', displayText: 'Safety margin' }
          ]
        }
      ]
    };
  }

  componentWillReceiveProps(newProps) {
    let firstLine = newProps.sampleData[0];
    if (firstLine === undefined) return;
    let max = parseInt(firstLine['Regionalstock']) + parseInt(firstLine['Stock']) + parseInt(firstLine['Safety']);
    let unitInterval = Math.round(max / 10);
    if (max < 10) {
      max = 10;
      unitInterval = 1;
    }

    this.setState({
      valueAxis: { ...this.state.valueAxis, unitInterval, maxValue: max * 1.1 },
      update: newProps.update,
      sampleData: newProps.sampleData
    });
  }

  shouldComponentUpdate() {
    return this.state.update;
  }

  componentDidUpdate() {
    // Reset update to false after each rendering
    if (this.state.update) {
      this.setState({ update: false });
    }
  }

  render() {
    return (
      <JqxChart
        style={{ width: 390, height: 250 }}
        title={'Stock levels per year'}
        description={'Level at first year is the requested level'}
        showLegend
        enableAnimations
        padding={{ left: 5, top: 5, right: 5, bottom: 5 }}
        titlePadding={{ left: 45, top: 0, right: 0, bottom: 10 }}
        source={this.state.sampleData}
        xAxis={this.state.xAxis}
        valueAxis={this.state.valueAxis}
        colorScheme={'scheme02'}
        seriesGroups={this.state.seriesGroups}
      />
    );
  }
}

Chart.defaultProps = {
  sampleData: [],
  update: false
};
