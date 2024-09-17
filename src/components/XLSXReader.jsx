import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import UploadFileComponent from './UploadFile'
import { checkFields } from '../scripts/valid_fields'
import { buildPastSub, buildInst, buildMetaPC, buildViolationGraph } from '../scripts/violation_structure';
import { buildProfiles, buildTopProfile } from "../scripts/profile";
import { concatList } from "../scripts/common_script"
import UploadRadioComponent from './UploadRadio';

const XLSXReader = ({setDashboard, setProfiles, setCOIDashboardGraph, setNavigation}) => {

    const [selectedOption, setSelectedOption] = useState("published");
    const coiTypeRegex = "(Inst|Meta|PastSub|PC|MetaPastSub)"
    const coiFileNameRegexStr = `(All-Coi|Coi)${coiTypeRegex}`
    const vaildFileRegexStr = "[A-Za-z0-9 -_.,()\[\]]*"
    const filenameRegex = new RegExp(`^(${coiFileNameRegexStr}${vaildFileRegexStr})`, 'i') // Regex for accepting files into the program
    const COI_DASHBOARD = {}
    
    const coiTypesDict = {
        "inst": {
            key: crypto.randomUUID(),
            href: "InstituionalCOI",
            name: {
                "published": "Instituional COI Violation",
            },
            description: {
                "published": "It contains COI violation due to institutional match.",
            },
            violation: ['positive', 'possible'],
            coi_function: buildInst
        },
        "meta_pc" : {
            key: crypto.randomUUID(),
            href: "PossibleCOI",
            name: {
                "unpublished": "History of Collaboration (Unreported COI)",
                "published": "History of Collaboration"
            }, 
            description: {
                "unpublished": "Contains all unreported COIs",
                "published": "Contain all co-authorship history of author-assigned reviewer/meta-reviewer pairs."
            },
            violation: ['positive', 'possible'],
            coi_function: buildMetaPC
        },
        "past_sub": {
            key: crypto.randomUUID(),
            href: "PastSubCOI",
            name: {
                "unpublished": "Past Submission (Unreported COI)",
                "published": "Past Submission (Reported COI)"
            }, 
            description: {
                "unpublished": "Contains all unreported COIs due to past submissions made by the author-reviewer pairs as coauthors",
                "published": "Contains all reported COIs due to past submissions made by the author-reviewer pairs as coauthors"
            },
            violation: ['positive'],
            coi_function: buildPastSub
        }
    }
    
    const handleFileSelection = (files, isAll) => {
        // Convert FileList to an array
        const validFiles = Array.from(files).filter((file) =>
            isAll ? file.name.startsWith("All-") && file.name.endsWith(".xlsx") 
                  : !file.name.startsWith("All-") && file.name.endsWith(".xlsx")
        );
    
        if (validFiles.length > 0) {
            console.log("Valid files selected:", validFiles);
            return validFiles
        } else {
            alert("Please select a file with the correct naming convention and .xlsx extension.");
            return validFiles
        }
    }
    

    const handleFileUpload = (files) => {
        const filesArray = Array.from(files);

        const validFileArray = handleFileSelection(filesArray, selectedOption === "unpublished")

        Promise.all(
            validFileArray.map((file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                        resolve({filename: file.name, data: jsonData});
                    };
                    reader.readAsArrayBuffer(file);
                });
            })
        ).then((results) => {
            processData(results)
        });
    };

    const processData = (data) => {
        if (data.length === 0) return
        
        data.forEach(sub_coi => {
            const filename = sub_coi.filename;
            if (!filenameRegex.test(filename)) return;
            const metadata = sub_coi.data;
            const fields = metadata[0];
            if (fields) {
                let type = checkFields(Object.keys(fields))
                if (type !== -1)
                    constructSubCOIJson(type, filename, metadata)
            }
        });
        console.log(COI_DASHBOARD)
        const profile = buildProfiles(COI_DASHBOARD);
        setCOIDashboardGraph({...buildViolationGraph(COI_DASHBOARD), ...buildTopProfile(profile)});
        setProfiles(profile);
        setDashboard(COI_DASHBOARD);
        
        updateShowProperty('Possible Violation', COI_DASHBOARD?.possible ?? false);
        updateShowProperty('Positive Violation', COI_DASHBOARD?.positive ?? false);
        updateShowProperty('Profile', true)    
        updateShowProperty('Dashboard Overview', true)        
    }

    const updateShowProperty = (name, show) => {
        setNavigation(prevNavigation =>
            prevNavigation.map(item =>
            item.name === name ? { ...item, show } : item)
        );
    };
    
    const constructSubCOIJson = (type, filename, metadata) =>{
        // retrieve coiType json from coiTypesDict dictionary
        const coiType = coiTypesDict[type.toLowerCase()]

        const coi_data = coiType.coi_function(filename, metadata)
        const positive = coi_data[0];
        const possible = coi_data[1];
        
        coiType.violation.includes('positive') && populateCOIDashboard(coiType, type, 'positive', positive.coi_data);
        coiType.violation.includes('possible') && populateCOIDashboard(coiType, type, 'possible', possible.coi_data);
    }

    const populateCOIDashboard = (coiType, type, violationType, coiData) =>{
        if (!(violationType in COI_DASHBOARD)){
            COI_DASHBOARD[violationType] = {}
        }

        if (coiType.key in COI_DASHBOARD[violationType])
        {
            const orginal = COI_DASHBOARD[violationType][coiType.key].coi_data
            COI_DASHBOARD[violationType][coiType.key].coi_data = concatList(orginal, coiData)
        }
        else {
            const json = {
                key: coiType.key,
                name: coiType.name[selectedOption],
                type: type.toLowerCase(),
                description: coiType.description[selectedOption],
                href: coiType.href,
                coi_data: coiData
            }
            COI_DASHBOARD[violationType][coiType.key] = json
        }
    }


    return (
    <>
        <UploadFileComponent handleFileUpload={handleFileUpload} />
        <UploadRadioComponent selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
    </>
    )
};

export default XLSXReader;
