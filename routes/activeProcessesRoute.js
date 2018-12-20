let express = require('express');
let activeProcess = require('../controllers/processes/activeProcessController');

let router = express.Router();

router.post('/startProcess', function (req, res) {
    let structure_name = req.body.structure_name;
    let process_name = req.body.process_name;
    let username = req.body.user_name;
    activeProcess.startProcessByUsername(username, structure_name, process_name, (err, activeProcess) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Activated Successfully");
        }
    });
});

router.get('/getAllActiveProcessesByUser', function (req, res) {
    let user_name = req.query.user_name;
    activeProcess.getAllActiveProcessesByUser(user_name, (err, array) => {
        res.render('MyActiveProcessesPage', {title: 'Express', table: array});
    });
});

router.get('/getWaitingActiveProcessesByUser', function (req, res) {
    let user_name = req.query.user_name;
    activeProcess.getWaitingActiveProcessesByUser(user_name, (err, array) => {
        res.render('MyWaitingProcessesPage', {title: 'Express', table: array});
    });
});
router.get('/reportMePlease', function (req, res) {
    let process_name = req.query.process_name;
    activeProcess.getAllActiveProcessDetails(process_name, (err,array) => {
        res.render('processReport', {title: 'Express', processDetails: array[0], table: array[1]});
    });
});

router.post('/handleProcess', function (req, res) {
    let user_name = req.body.user_name;
    let process_name = req.body.process_name;
    let stage = {stageNum: parseInt(req.body.stage_num), comments: "HII"};
    activeProcess.handleProcess(user_name, process_name, stage, [""], [""], (err, ret) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Activated Successfully");
        }
    });
});

router.post('/advanceProcess', function (req, res) {
    let process_name = req.body.process_name;
    let next = [parseInt(req.body.next)];
    activeProcess.advanceProcess(process_name, next, (err, ret) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Activated Successfully");
        }
    });
});

module.exports = router;
