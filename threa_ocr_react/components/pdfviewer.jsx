'use client'

import React, { useState } from "react";
import { Icon } from "@iconify/react";

import { LoadError, Viewer, Worker, SpecialZoomLevel, ProgressBar } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { openPlugin } from '@react-pdf-viewer/open';
import { dropPlugin } from '@react-pdf-viewer/drop';

// import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/open/lib/styles/index.css';
import '@react-pdf-viewer/drop/lib/styles/index.css';
import { render } from "react-dom";

const renderError = (error) => {
    let message = '';
    switch (error.name) {
        case 'InvalidPDFException':
            message = 'The document is invalid or corrupted';
            break;
        case 'MissingPDFException':
            message = 'Please upload file';
            break;
        case 'UnexpectedResponseException':
            message = 'Unexpected server response';
            break;
        default:
            message = 'Cannot load the document';
            break;
    }

    return (
        <div
            style={{
                alignItems: 'center',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    backgroundColor: '#e53e3e',
                    borderRadius: '0.25rem',
                    color: '#fff',
                    padding: '0.5rem',
                }}
            >
                {message}
            </div>
        </div>
    );
};

const PdfViewer = ({ filepath }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        // setInitialTab: (doc) => Promise.resolve(0),
    });

    const openPluginInstance = openPlugin({
        enableShortcuts: false
    });

    const dropPluginInstance = dropPlugin();
    
    return(
        <div className="pdf-container">
            <Worker workerUrl="javascripts/pdf.worker.js">
                <div style={{ height: '100%' }}>
                    <Viewer
                        fileUrl={filepath}
                        renderError={renderError}
                        defaultScale={SpecialZoomLevel.PageWidth}
                        plugins={[
                            defaultLayoutPluginInstance,
                            openPluginInstance,
                            dropPluginInstance
                        ]}
                        renderLoader={(percentages) => (
                            <div style={{ width: '240px' }}>
                                <ProgressBar progress={Math.round(percentages)} />
                            </div>
                        )}
                    />
                </div>
            </Worker>
        </div>
    )
    
}

export default PdfViewer;