import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeflex/primeflex.css';
import axios from 'axios'

import React, { Component } from 'react';
import { Chart } from 'primereact/chart';

export class PlotterChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                labels: [],
                datasets: [],
            }
        }
        //url that contains chart dataSet
        this.dataUrl = 'https://plotter-task.herokuapp.com/data';
        this.getChartData();
        this.options = {
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    },
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'value'
                    }
                }]
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Plotter',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }

    }
    async getChartData() {
        this.chartInq = {
            "measures": this.props.measure,
            "dimension": this.props.dimension,
        }
        console.log(this.chartInq);
        axios.post(this.dataUrl, this.chartInq)
            .then(response => {
                this.datasets = this.state.chartData.datasets.slice();
                for (var i = 1; i < response.data.length; i++) {
                    this.datasets.push(
                        {
                            label: response.data[i].name,
                            data: response.data[i].values,
                            fill: false,
                            borderColor: '#4bc0c0'
                        },
                    )
                }
                this.setState({
                    chartData: {
                        labels: response.data[0].values,
                        datasets: this.datasets,
                    }
                });
            }); 
    }
    render() {
        return (
            <div>
                <Chart type="line" data={this.state.chartData} options={this.options} scaleLabel="true" />
            </div >
        );
    }
}


