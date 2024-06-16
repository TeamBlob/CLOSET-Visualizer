import React from 'react';
import * as XLSX from 'xlsx';
import FileInput from './FileInput';
import { checkFields } from '../scripts/valid_fields'
import { buildPastSub, buildInst, buildMetaPC } from '../scripts/build_violation_structure';

const XLSXReader = ({setDashboard}) => {
    const coiTypeRegex = "(Inst|Meta|PastSub|PC|MetaPastSub)"
    const coiFileNameRegexStr = `(All-Coi|Coi)${coiTypeRegex}`
    const vaildFileRegexStr = "[A-Za-z0-9 -_.,()\[\]]*"
    const filenameRegex = new RegExp(`^(${coiFileNameRegexStr}${vaildFileRegexStr})`, 'i') // Regex for accepting files into the program

    
    const coiTypes_dict = {
        "inst": {
            key: crypto.randomUUID(),
            href: "InstituionalCOI",
            category: 1,
            name: "Instituional COI Violation",
            description: "It contains (potential) COI violation due to institutional match.",
            coi_function: buildInst
        },
        "meta_pc" : {
            key: crypto.randomUUID(),
            href: "PossibleCOI",
            category: 1,
            name: "Possible COI Violation", 
            description: "It contains possible COI violations (based on the conference-specified policy for COI) with the assigned reviewers",
            coi_function: buildMetaPC
        },
        "pastsub": {
            key: crypto.randomUUID,
            name: "Past Sub", 
            category: 2,
            href: "PastSubCOI",
            description: "COI violations due to published papers that appear in DBLP",
            coi_function: buildPastSub
        }
    }
    let COI_DASHBOARD = []

    const handleFileUpload = (files) => {
        const filesArray = Array.from(files); // Convert FileList to array
        Promise.all(
            filesArray.map((file) => {
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
            const fields = metadata[0]
            
            let type = checkFields(Object.keys(fields))
            if (type != null)
                constructSubCOIJson(type, metadata)
        });
        setDashboard(COI_DASHBOARD)
    }
    const constructSubCOIJson = (type, metadata) =>{
        const coiType = coiTypes_dict[type.toLowerCase()]
        if (!COI_DASHBOARD.hasOwnProperty(coiType.key))
        {
            COI_DASHBOARD.push({
                key: coiType.key,
                name: coiType.name,
                description: coiType.description,
                href: coiType.href,
                coi_data: coiType.coi_function(metadata)
            })
        }
    }


    return (
        <div>
        <h2>Upload XLSX Files</h2>
            <FileInput onChange={handleFileUpload} />
        </div>
    );
};

export default XLSXReader;
