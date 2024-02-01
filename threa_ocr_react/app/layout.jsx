import React, { Children } from "react";

import '@styles/homepage.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export const metadata = {
    title: "THREA OCR",
    description: "THREA OCR Application"
};

const RootLayout = ({ children }) => {
    
    console.log("rendering app..")
    return (
        <html lang="en">
            <head>
                <title>THREA OCR</title>
            </head>
            <body>
                <div className="main">
                    <div className="gradient"></div>
                </div>
                <main className="app">
                    {children}
                </main>
            </body>
            
        </html>
    )
}

export default RootLayout