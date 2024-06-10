export const buildGraph = (data) => {
    const graph = {
        nodes: [],
        edges: []
    }
    get_all_nodes(graph, data)
    build_default_edges(graph, data)
    console.log(data)
    if (data.violation.type === "past_institutional_violation"){
        build_past_institutional_violation_graph(graph, data);
    }
    else if (data.violation.type === "cur_institutional_violation"){
        build_cur_institutional_violation_graph(graph, data);
    }
    else if(data.violation.type === "co_authorship_violation"){
        build_possible_violation_graph(graph, data);
    }
    else if(data.violation.type === "past_sub"){
        build_past_sub_graph(graph, data);
    }
    
    return graph
}

const get_all_nodes = (graph, data) =>{
    const pageJson = { 
        id: data.pageId, 
        label: data.pageId.toString(), 
        title: `Connected to ${data.author.length} authors and ${data.reviewer.length} reviewers`, 
        group: "page"
    }
    graph.nodes.push(pageJson)

    // read authors 
    const author_list = data.author;

    for( let i = 0; i < author_list.length; i++)
    {
        const json = {
            id: author_list[i].key, label: author_list[i].name, group: "author"
        }
        graph.nodes.push(json)
    }
    
    const reviewer_list = data.reviewer;
    // read reviewers
    for( let i = 0; i < reviewer_list.length; i++)
    {
        const json = {
            id: reviewer_list[i].key, label: reviewer_list[i].name, group: "reviewer"
        }
        graph.nodes.push(json)
    }
}

const build_default_edges = (graph, data) => {
    const page_id = data.pageId;

    // read authors 
    const author_list = data.author;
    for( let i = 0; i < author_list.length; i++)
    {
        const json = {
            from: page_id, to: author_list[i].key
        }
        graph.edges.push(json)
    }

    // read reviewers
    const reviewer_list = data.reviewer;
    for( let i = 0; i < reviewer_list.length; i++)
    {
        const json = {
            from: page_id, to: reviewer_list[i].key
        }
        graph.edges.push(json)
    }
}

const findKeyByName = (jsonData, name) => {
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].name.trim() === name.trim()) {
            return jsonData[i].key;
        }
    }
    return -1; // Return -1 if name is not found
  };

const build_past_institutional_violation_graph = (graph, data) => {
    const violations = data.violation.history
    for (let i = 0; i < violations.length; i++)
    {
        const name1 = violations[i].name1
        const name2 = violations[i].name2
        const key1 = findKeyByName(data.reviewer, name1) !== -1 ? findKeyByName(data.reviewer, name1) : findKeyByName(data.author, name1);
        const key2 = findKeyByName(data.reviewer, name2) !== -1 ? findKeyByName(data.reviewer, name2) : findKeyByName(data.author, name2);

        const json = {
            from: key1, to: key2
        }
        graph.edges.push(json)
    }
}

const build_cur_institutional_violation_graph = (graph, data) => {

    const violations = data.violation.history
    console.log(violations)
    const name1 = violations[0].name
    const name2 = violations[1].name
    const key1 = findKeyByName(data.reviewer, name1) !== -1 ? findKeyByName(data.reviewer, name1) : findKeyByName(data.author, name1);
    const key2 = findKeyByName(data.reviewer, name2) !== -1 ? findKeyByName(data.reviewer, name2) : findKeyByName(data.author, name2);
    
    const json = {
        from: key1, to: key2
    }
    graph.edges.push(json)
}

const build_possible_violation_graph = (graph, data) => {
    const authorKey = data.author[0].key
    const reviewerKey = data.reviewer[0].key

    const json = {
        from: reviewerKey, to: authorKey
    }
    graph.edges.push(json)
    console.log(graph)
}

const build_past_sub_graph = (graph, data) => {
    const authorKey = data.author[0].key
    const reviewerKey = data.reviewer[0].key

    const json = {
        from: reviewerKey, to: authorKey
    }
    graph.edges.push(json)
    console.log(graph)
}