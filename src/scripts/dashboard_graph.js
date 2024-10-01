const buildPaperCountCount = (isAll, data) => {
    const chartDatas = []
    
    Object.keys(data).length > 0 && Object.keys(data).forEach((key) => {
        const dataSubDashboard = data[key];
        if (dataSubDashboard) {
            Object.keys(dataSubDashboard).forEach((key) => {
                const coiCategory = dataSubDashboard[key].coi_data;
                const coiTypes = dataSubDashboard[key].type
                coiCategory.forEach((coi_data) => {
                    const pageIds = coi_data.pageId.toString().split(",").map(item => item.trim());
            
                    pageIds.forEach((pageId) => {
                        // Check if chartDatas already contains an entry for the given paperId
                        const existingData = chartDatas.find((item) => item.group === pageId);
                        const paper_data = { coi_data: coi_data, type: coiTypes }
                        if (existingData) {
                            // If the paperId exists, increment its value by 1
                            existingData.value += 1;
                            existingData.paper.push(paper_data)
                        } else {
                            // If the paperId does not exist, create a new entry
                            const chartData = {
                                group: pageId,
                                value: 1,
                                paper: [paper_data]
                            };
                            chartDatas.push(chartData);
                        }
                    });
                });
            });
        }
    });

    const options = {
        title: isAll ? 'Unreported Paper Violation (Num of Unreported COI)' : 'COI Paper Violation (Num of COI Violation)',
        donut: {
            alignment: 'center'
        },
        height: "400px",
        legend: {
            alignment: "center",
            enabled: false
        }
        
    }
    
    return { data: chartDatas, options: options };
}

const buildCategoryDataset = (isAll, data) => {
    const chartDatas = []
    let submissionDict = {}
    let reviewerDict = {}
    Object.keys(data).length > 0 && Object.keys(data).forEach((key) => {
        const subCoiType = key;
        const dataSubDashboard = data[subCoiType];

        Object.keys(dataSubDashboard).forEach((coi_category) => {
            const categoryName = dataSubDashboard[coi_category].name
            const coiDatas = dataSubDashboard[coi_category].coi_data;
            // Setting up Submission Dictionary schema for ChartData
            if (!(categoryName in submissionDict))
            {
                submissionDict[categoryName] = { 
                    group: "Submission Count",
                    key: categoryName,
                    data: new Set()
                };
            }
            // Setting up Reviewer Dictionary schema for ChartData
            if (!(categoryName in reviewerDict))
            {
                reviewerDict[categoryName] = { 
                    group: "Reviewer Count",
                    key: categoryName,
                    data: new Set()
                }
            }
            
            coiDatas.forEach((coiPaper) => {

                // Populating Submission Set
                const paperIds = coiPaper.pageId.toString().split(",").map(item => item.trim());
                paperIds.forEach((paper) => submissionDict[categoryName].data.add(paper));

                // Populating Reviewer Set
                coiPaper.reviewer.forEach((person) => reviewerDict[categoryName].data.add(person.email))
            });
        });
    });

    // Setting Chart Dataset from Submission Data 
    Object.keys(submissionDict).forEach((key) => {
        const chartSubmissionData = {
            group: submissionDict[key].group,
            key: submissionDict[key].key,
            value: submissionDict[key].data.size,
        };
        chartDatas.push(chartSubmissionData)
    });
    // Setting Chart Dataset from Reviewer Data 
    Object.keys(reviewerDict).forEach((key) => {
        const chartReviewerData = {
            group: reviewerDict[key].group,
            key: reviewerDict[key].key,
            value: reviewerDict[key].data.size,
        };
        chartDatas.push(chartReviewerData)
    });
    
    // Setting Options
    const options = {
        title: isAll ? 'Unreported COI Category' : 'COI Violation Category',
        data: {
            selectedGroups: ['Submission Count', 'Reviewer Count'],
        },
        axes: {
            left: {
                mapsTo: 'value',
            },
            bottom: {
                scaleType: 'labels',
                mapsTo: 'key',
                stacked: true
            },
        },
        height: '400px'
    };    


    return { data: chartDatas, options: options };

}

const buildDatasetPositivePossible_ = (isAll, data) => {
    const chartDatas = []
    let submissionDict = {}
    let reviewerDict = {}
    
    Object.keys(data).length > 0 && Object.keys(data).forEach((key) => {
        const subCoiType = key;
        const dataSubDashboard = data[subCoiType];
        let tempSubmissionDict = {}
        let tempReviewerDict = {}

        // Setting up Submission Dictionary schema for ChartData
        if (!(subCoiType in tempSubmissionDict))
        {
            tempSubmissionDict[subCoiType] = { 
                group: "Submission Count",
                key: subCoiType,
                data: new Set()
            }
        }
        // Setting up Reviewer Dictionary schema for ChartData
        if (!(subCoiType in tempReviewerDict))
        {
            tempReviewerDict[subCoiType] = { 
                group: "Reviewer Count",
                key: subCoiType,
                data: new Set()
            }
        }
        
        Object.keys(dataSubDashboard).forEach((key) => {
            const coiDatas = dataSubDashboard[key].coi_data;

            coiDatas.forEach((coiPaper) => {
                const paperIds = coiPaper.pageId.toString().split(",").map(item => item.trim());
                paperIds.forEach((paper) => tempSubmissionDict[subCoiType].data.add(paper));

                // Populating Reviewer Set
                coiPaper.reviewer.forEach((person) => tempReviewerDict[subCoiType].data.add(person.email))
            });
        });

        const chartSubmissionData = {
            group: tempSubmissionDict[key].group,
            key: tempSubmissionDict[key].key,
            value: tempSubmissionDict[key].data.size,
        };
        chartDatas.push(chartSubmissionData)
        const chartReviewerData = {
            group: tempReviewerDict[key].group,
            key: tempReviewerDict[key].key,
            value: tempReviewerDict[key].data.size,
        };
        chartDatas.push(chartReviewerData)
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


export const buildViolationGraph = (isAll, data) => {
    const paperCountSetting = buildPaperCountCount(isAll, data)
    const positivePossibleSetting = buildDatasetPositivePossible_(isAll, data)
    const categorySetting = buildCategoryDataset(isAll, data)
    
    
    
    return {
        paperGraph: paperCountSetting,
        violationGraph: categorySetting, 
        positivePossibleGraph: positivePossibleSetting
    }
}