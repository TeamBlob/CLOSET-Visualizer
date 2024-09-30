import { legend } from "@carbon/charts";

const buildUnreportCount = (isAll, data) => {
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
            alignment: "center"
        }
        
    }
    
    return { data: chartDatas, options: options };
}

const buildCategoryDataset = (isAll, data) => {
    const chartDatas = []

    Object.keys(data).length > 0 && Object.keys(data).forEach((coi_types) => {
        const dataSubDashboard = data[coi_types];
        Object.keys(dataSubDashboard).forEach((coi_category) => {
            const categoryName = dataSubDashboard[coi_category].name
            const coiDatas = dataSubDashboard[coi_category].coi_data;

            // Submission Count
            coiDatas.forEach((coiPaper) => {
                const submissionCount = coiPaper.pageId.toString().split(",").map(item => item.trim()).length;
                const existingData = chartDatas.find((item) => 
                                                        item.key === categoryName && 
                                                        item.group === "Submission Count");
                if (existingData) {
                    // If the paperId exists, increment its value by 1
                    existingData.value += submissionCount;
                } else {
                    // If the paperId does not exist, create a new entry
                    const chartData = {
                        group: "Submission Count",
                        key: categoryName,
                        value: submissionCount,
                    };
                    chartDatas.push(chartData)
                }
            });

        });

        Object.keys(dataSubDashboard).forEach((coi_category) => {
            const categoryName = dataSubDashboard[coi_category].name
            const coiDatas = dataSubDashboard[coi_category].coi_data;

            // Submission Count
            coiDatas.forEach((coiPaper) => {
                const reviewerCount = coiPaper.reviewer.length
                const existingData = chartDatas.find((item) => 
                                                        item.key === categoryName && 
                                                        item.group === "Reviewer Count");
                if (existingData) {
                    // If the paperId exists, increment its value by 1
                    existingData.value += reviewerCount;
                } else {
                    // If the paperId does not exist, create a new entry
                    const chartData = {
                        group: "Reviewer Count",
                        key: categoryName,
                        value: reviewerCount,
                    };
                    chartDatas.push(chartData)
                }
            });

        });
    });
    
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

export const buildViolationGraph = (isAll, data) => {
    const paperCountSetting = buildUnreportCount(isAll, data)
    const positivePossibleSetting = buildDatasetPositivePossible(data)
    const categorySetting = buildCategoryDataset(isAll, data)
    
    
    return {
        paperGraph: paperCountSetting,
        violationGraph: categorySetting, 
        positivePossibleGraph: positivePossibleSetting
    }
}