let userAccessor = require('../../models/accessors/usersAccessor');

module.exports.addNewRole = (newRoleName, fatherRoleName, callback) =>
{
    userAccessor.createRole({roleName: newRoleName, userEmail: [], children: []}, (err) =>
    {
        if (err) {
            callback(err);
        }
        else {
            if (fatherRoleName.localeCompare("") !== 0) {
                userAccessor.findRole({roleName: fatherRoleName}, (err, father) =>
                {
                    if (err) {
                        callback(err);
                    }
                    else if (father.length === 0) {
                        userAccessor.deleteOneRole({roleName: newRoleName}, (err) =>
                        {
                            if (err) {
                                callback(err)
                            }
                            else {
                                callback(new Error("ERROR: father name does not exists"));
                            }
                        });
                    }
                    else {
                        let fatherID = father[0]._id;
                        userAccessor.findRole({roleName: newRoleName}, (err, son) =>
                        {
                            if (err) {
                                callback(err)
                            }
                            else {
                                let sonID = son[0]._id;
                                userAccessor.updateRole({_id: fatherID}, {$push: {children: sonID}}, callback);
                            }
                        })
                    }
                })
            }
            else {
                callback(err);
            }
        }
    });
};

module.exports.getRoleToEmails = (callback)=>{
    userAccessor.findRole({},(err,roles)=>
    {
        if(err){
            callback(err);
        }
        callback(null,roles.reduce((acc,role)=>{
            acc[role.roleName] = role.userEmail;
            return acc;
        },{}))
    })
};

module.exports.addChildrenToRole = (roleObjectID,childrenObjectID, callback)=>{
    userAccessor.updateRole({_id: roleObjectID}, {$push: {children: childrenObjectID}}, callback);
};

module.exports.addUsersAndRole = (roleName, usersEmail, callback) =>
{
    userAccessor.createRole({roleName: roleName, userEmail: usersEmail, children: []}, (err, usersAndRole) =>
    {
        if (err) {
            callback(err);
        }
        else {
            callback(null,usersAndRole)
        }
    });
};

module.exports.deleteRole = (roleToDelete, callback) =>
{
    userAccessor.findRole({roleName: roleToDelete}, (err, role) =>
    {
        if (err) {
            callback(err);
        }
        else if (role.length === 0) {
            callback(new Error('ERROR: role not found'));
        }
        else {
            let toDeleteID = role[0]._id;
            let toDeleteChildren = role[0].children;
            userAccessor.findRole({children: toDeleteID}, (err, father) =>
            {
                if (err) {
                    callback(err);
                }
                else {
                    if (father.length !== 0) {
                        let fatherID = father[0]._id;
                        userAccessor.updateRole({_id: fatherID}, {$pull: {children: toDeleteID}}, (err) =>
                            {
                                if (err) {
                                    callback(err)
                                }
                                else {
                                    userAccessor.updateRole({_id: fatherID}, {$push: {children: {$each: toDeleteChildren}}}, (err) =>
                                        {
                                            if (err) {
                                                callback(err);
                                            }
                                            else {
                                                userAccessor.deleteOneRole({_id: toDeleteID}, callback)
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                    else {
                        userAccessor.deleteOneRole({_id: toDeleteID}, callback);
                    }
                }
            });
        }
    })
};

module.exports.changeRoleName = (oldRoleName, newRoleName, callback) =>
{
    if (newRoleName !== "") {
        userAccessor.findRole({roleName: oldRoleName}, (err, roleToChange) =>
        {
            if (err) {
                callback(err)
            }
            else {
                userAccessor.findRole({roleName: newRoleName}, (err, newRole) =>
                {
                    if (err) {
                        callback(err);
                    }
                    else if (newRole.length === 0) {
                        let toChangeID = roleToChange[0]._id;
                        userAccessor.updateRole({_id: toChangeID}, {roleName: newRoleName}, callback)
                    }
                    else {
                        callback(new Error("ERROR: name already exists"));
                    }
                })
            }
        })
    }
    else {
        callback(new Error("ERROR: name is empty"))
    }
};

module.exports.addNewUserToRole = (userEmail, roleName, callback) =>
{
    userAccessor.findRole({roleName: roleName}, (err, role) =>
    {
        if (err) {
            callback(err);
        }
        else {
            let emailsInRole = role[0].userEmail;
            if (emailsInRole.includes(userEmail)) {
                callback(new Error("ERROR: user already in that role"));
            }
            else {
                let toChangeID = role[0]._id;
                userAccessor.updateRole({_id: toChangeID}, {$push: {userEmail: userEmail}}, callback);
            }
        }
    })
};

module.exports.deleteUserFromRole = (userEmail, roleName, callback) =>
{
    userAccessor.findRole({roleName: roleName}, (err, role) =>
    {
        if (err) {
            callback(err);
        }
        else {
            let emailsInRole = role[0].userEmail;
            if (!emailsInRole.includes(userEmail)) {
                callback(new Error("ERROR: can't find user in emails"));
            }
            else {
                let toChangeID = role[0]._id;
                userAccessor.updateRole({_id: toChangeID}, {$pull: {userEmail: userEmail}}, callback);
            }
        }
    })
};

module.exports.changeUserEmailInRole = (roleName, oldUserEmail, newUserEmail, callback) =>
{
    userAccessor.findRole({userEmail: {"$in": [newUserEmail]}}, (err, role) =>
    {
        if (err) {
            callback(err);
        }
        if (role.length === 0) {
            userAccessor.findRole({roleName: roleName}, (err, role) =>
            {
                if (err) {
                    callback(err);
                }
                else {
                    let emailsInRole = role[0].userEmail;
                    if (!emailsInRole.includes(oldUserEmail)) {
                        callback(new Error("ERROR: can't find user in role"));
                    }
                    else {
                        let toChangeID = role[0]._id;
                        userAccessor.updateRole({_id: toChangeID}, {$pull: {userEmail: oldUserEmail}}, (err) =>
                            {
                                if (err) {
                                    callback(err);
                                }
                                else {
                                    userAccessor.updateRole({_id: toChangeID}, {$push: {userEmail: newUserEmail}}, callback)
                                }
                            }
                        )
                    }
                }
            })
        }
        else {
            callback(new Error("ERROR: email already exists"));
        }
    })
};

module.exports.getAllRoles = (callback) =>
{
    return userAccessor.findRole({}, callback).select('roleName');
};

module.exports.getAllRolesObjects = (callback) =>
{
    return userAccessor.findRole({}, callback);
};

module.exports.getUsersAndRolesTree = (callback) =>
{
    userAccessor.findInSankeyTree({}, (err, result) =>
    {
        if (err) {
            callback(err);
        }
        else if (result.length === 0) {
            userAccessor.createSankeyTree({sankey: JSON.stringify({content: {diagram: []}})}, (err, result) =>
            {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, result);
                }
            });
        }
        else {
            callback(null, result[0]);
        }
    });
};

module.exports.setUsersAndRolesTree = (sankey, roleToEmails, callback) =>
{
    let parsed_sankey = JSON.parse(sankey);
    userAccessor.updateSankeyTree({}, {sankey: sankey}, (err) =>
    {
        if (err) {
            callback(err);
        }
        else {
            userAccessor.deleteAllRoles((err)=>{
                if(err){
                    callback(err);
                }
                else{
                    let roles = parsed_sankey.content.diagram.filter((figure) =>
                    {
                        return figure.type === "sankey.shape.State";
                    });
                    let connections = parsed_sankey.content.diagram.filter((figure) =>
                    {
                        return figure.type === "sankey.shape.Connection";
                    });
                    let usersAndRoleDocuments = [];
                    roles.reduce((acc, role_figure) =>
                    {
                        return (err) =>
                        {
                            if (err) {
                                acc(err);
                            }
                            else {
                                let roleName = role_figure.labels[0].text;
                                this.addUsersAndRole(roleName, roleToEmails[roleName], (_err, usersAndRole) =>
                                {
                                    if(err){
                                        acc(err);
                                    }
                                    else{
                                        usersAndRoleDocuments.push(usersAndRole);
                                        acc(null)
                                    }
                                })
                            }
                        };
                    }, (err) =>
                    {
                        if (err) {
                            callback(err);
                        }
                        else {
                            let roleNames = usersAndRoleDocuments.map(usersAndRoleDocument=>{
                                return usersAndRoleDocument.roleName;
                            });
                            let roleIDs = roles.map(role=>role.id);

                            connections.reduce((acc, connection) =>
                            {
                                return (err) =>
                                {
                                    if (err) {
                                        acc(err);
                                    }
                                    else {
                                        let fromNodeIndex = roleIDs.indexOf(connection.source.node);
                                        let toNodeIndex = roleIDs.indexOf(connection.target.node);

                                        let fromNodeRoleName = roles[fromNodeIndex].labels[0].text;
                                        let toNodeRoleName = roles[toNodeIndex].labels[0].text;

                                        let fromNodeRoleIndex = roleNames.indexOf(fromNodeRoleName);
                                        let toNodeRoleIndex = roleNames.indexOf(toNodeRoleName);
                                        // TODO: RoleIndex check if -1
                                        let fromNodeID = usersAndRoleDocuments[fromNodeRoleIndex]._id;
                                        let toNodeID = usersAndRoleDocuments[toNodeRoleIndex]._id;

                                        this.addChildrenToRole(fromNodeID,toNodeID,(err)=>{
                                            if(err){
                                                acc(err);
                                            }
                                            else{
                                                acc(null);
                                            }
                                        })
                                    }
                                };
                            },(err)=>{
                                if(err){callback(err);}
                                else{
                                    // All done here
                                    callback(null);
                                }
                            })(null);
                        }
                    })(null);
                }
            });
        }
    })
};

module.exports.getAllUsersByRole = (roleName, callback) =>
{
    userAccessor.findRole({roleName: roleName}, (err, result) =>
    {
        if (err) {
            callback(err);
        }
        else {
            callback(null, result);
        }
    })
};

module.exports.getRoleByName = (name, callback) =>
{
    return userAccessor.findRole({roleName: name}, callback);
};

module.exports.getUsernameByRoleID = (roleID, callback) =>
{
    userAccessor.findRole({_id: roleID}, (err, res) =>
    {
        if (err) {
            callback(err);
        }
        else {
            callback(null, res[0].userEmail[0]);
        }
    })
};

module.exports.getRoleIdByUsername = function (username, callback)
{
    userAccessor.findRole({userEmail: username}, (err, user) =>
    {
        if (err) callback(err);
        else {
            if (user.length === 0) callback(null, null);
            else callback(null, user[0]._id);
        }
    });
};

module.exports.getRoleNameByRoleID = function (roleID, callback)
{
    userAccessor.findRole({_id: roleID}, (err, user) =>
    {
        if (err) callback(err);
        else {
            if (user.length === 0) callback(null, null);
            else callback(null, user[0].roleName);
        }
    });
};