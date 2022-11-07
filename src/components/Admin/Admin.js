import React, { Component } from "react";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data } from "react-data-grid-addons";
import Firebase from "../../firebase/firebase.js";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import UploadVideoSnippet from "../../components/UploadVideoSnippet/UploadVideoSnippet.js"

import 'bootstrap/dist/css/bootstrap.css';
import "./Admin.css"

const defaultColumnProperties = {
    filterable: true,
    width: 200,
    resizable: true,
};

const selectors = Data.Selectors;

const columns = [
{
    key: 'id',
    name: 'Order ID',
    sort: true,
    editable: true,
},{
    key: 'statusLabel',
    name: 'Status Label',
    editable: true,
},{
    key: 'statusValue',
    name: 'Status Value',
    editable: true,
},{
    key: 'emailAddress',
    name: 'Email Address',
  }, {
    key: 'firstName',
    name: 'First Name',
    sort: true,
}, {
    key: 'igname',
    name: 'IG Name',
},{
    key: 'lastName',
    name: 'Last Name',
},{
    key: 'reelDuration',
    name: 'Reel Duration',
},{
    key: 'reelPurpose',
    name: 'Reel Purpose',
},{
    key: 'reelSampleLink',
    name: 'Reel Sample Link',
},{
    key: 'orderAudioURL',
    name: 'Order Audio URL',
},{
    key: 'selectedLevelOption',
    name: 'Selected Level Option',
},{
    key: 'snippetVideoURL',
    name: 'Snippet Video URL',
    editable: true,
}].map(c => ({ ...c, ...defaultColumnProperties }));

class ConnectedAdmin extends Component {

    state = {
        orders:[],
        filters: [],
        filteredRows: [],
        selectedIndexes: [],
        rows:[],
        selectedOrdersIds: [],
        selectedOrderFirstName: '',
        adminLoggedIn: false,
        updatingRow: {},
    };

    sendEmail(){
        //TODO
        // emailjs.send('service_jdguftl', 'template_z19ojwr', templateParams, 'VSKnf4Vspvt3LgOiz')
    //     .then(function(response) {
    //        console.log('SUCCESS!', response.status, response.text);
    //     }, function(error) {
    //        console.log('FAILED...', error);
    //     });
    }

    componentDidMount(){
        if (this.props?.match?.params?.id){
            this.setState({adminLoggedIn: true})
        }else{
            this.adminLogIn()
        }

        Firebase.getOrders().then( val => {
            this.setState({orders: val, filteredRows: this.getRows(val)})
        })
    }

    handleFilterChange=(filter)=>{
        const newFilters = { ...this.state.filters };

        if (filter.filterTerm) {
          newFilters[filter.column.key] = filter;
        } else {
          delete newFilters[filter.column.key];
        }

        let rows = this.state.orders
        let filters = this.state.filters
        let filteredRows = selectors.getRows({ rows, filters })

        this.setState({filters: newFilters, filteredRows: filteredRows})
    };

    getRows(val) {
        let rows = val
        let filters = this.state.filters

        return selectors.getRows({ rows, filters });
    }

    onRowsSelected = rows => {
        this.setState({
          selectedOrdersIds: this.state.selectedOrdersIds.concat(
              rows.map(r => r.row.id)
          ),
          selectedIndexes: this.state.selectedIndexes.concat(
            rows.map(r => r.rowIdx)
          ),
          selectedOrderFirstName: rows[0].row.firstName
        });
    };

    onRowsDeselected = rows => {
        let rowIndexes = rows.map(r => r.rowIdx);
        let rowIds = rows.map(r => r.row.id)

        this.setState({
            selectedOrdersIds: this.state.selectedOrdersIds.filter(
                i => rowIds.indexOf(i) === -1
            ),
            selectedIndexes: this.state.selectedIndexes.filter(
                i => rowIndexes.indexOf(i) === -1
            )
        });
    };

    refreshTable(){
        Firebase.getOrders().then( val => {
            this.setState({orders: val, filteredRows: this.getRows(val)})
        })
    }

    adminLogIn(){
        var tenure = prompt("Please enter master password to continue", "");
        if (tenure != null && tenure == "1") {
            this.setState({adminLoggedIn: true})
        }else{
          alert("you are a liar and a fraud!!!")
          this.setState({adminLoggedIn: false})
        }
    }

    updateAnnotation(){
        this.props.history.push({
            pathname: "/annotationfixer/" + this.state.selectedOrdersIds[0],
            state: {
                lyrics: this.state.selectedOrderFirstName,
                songId: this.state.selectedOrdersIds[0],
            }
        });
    }

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        this.setState(state => {
          const filteredRows = state.filteredRows.slice();
          const rows = state.rows.slice();
          let updatingRow = {}

          for (let i = fromRow; i <= toRow; i++) {
            filteredRows[i] = { ...filteredRows[i], ...updated };
            rows[i] = { ...rows[i], ...updated };
            updatingRow = { ...filteredRows[i], ...updated }
          }

          return { filteredRows, rows, updatingRow };
        });
    };

    render() {
        if (!this.state.adminLoggedIn){
            return (
                <div className="Admin">
                    unauthorized access to this page!
                </div>
            )
        }
        return (
            <div className="Admin l-container">
                <div className="Admin-table">
                    <h2>Order Table</h2>
                    <ReactDataGrid
                        rowKey="id"
                        columns={columns}
                        rowGetter={i => this.state.filteredRows[i]}
                        rowsCount={this.state.filteredRows.length}
                        minHeight={500}
                        enableCellSelect={true}
                        toolbar={<Toolbar enableFilter={true} />}
                        onAddFilter={filter => this.handleFilterChange(filter)}
                        onClearFilters={() => this.setState({filters: []})}
                        onGridRowsUpdated={this.onGridRowsUpdated}
                        rowSelection={{
                            showCheckbox: true,
                            enableShiftSelect: true,
                            onRowsSelected: this.onRowsSelected,
                            onRowsDeselected: this.onRowsDeselected,
                            selectBy: {
                              indexes: this.state.selectedIndexes
                            }
                        }}
                    />
                    {" "}
                    <Button
                        style={{ marginTop: 20, width: 200 }}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            this.refreshTable()
                        }}
                    >
                        Table Refresh
                    </Button>
                    {" "}
                    {
                        this.state.selectedIndexes.length == 1 && (
                            <div>
                                <Button
                                    style={{ marginTop: 20, width: 200 }}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        Firebase.updateSongInfo(this.state.selectedOrdersIds[0], this.state.updatingRow)
                                    }}
                                >
                                    Save Update - ({this.state.selectedOrdersIds[0]})
                                </Button>
                                {" "}
                                <Button
                                    style={{ marginTop: 20, width: 200 }}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        this.updateAnnotation()
                                    }}
                                >
                                    Update Annotation - ({this.state.selectedOrdersIds[0]})
                                </Button>
                            </div>
                        )
                    }
                </div>
                <div className="Admin-UploadVideoSnippet">
                    <UploadVideoSnippet />
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {};
};

const Admin = withRouter(connect(mapStateToProps)(ConnectedAdmin));
export default Admin;


//https://material-ui.com/components/material-icons/#material-icons