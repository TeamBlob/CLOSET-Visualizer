const NAME_REGEX = /[^()]+/;
const EMAIL_REGEX = /([\w\.-]+@([\w-]+\.)+[\w-]+)/;
const DETAIL_REGEX = /[^()]+/


export const buildPastSub = (filename, metadata) => {
    const pastSubData = [
    { 
        category: 'positive',
        coi_data: [] 
    }, 
    { 
        category: 'possible', 
        coi_data: []
    }]

    if(metadata.length < 1) return pastSubData

    for (let i = 0; i < metadata.length; i++) 
    {
        let row = metadata[i]
        
        try
        {
            const paperid = row['PAPER ID'];
            const author = row['AUTHOR'];
            const reviewer = row['(META)REVIEWERS'];
            const recent_venue = row['MOST RECENT VENUE'];
            const submission_time = row['SUBMISSION TIME'];

            const authorName = author.match(NAME_REGEX)[0];
            const authorEmail = author.match(EMAIL_REGEX)[0];

            const reviewerName = reviewer.match(NAME_REGEX)[0];
            const reviewerEmail = reviewer.match(EMAIL_REGEX)[0];
            
            const violationList = [];

            const jsonData = {
                "key": crypto.randomUUID(),
                "recent_venue": recent_venue,
                "submission_time": submission_time
            };
            violationList.push(jsonData);
            
            const coiData_json = {
                key: crypto.randomUUID(),
                pageId: paperid,
                filename: filename,
                author: [{ key: crypto.randomUUID(), name: authorName, email: authorEmail}],
                reviewer: [{ key: crypto.randomUUID(), name: reviewerName, email: reviewerEmail}],
                violation: {
                    type: "past_sub",
                    history: violationList
                }
            }
            
            pastSubData[0].coi_data.push(coiData_json)
            
        }
        catch(error){
            continue;
        }
    }
    
    return pastSubData
}

export const buildInst = (filename, metadata) =>{
    const instData = [
    { 
        category: 'positive',
        coi_data: [] 
    }, 
    { 
        category: 'possible', 
        coi_data: []
    }]

    if(metadata.length < 1) return instData

    const detailRegex = new RegExp(`\\(${EMAIL_REGEX.source}, ${DETAIL_REGEX.source}\\)`);
    const nameDetailReg = new RegExp(`(${NAME_REGEX.source}${detailRegex.source})`, 'g');

    for (let i = 0; i < metadata.length; i++) {
        let row = metadata[i]
        try
        {
            const paperid = row['PAPER ID'];
            const authors = row['AUTHORS'];
            const reviewers = row['META(REVIEWERS)'];
            let isPossible = false;
            let violation = row['DETAILS OF INSTITUTIONAL COI'];
            
            if (violation === "No violation w.r.t. current affiliations.")
            {
                isPossible = true;
                violation = row['DETAILS OF POSSIBLE PAST INSTITUTIONAL COI'];
            }

            const author_list = handleInstSchema(authors.matchAll(nameDetailReg));
            const reviewer_list = handleInstSchema(reviewers.matchAll(nameDetailReg));

            const violationList = [];
            if (!isPossible){
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
                key: crypto.randomUUID(),
                pageId: paperid,
                filename: filename,
                author: author_list,
                reviewer: reviewer_list,
                violation: {
                    type: isPossible ? "possible_inst_violation" : "positive_inst_violation",
                    history: violationList
                }
            }

            isPossible ? instData[1].coi_data.push(coiData_json) : instData[0].coi_data.push(coiData_json);
            
        
        }
        catch(error){
            console.log(error)
            continue;
        }
        
    }
    return instData
}

const handleInstSchema = (listMatch) => {
    // Regular Expression
    const detailRegex = new RegExp(`\(${EMAIL_REGEX.source}, ${DETAIL_REGEX.source}\)`);

    const tempList = [] 
    for (const match of listMatch) {
        const matchedData = match[0].trim();

        const key = crypto.randomUUID();
        const name = matchedData.match(NAME_REGEX)[0].trim();
        const detail = matchedData.match(detailRegex)[0].replace(/[()]/g, '').split(',').map(detail => detail.trim());
        
        const email = detail[0];
        const institute = detail[1].replace(/[^\w\s]/g, '');
        const jsonData = {
            "key": key,
            "name": name,
            "email": email,
            "institute": institute
        };
        tempList.push(jsonData);
    }
    return tempList;
}

export const buildMetaPC = (filename, metadata) =>{
    const metaPCData = [
    { 
        category: 'positive',
        coi_data: [] 
    }, 
    { 
        category: 'possible', 
        coi_data: []
    }]
    if(metadata.length < 1) return metaPCData
    
    for (let i = 0; i < metadata.length; i++) 
    {
        let row = metadata[i];
        try{
            
            const paperid = row['PAPER IDS'];
            // author and reviewer schema -> name (email - address)
            const author = row['AUTHOR'];
            const reviewer = row['(META)REVIEWERS']; 
            
            const reviewerURL = row['DBLP OF (META)REVIEWERS'];
            const during_year3 = row['CO-AUTHORSHIP DURING LAST 3 YEARS'];
            const during_year10 = row['CO-AUTHORSHIP DURING LAST 10 YEARS'];
            const count_last10 = row['CO-AUTHORSHIP COUNT IN LAST 10 YEARS'];
            const history_violation = row['CO-AUTHORSHIP HISTORY'];
            const comment = row['COMMENTS']
            const authorName = author.match(NAME_REGEX)[0];
            const authorEmail = author.match(EMAIL_REGEX)[0];

            const reviewerName = reviewer.match(NAME_REGEX)[0];
            const reviewerEmail = reviewer.match(EMAIL_REGEX)[0];

            const isPossible = Boolean(comment) // if comment is empty, isPossible is false, true otherwise
            const coiData_json = {
                key: crypto.randomUUID(),
                pageId: paperid,
                filename: filename,
                author: [{ key: crypto.randomUUID(), name: authorName, email: authorEmail}],
                reviewer: [{ key: crypto.randomUUID(), name: reviewerName, email: reviewerEmail, url: reviewerURL }],
                violation: {
                    type: "co_authorship_violation",
                    during_year3: handle_meta_pc_schemas(during_year3),
                    during_year10: handle_meta_pc_schemas(during_year10),
                    count_last10: count_last10,
                    history: handle_meta_pc_schemas(history_violation),
                    comment: comment,
                }
            }
            isPossible ? metaPCData[1].coi_data.push(coiData_json) : metaPCData[0].coi_data.push(coiData_json);
        }
        catch(error){

            continue;
        }
    }
    return metaPCData
} 

const handle_meta_pc_schemas = (data) => {

    // Regex expression
    const violationRegex = /([a-zA-Z0-9\s]+:\s*(\[(\(\d{4},\s\d{1,2}\)(, )*)+\]))/gs;
    const flagRegex = /(\d{4},\d{1,2})/gs;
    const violationList = []
    let matches = data.match(violationRegex);
    if (!matches)
        return violationList
    
    for (const violation of matches) 
    {
        const parts = violation.trim().split(':');
        const name = parts[0];
        const flagged = parts[1];
        const allFlags = flagged.replace(/\s+/g, '').match(flagRegex);
        
        const jsonData = {
            key: crypto.randomUUID(),
            name : name,
            flags : allFlags.map(item => item.split(',').map(item => item.trim()))
        };
        violationList.push(jsonData)
    }
    return violationList
};

const buildDatasetPaperCount = (data) => {
    const chartDatas = []
    Object.keys(data).length > 0 && Object.keys(data).forEach((key) => {
        const dataSubDashboard = data[key];
        Object.keys(dataSubDashboard).forEach((key) => {
            const coiCategory = dataSubDashboard[key].coi_data;
            coiCategory.forEach((coi_data) => {
                const pageIds = coi_data.pageId.toString().split(",").map(item => item.trim());
        
                pageIds.forEach((pageId) => {
                    // Check if chartDatas already contains an entry for the given paperId
                    const existingData = chartDatas.find((item) => item.group === pageId);
        
                    if (existingData) {
                        // If the paperId exists, increment its value by 1
                        existingData.value += 1;
                    } else {
                        // If the paperId does not exist, create a new entry
                        const chartData = {
                            group: pageId,
                            value: 1,
                        };
                        chartDatas.push(chartData);
                    }
                });
            });
        });
    });

    const options = {
        "title": "Paper Violation",
        "donut": {
            "center": {
                "label": "Paper Violation Count"
            }
        },
        "height": "400px"
    }
    
    return { data: chartDatas, options: options };
}

const buildDatasetViolation = (data) => {
    const chartDatas = []
    
    Object.keys(data).length > 0 && Object.keys(data).forEach((key) => {
        const dataSubDashboard = data[key];
        Object.keys(dataSubDashboard).forEach((key) => {
            const categoryName = dataSubDashboard[key].name
            const coiDatas = dataSubDashboard[key].coi_data;
            const chartData = {
                group: "Main",
                key: categoryName,
                value: coiDatas.length,
            };
            chartDatas.push(chartData)
        });
    });


    const options = {
        title: 'COI Violation Category',
        data: {
            selectedGroups: ['Main'],
        },
        axes: {
            left: {
                mapsTo: 'value',
            },
            bottom: {
                scaleType: 'labels',
                mapsTo: 'key',
            },
        },
        height: '400px',
    };    
    return { data: chartDatas, options: options };
}

const buildDatasetPositivePossible = (data) => {
    const chartDatas = []
    
    Object.keys(data).length > 0 && Object.keys(data).forEach((key) => {
        const dataSubDashboard = data[key];
        
        let count = 0;
        Object.keys(dataSubDashboard).forEach((key) => {
            count += dataSubDashboard[key].coi_data.length;
        });
        const chartData = {
            group: "Main",
            key: key,
            value: count,
        };
        chartDatas.push(chartData) 
    });

    const options = {
        title: 'Positive vs Possible',
        data: {
            selectedGroups: ['All'],
        },
        axes: {
            left: {
                mapsTo: 'value',
            },
            bottom: {
                scaleType: 'labels',
                mapsTo: 'key',
            },
        },
        height: '400px',
        color: {
            scale: {
                Main: '#5aa469',
            },
        },
    };    
    return { data: chartDatas, options: options };
}

export const buildViolationGraph = (data) => {
    const paperCountSetting = buildDatasetPaperCount(data)
    const violationSetting = buildDatasetViolation(data)
    const positivePossibleSetting = buildDatasetPositivePossible(data)
    return {
        paperGraph: paperCountSetting,
        violationGraph: violationSetting, 
        positivePossibleGraph: positivePossibleSetting
    }
}

 