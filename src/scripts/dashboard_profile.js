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

export function buildSubmissionProfileGraph(profilesData) {
    const optionsDataset = [{
        type: "past_sub",
        datasetName: "Past Submissions"
    }, {
        type: "meta_pc",
        datasetName: "COI Violations"
    }, {
        type: "inst",
        datasetName: "Institution Violations"
    }];

    const dataSubmission = buildProfileSubmissionDataset(profilesData, optionsDataset);

    // Define options with correct syntax
    const options = {
        title: "Author's Submission Chart",
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

export function buildReviewerProfileGraph(profilesData) {
    const optionsDataset = [{
            type: "past_sub",
            datasetName: "Past Submissions"
        }, {
            type: "meta_pc",
            datasetName: "COI Violations"
        }, {
            type: "inst",
            datasetName: "Institution Violations"
    }];

    const dataReviewer = buildProfileReviewerDataset(profilesData, optionsDataset)

    // Define options with correct syntax
    const options = {
        title: "Author's Reviewer Chart",
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