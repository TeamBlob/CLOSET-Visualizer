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
        submission_type: {},
        reviewer_type: {}
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
    
    // -- Handle Author's Reviewer data -- 
    // add Violator Email into author's Reviewer Set
    profile.reviewer.add(violator.email);

    // add Violator Email into author's Reviewer COI Category Set {inst: set(email1, email2)}
    if (!profile.reviewer_type.hasOwnProperty(type))
        profile.reviewer_type[type] = new Set();
    
    profile.reviewer_type[type].add(violator.email)

    // -- Handle Author's Submission data --
    // Add paperIds to the list only if they don't already exist
    const paperIds = coiPaper.pageId.toString().split(",").map(item => item.trim());

    paperIds.forEach((id) => {
        profile.paper.add(id);
    });

    // Add violation counter for violation category {inst: set(100, 200, 300), past_sub: set(100, 200, 300)}
    if (!profile.submission_type.hasOwnProperty(type))
        profile.submission_type[type] = new Set();
    
    paperIds.forEach((id) => {
        profile.submission_type[type].add(id);
    });
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
            profileData: profile
        };
        tempProfiles.push(profileData);
    });

    return {topProfiles: tempProfiles
        .sort((a, b) => b.submission_count - a.submission_count)
        .slice(0, 5)};
};
