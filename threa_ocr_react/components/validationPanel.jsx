'use client'

import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";

import { Paginator } from 'primereact/paginator';

const ValidationPanel = ({setSelectedRow, setValidationResult, ValidationResult, tableHeight, rightContainerH}) => {
    // console.log("ValidationResult:", ValidationResult);
    // console.log("tableHeight:", tableHeight);
    const [first, setFirst] = useState(0);
    const [type, setType] = useState("Date");
    const [validationH, setValidationH] = useState(0);
    const [style, setStyle] = useState({});
    const [currentLine, setCurrentLine] = useState(0);

    const onPageChange = (event) => {
        console.log("event", event);
        setFirst(event.first);
    };

    useEffect(()=>{
        console.log("changing table row");
        setSelectedRow(currentLine);
    },[currentLine])

    useEffect(()=>{
        // render validation panel according to Output Table Height
        const minusH = 146+tableHeight;
        const balance = rightContainerH - minusH - 5;
        setValidationH(balance);

        setStyle({
            height: (balance )+"px"
        })
        
    }, [tableHeight]);

    const handleDeclineResult = ()=>{

    };

    // handling review item - onAccept
    const handleAcceptResult = (type)=>{
        let JsonCopy = JSON.parse(JSON.stringify(ValidationResult));
        let currentLineData = JsonCopy.data[currentLine];
        console.log("JsonCopy",JsonCopy);
        console.log(type, ":currentLineData",currentLineData);
    };


    const InfoPanel = ({first}) => {
        const InfoLine = ValidationResult.stats.total.lineNum[first];
        const LineNo = InfoLine.lineNum;
        const ModifiedCol = InfoLine.type.split(",");
        const InfoData = ValidationResult.data[LineNo.toString()]

        useEffect(()=>{
            setCurrentLine(parseInt(LineNo));
        }, [LineNo])
        
        return(
            <div className="info-items">
                { ModifiedCol.map((item, key) => (
                    <div key={key}>
                        <div className="otherinfo">
                            <span className="text-sm mr-2">Line</span>
                            <div className="lineno">
                                <span>{parseInt(LineNo) + 1}</span>
                            </div>
                        </div>
                        <div className="results">
                            <div className="type capitalize">
                                {item}
                            </div>
                            <div>
                                <span className="font-bold">{InfoData[item.toLowerCase()].original}</span>
                            </div>
                            <div className="icon-wrapper">
                                <Icon icon="mdi:arrow-right-bold"/>
                            </div>
                            <div>
                                <span className="font-bold">{InfoData[item.toLowerCase()].modified}</span>
                            </div>
                            <div className={ InfoData[item.toLowerCase()].status !== "pending" ? "review modified" : "review" }>
                                <span className="cur cursor-default" title={
                                        InfoData[item.toLowerCase()].status === "pending"?
                                        "require fix by user": "review data fixed by the system"}>
                                    {
                                        InfoData[item.toLowerCase()].status !== "pending" ?
                                        "to be reviewed" : "to be fixed"
                                    }
                                </span>
                            </div>
                        </div>
                        { InfoData[item.toLowerCase()].status !== "pending" ? 
                            <div className="action-review">
                                <div className="decline text-sm underline" title="decline result" onClick={()=>{ console.log("change declined! ask user to fix") }}>
                                    <Icon icon="iconoir:cancel"/>
                                </div>
                                <div className="accept" title="accept result" onClick={handleAcceptResult(item.toLowerCase())}>
                                    <Icon icon="typcn:tick" className="" />
                                </div>
                            </div> : ""
                        }                
                    </div>
                ))}
            </div>
        );
    }

    return(
        ValidationResult.stats !== undefined ?

            <div className={"validation-panel"} style={style}>
                <div className="header w-full">
                    <div className="status-wrapper">
                        <Icon icon="ion:alert-circle-outline" title="click on cell to edit value" className="text-[#333]] mr-2"/>
                        <span className="mr-2 font-bold text-orange-400">{ValidationResult.stats.total.review}</span> 
                        are to be reviewed and 
                        <span className="mr-2 ml-2 font-bold text-red-700">{ValidationResult.stats.total.fix}</span> 
                        to be fixed
                    </div>
                    <div className="count-wrapper">
                        <div>
                            <span className="count date">
                                {ValidationResult.stats.date.lineNum.length}
                            </span>
                            <span>Date</span>
                        </div>

                        <div>
                            <span className="count debit">
                                {ValidationResult.stats.debit.lineNum.length}
                            </span>
                            <span>Debit</span>
                        </div>

                        <div>
                            <span className="count credit">
                                {ValidationResult.stats.credit.lineNum.length}
                            </span>
                            <span>Credit</span>
                        </div>

                        <div>
                            <span className="count balance">
                                {ValidationResult.stats.balance.lineNum.length}
                            </span>
                            <span>Balance</span>
                        </div>

                    </div>
                </div>
                
                <div className="info-wrapper">
                    <InfoPanel first={first} />
                    <Paginator first={first} type={type} rows={1} totalRecords={ValidationResult.stats.total.lineNum.length} onPageChange={onPageChange} template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
                </div>
                
            </div> :

            <div></div>
    );
}

export default ValidationPanel;


