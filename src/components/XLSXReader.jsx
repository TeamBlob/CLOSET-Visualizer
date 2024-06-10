import React from 'react';
import * as XLSX from 'xlsx';
import FileInput from './FileInput';
import { check_fields } from '../scripts/valid_fields'

const XLSXReader = ({setdashboard}) => {

    const [data, setData] = React.useState([]);
    const coiType_regexStr = "(Inst|Meta|PastSub|PC|MetaPastSub)"
    const coi_regexStr = `(All-Coi|Coi)${coiType_regexStr}`
    const vaildFile_regexStr = "[A-Za-z0-9 -_.,()\[\]]*"
    const filename_regex = new RegExp(`^(${coi_regexStr}${vaildFile_regexStr})`, 'i') // Regex for accepting files into the program

    
    const buildInst = (metadata) =>{
        const sub_coi_json = []
        for (let i = 1; i < metadata.length; i++) {
            const paperid = metadata[i][0];
            const authors = metadata[i][1];
            const reviewers = metadata[i][2];
            let isPastCOI = false;
            let violation = undefined;
            violation = metadata[i][3];
            
            if (metadata[i][3] === "No violation w.r.t. current affiliations.")
            {
                isPastCOI = true;
                violation = metadata[i][4];
            }

            const normalRegex = /[\w\s,\{\}\']+/;
            const emailRegex = /[\w\.-]+@([\w-]+\.)+[\w-]{2,4}/;
            const detailRegex = new RegExp(`\\(${emailRegex.source}, ${normalRegex.source}\\)`);
            const regexExpression = new RegExp(`(${normalRegex.source}${detailRegex.source})`, 'g');

            const author_matches = authors.matchAll(regexExpression);
            const reviewer_matches = reviewers.matchAll(regexExpression);
            const author_list = [];
            const reviewer_list = [];
            for (const match of author_matches) {
                const matchedData = match[0].trim();
                const key = crypto.randomUUID();
                const name = matchedData.match(normalRegex)[0];
                const detail = matchedData.match(detailRegex)[0].replace(/[()]/g, '').split(',').map(detail => detail.trim());
                const email = detail[0];
                const institute = detail[1];
            
                const jsonData = {
                    "key": key,
                    "name": name,
                    "email": email,
                    "institute": institute
                };
                author_list.push(jsonData);
            }
            for (const match of reviewer_matches) {
                const matchedData = match[0].trim();
                const name = matchedData.match(normalRegex)[0];
                const detail = matchedData.match(detailRegex)[0].replace(/[()]/g, '').split(',').map(detail => detail.trim());
                const email = detail[0];
                const institute = detail[1];
            
                const jsonData = {
                    "key": crypto.randomUUID(),
                    "name": name,
                    "email": email,
                    "institute": institute
                };
                reviewer_list.push(jsonData);
            }

            const violationList = [];
            if (!isPastCOI){
                const instRegex = /\([\w\s]+,[\w\s]+\)/g;
                const matches = violation.match(instRegex);
                for (const violation of matches) {
                    const strippedViolation = violation.replace(/[()]/g, '');
                    const [name1, name2] = strippedViolation.split(',').map(item => item.trim());
                    
                    const jsonData = {
                        "key": crypto.randomUUID(),
                        "name1": name1,
                        "name2": name2
                    };
                    violationList.push(jsonData);
                }
            }
            else{
                const instRegex = /([\w\s]+-\{[\w\s',]+\})/g;
                const matches = violation.match(instRegex);
                for (const violation of matches) {
                    const [name, institutesString] = violation.split('-');
                    const institutes = institutesString.slice(1, -1).split(',').map(institute => institute.trim().slice(1, -1));
                    
                    const jsonData = {
                        "key": crypto.randomUUID(),
                        "name": name.trim(),
                        "institute": institutes
                    };
                    violationList.push(jsonData);
                }
            }
            const coiData_json = {
                pageId: paperid,
                author: author_list,
                reviewer: reviewer_list,
                violation: {
                    type: isPastCOI ? "cur_institutional_violation" : "past_institutional_violation",
                    history: violationList
                }
            }
            sub_coi_json.push(coiData_json)
            
        }
        return sub_coi_json
    }
    const buildPossibleViolation = (metadata) =>{
        const sub_coi_json = []
        if(metadata.length <= 1) return sub_coi_json
        const normalRegex = /[\w\s]+/;
        const emailRegex = /[\w\.-]+@([\w-]+\.)+[\w-]{2,4}/;

        const possibleViolationRegex = /([\w\s]+:\[\(\d{4}, \d{1,2}\)\])/g;
        
        for (let i = 1; i < metadata.length; i++) 
        {
            try{
                const paperid = metadata[i][3];
                const author = metadata[i][0];
                const reviewer = metadata[i][1];
                const reviewerurl = metadata[i][2];
                const violation = metadata[i][7];
                
                const authorName = author.match(normalRegex)[0];
                const authorEmail = author.match(emailRegex)[0];

                const reviewerName = reviewer.match(normalRegex)[0];
                const reviewerEmail = reviewer.match(emailRegex)[0];

                const matches = violation.match(possibleViolationRegex);

                const violationList = [];
                for (const violation of matches) {
                    const parts = violation.trim().split(':');
                    const name = parts[0];
                    const period = parts[1].replace(/[\[\]\(\)]/g, '').trim();
                    const [year, count] = period.split(',').map(item => item.trim());
                    
                    
                    const jsonData = {
                        key: crypto.randomUUID(),
                        name : name,
                        year : year,
                        count : count
                    };
                    violationList.push(jsonData);
                }
                const coiData_json = {
                    pageId: paperid,
                    author: [{ key: crypto.randomUUID(), name: authorName, email: authorEmail}],
                    reviewer: [{ key: crypto.randomUUID(), name: reviewerName, email: reviewerEmail, url: reviewerurl }],
                    violation: {
                        type: "co_authorship_violation",
                        history: violationList
                    }
                }
                sub_coi_json.push(coiData_json)

            }
            catch(error){
                continue;
            }
        }
        return sub_coi_json
    }
    const buildPastSub = (metadata) => {
        const sub_coi_json = []

        if(metadata.length <= 1) return sub_coi_json

        const normalRegex = /[\w\s]+/;
        const emailRegex = /[\w\.-]+@([\w-]+\.)+[\w-]{2,4}/;
        for (let i = 1; i < metadata.length; i++) 
        {
            try
            {
                const paperid = metadata[i][0];
                const author = metadata[i][1];
                const reviewer = metadata[i][2];
                const recent_venue = metadata[i][3];
                const submission_time = metadata[i][4];

                const authorName = author.match(normalRegex)[0];
                const authorEmail = author.match(emailRegex)[0];

                const reviewerName = reviewer.match(normalRegex)[0];
                const reviewerEmail = reviewer.match(emailRegex)[0];
                
                const violationList = [];

                const jsonData = {
                    "key": crypto.randomUUID(),
                    "recent_venue": recent_venue,
                    "submission_time": submission_time
                };
                violationList.push(jsonData);
                
                const coiData_json = {
                    pageId: paperid,
                    author: [{ key: crypto.randomUUID(), name: authorName, email: authorEmail}],
                    reviewer: [{ key: crypto.randomUUID(), name: reviewerName, email: reviewerEmail}],
                    violation: {
                        type: "past_sub",
                        history: violationList
                    }
                }


                sub_coi_json.push(coiData_json)

            }
            catch(error){
                console.log(error);
                continue;
            }
        }
        return sub_coi_json
    }
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
            coi_function: buildPossibleViolation
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
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                resolve({filename: file.name, data: jsonData});
            };
                reader.readAsBinaryString(file);
            });
        })
        ).then((results) => {
            setData(results.flat()); // Flatten the array of arrays
            processData(results)
        });
    };

    const processData = (data) => {
        if (data.length === 0) return
        
        data.forEach(sub_coi => {
            const filename = sub_coi.filename;
            if (!filename_regex.test(filename)) return;
            const metadata = sub_coi.data;
            const fields = metadata[0]
            let type = check_fields(fields)
            if (type != null)
                console.log(type)
                constructSubCOIJson(type, metadata)
        });
        setdashboard(COI_DASHBOARD)
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
