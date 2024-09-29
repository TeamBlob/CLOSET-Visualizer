import { findProfileByName } from './common_script'

const buildTempProfile = (name, email) =>{
    return {
        key: crypto.randomUUID(),
        name: name,
        email: email,
        violator: {
            possible: [],
            positive: []
        },
        paper: [],
        reviewer: [],
        violation: {}
    }
}

const addProfile = (profiles, person, violator, role, coiPaper, type, violation_category) => {
    // building the coi violator schema
    let violatorSchema = {
        violator: violator.email,
        role: role,
        type: type,
        coi_paper: coiPaper, 
    };
    
    // check if email of person exist in profile, if not create new profile json
    if (!profiles.hasOwnProperty(person.email))
        profiles[person.email] = buildTempProfile(person.name, person.email);

    const profile = profiles[person.email];

    // add coi violation to person profile
    profile.violator[violation_category].push(violatorSchema);

    if (!profile.reviewer.includes(violator.email)) {
        profile.reviewer.push(violator.email);
    }

    
    const paperIds = coiPaper.pageId.toString().split(",").map(item => item.trim());
    const currentPapers = profile.paper;

    // Add paperIds to the list only if they don't already exist
    paperIds.forEach((id) => {
        if (!currentPapers.includes(id)) {
            currentPapers.push(id);
        }
    });

    // Add violation counter for violation category {inst: 2, past_sub: 1}
    if (!profile.violation.hasOwnProperty(type))
        profile.violation[type] = 0
    profile.violation[type] += 1
    
}

const buildProfilePastSub = (data, profiles, category) => {
    data.map((coiPaper) => {
        let author = coiPaper.author[0];
        let reviewer = coiPaper.reviewer[0];
        //For authors of the paper
        addProfile(profiles, author, reviewer, "author", coiPaper, 'past_sub', category)
    })
}
const buildProfileMetaPC = (data, profiles, category) => {
    data.map((coiPaper) => {
        let author = coiPaper.author[0];
        let reviewer = coiPaper.reviewer[0];

        //For authors of the paper
        addProfile(profiles, author, reviewer, "author", coiPaper, 'meta_pc', category)
    })
}

const buildProfileInst = (data, profiles, category) => {
    data.map((coiPaper) => {
        if (category === "positive"){
            handleProfileInstPositive(coiPaper, profiles);
        }
        else if (category === "possible"){
            handleProfileInstPossible(coiPaper, profiles);
        }
    });
}

const handleProfileInstPositive = (coiPaper, profiles, category) => {
    const violations = coiPaper.violation.history
    for (let i = 0; i < violations.length; i++)
    {
        const name1 = violations[i].name1
        const name2 = violations[i].name2
        const violator1 = findProfileByName(coiPaper.reviewer, name1) !== -1 ? findProfileByName(coiPaper.reviewer, name1, 'reviewer') : findProfileByName(coiPaper.author, name1, 'author');
        const violator2 = findProfileByName(coiPaper.reviewer, name2) !== -1 ? findProfileByName(coiPaper.reviewer, name2, 'reviewer') : findProfileByName(coiPaper.author, name2, 'author');
        
        violator1.type == "author" && addProfile(profiles, violator1.profile, violator2.profile, violator1.type, coiPaper, 'inst', "positive")
        violator1.type == "reviewer" && addProfile(profiles, violator2.profile, violator1.profile, violator2.type, coiPaper, 'inst', "positive")
    }
    
}

const handleProfileInstPossible = (coiPaper, profiles, category) => {
    const violations = coiPaper.violation.history
    const name1 = violations[0].name
    const name2 = violations[1].name
    const violator1 = findProfileByName(coiPaper.reviewer, name1) !== -1 ? findProfileByName(coiPaper.reviewer, name1, 'reviewer') : findProfileByName(coiPaper.author, name1, 'author');
    const violator2 = findProfileByName(coiPaper.reviewer, name2) !== -1 ? findProfileByName(coiPaper.reviewer, name2, 'reviewer') : findProfileByName(coiPaper.author, name2, 'author');
        
    violator1.type == "author" && addProfile(profiles, violator1.profile, violator2.profile, violator1.type, coiPaper, 'inst', "possible")
    violator1.type == "reviewer" && addProfile(profiles, violator2.profile, violator1.profile, violator2.type, coiPaper, 'inst', "possible")
}

const coiFunction = {
    "inst": {
        build: buildProfileInst
    },
    "meta_pc" : {
        build: buildProfileMetaPC
    },
    "past_sub": {
        build: buildProfilePastSub
    }
}

export const buildProfiles = (data) => {
    const profiles = {};
    
    data.positive && Object.keys(data.positive).forEach((key) => {
        const coiData = data.positive[key]
        let type = coiData.type;
        coiFunction[type].build(coiData.coi_data, profiles, 'positive')
    });


    data.possible && Object.keys(data.possible).forEach((key) => {
        const coiData = data.possible[key]
        let type = coiData.type;

        coiFunction[type].build(coiData.coi_data, profiles, 'possible')
    });

    return profiles;
}

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
export const buildTopProfile = (profilesData) => {
    const tempProfiles = [];
    Object.keys(profilesData).forEach((key) => {
        const profile = profilesData[key];

        const profileData = {
            name: profile.name,
            submission_count: profile.paper.length,
            reviewer_count: profile.reviewer.length,
            count: Object.values(profile.violation).reduce((acc, value) => acc + value, 0),
            profileData: profile
        };
        tempProfiles.push(profileData);
    });

    return {topProfiles: tempProfiles
        .sort((a, b) => b.submission_count - a.submission_count)
        .slice(0, 5)};
    
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