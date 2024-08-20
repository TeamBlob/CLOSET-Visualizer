import { findProfileByName } from './common_script'

const buildTempProfile = (name, email) =>{
    return {
        key: crypto.randomUUID(),
        name: name,
        email: email,
        author: 0,
        reviewer: 0,
        violator: {
            possible: [],
            positive: []
        },
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
    // add coi violation to person profile
    profiles[person.email].violator[violation_category].push(violatorSchema);
    if (role === 'author')
        profiles[person.email].author += 1
    else
        profiles[person.email].reviewer += 1
}

const buildProfilePastSub = (data, profiles, category) => {
    data.map((coiPaper) => {
        let author = coiPaper.author[0];
        let reviewer = coiPaper.reviewer[0];
        //For authors of the paper
        addProfile(profiles, author, reviewer, "author", coiPaper, 'past_sub', category)
        //For reviewer of the paper
        addProfile(profiles, reviewer, author, "reviewer", coiPaper, 'past_sub', category)
    })
}
const buildProfileMetaPC = (data, profiles, category) => {
    data.map((coiPaper) => {
        let author = coiPaper.author[0];
        let reviewer = coiPaper.reviewer[0];

        //For authors of the paper
        addProfile(profiles, author, reviewer, "author", coiPaper, 'meta_pc', category)
        //For reviewer of the paper
        addProfile(profiles, reviewer, author, "reviewer", coiPaper, 'meta_pc', category)
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
        addProfile(profiles, violator1.profile, violator2.profile, violator1.type, coiPaper, 'inst', "positive")
        addProfile(profiles, violator2.profile, violator1.profile, violator2.type, coiPaper, 'inst', "positive")
    }
    
}

const handleProfileInstPossible = (coiPaper, profiles, category) => {
    const violations = coiPaper.violation.history
    const name1 = violations[0].name
    const name2 = violations[1].name
    const violator1 = findProfileByName(coiPaper.reviewer, name1) !== -1 ? findProfileByName(coiPaper.reviewer, name1, 'reviewer') : findProfileByName(coiPaper.author, name1, 'author');
    const violator2 = findProfileByName(coiPaper.reviewer, name2) !== -1 ? findProfileByName(coiPaper.reviewer, name2, 'reviewer') : findProfileByName(coiPaper.author, name2, 'author');
        
    addProfile(profiles, violator1.profile, violator2.profile, violator1.type, coiPaper, 'inst', "possible")
    addProfile(profiles, violator2.profile, violator1.profile, violator2.type, coiPaper, 'inst', "possible")
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
    Object.keys(data.positive).forEach((key) => {
        const coiData = data.positive[key]
        let type = coiData.type;

        coiFunction[type].build(coiData.coi_data, profiles, 'positive')
    });


    Object.keys(data.possible).forEach((key) => {
        const coiData = data.possible[key]
        let type = coiData.type;

        coiFunction[type].build(coiData.coi_data, profiles, 'possible')
    });


    
    return profiles;
    
}