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
    }
}

const addProfile = (profiles, person, violator, role, coiPaper, violation_category) => {
    // building the coi violator schema
    let violatorSchema = {
        violator: violator.email,
        role: role,
        coi_paper: coiPaper, 
    };
    
    // check if email of person exist in profile, if not create new profile json
    if (!profiles.hasOwnProperty(person.email))
        profiles[person.email] = buildTempProfile(person.name, person.email);
    // add coi violation to person profile
    profiles[person.email].violator[violation_category].push(violatorSchema);
}

const buildProfilePastSub = (data, profiles, category) => {
    data.map((coiPaper) => {
        let author = coiPaper.author[0];
        let reviewer = coiPaper.reviewer[0];
        //For authors of the paper
        addProfile(profiles, author, reviewer, "author", coiPaper, category)
        //For reviewer of the paper
        addProfile(profiles, reviewer, author, "reviewer", coiPaper, category)
    })
}
const buildProfileMetaPC = (data, profiles, category) => {
    data.map((coiPaper) => {
        let author = coiPaper.author[0];
        let reviewer = coiPaper.reviewer[0];

        //For authors of the paper
        addProfile(profiles, author, reviewer, "author", coiPaper, category)
        //For reviewer of the paper
        addProfile(profiles, reviewer, author, "reviewer", coiPaper, category)
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
        addProfile(profiles, violator1.profile, violator2.profile, violator1.type, coiPaper, "positive")
        addProfile(profiles, violator2.profile, violator1.profile, violator2.type, coiPaper, "positive")
    }
    
}

const handleProfileInstPossible = (coiPaper, profiles, category) => {
    const violations = coiPaper.violation.history
    const name1 = violations[0].name
    const name2 = violations[1].name
    const violator1 = findProfileByName(coiPaper.reviewer, name1) !== -1 ? findProfileByName(coiPaper.reviewer, name1, 'reviewer') : findProfileByName(coiPaper.author, name1, 'author');
    const violator2 = findProfileByName(coiPaper.reviewer, name2) !== -1 ? findProfileByName(coiPaper.reviewer, name2, 'reviewer') : findProfileByName(coiPaper.author, name2, 'author');
        
    addProfile(profiles, violator1.profile, violator2.profile, violator1.type, coiPaper, "possible")
    addProfile(profiles, violator2.profile, violator1.profile, violator2.type, coiPaper, "possible")
}

const coiFunction = {
    "inst": {
        build: buildProfileInst
    },
    "meta_pc" : {
        build: buildProfileMetaPC
    },
    "pastsub": {
        build: buildProfilePastSub
    }
}

export const buildProfiles = (data) => {
    const profiles = {};
    data.positive.map((x) => {
        let key = x.type;
        coiFunction[key].build(x.coi_data, profiles, 'positive')
    })
    data.possible.map((x) => {
        let key = x.type;
        coiFunction[key].build(x.coi_data, profiles, 'possible')
    })
    return profiles;
    
}