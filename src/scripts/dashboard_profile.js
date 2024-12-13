const buildProfileSubmissionDataset = (profilesData, optionsDataset) => {
    const submissionChartData = [];
    
    Object.keys(profilesData).forEach((key) => {
        const profile = profilesData[key];
        const totalSubmissionCount = profile.paper.size

        const chartTotalData = {
            group: "Total Submissions",
            key: `${profile.name}`,
            value: totalSubmissionCount,
        };
        submissionChartData.push(chartTotalData)

        optionsDataset.forEach((setting) => {
            const type = setting.type;
            const datasetName = setting.datasetName
            const submissionCount = profile.submission_type[type] !== undefined ? profile.submission_type[type].size : 0
            if (submissionCount){
                const chartData = {
                    group: datasetName,
                    key: `${profile.name}`,
                    value: submissionCount,
                };
                submissionChartData.push(chartData)
            }
        })
    });
    return submissionChartData
};

const buildProfileReviewerDataset = (profilesData, optionsDataset) => {
    const reviewerChartData = [];
    
    Object.keys(profilesData).forEach((key) => {
        const profile = profilesData[key];
        const totalReviewerCount = profile.reviewer.size

        const chartTotalData = {
            group: "Total Reviewers",
            key: `${profile.name}`,
            value: totalReviewerCount,
        };
        reviewerChartData.push(chartTotalData)

        optionsDataset.forEach((setting) => {
            const type = setting.type;
            const datasetName = setting.datasetName
            const reviewerCount = profile.reviewer_type[type] !== undefined ? profile.reviewer_type[type].size : 0
            if (reviewerCount){
                const chartData = {
                    group: datasetName,
                    key: `${profile.name}`,
                    value: reviewerCount,
                };
                reviewerChartData.push(chartData)
            }
        })
    });
    return reviewerChartData
};

export function buildSubmissionProfileGraph(profilesData, isAll) {
    const optionsDataset = [{
        type: "past_sub",
        datasetName: "Past Submissions"
    }, {
        type: "meta_pc",
        datasetName: isAll ? 'Unreported COI' : 'COI Violation'
    }, {
        type: "inst",
        datasetName: "Institution Violations"
    }];

    const dataSubmission = buildProfileSubmissionDataset(profilesData, optionsDataset);

    const order = [
        "Total Submissions",
        isAll ? 'Unreported COI' : 'COI Violation',
        "Past Submissions",
        "Institution Violations"
    ];
    
    dataSubmission.sort((a, b) => {
        return order.indexOf(a.group) - order.indexOf(b.group);
    });
    console.log(dataSubmission)

    // Define options with correct syntax
    const options = {
        title: (isAll ? "Unreported " : "") + "Submission profiles" ,
        data: {
            selectedGroups: ['Total Submissions'],
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
        color: {
            scale: {
                'Total Submissions': '#01084f',
                'Past Submissions': '#631e50',
                'COI Violations': '#a73c5a',
                'Unreported COI' : '#086ca2',
                'Institution Violations': '#ff7954',
            },
        },
        animations: false,
        height: '400px',
    };
    const data = [...dataSubmission];
    data.sort((a, b) => b.value - a.value);
    return {
        data: data,
        options: options
    };
}

export function buildReviewerProfileGraph(profilesData, isAll) {
    const optionsDataset = [{
            type: "past_sub",
            datasetName: "Past Submissions"
        }, {
            type: "meta_pc",
            datasetName: isAll ? 'Unreported COI' : 'COI Violation'
        }, {
            type: "inst",
            datasetName: "Institution Violations"
    }];

    const dataReviewer = buildProfileReviewerDataset(profilesData, optionsDataset)

    const order = [
        "Total Reviewer",
        isAll ? 'Unreported COI' : 'COI Violation',
        "Past Submissions",
        "Institution Violations"
    ];
    
    dataReviewer.sort((a, b) => {
        return order.indexOf(a.group) - order.indexOf(b.group);
    });
    console.log(dataReviewer)

    // Define options with correct syntax
    const options = {
        title: (isAll ? "Unreported " : "") + "Reviewer profiles",
        data: {
            selectedGroups: ['Total Reviewers'],
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
        color: {
            scale: {
                'Total Reviewers': '#034569',
                'Past Submissions': '#235b79',
                'COI Violations': '#086ca2',
                'Unreported COI' : '#086ca2',
                'Institution Violations': '#3c9dd0',
            },
        },
        animations: false,
        height: '400px',
    };
    
    dataReviewer.sort((a, b) => b.value - a.value);
    return {
        data: dataReviewer,
        options: options
    }
};