/**
 * {
 *  key: "randomuuid...",
 *  name: "full_name",
 *  email: "email" optional,
 *  violator: {
 *      possible: [{violator_email: violator_email, type: 'author' or 'reviewer', coi_paper: paper_violation, }]
 *      positive: [...]
 *  } 
 * }
 * 
**/
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

const addProfile = (profiles, person, violator, type, coiPaper, violation_category) => {
    // building the coi violator schema
    let violatorSchema = {
        violator: violator.email,
        type: type,
        coi_paper: coiPaper, 
    };
    
    // check if email of person exist in profile, if not create new profile json
    if (!profiles.hasOwnProperty(person.email))
        profiles[person.email] = buildTempProfile(person.name, person.email);
    // add coi violation to person profile
    profiles[person.email].violator[violation_category].push(violatorSchema);
}

const buildProfilePastSub = (data, profiles) => {
    data.map((coiPaper) => {
        let author = coiPaper.author[0];
        let reviewer = coiPaper.reviewer[0];
        //For authors of the paper
        addProfile(profiles, author, reviewer, "author", coiPaper, "positive")
        //For reviewer of the paper
        addProfile(profiles, reviewer, author, "reviewer", coiPaper, "positive")
    })
}
const buildProfileMetaPC = (data, profiles) => {
    data.map((coiPaper) => {
        let author = coiPaper.author[0];
        let reviewer = coiPaper.reviewer[0];

        //For authors of the paper
        addProfile(profiles, author, reviewer, "author", coiPaper, "possible")
        //For reviewer of the paper
        addProfile(profiles, reviewer, author, "reviewer", coiPaper, "possible")
    })
    console.log(profiles)
}

const buildProfileInst = (data, profiles) => {
    data.map((coiPaper) => {
        if (coiPaper.violation.type === "past_institutional_violation"){
            handleProfileInstPast(coiPaper, profiles);
        }
        else if (coiPaper.violation.type === "cur_institutional_violation"){
            handleProfileInstCur(coiPaper, profiles);
        }
    });
    console.log(profiles)
}

const handleProfileInstPast = (coiPaper, profiles) => {
    const violations = coiPaper.violation.history
    for (let i = 0; i < violations.length; i++)
    {
        const name1 = violations[i].name1
        const name2 = violations[i].name2
        const violator1 = findProfileByName(coiPaper.reviewer, name1) !== -1 ? findProfileByName(coiPaper.reviewer, name1, 'reviewer') : findProfileByName(coiPaper.author, name1, 'author');
        const violator2 = findProfileByName(coiPaper.reviewer, name2) !== -1 ? findProfileByName(coiPaper.reviewer, name2, 'reviewer') : findProfileByName(coiPaper.author, name2, 'author');
        addProfile(profiles, violator1.profile, violator2.profile, violator1.type, coiPaper, "possible")
        addProfile(profiles, violator2.profile, violator1.profile, violator2.type, coiPaper, "possible")
    }
    
}

const handleProfileInstCur = (coiPaper, profiles) => {
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
    data.map((x) => {
        let key = x.type;
        coiFunction[key].build(x.coi_data, profiles)
    })

    
}