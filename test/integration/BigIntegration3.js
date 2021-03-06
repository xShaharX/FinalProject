let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let UsersPermissionsController = require('../../controllers/usersControllers/UsersPermissionsController');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let waitingProcessStructuresController = require('../../controllers/processesControllers/waitingProcessStructuresController');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let processReportController = require('../../controllers/processesControllers/processReportController');
let notificationController = require('../../controllers/notificationsControllers/notificationController');
let filledOnlineFormController = require('../../controllers/onlineFormsControllers/filledOnlineFormController');
let UserPermissions = require('../../domainObjects/UserPermissions');
let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let fs = require("fs");

let globalBefore = async function ()
{
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.connection.db.dropDatabase();
};

let globalAfter = function ()
{
    mongoose.connection.close();
};


describe('1. addUsersAndRole', function ()
{

    before(globalBefore);
    after(globalAfter);
    let tree9_string = fs.readFileSync("./test/inputs/trees/tree9/tree9.json");
    let processStructure9_string = fs.readFileSync("./test/inputs/processStructures/processStructure9/processStructure9.json");

    it('1.1 Creating users and roles tree', function (done)
    {
        usersAndRolesController.getUsersAndRolesTree(() =>
        {
            usersAndRolesController.setUsersAndRolesTree("creator@email.com", tree9_string,
                {
                    "יו\"ר": ["yor@outlook.com"],
                    "סיו\"ר": ["sayor@outlook.com"],
                    "רמ\"ד כספים": ["cesef@outlook.com"],
                    "רמ\"ד אקדמיה": ["academy@outlook.com"],
                    "רמ\"ד הסברה": ["hasbara@outlook.com"],
                    "רמ\"ד מעורבות": ["meoravut@outlook.com"],
                    "מנהל/ת רווחה": ["revaha@outlook.com"],
                    "מנהלת גרפיקה": ["graphics@outlook.com"],
                    "רכז ניו מדיה": ["new_media@outlook.com", "new_media2@outlook.com", "new_media3@outlook.com"],
                    "מנהל/ת אתר אינטרנט": ["website@outlook.com"],
                    "מנהל/ת מיזמים אקדמים": ["meizamim@outlook.com"]
                },
                {
                    "yor@outlook.com": "אלף בית",
                    "sayor@outlook.com": "בית גימל",
                    "cesef@outlook.com": "גימל דלת",
                    "academy@outlook.com": "דלת היי",
                    "hasbara@outlook.com": "היי וו",
                    "meoravut@outlook.com": "וו זין",
                    "revaha@outlook.com": "זין חית",
                    "graphics@outlook.com": "חית טת",
                    "meizamim@outlook.com": "טת יוד",
                    "new_media@outlook.com": "יוד כף",
                    "new_media2@outlook.com": "יוד כף למד",
                    "new_media3@outlook.com": "כף למד מם",
                    "website@outlook.com": "כף למד"
                },
                {
                    "יו\"ר": "5",
                    "סיו\"ר": "4",
                    "רמ\"ד כספים": "3",
                    "רמ\"ד אקדמיה": "3",
                    "רמ\"ד הסברה": "3",
                    "רמ\"ד מעורבות": "3",
                    "מנהל/ת רווחה": "2",
                    "מנהלת גרפיקה": "2",
                    "רכז ניו מדיה": "1",
                    "מנהל/ת אתר אינטרנט": "2",
                    "מנהל/ת מיזמים אקדמים": "2"
                },
                (err) =>
                {
                    if (err) {
                        done(err);
                    }
                    else {
                        usersAndRolesController.getRoleIdByUsername("cesef@outlook.com", (err, roleId) =>
                        {
                            if (err) {
                                done(err)
                            }
                            else {
                                usersAndRolesController.getRoleNameByRoleID(roleId, (err, roleName) =>
                                {
                                    if (err) {
                                        done(err)
                                    }
                                    else {
                                        assert.deepEqual(roleName, "רמ\"ד כספים");
                                        usersAndRolesController.findAdmins((err, admins) =>
                                        {
                                            if (err) {
                                                done(err);
                                            }
                                            else {
                                                assert.deepEqual(admins.length, 1);
                                                usersAndRolesController.getEmailToFullName((err, emailsToFullName) =>
                                                {
                                                    if (err) {
                                                        done(err);
                                                    }
                                                    else {
                                                        assert.deepEqual(emailsToFullName["graphics@outlook.com"], "חית טת");
                                                        assert.deepEqual(emailsToFullName["new_media2@outlook.com"], "יוד כף למד");

                                                        usersAndRolesController.getRoleToDereg((err, roleToDereg) =>
                                                        {
                                                            if (err) {
                                                                done(err)
                                                            }
                                                            else {
                                                                assert.deepEqual(Object.keys(roleToDereg).length, 11);
                                                                assert.deepEqual(roleToDereg["יו\"ר"], "5");
                                                                assert.deepEqual(roleToDereg["מנהל/ת רווחה"], "2");
                                                                UsersPermissionsController.setUserPermissions("creator@email.com", new UserPermissions("yor@outlook.com", [true, true, true, true]), (err) =>
                                                                {
                                                                    if (err) {
                                                                        done(err);
                                                                    }
                                                                    else {
                                                                        done();
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            );
        });
    }).timeout(30000);

    it('1.2 Creating process structure', function (done)
    {
        processStructureController.addProcessStructure("sayor@outlook.com", "מעורבות באתר אקדמיה", processStructure9_string,
            [], "24", "12", (err, needApprove) =>
            {
                assert.deepEqual(needApprove, "approval");
                waitingProcessStructuresController.getAllWaitingProcessStructuresWithoutSankey((err, waitingStructures) =>
                {
                    if (err) {
                        done(err);
                    }
                    else {
                        assert.deepEqual(waitingStructures[0].userEmail, "sayor@outlook.com");
                        waitingProcessStructuresController.approveProcessStructure("yor@outlook.com", waitingStructures[0].id, (err) =>
                        {
                            if (err) {
                                done(err);
                            }
                            else {
                                processStructureController.getAllProcessStructures((err, processStructures) =>
                                {
                                    if (err) {
                                        done(err);
                                    }
                                    else {
                                        assert.deepEqual(processStructures[0].structureName, "מעורבות באתר אקדמיה");
                                        assert.deepEqual(processStructures[0].stages.length, 10);
                                        processStructureController.editProcessStructure("new_media3@outlook.com", "מעורבות באתר אקדמיה", processStructure9_string, [], 48, 12, (err, needApprove) =>
                                        {
                                            if (err) {
                                                done(err);
                                            }
                                            else {
                                                assert.deepEqual(needApprove, "approval");
                                                waitingProcessStructuresController.getAllWaitingProcessStructuresWithoutSankey((err, waitingStructures) =>
                                                {
                                                    if (err) {
                                                        done(err);
                                                    }
                                                    else {
                                                        waitingProcessStructuresController.disapproveProcessStructure("creator@email.com", waitingStructures[0].id, (err) =>
                                                        {
                                                            if (err) {
                                                                done(err);
                                                            }
                                                            else {
                                                                processStructureController.getProcessStructure("מעורבות באתר אקדמיה", (err, ps) =>
                                                                {
                                                                    if (err) {
                                                                        done(err);
                                                                    }
                                                                    else {
                                                                        assert.deepEqual(ps.automaticAdvanceTime, 24);
                                                                        assert.deepEqual(ps.notificationTime, 12);
                                                                        done();
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
    }).timeout(30000);

    it('1.3 Starting, advancing, cancelling', function (done)
    {
        activeProcessController.startProcessByUsername("website@outlook.com", "מעורבות באתר אקדמיה", "תהליך 1",
            new Date(2022, 4, 26, 16), 2, (err) =>
            {
                if (err) {
                    done(err);
                }
                else {
                    activeProcessController.uploadFilesAndHandleProcess("website@outlook.com",
                        {
                            processName: "תהליך 1",
                            1: "on",
                            comments: "הערה 1"
                        }, [], [], (err) =>
                        {
                            if (err) {
                                done(err);
                            }
                            else {
                                activeProcessController.uploadFilesAndHandleProcess("hasbara@outlook.com", {
                                    processName: "תהליך 1",
                                    2: "on",
                                    comments: "הערה 2"
                                }, [], [], (err) =>
                                {
                                    if (err) {
                                        done(err);
                                    }
                                    else {
                                        activeProcessController.takePartInActiveProcess("תהליך 1", "new_media@outlook.com", (err) =>
                                        {
                                            if (err) {
                                                done(err);
                                            }
                                            else {
                                                activeProcessController.uploadFilesAndHandleProcess("new_media@outlook.com", {
                                                    processName: "תהליך 1",
                                                    3: "on",
                                                    comments: "הערה 3"
                                                }, [], [], (err) =>
                                                {
                                                    if (err) {
                                                        done(err);
                                                    }
                                                    else {
                                                        activeProcessController.uploadFilesAndHandleProcess("meizamim@outlook.com", {
                                                            processName: "תהליך 1",
                                                            4: "on",
                                                            comments: "הערה 4"
                                                        }, [], [], (err) =>
                                                        {
                                                            if (err) {
                                                                done(err);
                                                            }
                                                            else {
                                                                activeProcessController.uploadFilesAndHandleProcess("academy@outlook.com", {
                                                                    processName: "תהליך 1",
                                                                    5: "on",
                                                                    6: "on",
                                                                    comments: "הערה 56"
                                                                }, [], [], (err) =>
                                                                {
                                                                    if (err) {
                                                                        done(err);
                                                                    }
                                                                    else {
                                                                        activeProcessController.uploadFilesAndHandleProcess("cesef@outlook.com", {
                                                                            processName: "תהליך 1",
                                                                            9: "on",
                                                                            comments: "הערה 7.1"
                                                                        }, [], [], (err) =>
                                                                        {
                                                                            if (err) {
                                                                                done(err);
                                                                            }
                                                                            else {
                                                                                activeProcessController.uploadFilesAndHandleProcess("revaha@outlook.com", {
                                                                                    processName: "תהליך 1",
                                                                                    9: "on",
                                                                                    comments: "הערה 7.2"
                                                                                }, [], [], (err) =>
                                                                                {
                                                                                    if (err) {
                                                                                        done(err);
                                                                                    }
                                                                                    else {
                                                                                        activeProcessController.uploadFilesAndHandleProcess("website@outlook.com", {
                                                                                            processName: "תהליך 1",
                                                                                            7: "on",
                                                                                            comments: "הערה 7"
                                                                                        }, [], [], (err) =>
                                                                                        {
                                                                                            if (err) {
                                                                                                done(err);
                                                                                            }
                                                                                            else {
                                                                                                activeProcessController.uploadFilesAndHandleProcess("sayor@outlook.com", {
                                                                                                    processName: "תהליך 1",
                                                                                                    8: "on",
                                                                                                    comments: "הערה 8"
                                                                                                }, [], [], (err) =>
                                                                                                {
                                                                                                    if (err) {
                                                                                                        done(err);
                                                                                                    }
                                                                                                    else {
                                                                                                        activeProcessController.uploadFilesAndHandleProcess("yor@outlook.com", {
                                                                                                            processName: "תהליך 1",
                                                                                                            comments: "הערה 10"
                                                                                                        }, [], [], (err) =>
                                                                                                        {
                                                                                                            if (err) {
                                                                                                                done(err);
                                                                                                            }
                                                                                                            else {
                                                                                                                activeProcessController.getAllActiveProcesses((err, activeProcesses) =>
                                                                                                                {
                                                                                                                    if (err) {
                                                                                                                        done(err);
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        assert.deepEqual(activeProcesses.length, 0);
                                                                                                                        activeProcessController.startProcessByUsername("website@outlook.com", "מעורבות באתר אקדמיה", "תהליך 2",
                                                                                                                            new Date(2022, 4, 26, 16), 2, (err) =>
                                                                                                                            {
                                                                                                                                if (err) {
                                                                                                                                    done(err);
                                                                                                                                }
                                                                                                                                else {
                                                                                                                                    activeProcessController.uploadFilesAndHandleProcess("website@outlook.com",
                                                                                                                                        {
                                                                                                                                            processName: "תהליך 2",
                                                                                                                                            1: "on",
                                                                                                                                            comments: "הערה 1"
                                                                                                                                        }, [], [], (err) =>
                                                                                                                                        {
                                                                                                                                            if (err) {
                                                                                                                                                done(err);
                                                                                                                                            }
                                                                                                                                            else {
                                                                                                                                                activeProcessController.uploadFilesAndHandleProcess("hasbara@outlook.com", {
                                                                                                                                                    processName: "תהליך 2",
                                                                                                                                                    2: "on",
                                                                                                                                                    comments: "הערה 2"
                                                                                                                                                }, [], [], (err) =>
                                                                                                                                                {
                                                                                                                                                    if (err) {
                                                                                                                                                        done(err);
                                                                                                                                                    }
                                                                                                                                                    else {
                                                                                                                                                        activeProcessController.cancelProcess("new_media@outlook.com", "תהליך 2", "בדיקת בוטל", (err) =>
                                                                                                                                                        {
                                                                                                                                                            if (err) {
                                                                                                                                                                done(err);
                                                                                                                                                            }
                                                                                                                                                            done();
                                                                                                                                                        });
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                            }
                                                                                                                                        });
                                                                                                                                }
                                                                                                                            });
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                }
            });
    }).timeout(30000);

    it('1.4 Checking reports and notifications', function (done)
    {
        processReportController.getAllProcessesReportsByUser("yor@outlook.com", (err, processReports) =>
        {
            if (err) {
                done(err);
            }
            else {
                notificationController.getUserNotifications("website@outlook.com", (err, websiteNotifications) =>
                {
                    if (err) {
                        done(err);
                    }
                    else {
                        notificationController.getUserNotifications("sayor@outlook.com", (err, sayorNotifications) =>
                        {
                            if (err) {
                                done(err);
                            }
                            else {
                                assert.deepEqual(true, sayorNotifications.some(notification =>
                                {
                                    return notification.notificationType === "תהליך נגמר בהצלחה";
                                }));
                                assert.deepEqual(true, sayorNotifications.some(notification =>
                                {
                                    return notification.notificationType === "מבנה תהליך אושר";
                                }));
                                assert.deepEqual(true, websiteNotifications.some(notification =>
                                {
                                    return notification.notificationType === "תהליך נגמר בהצלחה";
                                }));
                                assert.deepEqual(true, websiteNotifications.some(notification =>
                                {
                                    return notification.notificationType === "תהליך בוטל";
                                }));
                                assert.deepEqual(true, websiteNotifications.some(notification =>
                                {
                                    return notification.notificationType === "תהליך בהמתנה";
                                }));
                                assert.deepEqual(true, processReports.some(processReport =>
                                {
                                    return processReport.processName === "תהליך 1";
                                }));
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.5 modification on tree', function (done)
    {
        activeProcessController.startProcessByUsername("website@outlook.com", "מעורבות באתר אקדמיה", "תהליך 4",
            new Date(2022, 4, 26, 16), 2, (err) =>
            {
                if (err) {
                    done(err);
                }
                else {
                    activeProcessController.uploadFilesAndHandleProcess("website@outlook.com",
                        {
                            processName: "תהליך 4",
                            1: "on",
                            comments: "הערה 1"
                        }, [], [], (err) =>
                        {
                            if (err) {
                                done(err);
                            }
                            else {
                                usersAndRolesController.getRoleIdByUsername("hasbara@outlook.com", (err, oldRoleID) =>
                                {
                                    usersAndRolesController.setUsersAndRolesTree("creator@email.com", tree9_string,
                                        {
                                            "יו\"ר": ["yor@outlook.com"],
                                            "סיו\"ר": ["sayor@outlook.com"],
                                            "רמ\"ד כספים": ["cesef@outlook.com"],
                                            "רמ\"ד אקדמיה": ["academy@outlook.com"],
                                            "רמ\"ד הסברה": ["hasbara2@outlook.com"],
                                            "רמ\"ד מעורבות": ["meoravut@outlook.com"],
                                            "מנהל/ת רווחה": ["revaha@outlook.com"],
                                            "מנהלת גרפיקה": ["graphics@outlook.com"],
                                            "רכז ניו מדיה": ["new_media@outlook.com", "new_media2@outlook.com", "new_media3@outlook.com"],
                                            "מנהל/ת אתר אינטרנט": ["website@outlook.com"],
                                            "מנהל/ת מיזמים אקדמים": ["meizamim@outlook.com"]
                                        },
                                        {
                                            "yor@outlook.com": "אלף בית",
                                            "sayor@outlook.com": "בית גימל",
                                            "cesef@outlook.com": "גימל דלת",
                                            "academy@outlook.com": "דלת היי",
                                            "hasbara2@outlook.com": "היי וו",
                                            "meoravut@outlook.com": "וו זין",
                                            "revaha@outlook.com": "זין חית",
                                            "graphics@outlook.com": "חית טת",
                                            "meizamim@outlook.com": "טת יוד",
                                            "new_media@outlook.com": "יוד כף",
                                            "new_media2@outlook.com": "יוד כף למד",
                                            "new_media3@outlook.com": "כף למד מם",
                                            "website@outlook.com": "כף למד"
                                        },
                                        {
                                            "יו\"ר": "5",
                                            "סיו\"ר": "4",
                                            "רמ\"ד כספים": "3",
                                            "רמ\"ד אקדמיה": "3",
                                            "רמ\"ד הסברה": "3",
                                            "רמ\"ד מעורבות": "3",
                                            "מנהל/ת רווחה": "2",
                                            "מנהלת גרפיקה": "2",
                                            "רכז ניו מדיה": "1",
                                            "מנהל/ת אתר אינטרנט": "2",
                                            "מנהל/ת מיזמים אקדמים": "2"
                                        },
                                        (err) =>
                                        {
                                            if (err) {
                                                done(err);
                                            }
                                            else {
                                                activeProcessController.getActiveProcessByProcessName("תהליך 4", (err, activeProcess) =>
                                                {
                                                    activeProcess.stages.forEach((stage) =>
                                                    {
                                                        if (stage.roleID.toString() === oldRoleID.toString()) {
                                                            assert.deepEqual(stage.userEmail === null, true);

                                                        }
                                                    });
                                                    notificationController.getUserNotifications("hasbara2@outlook.com",(err,notifications)=>{
                                                        assert.deepEqual(notifications.some(notification=>notification.notificationType==="תהליך זמין"),true);
                                                        done();
                                                    });
                                                });
                                            }
                                        });
                                })
                            }
                        });
                }
            })
    }).timeout(30000);

    it('1.6 modification on tree 2', function (done)
    {
        activeProcessController.startProcessByUsername("website@outlook.com", "מעורבות באתר אקדמיה", "תהליך 3",
            new Date(2022, 4, 26, 16), 2, (err) =>
            {
                if (err) {
                    done(err);
                }
                else {
                    activeProcessController.uploadFilesAndHandleProcess("website@outlook.com",
                        {
                            processName: "תהליך 3",
                            1: "on",
                            comments: "הערה 1"
                        }, [], [], (err) =>
                        {
                            if (err) {
                                done(err);
                            }
                            else {
                                let diagram = JSON.parse(tree9_string).content.diagram;
                                let nodeToDelete = diagram.find((node) =>
                                {
                                    if (node.type === "sankey.shape.State") {
                                        if (node.labels[0].text === "מנהל/ת מיזמים אקדמים") {
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                                let tree9_deleted = {
                                    content: {
                                        diagram: diagram.filter(node =>
                                        {
                                            if (node.id === nodeToDelete.id) {
                                                return false;
                                            }
                                            if (node.type === "sankey.shape.Connection") {
                                                if (nodeToDelete.id === node.target.node) {
                                                    return false;
                                                }
                                            }
                                            return true;
                                        })
                                    }
                                };
                                activeProcessController.getActiveProcessByProcessName("תהליך 3", (err, oldActiveProcess) =>
                                {
                                    usersAndRolesController.getRoleIdByUsername("meizamim@outlook.com", (err, oldRoleID) =>
                                    {
                                        usersAndRolesController.setUsersAndRolesTree("creator@email.com", JSON.stringify(tree9_deleted),
                                            {
                                                "יו\"ר": ["yor@outlook.com"],
                                                "סיו\"ר": ["sayor@outlook.com"],
                                                "רמ\"ד כספים": ["cesef@outlook.com"],
                                                "רמ\"ד אקדמיה": ["academy@outlook.com"],
                                                "רמ\"ד הסברה": ["hasbara@outlook.com"],
                                                "רמ\"ד מעורבות": ["meoravut@outlook.com"],
                                                "מנהל/ת רווחה": ["revaha@outlook.com"],
                                                "מנהלת גרפיקה": ["graphics@outlook.com"],
                                                "רכז ניו מדיה": ["new_media@outlook.com", "new_media2@outlook.com", "new_media3@outlook.com"],
                                                "מנהל/ת אתר אינטרנט": ["website@outlook.com"],
                                            },
                                            {
                                                "yor@outlook.com": "אלף בית",
                                                "sayor@outlook.com": "בית גימל",
                                                "cesef@outlook.com": "גימל דלת",
                                                "academy@outlook.com": "דלת היי",
                                                "hasbara@outlook.com": "היי וו",
                                                "meoravut@outlook.com": "וו זין",
                                                "revaha@outlook.com": "זין חית",
                                                "graphics@outlook.com": "חית טת",
                                                "new_media@outlook.com": "יוד כף",
                                                "new_media2@outlook.com": "יוד כף למד",
                                                "new_media3@outlook.com": "כף למד מם",
                                                "website@outlook.com": "כף למד"
                                            },
                                            {
                                                "יו\"ר": "5",
                                                "סיו\"ר": "4",
                                                "רמ\"ד כספים": "3",
                                                "רמ\"ד אקדמיה": "3",
                                                "רמ\"ד הסברה": "3",
                                                "רמ\"ד מעורבות": "3",
                                                "מנהל/ת רווחה": "2",
                                                "מנהלת גרפיקה": "2",
                                                "רכז ניו מדיה": "1",
                                                "מנהל/ת אתר אינטרנט": "2",
                                            }, (err) =>
                                            {
                                                if (err) {
                                                    done(err);
                                                }
                                                else {
                                                    processStructureController.getProcessStructure("מעורבות באתר אקדמיה", (err, processStructure) =>
                                                    {
                                                        if (err) {
                                                            done(err);
                                                        }
                                                        else {
                                                            let sankeyArray = JSON.parse(processStructure.sankey).content.diagram;
                                                            sankeyArray.forEach(element =>
                                                            {
                                                                if (element.type === "sankey.shape.State") {
                                                                    if (element.labels[0].text === "מנהל/ת מיזמים אקדמים") {
                                                                        assert.deepEqual(element.bgColor.toLowerCase(), "#ff1100");
                                                                    }
                                                                    else {
                                                                        assert.notDeepEqual(element.bgColor.toLowerCase(), "#ff1100");
                                                                    }
                                                                }
                                                            });
                                                            usersAndRolesController.getRoleIdByUsername("academy@outlook.com", (err, roleID) =>
                                                            {
                                                                activeProcessController.getActiveProcessByProcessName("תהליך 3", (err, activeProcess) =>
                                                                {
                                                                    oldActiveProcess.stages.forEach((stage) =>
                                                                    {
                                                                        if (stage.roleID.toString() === oldRoleID.toString()) {
                                                                            activeProcess.stages.forEach(_stage =>
                                                                            {
                                                                                if (JSON.stringify(stage.stagesToWaitFor) === JSON.stringify(_stage.stagesToWaitFor)) {
                                                                                    assert.deepEqual(roleID.toString(), _stage.roleID.toString());
                                                                                }
                                                                            })
                                                                        }
                                                                    });
                                                                    done();
                                                                });
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                    })
                                });
                            }
                        });
                }
            })
    }).timeout(30000);
});
