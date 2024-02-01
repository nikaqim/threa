'use client'

import React, { useState } from "react";
import { Icon } from "@iconify/react";

const Uploads = ({filepathHandler, jobIdHandler}) => {
    const [file, setFile] = useState([]);
    const [disabledUpload, setdisabledUpload] = useState(true);

    const onSubmit = async (e) => {
        e.preventDefault();

        console.log("Submitting file...", file);

        if(!file) return

        try{
            const data = new FormData();
            data.set('file', file)

            const res = await fetch('https://localhost:7129/api/OCR/upload', {
                method: 'POST',  
                headers: {
                    'Accept': '*/*',
                },
                body: data
            });

            if(!res.ok) throw new Error(await res.text())
            else {
                const resdata = await res.text();
                console.log("response:", resdata);

                jobIdHandler(JSON.parse(resdata).jobId);
                // startConnection("nikaqim");
            }
        } catch (e){
            console.log(e)
        }
    };

    return(
        <div className="upload-main w-full p-3 rounded-md">
            <div className="upload-container">
                <div className="header">
                    <h3 className="text-2xl font-bold">
                        Upload pdf file
                    </h3>
                    <p className="text-xl">
                        Click button below to upload recon file
                    </p>
                </div>
                <div className="upload my-3">
                    <form onSubmit={onSubmit}>
                        <input
                            type="file" 
                            name="file"
                            accept=".pdf"
                            onChange={
                                (e) => {
                                    console.log('File=',file);
                                    console.log('e.target.files=',e.target.files);

                                    const previewUrl = URL.createObjectURL(e.target.files[0]); 
                                    setFile(e.target.files?.[0])

                                    filepathHandler(previewUrl);
                                    setdisabledUpload(false)

                                    return ()=> URL.revokeObjectURL(objurl)
                                }
                            }
                        />

                        <label 
                            htmlFor="sbmtBTN" 
                            className={"flex items-center btn" + (disabledUpload? " disabled" : "")} 
                            title={(disabledUpload? "Please select pdf file" : "Upload pdf")}>
                            <Icon className="" icon="ic:round-upload" />&nbsp;<span className="font-semibold">Upload</span>
                        </label>
                        
                        <input className="hidden" id="sbmtBTN" disabled={disabledUpload} type="submit" value="upload" />
                    </form>
                </div>
            </div>
        </div>
        
    )
};

export default Uploads;