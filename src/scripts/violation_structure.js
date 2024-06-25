export const buildPastSub = (metadata) => {
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

    const normalRegex = /[\w\s]+/;
    const emailRegex = /[\w\.-]+@([\w-]+\.)+[\w-]{2,4}/;

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
            
            pastSubData[0].coi_data.push(coiData_json)
        }
        catch(error){
            continue;
        }
    }




    return pastSubData
}

export const buildInst = (metadata) =>{

    if(metadata.length < 1) return sub_coi_json

    const normalRegex = /[\w\s,\{\}\']+/;
    const emailRegex = /[\w\.-]+@([\w-]+\.)+[\w-]{2,4}/;
    const detailRegex = new RegExp(`\\(${emailRegex.source}, ${normalRegex.source}\\)`);
    const nameDetailReg = new RegExp(`(${normalRegex.source}${detailRegex.source})`, 'g');

    const sub_coi_json = []
    for (let i = 0; i < metadata.length; i++) {
        let row = metadata[i]
        try
        {
            const paperid = row['PAPER ID'];
            const authors = row['AUTHORS'];
            const reviewers = row['META(REVIEWERS)'];
            let isPastCOI = false;
            let violation = row['DETAILS OF INSTITUTIONAL COI'];
            
            if (violation === "No violation w.r.t. current affiliations.")
            {
                isPastCOI = true;
                violation = row['DETAILS OF POSSIBLE PAST INSTITUTIONAL COI'];
            }

            const author_list = handleInstSchema(authors.matchAll(nameDetailReg));
            const reviewer_list = handleInstSchema(reviewers.matchAll(nameDetailReg));

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
        catch(error){
            console.log(error);
            continue;
        }
        
    }
    return sub_coi_json
}

const handleInstSchema = (data) => {
    // Regular Expression
    const normalRegex = /[\w\s,\{\}\']+/;
    const emailRegex = /[\w\.-]+@([\w-]+\.)+[\w-]{2,4}/;
    const detailRegex = new RegExp(`\\(${emailRegex.source}, ${normalRegex.source}\\)`);

    const tempList = [] 
    for (const match of data) {
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
        tempList.push(jsonData);
    }
    return tempList;
}

export const buildMetaPC = (metadata) =>{
    const sub_coi_json = []
    if(metadata.length < 1) return sub_coi_json
    
    // Regex expression to extract the author/reviewer's name and email addresses
    const normalRegex = /[\w\s]+/;
    const emailRegex = /[\w\.-]+@([\w-]+\.)+[\w-]{2,4}/;
    
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
            const authorName = author.match(normalRegex)[0];
            const authorEmail = author.match(emailRegex)[0];

            const reviewerName = reviewer.match(normalRegex)[0];
            const reviewerEmail = reviewer.match(emailRegex)[0];
            
            const coiData_json = {
                pageId: paperid,
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
            sub_coi_json.push(coiData_json)

        }
        catch(error){
            continue;
        }
    }
    return sub_coi_json
} 

const handle_meta_pc_schemas = (data) => {
    // Regex expression
    const violationRegex = /([a-zA-Z0-9\s]+:\s*(\[(\(\d{4},\d{1,2}\))+\]))/gs;
    const flagRegex = /(\(\d{4},\d{1,2}\))/gs;
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

 