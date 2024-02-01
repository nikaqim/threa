import React from "react";

const Banner = () => {
    return(
        <div className="banner-container">
            <div>
                <div className="left">
                    <div className="logo-container">
                        <img
                            src="assets/TH_Logo.png"
                            className="img"
                        />
                    </div>
                    <div className="str-container">
                        <img
                            src="assets/TH_StrRoman.png"
                            className="img"
                        />
                    </div>
                </div>
                <div className="center">
                    <h3 className="text-2xl font-bold">THREA OCR</h3>
                </div>
                <div className="right">
                    <img
                        src="assets/TH_StrAr.png"
                        className="img"
                    />
                </div>
            </div>
            
        </div>
    )
}

export default Banner;