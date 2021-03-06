let usersAndRoles = require("../schemas/usersSchemas/UsersAndRolesSchema.js");
let usersAndRolesTreeSankey = require('../schemas/usersSchemas/UsersAndRolesTreeSankeySchema.js');
let userNames = require('../schemas/usersSchemas/UserNamesSchema');
let AdminsSchema = require('../schemas/usersSchemas/AdminsSchema');
let signaturesSchema = require('../schemas/usersSchemas/UsersSignaturesSchema');

module.exports.findRolesByArray = (rolesIDs, callback) => {
    usersAndRoles.find({_id: {$in :rolesIDs}}, callback);
};

module.exports.createRole = (newRole, callback) => {
    return usersAndRoles.create(newRole, callback);
};

module.exports.findRole = (roleToFind, callback) => {
    return usersAndRoles.find(roleToFind, callback);
};

module.exports.findRoleIDByRoleName = (roleName, callback) => {
    return usersAndRoles.find({roleName : roleName}, callback);
};

module.exports.deleteAllRoles = (callback) => {
    return usersAndRoles.deleteMany({}, callback);
};


module.exports.deleteOneRole = (roleToDelete, callback) => {
    return usersAndRoles.deleteOne(roleToDelete, callback);
};

module.exports.updateRole = (roleToUpdate, update, callback) => {
    return usersAndRoles.updateOne(roleToUpdate, update, callback);
};

module.exports.findInSankeyTree = (toFind, callback) => {
    return usersAndRolesTreeSankey.find(toFind, callback);
};

module.exports.createSankeyTree = (sankeyTree, callback) => {
    return usersAndRolesTreeSankey.create(sankeyTree, callback);
};

module.exports.updateSankeyTree = (whatToUpdate, theUpdate, callback) => {
    return usersAndRolesTreeSankey.updateOne(whatToUpdate, theUpdate, callback);
};

module.exports.findUser = (userToFind, callback) => {
    return usersAndRoles.find(userToFind, callback);
};

module.exports.findUsernames = (callback) => {
    return userNames.find({}, callback);
};

module.exports.findUsername = (user, callback) => {
    return userNames.find(user, callback);
};

module.exports.createUser = (user, callback) => {
    return userNames.create(user, callback);
};

module.exports.deleteAllUserNames = (callback) => {
    return userNames.deleteMany({}, callback);
};

module.exports.findAdmins = (criteria, callback) => {
    return AdminsSchema.find(criteria, callback);
};

module.exports.addAdmin = (admin, callback) => {
    return AdminsSchema.create(admin, callback);
};

