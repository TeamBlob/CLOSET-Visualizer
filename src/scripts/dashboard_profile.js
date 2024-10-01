
const buildDatasetAll = (profilesData) => {
    const chartDatas = [];
    Object.keys(profilesData).forEach((key) => {
        const profile = profilesData[key];

        const chartData = {
            group: "All",
            key: `${profile.name}`,
            value: Object.values(profile.violation).reduce((acc, value) => acc + value, 0),
        };
        chartDatas.push(chartData);
    });
    
    return chartDatas;
    
};

const buildDatasetCOI = (profilesData, type, datasetName) => {
    const data = [];
    Object.keys(profilesData).forEach((key) => {
        const profile = profilesData[key];
        
        const userData = {
            group: datasetName,
            key: `${profile.name}`,
            value: profile.violation[type] !== undefined ? profile.violation[type] : 0,
        };
        data.push(userData);
    });
    return data;
    
};

export const buildProfileGraph = (profilesData) => {
    const dataAll = buildDatasetAll(profilesData);
    const dataPastSub = buildDatasetCOI(profilesData, "past_sub", "Past Submissions")
    const dataMetaPC = buildDatasetCOI(profilesData, "meta_pc", "COI Violations")
    const dataInst = buildDatasetCOI(profilesData, "inst", "Institution Violations")
    // Define options with correct syntax
    const options = {
        title: 'Profile Violation Chart',
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
    };
    const data = [...dataAll, ...dataPastSub, ...dataMetaPC, ...dataInst];
    data.sort((a, b) => b.value - a.value);
    return {
        data: data,
        options: options
    }
};