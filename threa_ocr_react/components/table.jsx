'use client'

import React, { useEffect, useState, useRef, createRef } from "react";
import { Icon } from "@iconify/react";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DomHandler } from 'primereact/utils';

import {
    noBodyTemplate, 
    dateBodyTemplate,
    debitBodyTemplate,
    creditBodyTemplate,
    balanceBodyTemplate
} from "@components/tableTemplates";

import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';

const Table = ({
    selectedRow, 
    handleTableHeight, 
    tableChangeHeight, 
    setTableChangeHeight, 
    ValidationResult, 
    Results }) => {

    const refTableContainer = useRef(null);
    const DataTableRef = useRef(null);
    const DateRef = createRef(null);
    
    const [selection, setSelection] = useState(null);

    const TextEditor = (options) => {
        console.log("TextEditor:", options);
        return <InputText 
                    type="text" 
                    value={options.value} 
                    style={{ 
                        maxWidth: "84px", 
                        paddingLeft: "8px",
                        paddingTop: "2px",
                        paddingBottom: "2px",
                        background: "white",
                        border: "2px solid #e5e7eb"
                    }}
                    onChange={
                        (e) => options.editorCallback(e.target.value)
                    }
        />;
    }

    // price editor controller
    const PriceEditor = (options) => {
        return <InputNumber 
                    value={options.value} 
                    pattern="^\d*(\.\d{0,2})?$"
                    onValueChange={(e) => options.editorCallback((e.value))} 
                    minFractionDigits={2} maxFractionDigits={2}
                    style={{ 
                        maxWidth: "150px",
                        paddingLeft: "8px",
                        paddingTop: "2px",
                        paddingBottom: "2px",
                        background: "white",
                        border: "2px solid #e5e7eb"
                    }}
                />;
    };

    const onValueCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        switch (field) {
            case 'value.credit':
                rowData.value.credit = newValue;
                break;
            case 'value.debit':
                rowData.value.debit = newValue;
                break;
            case 'value.bal':
                rowData.value.bal = newValue;
                break;

            default:
                break;
        }
    };

    // getting table height to feed2 validationPanel
    useEffect(() => {
        handleTableHeight(refTableContainer.current.clientHeight);
        setTableChangeHeight(false)
    }, [tableChangeHeight]); // <-- empty array means 'run once

    const [tableReset, setTableReset] = useState(false);

    // changing viewing row by validation rownum value
    useEffect(() => {
        console.log("table row changed ->", selectedRow);
        console.log("DataTableRef.current ->", DataTableRef.current);
        DataTableRef.current.props.alwaysShowPaginator = false;
        DataTableRef.current.props.editMode = "cell";
        DataTableRef.current.props.first = selectedRow;

        console.log(
            "DataTableRef.current.props.children[1].ref:",
            DataTableRef.current.props.children[1].ref,
            document.body
        );

        setSelection(Results[selectedRow-1]);
        
        DataTableRef.current.reset()

        setTableReset(true)

    }, [selectedRow]); 

    useEffect(()=>{
        if(tableReset){
            let findRow = selectedRow.toString();
            
            let rowExist = ValidationResult.data[findRow] !== undefined
            let DateStatus = (rowExist) && ValidationResult.data[findRow].date !== null ? 
                ValidationResult.data[findRow].date.status : null;
            let DbtStatus = (rowExist) && ValidationResult.data[findRow].debit !== null ? 
                ValidationResult.data[findRow].debit.status : null;
            let CrtStatus = (rowExist) && ValidationResult.data[findRow].credit !== null ? 
                ValidationResult.data[findRow].credit.status : null;
            let BalStatus = (rowExist) && ValidationResult.data[findRow].balance !== null ? 
                ValidationResult.data[findRow].balance.status : null;

            let addClass = DateStatus === "pending" ? ".date" :
                DbtStatus === "pending" ? ".debit" :
                CrtStatus === "pending" ? ".credit" : ".balance";

            rowExist = ((addClass === ".balance") && (BalStatus === null)) || 
                ((addClass === ".balance") && (BalStatus === "modified")) ? false : rowExist;
                
            console.log(DateStatus, DbtStatus, CrtStatus, BalStatus, addClass);

            if(rowExist){
                DomHandler.find(DataTableRef.current.getElement(), addClass)[0].click();
            }

            setTableReset(false);
        }

    }, [tableReset]);
    
    const testHandler = (e)=>{
        console.log("test handler", e);
    };

    const selectionHandler = (e)=>{
        setSelection(e.value)
        console.log("DataTableRef.current.props.Selection:",DataTableRef.current.props.selection);
        console.log("selectionHandler:", e.value);
    }

    return(
        <div className="table-container" ref={refTableContainer}>
            <DataTable 
                onStateRestore={testHandler}
                paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                ref={DataTableRef} value={Results} cellSelection selectionMode="multiple"
                selection={selection} onSelectionChange={selectionHandler}
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ maxWidth: '100%' }}>

                <Column field="linenum" header="#" body={noBodyTemplate} style={{ verticalAlign: 'top' }} ></Column>
                <Column 
                    ref={DateRef}
                    field="date.modified" editor={(options) => TextEditor(options)} 
                    header="Date" body={dateBodyTemplate} style={{ verticalAlign: 'top' }} 
                    pt={{
                        bodyCell:{ className: "date" }
                    }}>    
                </Column>
                <Column 
                    field="descr.modified" header="Descriptions" 
                    style={{ width: '30%', minWidth:'250px', verticalAlign: 'top' }}>
                </Column>
                <Column 
                    field="value.debit" header="Debit" 
                    editor={(options) => PriceEditor(options)} 
                    onCellEditComplete={onValueCellEditComplete}
                    body={debitBodyTemplate} style={{ verticalAlign: 'top' }}
                    pt={{
                        bodyCell:{ className: "debit" }
                    }}> 
                </Column>
                <Column 
                    field="value.credit" header="Credit" 
                    editor={(options) => PriceEditor(options)} 
                    onCellEditComplete={onValueCellEditComplete}
                    body={creditBodyTemplate} style={{ verticalAlign: 'top' }}
                    pt={{
                        bodyCell:{ className: "credit" }
                    }}> 
                </Column>
                <Column 
                    field="value.bal" header="Balance" 
                    editor={(options) => PriceEditor(options)} 
                    onCellEditComplete={onValueCellEditComplete}
                    body={balanceBodyTemplate} style={{ verticalAlign: 'top' }}
                    pt={{
                        bodyCell:{ className: "balance" }
                    }}> 
                </Column>
                <Column rowEditor={true} field="" header=""></Column>

            </DataTable>
        </div>
    )
    
}


export default Table;



