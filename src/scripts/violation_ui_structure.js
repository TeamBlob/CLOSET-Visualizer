import { similar } from "./similar"
import { findProfileByName } from "./common_script"

const buildPastSub = (data) => {
    const authorName = data.author[0].name
    const reviewerName = data.reviewer[0].name
    const recent_venue = data.violation.history[0].recent_venue
    const submission = data.violation.history[0].submission_time
    
    const json = {
        type: 'past_sub',
        header: ['Author', 'Reviewer', 'Recent Venue', 'Submission'],
        dataset: [
            {
                authorName: authorName,
                reviewerName: reviewerName,
                recent_venue: recent_venue,
                submission: submission
            }
        ]


    }
    return json
}
const getNameByType = (obj1, obj2, type) => [obj1, obj2].find(obj => obj.type === type).profile || null;

const buildPositiveInst = (data) => {
    
    const violations = data.violation.history
    const json = {
        header: ['Author', 'Reviewer', 'Institution'],
        type: 'positive_inst',
        dataset: []
    }

    for (let i = 0; i < violations.length; i++)
    {
        const name1 = violations[i].name1
        const name2 = violations[i].name2
        const violator1 = findProfileByName(data.reviewer, name1) !== -1 ? findProfileByName(data.reviewer, name1, 'reviewer') : findProfileByName(data.author, name1, 'author');
        const violator2 = findProfileByName(data.reviewer, name2) !== -1 ? findProfileByName(data.reviewer, name2, 'reviewer') : findProfileByName(data.author, name2, 'author');

        const author = getNameByType(violator1, violator2, 'author');
        const reviewer = getNameByType(violator1, violator2, 'reviewer');
        const institution = violator1.profile.institute
        const reason = {
            authorName: author.name,
            reviewerName: reviewer.name,
            institution: institution
        }
        json.dataset.push(reason)
    }
    return json
}

const buildPossibleInst = (data) => {
    const violations = data.violation.history

    const name1 = violations[0].name
    const name2 = violations[1].name
    const violator1 = findProfileByName(data.reviewer, name1) !== -1 ? findProfileByName(data.reviewer, name1, 'reviewer') : findProfileByName(data.author, name1, 'author');
    const violator2 = findProfileByName(data.reviewer, name2) !== -1 ? findProfileByName(data.reviewer, name2, 'reviewer') : findProfileByName(data.author, name2, 'author');
    
    const author = getNameByType(violator1, violator2, 'author');
    const reviewer = getNameByType(violator1, violator2, 'reviewer');
    const similarity = similar(violations[0].institute, violations[1].institute)

    const json = {
        header: ['Author', 'Institutions', 'Reviewer', 'Institutions', 'Similarity'],
        type: 'possible_inst',
        dataset: [
            {
                authorName: author.name,
                authorInst: (violations[0].name === author.name) ? violations[0].institute : violations[1].institute,
                reviewerName: reviewer.name,
                reviewerInst: (violations[0].name === reviewer.name) ? violations[0].institute : violations[1].institute,
                similarity: similarity
            }
        ]
    }
    return json
}

const buildMetaPC = (data) => {
    const violations = data.violation
    const author = data.author[0];
    const reviewer = data.reviewer[0];
    const history = violations.history
    const comment = violations.comment

    const json = {
        header: ['Author', 'Reviewer', 'History', 'Comments'],
        type: 'meta_pc',
        dataset: [
            {
                authorName: author.name,
                reviewerName: reviewer.name,
                history: history,
                comment: comment
            }
        ]
    }
    return json
}

const buildInst = (data) => {
    data.violation.type
    if (data.violation.type === "positive_inst_violation"){
        return buildPositiveInst(data);
    }
    else if (data.violation.type === "possible_inst_violation"){
        return buildPossibleInst(data);
    }
}

const coiFunction = {
    "inst": {
        build: buildInst
    },
    "meta_pc" : {
        build: buildMetaPC
    },
    "past_sub": {
        build: buildPastSub
    }
}

export const constructUIJson = (data, type) => {
    return coiFunction[type].build(data);
}