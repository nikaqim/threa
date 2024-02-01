'use client'

import React, { useState, useEffect, useRef } from "react";
import Banner from "@components/banner";
import Uploads from "@components/upload";
import Table from "@components/table";
import ValidationPanel from "@components/validationPanel";
import PdfViewer from "@components/pdfviewer";

import { DragSizing } from 'react-drag-sizing';
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const Home = () => {
    console.log("rendering home...");
    
    const [filepath, setFilePath] = useState("pdf/default.pdf");
    const [intervalId, setIntervalId] = useState("");

    const [jobId, setJobId] = useState("");
    const [jobcompleted, setJobCompleted] = useState();
    const [jobResult, setJobResult]  = useState([
        {
            "original": "31/08/23 B/F... .00 .00 8125.47",
            "modified": "31/08/23 B/F 0.0 0.00 8125.47",
            "lineNum": 4,
            "status": null,
            "date": {
                "name": "Date",
                "original": "31/08/23",
                "modified": "31/08/23",
                "lineNum": 4,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "B/F",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.0,
                "credit": 0.00,
                "bal": 8125.47,
                "original": "0.0 0.00 8125.47",
                "modified": "0.0 0.00 8125.47",
                "nxtLineFixed": false,
                "nxtLine": "0 30.00 8155.47",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 RIB/MB TRF FROM CA/SA 00 30.00 8155.47",
            "modified": "1/09/23 RIB/MB TRF FROM CA/SA 0 30.00 8155.47",
            "lineNum": 5,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 5,
                "nextVal": "",
                "suggested": [],
                "status": "pending"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0,
                "credit": 30.00,
                "bal": 8155.47,
                "original": "0 30.00 8155.47",
                "modified": "0 30.00 8155.47",
                "nxtLineFixed": false,
                "nxtLine": "0.00 101.00 8256.47",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 R18/MB TRF FROM CA/SA .00 101.00 8256.47",
            "modified": "1/09/23 R18/MB TRF FROM CA/SA 0.00 101.00 8256.47",
            "lineNum": 6,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 6,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "R18/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 101.00,
                "bal": 8256.47,
                "original": "0.00 101.00 8256.47",
                "modified": "0.00 101.00 8256.47",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 8356.47",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 R1B/MB TRF FROM CA/SA .00 100.00 8356.47",
            "modified": "1/09/23 R1B/MB TRF FROM CA/SA 0.00 100.00 8356.47",
            "lineNum": 7,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 7,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "R1B/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 8356.47,
                "original": "0.00 100.00 8356.47",
                "modified": "0.00 100.00 8356.47",
                "nxtLineFixed": true,
                "nxtLine": "0.00 30.00 8336.47",
                "nxtLineModified": "0.00 30.00 8386.47",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 RIB/MB TRF FROM CA/SA .00 . 30.00 8336.47",
            "modified": "1/09/23 RIB/MB TRF FROM CA/SA 0.00 30.00 8386.47",
            "lineNum": 8,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 8,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 30.00,
                "bal": 8386.47,
                "original": "0.00 30.00 8336.47",
                "modified": "0.00 30.00 8386.47",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 8486.47",
                "nxtLineModified": "",
                "modCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 RIB/MB TRF FROM CA/SA .00 100.00 8486.47",
            "modified": "1/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 8486.47",
            "lineNum": 9,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 9,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 8486.47,
                "original": "0.00 100.00 8486.47",
                "modified": "0.00 100.00 8486.47",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 8586.47",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 RIB/MB TRF FROM CA/SA .00 100.00 8586.47",
            "modified": "1/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 8586.47",
            "lineNum": 10,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 10,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 8586.47,
                "original": "0.00 100.00 8586.47",
                "modified": "0.00 100.00 8586.47",
                "nxtLineFixed": false,
                "nxtLine": "0.00 30.00 8616.47",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 R1B8/MB TRF FROM CA/SA .00 30.00 8616.47",
            "modified": "1/09/23 R1B8/MB TRF FROM CA/SA 0.00 30.00 8616.47",
            "lineNum": 11,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 11,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "R1B8/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 30.00,
                "bal": 8616.47,
                "original": "0.00 30.00 8616.47",
                "modified": "0.00 30.00 8616.47",
                "nxtLineFixed": false,
                "nxtLine": "0.00 30.00 8646.47",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 RIB/MB TRF FROM CA/SA .00 30.00 8646.47",
            "modified": "1/09/23 RIB/MB TRF FROM CA/SA 0.00 30.00 8646.47",
            "lineNum": 12,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 12,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 30.00,
                "bal": 8646.47,
                "original": "0.00 30.00 8646.47",
                "modified": "0.00 30.00 8646.47",
                "nxtLineFixed": true,
                "nxtLine": "0.00 1000.00 9616.47",
                "nxtLineModified": "0.00 1000.00 9646.47",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "4/09/23 RIB/MB TRF FROM CA/SA .00 1000.00 9616.47",
            "modified": "1/09/23 RIB/MB TRF FROM CA/SA 0.00 1000.00 9646.47",
            "lineNum": 13,
            "status": null,
            "date": {
                "name": "Date",
                "original": "4/09/23",
                "modified": "1/09/23",
                "lineNum": 13,
                "nextVal": "",
                "suggested": [],
                "status": "review"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1000.00,
                "bal": 9646.47,
                "original": "0.00 1000.00 9616.47",
                "modified": "0.00 1000.00 9646.47",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1000.00 10646.47",
                "nxtLineModified": "",
                "modCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 RIB/NB TRF FROM CA/SA .00 1000.00 10646.47",
            "modified": "1/09/23 RIB/NB TRF FROM CA/SA 0.00 1000.00 10646.47",
            "lineNum": 14,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 14,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/NB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1000.00,
                "bal": 10646.47,
                "original": "0.00 1000.00 10646.47",
                "modified": "0.00 1000.00 10646.47",
                "nxtLineFixed": false,
                "nxtLine": "0.00 200.00 10846.47",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 RIB/NB TRF FROM CA/SA .00 200.00 10846.47",
            "modified": "1/09/23 RIB/NB TRF FROM CA/SA 0.00 200.00 10846.47",
            "lineNum": 15,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 15,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/NB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 200.00,
                "bal": 10846.47,
                "original": "0.00 200.00 10846.47",
                "modified": "0.00 200.00 10846.47",
                "nxtLineFixed": false,
                "nxtLine": "7558.57 0.00 3287.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 DEBIT ADVICE 7558.57 .00 3287 90",
            "modified": "1/09/23 DEBIT ADVICE 7558.57 0.00 3287.90",
            "lineNum": 16,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 16,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE FIGURE DD 30 4a 31/05/2023 LEMBAGA TABUNG HAJI .",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 7558.57,
                "credit": 0.00,
                "bal": 3287.90,
                "original": "7558.57 0.00 3287.90",
                "modified": "7558.57 0.00 3287.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 3285.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 SERVICE CHARGE 2.00. .00 3285.90",
            "modified": "1/09/23 SERVICE CHARGE 2.00 0.00 3285.90",
            "lineNum": 23,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 23,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 3285.90,
                "original": "2.00 0.00 3285.90",
                "modified": "2.00 0.00 3285.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 3335.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 RIB/MB TRF FROM CA/SA .00 50.00 3335.90",
            "modified": "1/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 3335.90",
            "lineNum": 24,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 24,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 3335.90,
                "original": "0.00 50.00 3335.90",
                "modified": "0.00 50.00 3335.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 3000.00 6335.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "1/09/23 RIB/MB TRF FROM CA/SA .00 . 3000.00 6335 90",
            "modified": "1/09/23 RIB/MB TRF FROM CA/SA 0.00 3000.00 6335.90",
            "lineNum": 25,
            "status": null,
            "date": {
                "name": "Date",
                "original": "1/09/23",
                "modified": "1/09/23",
                "lineNum": 25,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 3000.00,
                "bal": 6335.90,
                "original": "0.00 3000.00 6335.90",
                "modified": "0.00 3000.00 6335.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 201.00 6536.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "2/09/23 RIB/MB TRF FROM CA/SA .00 201.00 6536 90",
            "modified": "2/09/23 RIB/MB TRF FROM CA/SA 0.00 201.00 6536.90",
            "lineNum": 26,
            "status": null,
            "date": {
                "name": "Date",
                "original": "2/09/23",
                "modified": "2/09/23",
                "lineNum": 26,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 201.00,
                "bal": 6536.90,
                "original": "0.00 201.00 6536.90",
                "modified": "0.00 201.00 6536.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1500.00 8036.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "4/09/23 RIB/MB TRF FROM CA/SA .00 1500.00 8036.90",
            "modified": "4/09/23 RIB/MB TRF FROM CA/SA 0.00 1500.00 8036.90",
            "lineNum": 27,
            "status": null,
            "date": {
                "name": "Date",
                "original": "4/09/23",
                "modified": "4/09/23",
                "lineNum": 27,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1500.00,
                "bal": 8036.90,
                "original": "0.00 1500.00 8036.90",
                "modified": "0.00 1500.00 8036.90",
                "nxtLineFixed": false,
                "nxtLine": "5972.00 0.00 2064.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "4/09/23 DEBIT ADVICE 5972.00 .00 2064 90",
            "modified": "4/09/23 DEBIT ADVICE 5972.00 0.00 2064.90",
            "lineNum": 28,
            "status": null,
            "date": {
                "name": "Date",
                "original": "4/09/23",
                "modified": "4/09/23",
                "lineNum": 28,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE RIB PAYMENT DD 01 02/09/23 . LEMBAGA TABUNG HAJI K",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 5972.00,
                "credit": 0.00,
                "bal": 2064.90,
                "original": "5972.00 0.00 2064.90",
                "modified": "5972.00 0.00 2064.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 2062.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "4/09/23 SERVICE CHARGE 2.00. .00 2062.90",
            "modified": "4/09/23 SERVICE CHARGE 2.00 0.00 2062.90",
            "lineNum": 35,
            "status": null,
            "date": {
                "name": "Date",
                "original": "4/09/23",
                "modified": "4/09/23",
                "lineNum": 35,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 2062.90,
                "original": "2.00 0.00 2062.90",
                "modified": "2.00 0.00 2062.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 60.00 2122.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 RIB/MB TRF FROM CA/SA .00 60.00 2122.90",
            "modified": "5/09/23 RIB/MB TRF FROM CA/SA 0.00 60.00 2122.90",
            "lineNum": 36,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 36,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 60.00,
                "bal": 2122.90,
                "original": "0.00 60.00 2122.90",
                "modified": "0.00 60.00 2122.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1301.00 3423.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 RIB/MB TRF FROM CA/SA .00 1301.00 3423.90",
            "modified": "5/09/23 RIB/MB TRF FROM CA/SA 0.00 1301.00 3423.90",
            "lineNum": 37,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 37,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1301.00,
                "bal": 3423.90,
                "original": "0.00 1301.00 3423.90",
                "modified": "0.00 1301.00 3423.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 200.00 3623.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 RIB/MB TRF FROM CA/SA .00 200.00 3623.90",
            "modified": "5/09/23 RIB/MB TRF FROM CA/SA 0.00 200.00 3623.90",
            "lineNum": 38,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 38,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 200.00,
                "bal": 3623.90,
                "original": "0.00 200.00 3623.90",
                "modified": "0.00 200.00 3623.90",
                "nxtLineFixed": true,
                "nxtLine": "0.00 4000.00 7623.50",
                "nxtLineModified": "0.00 4000.00 7623.90",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 RIB/MB TRF FROM CA/SA .00 4000.00 7623.50",
            "modified": "5/09/23 RIB/MB TRF FROM CA/SA 0.00 4000.00 7623.90",
            "lineNum": 39,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 39,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 4000.00,
                "bal": 7623.90,
                "original": "0.00 4000.00 7623.50",
                "modified": "0.00 4000.00 7623.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 7723.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 RIB/MB TRF FROM CA/SA .00 100.00 7723.90",
            "modified": "5/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 7723.90",
            "lineNum": 40,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 40,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 7723.90,
                "original": "0.00 100.00 7723.90",
                "modified": "0.00 100.00 7723.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 7823.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 RIB/MB TRF FROM CA/SA .00 100. 00 7823.90",
            "modified": "5/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 7823.90",
            "lineNum": 41,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 41,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 7823.90,
                "original": "0.00 100.00 7823.90",
                "modified": "0.00 100.00 7823.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 7873.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 RIB/MB TRF FROM CA/SA .00 50.00 7873 90",
            "modified": "5/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 7873.90",
            "lineNum": 42,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 42,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 7873.90,
                "original": "0.00 50.00 7873.90",
                "modified": "0.00 50.00 7873.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 7923.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 RIB/MB TRF FROM CA/SA .00 50.00 7923 90",
            "modified": "5/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 7923.90",
            "lineNum": 43,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 43,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 7923.90,
                "original": "0.00 50.00 7923.90",
                "modified": "0.00 50.00 7923.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 7973.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 RIB/MB TRF FROM CA/SA .00 50.00 7973 90",
            "modified": "5/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 7973.90",
            "lineNum": 44,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 44,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 7973.90,
                "original": "0.00 50.00 7973.90",
                "modified": "0.00 50.00 7973.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 8023.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 RIB/MB TRF FROM CA/SA .00 50.00 8023.90.",
            "modified": "5/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 8023.90",
            "lineNum": 45,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 45,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 8023.90,
                "original": "0.00 50.00 8023.90",
                "modified": "0.00 50.00 8023.90",
                "nxtLineFixed": false,
                "nxtLine": "1500.00 0 6523.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 DEBIT ADVICE 1500.00 D 6523.90",
            "modified": "5/09/23 DEBIT ADVICE 1500.00 0 6523.90",
            "lineNum": 46,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 46,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE RIB PYMT DD 04/09/23 N LEMBAGA TABUNG HAJI pa",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 1500.00,
                "credit": 0,
                "bal": 6523.90,
                "original": "1500.00 0 6523.90",
                "modified": "1500.00 0 6523.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 6521.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 SERVICE CHARGE 2.00. .00 G521 90",
            "modified": "5/09/23 SERVICE CHARGE 2.00 0.00 6521.90",
            "lineNum": 51,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 51,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 6521.90,
                "original": "2.00 0.00 6521.90",
                "modified": "2.00 0.00 6521.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 6621.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "5/09/23 RIB/NB TRF FROM CA/SA .00 100.00 . 6G21 90",
            "modified": "5/09/23 RIB/NB TRF FROM CA/SA 0.00 100.00 6621.90",
            "lineNum": 52,
            "status": null,
            "date": {
                "name": "Date",
                "original": "5/09/23",
                "modified": "5/09/23",
                "lineNum": 52,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/NB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 6621.90,
                "original": "0.00 100.00 6621.90",
                "modified": "0.00 100.00 6621.90",
                "nxtLineFixed": false,
                "nxtLine": "100.00 0 6521.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "6/09/23 RiB/MB TRF TO CA/SA 100.00 00 6521.90",
            "modified": "6/09/23 RiB/MB TRF TO CA/SA 100.00 0 6521.90",
            "lineNum": 63,
            "status": null,
            "date": {
                "name": "Date",
                "original": "6/09/23",
                "modified": "6/09/23",
                "lineNum": 63,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RiB/MB TRF TO CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 100.00,
                "credit": 0,
                "bal": 6521.90,
                "original": "100.00 0 6521.90",
                "modified": "100.00 0 6521.90",
                "nxtLineFixed": false,
                "nxtLine": "5961.00 0.00 560.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "6/09/23 DEBIT ADVICE 5961.00 .00 560.90",
            "modified": "6/09/23 DEBIT ADVICE 5961.00 0.00 560.90",
            "lineNum": 64,
            "status": null,
            "date": {
                "name": "Date",
                "original": "6/09/23",
                "modified": "6/09/23",
                "lineNum": 64,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE FIGURE DD 05/09/2023 LEMBAGA TABUNG HAJI",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 5961.00,
                "credit": 0.00,
                "bal": 560.90,
                "original": "5961.00 0.00 560.90",
                "modified": "5961.00 0.00 560.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 558.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "6/09/23 SERVICE CHARGE 2.00 .00 558.90",
            "modified": "6/09/23 SERVICE CHARGE 2.00 0.00 558.90",
            "lineNum": 67,
            "status": null,
            "date": {
                "name": "Date",
                "original": "6/09/23",
                "modified": "6/09/23",
                "lineNum": 67,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 558.90,
                "original": "2.00 0.00 558.90",
                "modified": "2.00 0.00 558.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1000.00 1558.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "6/09/23 RIB/MB TRF FROM CA/SA .00 1000.00 1558 90",
            "modified": "6/09/23 RIB/MB TRF FROM CA/SA 0.00 1000.00 1558.90",
            "lineNum": 68,
            "status": null,
            "date": {
                "name": "Date",
                "original": "6/09/23",
                "modified": "6/09/23",
                "lineNum": 68,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1000.00,
                "bal": 1558.90,
                "original": "0.00 1000.00 1558.90",
                "modified": "0.00 1000.00 1558.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 800.00 2358.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "7/09/23 RIB/MB TRF FROM CA/SA .00 800.00 2358 90",
            "modified": "7/09/23 RIB/MB TRF FROM CA/SA 0.00 800.00 2358.90",
            "lineNum": 69,
            "status": null,
            "date": {
                "name": "Date",
                "original": "7/09/23",
                "modified": "7/09/23",
                "lineNum": 69,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 800.00,
                "bal": 2358.90,
                "original": "0.00 800.00 2358.90",
                "modified": "0.00 800.00 2358.90",
                "nxtLineFixed": false,
                "nxtLine": "1000.00 0.00 1358.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "7/09/23 DEBIT ADVICE 1000.00 . .00 1358 90",
            "modified": "7/09/23 DEBIT ADVICE 1000.00 0.00 1358.90",
            "lineNum": 70,
            "status": null,
            "date": {
                "name": "Date",
                "original": "7/09/23",
                "modified": "7/09/23",
                "lineNum": 70,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE RIB PYMT DD 06/09/20 LEMBAGA TABUNG HAJI",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 1000.00,
                "credit": 0.00,
                "bal": 1358.90,
                "original": "1000.00 0.00 1358.90",
                "modified": "1000.00 0.00 1358.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 1356.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "7/09/23 SERVICE CHARGE 2.00 .00 1356.90",
            "modified": "7/09/23 SERVICE CHARGE 2.00 0.00 1356.90",
            "lineNum": 73,
            "status": null,
            "date": {
                "name": "Date",
                "original": "7/09/23",
                "modified": "7/09/23",
                "lineNum": 73,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 1356.90,
                "original": "2.00 0.00 1356.90",
                "modified": "2.00 0.00 1356.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 200.00 1556.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "8/09/23 RiB/MB TRF FROM CA/SA .00 200.00 1556.90",
            "modified": "8/09/23 RiB/MB TRF FROM CA/SA 0.00 200.00 1556.90",
            "lineNum": 74,
            "status": null,
            "date": {
                "name": "Date",
                "original": "8/09/23",
                "modified": "8/09/23",
                "lineNum": 74,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RiB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 200.00,
                "bal": 1556.90,
                "original": "0.00 200.00 1556.90",
                "modified": "0.00 200.00 1556.90",
                "nxtLineFixed": false,
                "nxtLine": "800.00 0.00 756.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "8/09/23 DEBIT ADVICE 800.00 .00 756.90",
            "modified": "8/09/23 DEBIT ADVICE 800.00 0.00 756.90",
            "lineNum": 75,
            "status": null,
            "date": {
                "name": "Date",
                "original": "8/09/23",
                "modified": "8/09/23",
                "lineNum": 75,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE RIB PYMT DD 07/09/23 LEMBAGA TABUNG HAJI c",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 800.00,
                "credit": 0.00,
                "bal": 756.90,
                "original": "800.00 0.00 756.90",
                "modified": "800.00 0.00 756.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 754.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "8/05/23 SERVICE CHARGE 2.00 .00 754.90",
            "modified": "8/09/23 SERVICE CHARGE 2.00 0.00 754.90",
            "lineNum": 78,
            "status": null,
            "date": {
                "name": "Date",
                "original": "8/05/23",
                "modified": "8/09/23",
                "lineNum": 78,
                "nextVal": "",
                "suggested": [],
                "status": "review"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 754.90,
                "original": "2.00 0.00 754.90",
                "modified": "2.00 0.00 754.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 854.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "10/09/23 RIB/MB TRF FROM CA/SA .00 100.00 854.90",
            "modified": "10/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 854.90",
            "lineNum": 79,
            "status": null,
            "date": {
                "name": "Date",
                "original": "10/09/23",
                "modified": "10/09/23",
                "lineNum": 79,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 854.90,
                "original": "0.00 100.00 854.90",
                "modified": "0.00 100.00 854.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 200.00 1054.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "11/09/23 RIB/MB TRF FROM CA/SA .00 200.00 1054.90",
            "modified": "11/09/23 RIB/MB TRF FROM CA/SA 0.00 200.00 1054.90",
            "lineNum": 80,
            "status": null,
            "date": {
                "name": "Date",
                "original": "11/09/23",
                "modified": "11/09/23",
                "lineNum": 80,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 200.00,
                "bal": 1054.90,
                "original": "0.00 200.00 1054.90",
                "modified": "0.00 200.00 1054.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 450.00 1504.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "11/09/23 RIB/MB TRF FROM CA/SA .00 450.00 1504.90",
            "modified": "11/09/23 RIB/MB TRF FROM CA/SA 0.00 450.00 1504.90",
            "lineNum": 81,
            "status": null,
            "date": {
                "name": "Date",
                "original": "11/09/23",
                "modified": "11/09/23",
                "lineNum": 81,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 450.00,
                "bal": 1504.90,
                "original": "0.00 450.00 1504.90",
                "modified": "0.00 450.00 1504.90",
                "nxtLineFixed": false,
                "nxtLine": "300.00 0.00 1204.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "11/09/23 DEBIT ADVICE 300.00 .00 1204.90",
            "modified": "11/09/23 DEBIT ADVICE 300.00 0.00 1204.90",
            "lineNum": 82,
            "status": null,
            "date": {
                "name": "Date",
                "original": "11/09/23",
                "modified": "11/09/23",
                "lineNum": 82,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE RIB PYMT DD 08/09/23 10/09/23 LEMBAGA TABUNG HAJI",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 300.00,
                "credit": 0.00,
                "bal": 1204.90,
                "original": "300.00 0.00 1204.90",
                "modified": "300.00 0.00 1204.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 1202.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "11/09/23 SERVICE CHARGE 2.00 .00 1202.90",
            "modified": "11/09/23 SERVICE CHARGE 2.00 0.00 1202.90",
            "lineNum": 86,
            "status": null,
            "date": {
                "name": "Date",
                "original": "11/09/23",
                "modified": "11/09/23",
                "lineNum": 86,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 1202.90,
                "original": "2.00 0.00 1202.90",
                "modified": "2.00 0.00 1202.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 110.00 1312.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "12/09/23 RIB/MB TRF FROM CA/SA .00 110.00 1312.90",
            "modified": "12/09/23 RIB/MB TRF FROM CA/SA 0.00 110.00 1312.90",
            "lineNum": 87,
            "status": null,
            "date": {
                "name": "Date",
                "original": "12/09/23",
                "modified": "12/09/23",
                "lineNum": 87,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 110.00,
                "bal": 1312.90,
                "original": "0.00 110.00 1312.90",
                "modified": "0.00 110.00 1312.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 10.00 1322.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "12/09/23 RIB/MB TRF FROM CA/SA .00 10.00 1322.90",
            "modified": "12/09/23 RIB/MB TRF FROM CA/SA 0.00 10.00 1322.90",
            "lineNum": 88,
            "status": null,
            "date": {
                "name": "Date",
                "original": "12/09/23",
                "modified": "12/09/23",
                "lineNum": 88,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 10.00,
                "bal": 1322.90,
                "original": "0.00 10.00 1322.90",
                "modified": "0.00 10.00 1322.90",
                "nxtLineFixed": false,
                "nxtLine": "650.00 0.00 672.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "12/09/23 DEBIT ADVICE 650.00 .00 672 90",
            "modified": "12/09/23 DEBIT ADVICE 650.00 0.00 672.90",
            "lineNum": 89,
            "status": null,
            "date": {
                "name": "Date",
                "original": "12/09/23",
                "modified": "12/09/23",
                "lineNum": 89,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE FIGURE DD 11/09/2023 LEMBAGA TABUNG HAJI pa",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 650.00,
                "credit": 0.00,
                "bal": 672.90,
                "original": "650.00 0.00 672.90",
                "modified": "650.00 0.00 672.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 670.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "12/09/23 SERVICE CHARGE 2.00 .00 670.90",
            "modified": "12/09/23 SERVICE CHARGE 2.00 0.00 670.90",
            "lineNum": 92,
            "status": null,
            "date": {
                "name": "Date",
                "original": "12/09/23",
                "modified": "12/09/23",
                "lineNum": 92,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 670.90,
                "original": "2.00 0.00 670.90",
                "modified": "2.00 0.00 670.90",
                "nxtLineFixed": false,
                "nxtLine": "120.00 0 550.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "13/09/23 DEBIT ADVICE 120.00 oo 550.90",
            "modified": "13/09/23 DEBIT ADVICE 120.00 0 550.90",
            "lineNum": 93,
            "status": null,
            "date": {
                "name": "Date",
                "original": "13/09/23",
                "modified": "13/09/23",
                "lineNum": 93,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE FIGURE DD 12/09/2023 LEMBAGA TABUNG HAJI",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 120.00,
                "credit": 0,
                "bal": 550.90,
                "original": "120.00 0 550.90",
                "modified": "120.00 0 550.90",
                "nxtLineFixed": false,
                "nxtLine": "2.0 0.00 548.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "13/09/23 SERVICE CHARGE 2.0 .00 548 90",
            "modified": "13/09/23 SERVICE CHARGE 2.0 0.00 548.90",
            "lineNum": 96,
            "status": null,
            "date": {
                "name": "Date",
                "original": "13/09/23",
                "modified": "13/09/23",
                "lineNum": 96,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.0,
                "credit": 0.00,
                "bal": 548.90,
                "original": "2.0 0.00 548.90",
                "modified": "2.0 0.00 548.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 648.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "13/09/23 RIB/MB TRF FROM CA/SA .00 100.00 648.90",
            "modified": "13/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 648.90",
            "lineNum": 97,
            "status": null,
            "date": {
                "name": "Date",
                "original": "13/09/23",
                "modified": "13/09/23",
                "lineNum": 97,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 648.90,
                "original": "0.00 100.00 648.90",
                "modified": "0.00 100.00 648.90",
                "nxtLineFixed": false,
                "nxtLine": "100.00 0.00 548.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "14/0923 DEBIT ADVICE 100 00 .00 548.90",
            "modified": "14/09/23 DEBIT ADVIC 100.00 0.00 548.90",
            "lineNum": 98,
            "status": null,
            "date": {
                "name": "Date",
                "original": "14/09/23",
                "modified": "14/09/23",
                "lineNum": 98,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVIC RIB PYMT DD 13/09/23 LEMBAGA TABUNG HAJI pa",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 100.00,
                "credit": 0.00,
                "bal": 548.90,
                "original": "100.00 0.00 548.90",
                "modified": "100.00 0.00 548.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 546.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "14/09/23 SERVICE CHARGE 2.00 .00 546.90",
            "modified": "14/09/23 SERVICE CHARGE 2.00 0.00 546.90",
            "lineNum": 101,
            "status": null,
            "date": {
                "name": "Date",
                "original": "14/09/23",
                "modified": "14/09/23",
                "lineNum": 101,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 546.90,
                "original": "2.00 0.00 546.90",
                "modified": "2.00 0.00 546.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 200.00 746.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "17/09/23 RIB/MB TRF FROM CA/SA .00 200.00 746.90",
            "modified": "17/09/23 RIB/MB TRF FROM CA/SA 0.00 200.00 746.90",
            "lineNum": 102,
            "status": null,
            "date": {
                "name": "Date",
                "original": "17/09/23",
                "modified": "17/09/23",
                "lineNum": 102,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 200.00,
                "bal": 746.90,
                "original": "0.00 200.00 746.90",
                "modified": "0.00 200.00 746.90",
                "nxtLineFixed": false,
                "nxtLine": "0 1000.00 1746.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "18/09/23 RIB/MB TRF FROM CA/SA 00 1000.00 1746.90",
            "modified": "18/09/23 RIB/MB TRF FROM CA/SA 0 1000.00 1746.90",
            "lineNum": 103,
            "status": null,
            "date": {
                "name": "Date",
                "original": "18/09/23",
                "modified": "18/09/23",
                "lineNum": 103,
                "nextVal": "",
                "suggested": [],
                "status": "pending"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0,
                "credit": 1000.00,
                "bal": 1746.90,
                "original": "0 1000.00 1746.90",
                "modified": "0 1000.00 1746.90",
                "nxtLineFixed": false,
                "nxtLine": "200.00 0.00 1546.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "46/09/23 DEBIT ADVICE . 200.00 .00 1546.90",
            "modified": "18/09/23 DEBIT ADVICE 200.00 0.00 1546.90",
            "lineNum": 110,
            "status": null,
            "date": {
                "name": "Date",
                "original": "46/09/23",
                "modified": "18/09/23",
                "lineNum": 110,
                "nextVal": "",
                "suggested": [],
                "status": "review"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE RIB PYMT DD 17/9/23 LEMBAGA TABUNG HAJI",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 200.00,
                "credit": 0.00,
                "bal": 1546.90,
                "original": "200.00 0.00 1546.90",
                "modified": "200.00 0.00 1546.90",
                "nxtLineFixed": false,
                "nxtLine": "2.0 0.00 1544.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "18/09/23 SERVICE CHARGE 2.0 A .00 1544.90",
            "modified": "18/09/23 SERVICE CHARGE 2.0 0.00 1544.90",
            "lineNum": 113,
            "status": null,
            "date": {
                "name": "Date",
                "original": "18/09/23",
                "modified": "18/09/23",
                "lineNum": 113,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.0,
                "credit": 0.00,
                "bal": 1544.90,
                "original": "2.0 0.00 1544.90",
                "modified": "2.0 0.00 1544.90",
                "nxtLineFixed": false,
                "nxtLine": "1000.00 0.00 544.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "19/09/23 DEBIT ADVICE 1000.00 .00 544.90",
            "modified": "19/09/23 DEBIT ADVICE 1000.00 0.00 544.90",
            "lineNum": 114,
            "status": null,
            "date": {
                "name": "Date",
                "original": "19/09/23",
                "modified": "19/09/23",
                "lineNum": 114,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE . RIB PYMT DD 18/09/23 N . . LEMBAGA TABUNG HAJI",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 1000.00,
                "credit": 0.00,
                "bal": 544.90,
                "original": "1000.00 0.00 544.90",
                "modified": "1000.00 0.00 544.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 542.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "49/09/23 SERVICE CHARGE 2.00 .00 542.90",
            "modified": "19/09/23 SERVICE CHARGE 2.00 0.00 542.90",
            "lineNum": 117,
            "status": null,
            "date": {
                "name": "Date",
                "original": "49/09/23",
                "modified": "19/09/23",
                "lineNum": 117,
                "nextVal": "",
                "suggested": [],
                "status": "review"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 542.90,
                "original": "2.00 0.00 542.90",
                "modified": "2.00 0.00 542.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 3000.00 3542.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "20/09/23 RIB/MB TRF FROM CA/SA .00 3000.00 3542.90",
            "modified": "20/09/23 RIB/MB TRF FROM CA/SA 0.00 3000.00 3542.90",
            "lineNum": 118,
            "status": null,
            "date": {
                "name": "Date",
                "original": "20/09/23",
                "modified": "20/09/23",
                "lineNum": 118,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 3000.00,
                "bal": 3542.90,
                "original": "0.00 3000.00 3542.90",
                "modified": "0.00 3000.00 3542.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 300.00 3842.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "21/09/23 RIB/MB TRF FROM CA/SA .00 300 00 3842.90",
            "modified": "21/09/23 RIB/MB TRF FROM CA/SA 0.00 300.00 3842.90",
            "lineNum": 119,
            "status": null,
            "date": {
                "name": "Date",
                "original": "21/09/23",
                "modified": "21/09/23",
                "lineNum": 119,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 300.00,
                "bal": 3842.90,
                "original": "0.00 300.00 3842.90",
                "modified": "0.00 300.00 3842.90",
                "nxtLineFixed": false,
                "nxtLine": "3000.00 0.00 842.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "21/09/23 DEBIT ADVICE . 3000.00 .00 842.90",
            "modified": "21/09/23 DEBIT ADVICE 3000.00 0.00 842.90",
            "lineNum": 120,
            "status": null,
            "date": {
                "name": "Date",
                "original": "21/09/23",
                "modified": "21/09/23",
                "lineNum": 120,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE RIB PYMT DD 20/05/23 LEMBAGA TABUNG HAJI",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 3000.00,
                "credit": 0.00,
                "bal": 842.90,
                "original": "3000.00 0.00 842.90",
                "modified": "3000.00 0.00 842.90",
                "nxtLineFixed": true,
                "nxtLine": "20 0.00 840.90",
                "nxtLineModified": "2.00 0.00 840.90",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": true,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "modified"
                    }
                }
            }
        },
        {
            "original": "21/09/23 SERVICE CHARGE 20 . .00 840.90",
            "modified": "21/09/23 SERVICE CHARGE 2.00 0.00 840.90",
            "lineNum": 123,
            "status": null,
            "date": {
                "name": "Date",
                "original": "21/09/23",
                "modified": "21/09/23",
                "lineNum": 123,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 840.90,
                "original": "20 0.00 840.90",
                "modified": "2.00 0.00 840.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 500.00 1340.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": true,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "modified"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "21/09/23 RIB/MB TRF FROM CA/SA .00 500.00 1340.90",
            "modified": "21/09/23 RIB/MB TRF FROM CA/SA 0.00 500.00 1340.90",
            "lineNum": 124,
            "status": null,
            "date": {
                "name": "Date",
                "original": "21/09/23",
                "modified": "21/09/23",
                "lineNum": 124,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 500.00,
                "bal": 1340.90,
                "original": "0.00 500.00 1340.90",
                "modified": "0.00 500.00 1340.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1000.00 2340.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "22/09/23 RIB/MB TRF FROM CA/SA .00 1000.00 2340.90",
            "modified": "22/09/23 RIB/MB TRF FROM CA/SA 0.00 1000.00 2340.90",
            "lineNum": 125,
            "status": null,
            "date": {
                "name": "Date",
                "original": "22/09/23",
                "modified": "22/09/23",
                "lineNum": 125,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1000.00,
                "bal": 2340.90,
                "original": "0.00 1000.00 2340.90",
                "modified": "0.00 1000.00 2340.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 220.00 2560.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": ". 22/09/23 RIB/MB TRF FROM CA/SA . .00 220.00 2560.90",
            "modified": "22/09/23 RIB/MB TRF FROM CA/SA 0.00 220.00 2560.90",
            "lineNum": 126,
            "status": null,
            "date": {
                "name": "Date",
                "original": "22/09/23",
                "modified": "22/09/23",
                "lineNum": 126,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 220.00,
                "bal": 2560.90,
                "original": "0.00 220.00 2560.90",
                "modified": "0.00 220.00 2560.90",
                "nxtLineFixed": true,
                "nxtLine": "0.00 100.00 2660.50",
                "nxtLineModified": "0.00 100.00 2660.90",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "22/08/23 RIB/MB TRF FROM CA/SA .00 100.00 2660.50",
            "modified": "22/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 2660.90",
            "lineNum": 127,
            "status": null,
            "date": {
                "name": "Date",
                "original": "22/08/23",
                "modified": "22/09/23",
                "lineNum": 127,
                "nextVal": "",
                "suggested": [],
                "status": "review"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 2660.90,
                "original": "0.00 100.00 2660.50",
                "modified": "0.00 100.00 2660.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1400.00 4060.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "22/09/23 RIB/MB TRF FROM CA/SA .00 1400 00 4060.90",
            "modified": "22/09/23 RIB/MB TRF FROM CA/SA 0.00 1400.00 4060.90",
            "lineNum": 128,
            "status": null,
            "date": {
                "name": "Date",
                "original": "22/09/23",
                "modified": "22/09/23",
                "lineNum": 128,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1400.00,
                "bal": 4060.90,
                "original": "0.00 1400.00 4060.90",
                "modified": "0.00 1400.00 4060.90",
                "nxtLineFixed": false,
                "nxtLine": "0 1000.00 5060.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "22/09/23 RIB/MB TRF FROM CA/SA Do 1000.00 5060.90",
            "modified": "22/09/23 RIB/MB TRF FROM CA/SA 0 1000.00 5060.90",
            "lineNum": 129,
            "status": null,
            "date": {
                "name": "Date",
                "original": "22/09/23",
                "modified": "22/09/23",
                "lineNum": 129,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0,
                "credit": 1000.00,
                "bal": 5060.90,
                "original": "0 1000.00 5060.90",
                "modified": "0 1000.00 5060.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 500.00 5560.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "22/09/23 RIB/MB TRF FROM CA/SA .00 500.00 5560 90",
            "modified": "22/09/23 RIB/MB TRF FROM CA/SA 0.00 500.00 5560.90",
            "lineNum": 130,
            "status": null,
            "date": {
                "name": "Date",
                "original": "22/09/23",
                "modified": "22/09/23",
                "lineNum": 130,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 500.00,
                "bal": 5560.90,
                "original": "0.00 500.00 5560.90",
                "modified": "0.00 500.00 5560.90",
                "nxtLineFixed": false,
                "nxtLine": "800.00 0.00 4760.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "22/09/23 DEBIT ADVICE 800.00 .00 4760.90",
            "modified": "22/09/23 DEBIT ADVICE 800.00 0.00 4760.90",
            "lineNum": 131,
            "status": null,
            "date": {
                "name": "Date",
                "original": "22/09/23",
                "modified": "22/09/23",
                "lineNum": 131,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE RIB PAYMI DD 21/9/23 LEMBAGA TABUNG HAJI Lai",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 800.00,
                "credit": 0.00,
                "bal": 4760.90,
                "original": "800.00 0.00 4760.90",
                "modified": "800.00 0.00 4760.90",
                "nxtLineFixed": false,
                "nxtLine": "2 0.00 4758.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "22/09/23 SERVICE CHARGE 2 .00 4758.90",
            "modified": "22/09/23 SERVICE CHARGE 2 0.00 4758.90",
            "lineNum": 134,
            "status": null,
            "date": {
                "name": "Date",
                "original": "22/09/23",
                "modified": "22/09/23",
                "lineNum": 134,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2,
                "credit": 0.00,
                "bal": 4758.90,
                "original": "2 0.00 4758.90",
                "modified": "2 0.00 4758.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 4808.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "22/09/23 RIB/MB TRF FROM CA/SA .00 50.00 4808.90",
            "modified": "22/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 4808.90",
            "lineNum": 135,
            "status": null,
            "date": {
                "name": "Date",
                "original": "22/09/23",
                "modified": "22/09/23",
                "lineNum": 135,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 4808.90,
                "original": "0.00 50.00 4808.90",
                "modified": "0.00 50.00 4808.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 4908.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "22/09/23 RIB/MB TRF FROM CA/SA .00 100.00 4908 90",
            "modified": "22/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 4908.90",
            "lineNum": 136,
            "status": null,
            "date": {
                "name": "Date",
                "original": "22/09/23",
                "modified": "22/09/23",
                "lineNum": 136,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 4908.90,
                "original": "0.00 100.00 4908.90",
                "modified": "0.00 100.00 4908.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 4958.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "22/09/23 RIB/MB TRF FROM CA/SA .00 50.00 4958.90",
            "modified": "22/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 4958.90",
            "lineNum": 137,
            "status": null,
            "date": {
                "name": "Date",
                "original": "22/09/23",
                "modified": "22/09/23",
                "lineNum": 137,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 4958.90,
                "original": "0.00 50.00 4958.90",
                "modified": "0.00 50.00 4958.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 5008.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 50.00 5008.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 5008.90",
            "lineNum": 138,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 138,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 5008.90,
                "original": "0.00 50.00 5008.90",
                "modified": "0.00 50.00 5008.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 5058.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 50.00 5058.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 5058.90",
            "lineNum": 139,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 139,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 5058.90,
                "original": "0.00 50.00 5058.90",
                "modified": "0.00 50.00 5058.90",
                "nxtLineFixed": true,
                "nxtLine": "0.00 261.00 5309.90",
                "nxtLineModified": "0.00 251.00 5309.90",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": true,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "modified",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 261.00 5309.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 251.00 5309.90",
            "lineNum": 140,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 140,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 251.00,
                "bal": 5309.90,
                "original": "0.00 261.00 5309.90",
                "modified": "0.00 251.00 5309.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 5409.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": true,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "modified",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 100.00 5409.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 5409.90",
            "lineNum": 141,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 141,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 5409.90,
                "original": "0.00 100.00 5409.90",
                "modified": "0.00 100.00 5409.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 51.00 5460.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA 51.00 5460.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 51.00 5460.90",
            "lineNum": 142,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 142,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 51.00,
                "bal": 5460.90,
                "original": "0.00 51.00 5460.90",
                "modified": "0.00 51.00 5460.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 150.00 5610.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 150.00 5610.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 150.00 5610.90",
            "lineNum": 143,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 143,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 150.00,
                "bal": 5610.90,
                "original": "0.00 150.00 5610.90",
                "modified": "0.00 150.00 5610.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 51.00 5661.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 51.00 5661.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 51.00 5661.90",
            "lineNum": 144,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 144,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 51.00,
                "bal": 5661.90,
                "original": "0.00 51.00 5661.90",
                "modified": "0.00 51.00 5661.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 41.00 5702.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 41.00 5702.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 41.00 5702.90",
            "lineNum": 145,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 145,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 41.00,
                "bal": 5702.90,
                "original": "0.00 41.00 5702.90",
                "modified": "0.00 41.00 5702.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 5802.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 100.00 5802.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 5802.90",
            "lineNum": 146,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 146,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 5802.90,
                "original": "0.00 100.00 5802.90",
                "modified": "0.00 100.00 5802.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 60.00 5862.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 . 60.00 5862 90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 60.00 5862.90",
            "lineNum": 147,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 147,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 60.00,
                "bal": 5862.90,
                "original": "0.00 60.00 5862.90",
                "modified": "0.00 60.00 5862.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 51.00 5913.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 51 00 5913.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 51.00 5913.90",
            "lineNum": 148,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 148,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 51.00,
                "bal": 5913.90,
                "original": "0.00 51.00 5913.90",
                "modified": "0.00 51.00 5913.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 51.00 5964.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 51.00 5964.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 51.00 5964.90",
            "lineNum": 149,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 149,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 51.00,
                "bal": 5964.90,
                "original": "0.00 51.00 5964.90",
                "modified": "0.00 51.00 5964.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 6064.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 100.00 . 6064.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 6064.90",
            "lineNum": 150,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 150,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 6064.90,
                "original": "0.00 100.00 6064.90",
                "modified": "0.00 100.00 6064.90",
                "nxtLineFixed": false,
                "nxtLine": "0 101.00 6165.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/VB TRF FROM CA/SA 00 101.00 . 6165.90",
            "modified": "23/09/23 RIB/VB TRF FROM CA/SA 0 101.00 6165.90",
            "lineNum": 158,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 158,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/VB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0,
                "credit": 101.00,
                "bal": 6165.90,
                "original": "0 101.00 6165.90",
                "modified": "0 101.00 6165.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1000.00 7165.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RI1B/MB TRF FROM CA/SA .00 1000.00 7165.90",
            "modified": "23/09/23 RI1B/MB TRF FROM CA/SA 0.00 1000.00 7165.90",
            "lineNum": 160,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 160,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RI1B/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1000.00,
                "bal": 7165.90,
                "original": "0.00 1000.00 7165.90",
                "modified": "0.00 1000.00 7165.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 150.00 7315.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 150.00 7315.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 150.00 7315.90",
            "lineNum": 162,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 162,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 150.00,
                "bal": 7315.90,
                "original": "0.00 150.00 7315.90",
                "modified": "0.00 150.00 7315.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 7415.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00. 100.00 7415.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 7415.90",
            "lineNum": 164,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 164,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 7415.90,
                "original": "0.00 100.00 7415.90",
                "modified": "0.00 100.00 7415.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 7515.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB7MB TRF FROM CA/SA .00 100.00 7515.90",
            "modified": "23/09/23 RIB7MB TRF FROM CA/SA 0.00 100.00 7515.90",
            "lineNum": 166,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 166,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB7MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 7515.90,
                "original": "0.00 100.00 7515.90",
                "modified": "0.00 100.00 7515.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 120.00 7635.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 RIB/MB TRF FROM CA/SA .00 120.00 7635.90",
            "modified": "23/09/23 RIB/MB TRF FROM CA/SA 0.00 120.00 7635.90",
            "lineNum": 168,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 168,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 120.00,
                "bal": 7635.90,
                "original": "0.00 120.00 7635.90",
                "modified": "0.00 120.00 7635.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 7735.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "23/09/23 R18/MB TRF FROM CA/SA .00 100.00 7735.90",
            "modified": "23/09/23 R18/MB TRF FROM CA/SA 0.00 100.00 7735.90",
            "lineNum": 170,
            "status": null,
            "date": {
                "name": "Date",
                "original": "23/09/23",
                "modified": "23/09/23",
                "lineNum": 170,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "R18/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 7735.90,
                "original": "0.00 100.00 7735.90",
                "modified": "0.00 100.00 7735.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 70.00 7805.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/MB TRF FROM CA/SA .00 . 70.00 7805.90",
            "modified": "24/09/23 RIB/MB TRF FROM CA/SA 0.00 70.00 7805.90",
            "lineNum": 172,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 172,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 70.00,
                "bal": 7805.90,
                "original": "0.00 70.00 7805.90",
                "modified": "0.00 70.00 7805.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 70.00 7875.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/MB TRF FROM CA/SA .00 70.00 7875.90",
            "modified": "24/09/23 RIB/MB TRF FROM CA/SA 0.00 70.00 7875.90",
            "lineNum": 174,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 174,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 70.00,
                "bal": 7875.90,
                "original": "0.00 70.00 7875.90",
                "modified": "0.00 70.00 7875.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 200.00 8075.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/MB TRF FROM CA/SA .00 200.00 8075 90",
            "modified": "24/09/23 RIB/MB TRF FROM CA/SA 0.00 200.00 8075.90",
            "lineNum": 176,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 176,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 200.00,
                "bal": 8075.90,
                "original": "0.00 200.00 8075.90",
                "modified": "0.00 200.00 8075.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 200.00 8275.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/MB TRF FROM CA/SA .00 . 200.00 8275.90",
            "modified": "24/09/23 RIB/MB TRF FROM CA/SA 0.00 200.00 8275.90",
            "lineNum": 178,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 178,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 200.00,
                "bal": 8275.90,
                "original": "0.00 200.00 8275.90",
                "modified": "0.00 200.00 8275.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 70.00 8345.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 R1B/MB TRF FROM CA/SA 00 70.00 B345 90",
            "modified": "24/09/23 R1B/MB TRF FROM CA/SA 0.00 70.00 8345.90",
            "lineNum": 180,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 180,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "R1B/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 70.00,
                "bal": 8345.90,
                "original": "0.00 70.00 8345.90",
                "modified": "0.00 70.00 8345.90",
                "nxtLineFixed": true,
                "nxtLine": "0 20.00 8385.90",
                "nxtLineModified": "0 20.00 8365.90",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/NB TRF FROM CA/SA a 20.00 8385.90",
            "modified": "24/09/23 RIB/NB TRF FROM CA/SA 0 20.00 8365.90",
            "lineNum": 182,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 182,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/NB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0,
                "credit": 20.00,
                "bal": 8365.90,
                "original": "0 20.00 8385.90",
                "modified": "0 20.00 8365.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 700.00 9085.00",
                "nxtLineModified": "",
                "modCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/MB TRF FROM CA/SA .00 700.00 . 9085.00",
            "modified": "24/09/23 RIB/MB TRF FROM CA/SA 0.00 700.00 9065.90",
            "lineNum": 184,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 184,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 700.00,
                "bal": 9065.90,
                "original": "0.00 700.00 9085.00",
                "modified": "0.00 700.00 9065.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 70.00 9135.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/MB TRF FROM CA/SA .00 70.00 9135.90",
            "modified": "24/09/23 RIB/MB TRF FROM CA/SA 0.00 70.00 9135.90",
            "lineNum": 186,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 186,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 70.00,
                "bal": 9135.90,
                "original": "0.00 70.00 9135.90",
                "modified": "0.00 70.00 9135.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 70.00 2205.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/MB TRF FROM CA/SA .0D 70.00 2205.90",
            "modified": "24/09/23 RIB/MB TRF FROM CA/SA 0.00 70.00 9205.90",
            "lineNum": 188,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 188,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 70.00,
                "bal": 9205.90,
                "original": "0.00 70.00 2205.90",
                "modified": "0.00 70.00 9205.90",
                "nxtLineFixed": false,
                "nxtLine": "0 70.00 9275.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/MB TRF FROM CA/SA D. . 70.00 9275.90",
            "modified": "24/09/23 RIB/MB TRF FROM CA/SA 0 70.00 9275.90",
            "lineNum": 190,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 190,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0,
                "credit": 70.00,
                "bal": 9275.90,
                "original": "0 70.00 9275.90",
                "modified": "0 70.00 9275.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 60.00 9335.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/NB TRF FROM CA/SA .00 60.00 9335.90",
            "modified": "24/09/23 RIB/NB TRF FROM CA/SA 0.00 60.00 9335.90",
            "lineNum": 192,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 192,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/NB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 60.00,
                "bal": 9335.90,
                "original": "0.00 60.00 9335.90",
                "modified": "0.00 60.00 9335.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 60.00 9395.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/0923 RIB/MB TRF FROM CA/SA .00 60.00 9395.90",
            "modified": "24/09/23 RIB/MB TRF FROM CA/S 0.00 60.00 9395.90",
            "lineNum": 194,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 194,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/S",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 60.00,
                "bal": 9395.90,
                "original": "0.00 60.00 9395.90",
                "modified": "0.00 60.00 9395.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 60.00 9455.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/NB TRF FROM CA/SA .00 60.00 . 9455 90",
            "modified": "24/09/23 RIB/NB TRF FROM CA/SA 0.00 60.00 9455.90",
            "lineNum": 196,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 196,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/NB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 60.00,
                "bal": 9455.90,
                "original": "0.00 60.00 9455.90",
                "modified": "0.00 60.00 9455.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 150.00 9605.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "24/09/23 RIB/MB TRF FROM CA/SA .00 150.00 9605 90",
            "modified": "24/09/23 RIB/MB TRF FROM CA/SA 0.00 150.00 9605.90",
            "lineNum": 198,
            "status": null,
            "date": {
                "name": "Date",
                "original": "24/09/23",
                "modified": "24/09/23",
                "lineNum": 198,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 150.00,
                "bal": 9605.90,
                "original": "0.00 150.00 9605.90",
                "modified": "0.00 150.00 9605.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 31.00 9636.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/VB TRF FROM CA/SA .00 31.00 9636.90",
            "modified": "25/09/23 RIB/VB TRF FROM CA/SA 0.00 31.00 9636.90",
            "lineNum": 200,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 200,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/VB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 31.00,
                "bal": 9636.90,
                "original": "0.00 31.00 9636.90",
                "modified": "0.00 31.00 9636.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 51.00 9687.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 51.00 9687.90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 51.00 9687.90",
            "lineNum": 202,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 202,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 51.00,
                "bal": 9687.90,
                "original": "0.00 51.00 9687.90",
                "modified": "0.00 51.00 9687.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1000.00 10687.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 1000.00 10687.90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 1000.00 10687.90",
            "lineNum": 204,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 204,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1000.00,
                "bal": 10687.90,
                "original": "0.00 1000.00 10687.90",
                "modified": "0.00 1000.00 10687.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 31.00 10718.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 31.00 10718.90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 31.00 10718.90",
            "lineNum": 206,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 206,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 31.00,
                "bal": 10718.90,
                "original": "0.00 31.00 10718.90",
                "modified": "0.00 31.00 10718.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 200.00 10918.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA 00 200.00 10918. 90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 200.00 10918.90",
            "lineNum": 208,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 208,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 200.00,
                "bal": 10918.90,
                "original": "0.00 200.00 10918.90",
                "modified": "0.00 200.00 10918.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 2001.00 12919.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 2001.00 12919.90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 2001.00 12919.90",
            "lineNum": 210,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 210,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 2001.00,
                "bal": 12919.90,
                "original": "0.00 2001.00 12919.90",
                "modified": "0.00 2001.00 12919.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 12969.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 50 00 12969.90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 12969.90",
            "lineNum": 212,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 212,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 12969.90,
                "original": "0.00 50.00 12969.90",
                "modified": "0.00 50.00 12969.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 13019.00",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 50 00 13019.00",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 13019.90",
            "lineNum": 214,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 214,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 13019.90,
                "original": "0.00 50.00 13019.00",
                "modified": "0.00 50.00 13019.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1000.00 14019.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 1000.00 14019 90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 1000.00 14019.90",
            "lineNum": 216,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 216,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1000.00,
                "bal": 14019.90,
                "original": "0.00 1000.00 14019.90",
                "modified": "0.00 1000.00 14019.90",
                "nxtLineFixed": false,
                "nxtLine": "0.0 50.00 14069.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 50 00 14069 90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.0 50.00 14069.90",
            "lineNum": 218,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 218,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.0,
                "credit": 50.00,
                "bal": 14069.90,
                "original": "0.0 50.00 14069.90",
                "modified": "0.0 50.00 14069.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 14119.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 R1B/MB TRF FROM CA/SA .00 50.00 14119 90",
            "modified": "25/09/23 R1B/MB TRF FROM CA/SA 0.00 50.00 14119.90",
            "lineNum": 220,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 220,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "R1B/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 14119.90,
                "original": "0.00 50.00 14119.90",
                "modified": "0.00 50.00 14119.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 500.00 14619.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 500.00 14619 90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 500.00 14619.90",
            "lineNum": 222,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 222,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 500.00,
                "bal": 14619.90,
                "original": "0.00 500.00 14619.90",
                "modified": "0.00 500.00 14619.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 600.00 15219.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM GA/SA .00 600.00 15219.90",
            "modified": "25/09/23 RIB/MB TRF FROM GA/SA 0.00 600.00 15219.90",
            "lineNum": 224,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 224,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM GA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 600.00,
                "bal": 15219.90,
                "original": "0.00 600.00 15219.90",
                "modified": "0.00 600.00 15219.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 15269.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 50.00 15269 90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 15269.90",
            "lineNum": 226,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 226,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 15269.90,
                "original": "0.00 50.00 15269.90",
                "modified": "0.00 50.00 15269.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 600.00 15869.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 600.00 15869.90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 600.00 15869.90",
            "lineNum": 228,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 228,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 600.00,
                "bal": 15869.90,
                "original": "0.00 600.00 15869.90",
                "modified": "0.00 600.00 15869.90",
                "nxtLineFixed": false,
                "nxtLine": "50.00 0.00 15819.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF TO CA/SA 50.00 .00 15819 90",
            "modified": "25/09/23 RIB/MB TRF TO CA/SA 50.00 0.00 15819.90",
            "lineNum": 230,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 230,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF TO CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 50.00,
                "credit": 0.00,
                "bal": 15819.90,
                "original": "50.00 0.00 15819.90",
                "modified": "50.00 0.00 15819.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 15869.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 50.00 15869 90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 15869.90",
            "lineNum": 232,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 232,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 15869.90,
                "original": "0.00 50.00 15869.90",
                "modified": "0.00 50.00 15869.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 15969.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 100.00 15969 90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 15969.90",
            "lineNum": 234,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 234,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 15969.90,
                "original": "0.00 100.00 15969.90",
                "modified": "0.00 100.00 15969.90",
                "nxtLineFixed": false,
                "nxtLine": "9017.00 0.00 6952.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 DEBIT ADVICE 9017.00 .00 6952.90",
            "modified": "25/09/23 DEBIT ADVICE 9017.00 0.00 6952.90",
            "lineNum": 236,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 236,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE RIB PAYMENT .",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 9017.00,
                "credit": 0.00,
                "bal": 6952.90,
                "original": "9017.00 0.00 6952.90",
                "modified": "9017.00 0.00 6952.90",
                "nxtLineFixed": false,
                "nxtLine": "2 0.00 6950.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 SERVICE CHARGE 2d .00 6950.90",
            "modified": "25/09/23 SERVICE CHARGE 2 0.00 6950.90",
            "lineNum": 249,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 249,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2,
                "credit": 0.00,
                "bal": 6950.90,
                "original": "2 0.00 6950.90",
                "modified": "2 0.00 6950.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 401.00 7351.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "25/09/23 RIB/MB TRF FROM CA/SA .00 401.00 7351.90",
            "modified": "25/09/23 RIB/MB TRF FROM CA/SA 0.00 401.00 7351.90",
            "lineNum": 250,
            "status": null,
            "date": {
                "name": "Date",
                "original": "25/09/23",
                "modified": "25/09/23",
                "lineNum": 250,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 401.00,
                "bal": 7351.90,
                "original": "0.00 401.00 7351.90",
                "modified": "0.00 401.00 7351.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 31.00 7382.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 31.00 7382.90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 31.00 7382.90",
            "lineNum": 251,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 251,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 31.00,
                "bal": 7382.90,
                "original": "0.00 31.00 7382.90",
                "modified": "0.00 31.00 7382.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 10.00 7392.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 10.00 7392.90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 10.00 7392.90",
            "lineNum": 252,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 252,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 10.00,
                "bal": 7392.90,
                "original": "0.00 10.00 7392.90",
                "modified": "0.00 10.00 7392.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 31.00 7423.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 31.00 7423.90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 31.00 7423.90",
            "lineNum": 253,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 253,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 31.00,
                "bal": 7423.90,
                "original": "0.00 31.00 7423.90",
                "modified": "0.00 31.00 7423.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 30.00 7453.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 30.00 7453.90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 30.00 7453.90",
            "lineNum": 254,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 254,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 30.00,
                "bal": 7453.90,
                "original": "0.00 30.00 7453.90",
                "modified": "0.00 30.00 7453.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 31.00 7484.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 31.00 7484 90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 31.00 7484.90",
            "lineNum": 255,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 255,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 31.00,
                "bal": 7484.90,
                "original": "0.00 31.00 7484.90",
                "modified": "0.00 31.00 7484.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 7584.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 100.00 7584.90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 7584.90",
            "lineNum": 256,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 256,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 7584.90,
                "original": "0.00 100.00 7584.90",
                "modified": "0.00 100.00 7584.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 500.00 8084.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 500.00 8084 90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 500.00 8084.90",
            "lineNum": 257,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 257,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 500.00,
                "bal": 8084.90,
                "original": "0.00 500.00 8084.90",
                "modified": "0.00 500.00 8084.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 10.00 8094.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 10.00 8094.90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 10.00 8094.90",
            "lineNum": 258,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 258,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 10.00,
                "bal": 8094.90,
                "original": "0.00 10.00 8094.90",
                "modified": "0.00 10.00 8094.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 8144.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 50.00 8144.90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 8144.90",
            "lineNum": 259,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 259,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 8144.90,
                "original": "0.00 50.00 8144.90",
                "modified": "0.00 50.00 8144.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 31.00 8175.30",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA ..00 31.00 8175.30",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 31.00 8175.30",
            "lineNum": 260,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 260,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 31.00,
                "bal": 8175.30,
                "original": "0.00 31.00 8175.30",
                "modified": "0.00 31.00 8175.30",
                "nxtLineFixed": false,
                "nxtLine": "0.00 2000.00 101765.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "pending",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB .TRF FROM GA/SA .00 2000.00 101765.90",
            "modified": "26/09/23 RIB/MB .TRF FROM GA/SA 0.00 2000.00 101765.90",
            "lineNum": 261,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 261,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB .TRF FROM GA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 2000.00,
                "bal": 101765.90,
                "original": "0.00 2000.00 101765.90",
                "modified": "0.00 2000.00 101765.90",
                "nxtLineFixed": false,
                "nxtLine": "50.00 0.00 10125.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "pending",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF TO CA/SA 50.00 .00 10125.90",
            "modified": "26/09/23 RIB/MB TRF TO CA/SA 50.00 0.00 10125.90",
            "lineNum": 262,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "26/09/23",
                "lineNum": 262,
                "nextVal": "",
                "suggested": [],
                "status": "review"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF TO CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 50.00,
                "credit": 0.00,
                "bal": 10125.90,
                "original": "50.00 0.00 10125.90",
                "modified": "50.00 0.00 10125.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 10225.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "pending"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRE FROM CA/SA .00 100.00 10225.90",
            "modified": "26/09/23 RIB/MB TRE FROM CA/SA 0.00 100.00 10225.90",
            "lineNum": 263,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 263,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRE FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 10225.90,
                "original": "0.00 100.00 10225.90",
                "modified": "0.00 100.00 10225.90",
                "nxtLineFixed": true,
                "nxtLine": "0.00 5000.00 152265.90",
                "nxtLineModified": "0.00 5000.00 15225.90",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 5000 00 152265.90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 5000.00 15225.90",
            "lineNum": 264,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 264,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 5000.00,
                "bal": 15225.90,
                "original": "0.00 5000.00 152265.90",
                "modified": "0.00 5000.00 15225.90",
                "nxtLineFixed": false,
                "nxtLine": "6364.00 0.00 8861.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 DEBIT ADVICE 6364 00 . .00 8861 90",
            "modified": "26/09/23 DEBIT ADVICE 6364.00 0.00 8861.90",
            "lineNum": 265,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 265,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE FIGURE DD 25/09/2023 LEMBAGA TABUNG HAJI",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 6364.00,
                "credit": 0.00,
                "bal": 8861.90,
                "original": "6364.00 0.00 8861.90",
                "modified": "6364.00 0.00 8861.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 8859.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 SERVICE CHARGE 2.00 A 00 8859 90",
            "modified": "26/09/23 SERVICE CHARGE 2.00 0.00 8859.90",
            "lineNum": 270,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 270,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 8859.90,
                "original": "2.00 0.00 8859.90",
                "modified": "2.00 0.00 8859.90",
                "nxtLineFixed": false,
                "nxtLine": "0 300.00 9159.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA o 300.00 9159.90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0 300.00 9159.90",
            "lineNum": 271,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 271,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0,
                "credit": 300.00,
                "bal": 9159.90,
                "original": "0 300.00 9159.90",
                "modified": "0 300.00 9159.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 200.00 9359.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 200.00 9359.90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 200.00 9359.90",
            "lineNum": 272,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 272,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 200.00,
                "bal": 9359.90,
                "original": "0.00 200.00 9359.90",
                "modified": "0.00 200.00 9359.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 9459.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "26/09/23 RIB/MB TRF FROM CA/SA .00 100.00 9459.90",
            "modified": "26/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 9459.90",
            "lineNum": 273,
            "status": null,
            "date": {
                "name": "Date",
                "original": "26/09/23",
                "modified": "26/09/23",
                "lineNum": 273,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 9459.90,
                "original": "0.00 100.00 9459.90",
                "modified": "0.00 100.00 9459.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 9559.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "27/09/23 RIB/MB TRF FROM CA/SA .00 100.00 9559.90",
            "modified": "27/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 9559.90",
            "lineNum": 274,
            "status": null,
            "date": {
                "name": "Date",
                "original": "27/09/23",
                "modified": "27/09/23",
                "lineNum": 274,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 9559.90,
                "original": "0.00 100.00 9559.90",
                "modified": "0.00 100.00 9559.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 500.00 10059.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "27/09/23 RIB/MB TRF FROM CA/SA .00 500.00 10059.90",
            "modified": "27/09/23 RIB/MB TRF FROM CA/SA 0.00 500.00 10059.90",
            "lineNum": 275,
            "status": null,
            "date": {
                "name": "Date",
                "original": "27/09/23",
                "modified": "27/09/23",
                "lineNum": 275,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 500.00,
                "bal": 10059.90,
                "original": "0.00 500.00 10059.90",
                "modified": "0.00 500.00 10059.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 2000.00 12059.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "27/09/23 RIB/MB TRF FROM CA/SA .00 2000.00 12059.90",
            "modified": "27/09/23 RIB/MB TRF FROM CA/SA 0.00 2000.00 12059.90",
            "lineNum": 276,
            "status": null,
            "date": {
                "name": "Date",
                "original": "27/09/23",
                "modified": "27/09/23",
                "lineNum": 276,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 2000.00,
                "bal": 12059.90,
                "original": "0.00 2000.00 12059.90",
                "modified": "0.00 2000.00 12059.90",
                "nxtLineFixed": false,
                "nxtLine": "8925.00 0.00 3134.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "27/09/23 DEBIT ADVICE B925.00 .00 3134.90",
            "modified": "27/09/23 DEBIT ADVICE 8925.00 0.00 3134.90",
            "lineNum": 277,
            "status": null,
            "date": {
                "name": "Date",
                "original": "27/09/23",
                "modified": "27/09/23",
                "lineNum": 277,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE RIB PYMT DD 26/09/23 LEMBAGA TABUNG HAJI",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 8925.00,
                "credit": 0.00,
                "bal": 3134.90,
                "original": "8925.00 0.00 3134.90",
                "modified": "8925.00 0.00 3134.90",
                "nxtLineFixed": false,
                "nxtLine": "2.0 0.00 3132.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "27/09/23 SERVICE CHARGE 2.0 .00 3132.90",
            "modified": "27/09/23 SERVICE CHARGE 2.0 0.00 3132.90",
            "lineNum": 282,
            "status": null,
            "date": {
                "name": "Date",
                "original": "27/09/23",
                "modified": "27/09/23",
                "lineNum": 282,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.0,
                "credit": 0.00,
                "bal": 3132.90,
                "original": "2.0 0.00 3132.90",
                "modified": "2.0 0.00 3132.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 3182.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "27/09/23 RIB/MB TRF FROM CA/SA on 50 00 3182.90",
            "modified": "27/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 3182.90",
            "lineNum": 283,
            "status": null,
            "date": {
                "name": "Date",
                "original": "27/09/23",
                "modified": "27/09/23",
                "lineNum": 283,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 3182.90,
                "original": "0.00 50.00 3182.90",
                "modified": "0.00 50.00 3182.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 3232.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "27/09/23 RIB/MB TRF FROM CA/SA .00 50.00 3232.90",
            "modified": "27/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 3232.90",
            "lineNum": 284,
            "status": null,
            "date": {
                "name": "Date",
                "original": "27/09/23",
                "modified": "27/09/23",
                "lineNum": 284,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 3232.90,
                "original": "0.00 50.00 3232.90",
                "modified": "0.00 50.00 3232.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 200.00 3432.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "27/09/23 RIB/MB TRF FROM CA/SA .00 200.00 3432.90",
            "modified": "27/09/23 RIB/MB TRF FROM CA/SA 0.00 200.00 3432.90",
            "lineNum": 285,
            "status": null,
            "date": {
                "name": "Date",
                "original": "27/09/23",
                "modified": "27/09/23",
                "lineNum": 285,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 200.00,
                "bal": 3432.90,
                "original": "0.00 200.00 3432.90",
                "modified": "0.00 200.00 3432.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 3532.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "27/09/23 RIB/MB TRF FROM CA/SA .00 100.00 3532.90",
            "modified": "27/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 3532.90",
            "lineNum": 286,
            "status": null,
            "date": {
                "name": "Date",
                "original": "27/09/23",
                "modified": "27/09/23",
                "lineNum": 286,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 3532.90,
                "original": "0.00 100.00 3532.90",
                "modified": "0.00 100.00 3532.90",
                "nxtLineFixed": true,
                "nxtLine": "0.00 1600.00 3632.90",
                "nxtLineModified": "0.00 100.00 3632.90",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": true,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "modified",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "27/09/23 RIB/MB TRF FROM CA/SA .00 1600.00 3632.90",
            "modified": "27/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 3632.90",
            "lineNum": 287,
            "status": null,
            "date": {
                "name": "Date",
                "original": "27/09/23",
                "modified": "27/09/23",
                "lineNum": 287,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 3632.90,
                "original": "0.00 1600.00 3632.90",
                "modified": "0.00 100.00 3632.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 100.00 3732.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": true,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "modified",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "27/09/23 RIB/MB TRF FROM CA/SA .00 100.00 3732 90",
            "modified": "27/09/23 RIB/MB TRF FROM CA/SA 0.00 100.00 3732.90",
            "lineNum": 288,
            "status": null,
            "date": {
                "name": "Date",
                "original": "27/09/23",
                "modified": "27/09/23",
                "lineNum": 288,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 100.00,
                "bal": 3732.90,
                "original": "0.00 100.00 3732.90",
                "modified": "0.00 100.00 3732.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 150.00 3882.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 150.00 3882.90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 150.00 3882.90",
            "lineNum": 289,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 289,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 150.00,
                "bal": 3882.90,
                "original": "0.00 150.00 3882.90",
                "modified": "0.00 150.00 3882.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 201.00 4083.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 201.00 4083.90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 201.00 4083.90",
            "lineNum": 290,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 290,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 201.00,
                "bal": 4083.90,
                "original": "0.00 201.00 4083.90",
                "modified": "0.00 201.00 4083.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1001.00 5084.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 1001.00 5084.90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 1001.00 5084.90",
            "lineNum": 291,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 291,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1001.00,
                "bal": 5084.90,
                "original": "0.00 1001.00 5084.90",
                "modified": "0.00 1001.00 5084.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 201.00 5285.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 201.00 5285.90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 201.00 5285.90",
            "lineNum": 299,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 299,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 201.00,
                "bal": 5285.90,
                "original": "0.00 201.00 5285.90",
                "modified": "0.00 201.00 5285.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 51.00 5336.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RiB/MB TRF FROM CA/SA .00 51.00 5336.90",
            "modified": "28/09/23 RiB/MB TRF FROM CA/SA 0.00 51.00 5336.90",
            "lineNum": 300,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 300,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RiB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 51.00,
                "bal": 5336.90,
                "original": "0.00 51.00 5336.90",
                "modified": "0.00 51.00 5336.90",
                "nxtLineFixed": true,
                "nxtLine": "0.00 101.00 5437.00",
                "nxtLineModified": "0.00 101.00 5437.90",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 101.00 5437.00",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 101.00 5437.90",
            "lineNum": 301,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 301,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 101.00,
                "bal": 5437.90,
                "original": "0.00 101.00 5437.00",
                "modified": "0.00 101.00 5437.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 101.00 5538.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": true,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "modified",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 101.00 5538.90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 101.00 5538.90",
            "lineNum": 302,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 302,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 101.00,
                "bal": 5538.90,
                "original": "0.00 101.00 5538.90",
                "modified": "0.00 101.00 5538.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 300.00 5838.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA 00 300.00 5838 90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 300.00 5838.90",
            "lineNum": 303,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 303,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 300.00,
                "bal": 5838.90,
                "original": "0.00 300.00 5838.90",
                "modified": "0.00 300.00 5838.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 101.00 5939.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA 00 101.00 5939 90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 101.00 5939.90",
            "lineNum": 304,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 304,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 101.00,
                "bal": 5939.90,
                "original": "0.00 101.00 5939.90",
                "modified": "0.00 101.00 5939.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 101.00 6040.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA oo 101 00 6040.90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 101.00 6040.90",
            "lineNum": 305,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 305,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 101.00,
                "bal": 6040.90,
                "original": "0.00 101.00 6040.90",
                "modified": "0.00 101.00 6040.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 6090.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 50.00 G090 90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 6090.90",
            "lineNum": 306,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 306,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 6090.90,
                "original": "0.00 50.00 6090.90",
                "modified": "0.00 50.00 6090.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 201.00 6291.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 201 00 6291.90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 201.00 6291.90",
            "lineNum": 307,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 307,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 201.00,
                "bal": 6291.90,
                "original": "0.00 201.00 6291.90",
                "modified": "0.00 201.00 6291.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1000.00 7291.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 R1B/M3 TRF FROM CA/SA .00 1000.00 7291.90",
            "modified": "28/09/23 R1B/M3 TRF FROM CA/SA 0.00 1000.00 7291.90",
            "lineNum": 308,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 308,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "R1B/M3 TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1000.00,
                "bal": 7291.90,
                "original": "0.00 1000.00 7291.90",
                "modified": "0.00 1000.00 7291.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 500.00 7791.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 500 00 7791.90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 500.00 7791.90",
            "lineNum": 309,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 309,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 500.00,
                "bal": 7791.90,
                "original": "0.00 500.00 7791.90",
                "modified": "0.00 500.00 7791.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 500.00 8291.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 500.00 8291.90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 500.00 8291.90",
            "lineNum": 310,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 310,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 500.00,
                "bal": 8291.90,
                "original": "0.00 500.00 8291.90",
                "modified": "0.00 500.00 8291.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1000.00 9291.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 1000.00 9291.90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 1000.00 9291.90",
            "lineNum": 311,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 311,
                "nextVal": "",
                "suggested": [],
                "status": "pending"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1000.00,
                "bal": 9291.90,
                "original": "0.00 1000.00 9291.90",
                "modified": "0.00 1000.00 9291.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1200.00 10491.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "20/0823 RIB/MB TRF FROM CA/SA .00 1200.00 10491. 90",
            "modified": "28/09/23 RIB/MB TRF FROM CA/S 0.00 1200.00 10491.90",
            "lineNum": 312,
            "status": null,
            "date": {
                "name": "Date",
                "original": "20/08/23",
                "modified": "28/09/23",
                "lineNum": 312,
                "nextVal": "",
                "suggested": [],
                "status": "review"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/S",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1200.00,
                "bal": 10491.90,
                "original": "0.00 1200.00 10491.90",
                "modified": "0.00 1200.00 10491.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 250.00 10741.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "28/09/23 RIB/MB TRF FROM CA/SA .00 250.00 10741.90 .",
            "modified": "28/09/23 RIB/MB TRF FROM CA/SA 0.00 250.00 10741.90",
            "lineNum": 313,
            "status": null,
            "date": {
                "name": "Date",
                "original": "28/09/23",
                "modified": "28/09/23",
                "lineNum": 313,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 250.00,
                "bal": 10741.90,
                "original": "0.00 250.00 10741.90",
                "modified": "0.00 250.00 10741.90",
                "nxtLineFixed": true,
                "nxtLine": "0.00 260.00 10991.90",
                "nxtLineModified": "0.00 250.00 10991.90",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": true,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "modified",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "29/09/23 RIB/MB TRF FROM CA/SA .00 260.00 10991.90",
            "modified": "29/09/23 RIB/MB TRF FROM CA/SA 0.00 250.00 10991.90",
            "lineNum": 314,
            "status": null,
            "date": {
                "name": "Date",
                "original": "29/09/23",
                "modified": "29/09/23",
                "lineNum": 314,
                "nextVal": "",
                "suggested": [],
                "status": "pending"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 250.00,
                "bal": 10991.90,
                "original": "0.00 260.00 10991.90",
                "modified": "0.00 250.00 10991.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 1000.00 11991.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": true,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "modified",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "20/09/23 RIB/MB TRF FROM CA/SA .00 1000.00 11991.90",
            "modified": "29/09/23 RIB/MB TRF FROM CA/SA 0.00 1000.00 11991.90",
            "lineNum": 315,
            "status": null,
            "date": {
                "name": "Date",
                "original": "20/09/23",
                "modified": "29/09/23",
                "lineNum": 315,
                "nextVal": "",
                "suggested": [],
                "status": "review"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 1000.00,
                "bal": 11991.90,
                "original": "0.00 1000.00 11991.90",
                "modified": "0.00 1000.00 11991.90",
                "nxtLineFixed": false,
                "nxtLine": "8759.00 0.00 3232.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "29/08/23 DEBIT ADVICE 8759.00 .00 3232.90",
            "modified": "29/09/23 DEBIT ADVICE 8759.00 0.00 3232.90",
            "lineNum": 316,
            "status": null,
            "date": {
                "name": "Date",
                "original": "29/08/23",
                "modified": "29/09/23",
                "lineNum": 316,
                "nextVal": "",
                "suggested": [],
                "status": "review"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "DEBIT ADVICE FIGURE DD 27 4 28/09/2023 LEMBAGA TABUNG HAJI",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 8759.00,
                "credit": 0.00,
                "bal": 3232.90,
                "original": "8759.00 0.00 3232.90",
                "modified": "8759.00 0.00 3232.90",
                "nxtLineFixed": false,
                "nxtLine": "2.00 0.00 3230.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "29/09/23 SERVICE CHARGE 2.00. .00 3230.90",
            "modified": "29/09/23 SERVICE CHARGE 2.00 0.00 3230.90",
            "lineNum": 323,
            "status": null,
            "date": {
                "name": "Date",
                "original": "29/09/23",
                "modified": "29/09/23",
                "lineNum": 323,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "SERVICE CHARGE",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 2.00,
                "credit": 0.00,
                "bal": 3230.90,
                "original": "2.00 0.00 3230.90",
                "modified": "2.00 0.00 3230.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 3280.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "29/09/23 RIB/MB TRF FROM CA/SA 00 50 00 3280.90",
            "modified": "29/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 3280.90",
            "lineNum": 324,
            "status": null,
            "date": {
                "name": "Date",
                "original": "29/09/23",
                "modified": "29/09/23",
                "lineNum": 324,
                "nextVal": "",
                "suggested": [],
                "status": "pending"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 3280.90,
                "original": "0.00 50.00 3280.90",
                "modified": "0.00 50.00 3280.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 50.00 3330.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "20/09/23 RIB/MB TRF FROM CA/SA .00 50.00 3330.90",
            "modified": "29/09/23 RIB/MB TRF FROM CA/SA 0.00 50.00 3330.90",
            "lineNum": 325,
            "status": null,
            "date": {
                "name": "Date",
                "original": "20/09/23",
                "modified": "29/09/23",
                "lineNum": 325,
                "nextVal": "",
                "suggested": [],
                "status": "review"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 50.00,
                "bal": 3330.90,
                "original": "0.00 50.00 3330.90",
                "modified": "0.00 50.00 3330.90",
                "nxtLineFixed": false,
                "nxtLine": "0.0 500.00 3830.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "29/09/23 RIB/MB TRF FROM CA/SA .00 500 00 3830 90",
            "modified": "29/09/23 RIB/MB TRF FROM CA/SA 0.0 500.00 3830.90",
            "lineNum": 326,
            "status": null,
            "date": {
                "name": "Date",
                "original": "29/09/23",
                "modified": "29/09/23",
                "lineNum": 326,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.0,
                "credit": 500.00,
                "bal": 3830.90,
                "original": "0.0 500.00 3830.90",
                "modified": "0.0 500.00 3830.90",
                "nxtLineFixed": false,
                "nxtLine": "0.00 3000.00 6830.90",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        },
        {
            "original": "30/09/23 RIB/MB TRF FROM CA/SA .00 3000 00 6830.90",
            "modified": "30/09/23 RIB/MB TRF FROM CA/SA 0.00 3000.00 6830.90",
            "lineNum": 327,
            "status": null,
            "date": {
                "name": "Date",
                "original": "30/09/23",
                "modified": "30/09/23",
                "lineNum": 327,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "descr": {
                "name": "",
                "original": "",
                "modified": "RIB/MB TRF FROM CA/SA TOTAL CREDIT 150 60968.00 TOTAL DEBIT 39 62/262.57",
                "lineNum": 0,
                "nextVal": "",
                "suggested": [],
                "status": "accepted"
            },
            "value": {
                "debit": 0.00,
                "credit": 3000.00,
                "bal": 6830.90,
                "original": "0.00 3000.00 6830.90",
                "modified": "0.00 3000.00 6830.90",
                "nxtLineFixed": false,
                "nxtLine": "",
                "nxtLineModified": "",
                "modCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                },
                "nxtModCol": {
                    "balance": false,
                    "credit": false,
                    "debit": false,
                    "status": {
                        "balance": "accepted",
                        "credit": "accepted",
                        "debit": "accepted"
                    }
                }
            }
        }
    ]);

    const [jobValidation, setJobValidation] = useState([]);

    const refRContainer = useRef(null);
    const [tableHeight, setTableHeight] = useState(0);
    const [rightContainerH, setRightContainerH] = useState(0);
    const [tableChangeHeight, setTableChangeHeight] = useState(false);

    const [selectedRow, setSelectedRow] = useState(0);

    // WS Connection
    const [conn, setConnection] = useState();
    
    const startConnection = async (username) => {
        try {
            //  initiate connection
            console.log("Setting up websocket...");
            const conn = new HubConnectionBuilder()
                .withUrl("https://localhost:7129/monitor")
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            // set up handler
            conn.on("OnConnect", (username, msg)=>{
                console.log("Connection has been estalished...", msg);
            });

            conn.on("ReceiveMessage", (username, msg)=>{
                console.log("Receiving message:", msg);
            });

            conn.on("OnCompleted", async (username, msg)=>{
                setJobCompleted(true);
            });

            console.log(conn);
            setConnection(conn)

            await conn.start();
            await conn.invoke("OnConnect", {username});

        } catch(e){
            console.log("Websocket error:" + e);
        }
    }

    useEffect(() => {
        console.log("Inside use effect");

        // console.log("page height change...", tableRef.current.clientHeight);

        startConnection("nikaqim");
      }, []); // <-- empty array means 'run once'

    useEffect(()=>{
        if(jobcompleted){
            getJobResult(jobId);
            setJobCompleted(false);
        }
    }, [jobcompleted]);

    useEffect(()=>{
        console.log("jobResult", jobResult)
        setJobValidation(getValidationInput(jobResult));
    }, [jobResult]);

    useEffect(()=>{
        setRightContainerH(refRContainer.current.clientHeight);
    }, [tableHeight]);

    const getJobResult = async (id) => {
        console.log("Pulling result for job id:", id);
        const res = await fetch('https://localhost:7129/api/OCR/review/' + id, {
            method: 'GET',  
            headers: {
                'Accept': '*/*',
            }
        });

        if(!res.ok) throw new Error(await res.text())
        else {
            const resdata = await res.text();
            console.log("results:", resdata);
            setJobResult(JSON.parse(await resdata).jobResult.results);

            return resdata;
        }
    }

    const getValidationInput = (results) => {
        const returnData = {
            data: {},
            stats:{
                total: {
                    review:0,
                    fix:0,
                    lineNum:[]
                },
                date: {
                    review:0,
                    fix:0,
                    lineNum:[]
                },
                debit:{
                    review:0,
                    fix:0,
                    lineNum:[]
                },
                credit:{
                    review:0,
                    fix:0,
                    lineNum:[]
                },
                balance:{
                    review:0,
                    fix:0,
                    lineNum:[]
                }
            },
        };

        for(var i=0; i < results.length; i++){
            var DateStatus = results[i].date.status;
            var DebitStatus = results[i].value.modCol.status.debit;
            var CreditStatus = results[i].value.modCol.status.credit;
            var BalanceStatus = results[i].value.modCol.status.balance;

            var DateModified = DateStatus !== "accepted";
            var DebitModified = DebitStatus !== "accepted";
            var CreditModified = CreditStatus !== "accepted";
            var BalModified = BalanceStatus !== "accepted";
            
            var hasModifiedLine = DateModified || DebitModified || CreditModified || BalModified;

            if(hasModifiedLine){
                var allValueArrOrig = results[i].value.original.split(" ");
                var allValueArrModi = results[i].value.modified.split(" ");

                if(returnData.data[i.toString()] === undefined){
                    var lineNum = i.toString();
                    var typeModified = [];
                    returnData.data[lineNum] = {
                        date: DateModified ? {
                            original: results[i].date.original,
                            modified: results[i].date.modified,
                            status: results[i].date.status
                        } : null,

                        debit: DebitModified ? {
                            original: allValueArrOrig[0],
                            modified: allValueArrModi[0],
                            status: results[i].value.modCol.status.debit
                        } : null,
                        credit: CreditModified ? {
                            original: allValueArrOrig[1],
                            modified: allValueArrModi[1],
                            status: results[i].value.modCol.status.credit
                        } : null,
                        balance: BalModified ? {
                            original: allValueArrOrig[2],
                            modified: allValueArrModi[2],
                            status: results[i].value.modCol.status.balance
                        } : null,
                    }
                    
                    if(DateModified){
                        typeModified.push("date");
                        returnData.stats.date.lineNum.push(lineNum);
                        if(DateStatus === "review"){
                            returnData.stats.total.review += 1
                            returnData.stats.date.review += 1
                            
                        } else if(DateStatus === "pending"){
                            returnData.stats.total.fix += 1
                            returnData.stats.date.fix += 1
                        }
                    }
                    
                    if(DebitModified){
                        typeModified.push("debit");
                        returnData.stats.debit.lineNum.push(lineNum);

                        if(DebitStatus === "modified"){
                            returnData.stats.total.review += 1
                            returnData.stats.debit.review += 1
                        } else if(DebitStatus === "pending"){
                            returnData.stats.total.fix += 1
                            returnData.stats.debit.fix += 1
                        }
                    }

                    if(CreditModified){
                        typeModified.push("credit");
                        returnData.stats.credit.lineNum.push(lineNum);

                        if(CreditStatus === "modified"){
                            returnData.stats.total.review += 1
                            returnData.stats.credit.review += 1
                        } else if(CreditStatus === "pending"){
                            returnData.stats.total.fix += 1
                            returnData.stats.credit.fix += 1
                        }
                    }

                    if(BalModified){
                        typeModified.push("balance");
                        returnData.stats.balance.lineNum.push(lineNum);

                        if(BalanceStatus === "modified"){
                            returnData.stats.total.review += 1
                            returnData.stats.balance.review += 1
                        } else if(BalanceStatus === "pending"){
                            returnData.stats.total.fix += 1
                            returnData.stats.balance.fix += 1
                        }
                    }

                    returnData.stats.total.lineNum.push({
                        lineNum: lineNum,
                        type: typeModified.join()
                    });
                }
            }
        }

        return returnData;
    }

    const handleTableHeight = async (height) =>{
        setTableHeight(height);   
    }

    const handleJobId = async (id) => {
        console.log("Assigning job id:", id);
        setJobId(id)
        const res = await fetch('https://localhost:7129/api/OCR/jobstatus/' + id, {
            method: 'GET',  
            headers: {
                'Accept': '*/*',
            }
        });

        if(!res.ok) throw new Error(await res.text())
        else {
            const resdata = await res.text();
            console.log("response:", resdata);
        }

    }

    const handleFilePath = (filepath) => {
        console.log("filepath2upload:",JSON.stringify(filepath));
        setFilePath(filepath)
    };

    const handleTableHeightChange = () => {
        setTableChangeHeight(true);
    };
    
    return (
        <div className="home-container">
            <Banner />
            <div className="content">
                <DragSizing 
                    className="left"
                    border="right">
                    <PdfViewer filepath={filepath} />
                </DragSizing>

                <div className="right" ref={refRContainer}>
                    <Uploads filepathHandler={handleFilePath} jobIdHandler={handleJobId} />  
                    <DragSizing 
                    className="table-dragable"
                    border="bottom"
                    onEnd={handleTableHeightChange}>
                        <Table 
                            selectedRow={selectedRow}
                            handleTableHeight={handleTableHeight} 
                            tableChangeHeight={tableChangeHeight} 
                            setTableChangeHeight={setTableChangeHeight}
                            ValidationResult={jobValidation} 
                            Results={jobResult}
                        />
                    </DragSizing>
                    
                    <ValidationPanel 
                        setSelectedRow={setSelectedRow}
                        ValidationResult={jobValidation} 
                        setValidationResult={setJobValidation}
                        tableHeight={tableHeight} 
                        rightContainerH={rightContainerH}
                    />
                </div>

            </div>
        </div>
    )
}

export default Home


{/* <div className="left">
    <PdfViewer />
</div> */}