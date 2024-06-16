/**
 * - Dashboard JSON Format
 * [
 *  {
 *      key: randomuuid,
 *      name: "Name of COI Violation", i.e Possible Violation, Instituional COI Violation, Past Sub Violation
 *      category: "1" or "2", - Stated in Documentation 
 *      description: "Description of violation", - Stated in Documentation
 *      href: "Header Link of the COI violation",
 *      paper_violation : [paper_violation, paper_violation, paper_violation ...],
 *  }
 * ]
 * Documentation: 'CLOSET User Information.pdf'
 * 
 * Paper Violation consist of 3 format Past_Sub, Inst, and Meta_PC Schema
 * - Past_Sub JSON Schema
 * {
 *  paperId: "Paper ID",
 *  author: [ {key: randomuuid, name: "Author Name", email: "Author Email"} ],
 *  reviewer: [ {key: randomuuid, name: "Reviewer Name", email: "Reviewer Email"} ],
 *  violation:  { 
 *                  type: "past_sub"
 *                  history: [{ 
 *                              key: randomuuid, 
 *                              recent_venue: "recent venue", 
 *                              submission_time: "submission time", 
 *                           }]
 *              }
 * }
 * - Inst JSON Schema
 * {
 *  paperId: "Paper ID",
 *  author: [ {key: "randomuuid...", name: "Author Name", email: "Author Email", institute: "institution"}, ... ],
 *  reviewer: [ {key: "randomuuid...", name: "Reviewer Name", email: "Reviewer Email", institute: "institution"}, ... ],
 *  violation:  { 
 *                  type: "cur_institutional_violation" or "past_institutional_violation"
 *                  history: [{ 
 *                              key: randomuuid, 
 *                              name1: "violator 1", 
 *                              name2: "violator 2", 
 *                           }]
 *                          or
 *                           [{ 
 *                              key: randomuuid, 
 *                              name: "name of violator", 
 *                              institute: "list of institution", 
 *                           },...]
 *              }
 * }
 * 
 * - MetaPC JSON Schema
 * {
 *  pageId: "Paper ID",
 *  author: [ {key: randomuuid, name: "Author Name", email: "Author Email"} ],
 *  reviewer: [ {key: randomuuid, name: "Reviewer Name", email: "Reviewer Email"} ]
 *  violation: {
 *                  type: "co_authorship_violation",
 *                  during_year3: [ {name: "name of violator", flags: [year, count], ...} ],
 *                  during_year10: [ {name: "name of violator", flags: [year, count], ...} ],
 *                  count_last10: "Value of CO-AUTHORSHIP COUNT IN LAST 10 YEARS fields",
 *                  history: [ {name: "name of violator", flags: [year, count], ...} ],
 *                  comment: "Value of COMMENTS fields",
 *             }
 * }
 * 
 * - Reviewer and Authors JSON Schema
 * {
 *  "key": "randomuuid...",
 *  "name": "full_name",
 *  "type": "author" or "reviewer"
 *  "email": "email" optional,
 *  "paper: [paper_violation, paper_violation]",
 *  "violator": [ { 
 *                  violation_category: "Possible Violation" or "Positive Violation"
 *                  profile: profile_json, 
 *                }
 *                  reason: violation_category: "Possible Violation" or "Positive Violation"
 *                  profile: profile_json, 
 *                }
 * }
 * 
 * - Graph and Nodes JSON Schema - Following schema provided by React Graph VIS: https://www.npmjs.com/package/react-graph-vis
 * 
 * "graph": {
 *  nodes: [
 *    { id: PaperID, label: "PaperID", title: "PaperID" },
 *    { id: underscore_full_name, label: "Full Name", group: "author" or "reviewer" },
 *    ...
 *  ],
 *  edges: [
 *    { from: PaperID, to: underscore_full_name_1 },
 *    { from: PaperID, to: underscore_full_name_2 },
 *    { from: underscore_full_name_1, to: underscore_full_name_2 },
 *  ]
 *}
 * 
 * **/