import React from 'react';
import * as XLSX from 'xlsx';
import FileInput from './FileInput';

const XLSXReader = () => {

    const [data, setData] = React.useState([]);
    const [dashboard, setDashboard] = React.useState([]);
    const coiType_regexStr = "(Inst|Meta|PastSub|PC)"
    const coi_regexStr = `Coi${coiType_regexStr}`
    const vaildFile_regexStr = "[A-Za-z0-9 -_.,()\[\]]*"
    const filename_regex = new RegExp(`^(${coi_regexStr}${vaildFile_regexStr})`, 'i') // Regex for accepting files into the program
    const coi_regex = new RegExp(coiType_regexStr, 'i')
    const buildInst = (metadata) =>{
        let dataset = {}
        for (let i = 1; i < metadata.length; i++) {
            const paperid = metadata[i][0];
            const authors = metadata[i][1];
            const reviewers = metadata[i][2];
            let violation = undefined;
            if (metadata[i][3] === "No violation w.r.t. current affiliations.")
            {
                violation = metadata[i][4];
            }
            else{
                violation = metadata[i][3];
            }
            console.log(paperid, authors, reviewers)
        }
           
    }
    const buildPossibleViolation = (metadata) =>{
        if(metadata.length <= 1) return
        console.log("PossibleViolatioon", metadata)
        for (let i = 1; i < metadata.length; i++) {
            const paperid = metadata[i][3];
            const author = metadata[i][0];
            const reviewer = metadata[i][1];
            const reviewerurl = metadata[i][2];
            const violation = metadata[i][7];
            
            console.log(paperid, author, reviewer, reviewerurl, violation)
        }
    }
    const coiTypes_dict = {
        "inst": {
            key: crypto.randomUUID(),
            name: "Instituional COI Violation",
            description: "It contains (potential) COI violation due to institutional match.",
            coi_function: buildInst
        },
        "meta" : {
            key: crypto.randomUUID(),
            name: "Possible COI Violation", 
            description: "It contains possible COI violations (based on the conference-specified policy for COI) with the assigned reviewers",
            coi_function: buildPossibleViolation
        },
        "pc" : {
            key: crypto.randomUUID,
            name: "Possible COI Violation",
            description: "It contains possible COI violations (based on the conference-specified policy for COI) with the assigned reviewers",
            coi_function: buildPossibleViolation},
        "pastsub": {
            key: crypto.randomUUID,
            name: "Past Sub", 
            description: "COI violations due to published papers that appear in DBLP"},
            coi_function: () => {
                console.log('This is my function');
            },
    }
    let COI_DASHBOARD = {}

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
            var match = coi_regex.exec(filename)
            constructSubCOIJson(match[0], metadata)
        });
        console.log(COI_DASHBOARD)
    }
    const constructSubCOIJson = (type, metadata) =>{
        const coiType = coiTypes_dict[type.toLowerCase()]
        if (!COI_DASHBOARD.hasOwnProperty(coiType.key))
        {
            COI_DASHBOARD[coiType.key] = {
                name: coiType.name,
                description: coiType.description,
                coi_data: []
            }
            coiType.coi_function(metadata)
        }

    }


    return (
        <div>
        <h2>Upload XLSX Files</h2>
        <FileInput onChange={handleFileUpload} />
        {data.length > 0 && (
            <div>
            <h3>File Content</h3>
            {data.map((fileData, index) => (
                <div key={index}>
                <h4>{fileData.filename}</h4> {/* Display filename */}
                <pre>{JSON.stringify(fileData.data, null, 2)}</pre>
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default XLSXReader;
