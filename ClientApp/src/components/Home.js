import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeflex/primeflex.css';

import React, { Component } from 'react';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PlotterChart } from './PlotterChart';

export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);
        this.state = {
            dimValue: '',
            measValue: '',
            measures:[],
            columns: [],
        }
        this.columnsUrl = 'https://plotter-task.herokuapp.com/columns';
        this.getChartColumns();
        this.resetDimensions = this.resetDimensions.bind(this);
        this.resetMeasures = this.resetMeasures.bind(this);
    }
    async getChartColumns() {
    try {
        let response = await fetch(this.columnsUrl);
        let responseJson = await response.json();
        this.setState({ columns: responseJson });
    } catch (error) {

        console.error(error);
    }
}

    resetDimensions() {
        this.setState({ dimValue: '' });
    }
    resetMeasures() {
        this.setState({ measValue: '', measures:[] });
    }
    onDragStart = (e, v) => {
        console.log("dragstart");
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData('text/plain', JSON.stringify(v));
    }
    onDropMeasure = e => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.function == "measure") {
            var newStateArray = this.state.measures.slice();
            newStateArray.push(data.name);
            this.setState({ measValue: newStateArray.toString(), measures: newStateArray });
        } else {
            this.toast.show({ severity: 'error', summary: 'Error Message', detail: 'you have to set a measure value in this field', life: 3000 });
        }
    }

    onDropDimension = e => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.function == "dimension") {
            this.setState({ dimValue: data.name});
        } else {
            this.toast.show({ severity: 'error', summary: 'Error Message', detail: 'you have to set a dimension value in this field', life: 3000 });
        }
    }
    allowDrop = ev => {
        ev.preventDefault();
    }
    
    render() {
        let chart;
        let chartState = this.state;
        if (chartState.measures.length != 0 && chartState.dimValue != "") {
            chart = <PlotterChart measure={chartState.measures} dimension={chartState.dimValue} />;
        }

        return (
            <div>
                <Toast ref={(el) => this.toast = el} position="top-right" />
                <div className="row">
                    <div className="col-3 drag-container">
                        <div style={{ marginTop: '35px' }}>
                            Columns : <br />

                            <div style={{ display: 'inline-block' }}>
                                {
                                    this.state.columns.map((item) => {
                                        return <p draggable="true" onDragStart={(e) => this.onDragStart(e, item)} >{item.name}</p>
                                    })
                                }
                            </div>

                        </div>

                    </div>
                    <div className="p-fluid col-7 droppable">
                        <div className="p-field">
                            <label htmlFor="Dimensions">Dimensions</label>
                            <div className="row">
                                <InputText id="Dimensions" type="text" className="ml-3 col-6" value={this.state.dimValue} onDragOver={this.allowDrop} onDrop={this.onDropDimension} />
                                <Button label="Clear" className="ml-2 col-3 p-button-raised p-button-rounded" onClick={this.resetDimensions} />
                            </div>
                        </div>
                        <div className="p-field">
                            <label htmlFor="Measures">Measures</label>
                            <div className="row">
                                <InputText id="Measures" type="text" className="ml-3 col-6" value={this.state.measValue} onDragOver={this.allowDrop} onDrop={this.onDropMeasure} />
                                <Button label="Clear" className="ml-2 col-3 p-button-raised p-button-rounded" onClick={this.resetMeasures} />
                            </div>
                        </div>
                    </div>
                </div>
                {chart}
            </div>
        );
    }
}


