class processStructureSankey
{
    constructor(sankey)
    {
        this.sankey = sankey;
    }

    getSankeyStages()
    {
        return this.sankey.content.diagram.filter((figure) =>
        {
            return figure.type !== "sankey.shape.Connection";
        });
    }

    getStages(roleNameToIdFunc)
    {
        let sankeyStages = this.getSankeyStages();
        return sankeyStages.map((stage, index) =>
        {
            let roleName = stage.labels[0].text;
            let stageToReturn = {
                roleID: roleNameToIdFunc(roleName),
                stageNum: index,
                nextStages: [],
                stagesToWaitFor: [],
                onlineForms: [],
                attachedFilesNames: []
            };
            this.getConnections().forEach(connection =>
            {
                // connection.source.node , connection.target.node
                // figure.id
                if (connection.source.node === stage.id) {
                    let indexToPush = sankeyStages.indexOf(sankeyStages.find(_stage =>
                    {
                        return _stage.id === connection.target.node;
                    }));
                    if (indexToPush > -1) {
                        stageToReturn.nextStages.push(indexToPush);
                    }
                }
                if (connection.target.node === stage.id) {
                    let indexToPush = sankeyStages.indexOf(sankeyStages.find(_stage =>
                    {
                        return _stage.id === connection.source.node;
                    }));
                    if (indexToPush > -1) {
                        stageToReturn.stagesToWaitFor.push(indexToPush);
                    }
                }
            });
            return stageToReturn;
        });
    }

    getConnections()
    {
        return this.sankey.content.diagram.filter((figure) =>
        {
            return figure.type === "sankey.shape.Connection";
        });
    }

    getInitials()
    {
        return this.getSankeyStages().filter((figure) =>
        {
            return figure.bgColor === '#5957FF';

        }).map((figure) =>
        {
            let index;
            this.getSankeyStages().forEach((stage, _index) =>
            {
                if (stage.id === figure.id) {
                    index = _index;
                }
            });
            return index;
        });
    }

    hasMoreThanOneFlow(){
        let connections = this.getConnections();
        let flows = 0;
        this.getSankeyStages().forEach((role)=>{
            let result = true;
            connections.forEach((connection)=>{
                if(connection.target.node === role.id){
                    result = false;
                }
            });
            if(result){
                flows++;
            }
        });
        return flows > 1;
    }

    hasMultipleConnections(){
        let result = false;
        this.getConnections().forEach(connection=>{
            this.getConnections().forEach(_connection=>{
                if(_connection.id !== connection.id){
                    if(_connection.source.node === connection.source.node){
                        if(_connection.target.node === connection.target.node){
                            result = true;
                        }
                    }
                }
            })
        });
        return result;
    }

    hasCycles(){
        let connections = this.getConnections();
        let flows = [];
        this.getSankeyStages().forEach((role)=>{
            let result = true;
            connections.forEach((connection)=>{
                if(connection.target.node === role.id){
                    result = false;
                }
            });
            if(result){
                flows.push(role.id);
            }
        });

        var isCyclic = function (stack,node_id){
            stack.push(node_id);
            let result = !connections.every((connection)=>{
                if(connection.source.node ===  node_id){
                    if(stack.includes(connection.target.node)){
                        return false;
                    }
                    else{
                        return !isCyclic(stack,connection.target.node);
                    }
                }
                return true;
            });
            stack.pop();
            return result;
        };

        return !this.getSankeyStages().every((role)=>{
            if(flows.includes(role.id)){
                //Start scanning the tree from this root
                return !isCyclic([], role.id);

            }
            return true;
        });
    }

    firstStageIsNotInitial(){
        let connections = this.getConnections();
        let flows = [];
        this.getSankeyStages().forEach((role)=>{
            let result = true;
            connections.forEach((connection)=>{
                if(connection.target.node === role.id){
                    result = false;
                }
            });
            if(result){
                flows.push(role.id)
            }
        });
        return flows.every((flow)=>{
            let initials = this.getSankeyStages().filter((figure) =>
            {
                return figure.bgColor === '#5957FF';

            }).map(stage=>{
                return stage.id;
            });
            return !initials.includes(flow);
        })
    }

    hasNoStages()
    {
        return this.getSankeyStages().length === 0;

    }
}

module.exports = processStructureSankey;