import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeflex/primeflex.css';

import React, { Component } from 'react';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PlotterChart } from './PlotterChart';
import './Home.css';

export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);
        this.state = {
            dimValue: '', // dimension value in x-axis
            measures:[], // measures in y-axis
            columns: [], // all dimensions and measures user will select from
        }
        //url that contains columns data
        this.columnsUrl = 'https://plotter-task.herokuapp.com/columns';
        this.getChartColumns();
        this.resetDimensions = this.resetDimensions.bind(this);
        this.resetMeasures = this.resetMeasures.bind(this);
    }

    async getChartColumns() {
        // fetching columns 
        try {
            let response = await fetch(this.columnsUrl);
            let responseJson = await response.json();
            this.setState({ columns: responseJson });
        } catch (error) {
            this.showError(error.message);
        }
}
    //clear dimesnsion.
    resetDimensions() {
        this.setState({ dimValue: '' });
    }
    //clear measure.
    resetMeasures() {
        this.setState({ measures:[] });
    }
    onDragStart = (e, v) => {
        console.log("dragstart");
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData('text/plain', JSON.stringify(v));
    }
    //drop the selected measure.
    onDropMeasure = e => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.function == "measure") {
            var newStateArray = [];//this.state.measures.slice();
            newStateArray.push(data.name);
            this.setState({ measures: newStateArray });
        } else {
            this.showError('you have to set a measure value in this field');
        }
    }
    //drop the selected dimesnsion.
    onDropDimension = e => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.function == "dimension") {
            this.setState({ dimValue: data.name});
        } else {
            this.showError('you have to set a dimension value in this field');
        }
    }
    //to show error with specific message
    showError(message) {
        this.toast.show({ severity: 'error', summary: 'Error Message', detail: message, life: 3000 });
    }
    allowDrop = ev => {
        ev.preventDefault();
    }
    
    render() {
        let chart;
        if (this.state.measures.length != 0 && this.state.dimValue != "") {
            chart = <PlotterChart measure={this.state.measures} dimension={this.state.dimValue} />;
        }
        return (
            <div>
                <Toast ref={(el) => this.toast = el} position="top-right" />
                <div className="row" style={{ 'font-family': "Monospace" }} >
                    <div className="col-3 drag-container">
                        <div>
                            <label> Columns : </label><br />
                            <div style={{ display: 'inline-block', 'font-size': '20px' }}>
                                {
                                    this.state.columns.map((item) => {
                                        return <p draggable="true" onDragStart={(e) => this.onDragStart(e, item)} >{item.name}</p>
                                    })
                                }
                            </div>

                        </div>

                    </div>
                    <div className="inputs p-fluid col-7 droppable">
                        <div className="p-field">
                            <label htmlFor="Dimensions">Dimensions</label>
                            <div className="row">
                                <InputText id="Dimensions" type="text" className="ml-3 col-6" value={this.state.dimValue} onDragOver={this.allowDrop} onDrop={this.onDropDimension} />
                                <Button label="Clear" className="button ml-2 col-3 p-button-raised p-button-rounded" onClick={this.resetDimensions} />
                            </div>
                        </div>
                        <div className="p-field">
                            <label htmlFor="Measures">Measures</label>
                            <div className="row">
                                <InputText id="Measures" type="text" className="ml-3 col-6" value={this.state.measures.toString()} onDragOver={this.allowDrop} onDrop={this.onDropMeasure} />
                                <Button label="Clear" className="button ml-2 col-3 p-button-raised p-button-rounded" onClick={this.resetMeasures} />
                            </div>
                        </div>
                    </div>
                </div>
                {chart}
            </div>
        );
    }
}


