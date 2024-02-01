import React, { useEffect, useState, useRef } from "react";

const noBodyTemplate = function(Results, index){
    return (
        <div className="index-cell">
            {index.rowIndex + 1}
        </div>
    );
}

const dateBodyTemplate = function(Results){
    const Status = Results.date.status;
    const DateModified = Status !== "accepted";

    const DateValue = Results.date.modified;

    return (
        <div className="value-cell">
            {
                DateModified? 
                    Status !== "pending" ?
                    <div className="alert-buble review"></div>:
                    <div className="alert-buble fix"></div>:
                    ""
            }
            <span>{DateValue}</span>
        </div>
    );
}

const valueBodyTemplate = function(Results, Type="Debit"){
    const allValues = Results.value;

    const Status = Type === "Debit" ? 
        Results.value.modCol.status.debit : Type === "Credit" ?
        Results.value.modCol.status.credit : Results.value.modCol.status.balance;

    const ValueModified = Status !== "accepted";

    const valueInput = Type === "Debit" ? 
        Math.round(parseFloat(allValues.debit) * 100) : 
        Type === "Credit" ?
        Math.round(parseFloat(allValues.credit) * 100) : 
        Math.round(parseFloat(allValues.bal) * 100);   
    
    const debitValue = ( valueInput / 100).toFixed(2);
    
    return (
        <div className="value-cell">
            {
                ValueModified? 
                    Status !== "pending" ?
                    <div className="alert-buble review"></div>:
                    <div className="alert-buble fix"></div>:
                    ""
            }
            <span className={"" + (ValueModified ? "" :"")}>{debitValue}</span>
        </div>
    );
}

const debitBodyTemplate = function(Results){
    return valueBodyTemplate(Results, "Debit");
}

const creditBodyTemplate = function(Results){
    return valueBodyTemplate(Results, "Credit");
}

const balanceBodyTemplate = function(Results){
    return valueBodyTemplate(Results, "Balance");
}

export {
    noBodyTemplate, 
    dateBodyTemplate,
    debitBodyTemplate,
    creditBodyTemplate,
    balanceBodyTemplate
}