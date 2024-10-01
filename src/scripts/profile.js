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
        paper: new Set(),
        reviewer: new Set(),
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
    profile.reviewer.add(violator.email);

    // Add paperIds to the list only if they don't already exist
    const paperIds = coiPaper.pageId.toString().split(",").map(item => item.trim());

    paperIds.forEach((id) => {
        profile.paper.add(id);
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

export const buildTopProfile = (profilesData) => {
    const tempProfiles = [];
    Object.keys(profilesData).forEach((key) => {
        const profile = profilesData[key];

        const profileData = {
            name: profile.name,
            submission_count: profile.paper.size,
            reviewer_count: profile.reviewer.size,
            count: Object.values(profile.violation).reduce((acc, value) => acc + value, 0),
            profileData: profile
        };
        tempProfiles.push(profileData);
    });

    return {topProfiles: tempProfiles
        .sort((a, b) => b.submission_count - a.submission_count)
        .slice(0, 5)};
};
