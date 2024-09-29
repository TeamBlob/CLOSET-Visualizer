const buildUnreportCount = (data) => {
    const chartDatas = []
    
    const dataSubDashboard = data["possible"];
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

    const options = {
        "title": "Unreported Paper Violation",
        "donut": {
            "center": {
                "label": "Num of Unreported Count"
            }
        },
        "height": "400px"
    }
    
    return { data: chartDatas, options: options };
}

const buildDatasetViolation = (data) => {
    const chartDatas = []
    
    Object.keys(data).length > 0 && Object.keys(data).forEach((coi_types) => {
        const dataSubDashboard = data[coi_types];
        Object.keys(dataSubDashboard).forEach((coi_category) => {
            const categoryName = dataSubDashboard[coi_category].name
            const coiDatas = dataSubDashboard[coi_category].coi_data;

            const existingData = chartDatas.find((item) => item.key === categoryName);
            const existingData_category = chartDatas.find((item) => item.group === coi_types && item.key === categoryName);

            if (existingData) {
                // If the paperId exists, increment its value by 1
                existingData.value += coiDatas.length;
            } else {
                // If the paperId does not exist, create a new entry
                const chartData = {
                    group: "Main",
                    key: categoryName,
                    value: coiDatas.length,
                };
                chartDatas.push(chartData)
            }
            if (existingData_category) {
                // If the paperId exists, increment its value by 1
                existingData_category.value += coiDatas.length;
            } else {
                // If the paperId does not exist, create a new entry
                const chartData = {
                    group: coi_types,
                    key: categoryName,
                    value: coiDatas.length,
                };
                chartDatas.push(chartData)
            }


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
    const paperCountSetting = buildUnreportCount(data)
    const violationSetting = buildDatasetViolation(data)
    const positivePossibleSetting = buildDatasetPositivePossible(data)
    return {
        paperGraph: paperCountSetting,
        violationGraph: violationSetting, 
        positivePossibleGraph: positivePossibleSetting
    }
}