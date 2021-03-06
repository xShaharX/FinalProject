let express = require('express');
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');
let filledOnlineFormsController = require('../../controllers/onlineFormsControllers/filledOnlineFormController');
const formidable = require("formidable");
let router = express.Router();

/*
   _____ ______ _______
  / ____|  ____|__   __|
 | |  __| |__     | |
 | | |_ |  __|    | |
 | |__| | |____   | |
  \_____|______|  |_|

 */

router.get('/getAllOnlineForms', function (req, res) {
    onlineFormsController.getAllOnlineForms((err, forms) => {
        if (err) res.send(err);
        else {
            let onlineForms = {};
            forms.forEach((form) => {
                onlineForms[form.formName] = form.HTMLSource;
            });

            res.send(onlineForms);
        }
    });
});

router.get('/getAllOnlineFormsNames', function (req, res) {
    onlineFormsController.getAllOnlineForms((err, forms) => {
        if (err) res.send(err);
        else {
            let onlineForms = [];
            forms.forEach((form) => {
                onlineForms.push(form.formName);
            });
            res.send(onlineForms);
        }
    });
});

router.get('/display', function (req, res) {
    onlineFormsController.getOnlineFormByName(req.query.formName, (err, form) => {
        if (err) res.send(err);
        else if (form === null) res.send(new Error("form " + req.query.formName + " wasn't found"));
        else {
            res.render('onlineFormViews/' + form.HTMLSource, {
                formName: form.formName,
                isForShow: true,
                fields: false,
                shouldLock: true
            });
        }
    })
});

router.get('/fill', function (req, res) {
    filledOnlineFormsController.getFormReadyToFill(req.query.processName, req.query.formName, (err, HTMLSource, locals) => {
        if (err) res.send(err);
        else {
            res.render('onlineFormViews/' + HTMLSource, locals);

        }
    });

});

router.get('/displayFilled', function (req, res) {
    let filledFormID = req.query.formID;
    filledOnlineFormsController.displayFilledForm(filledFormID, (err, locals, HTMLSource) => {
        if (err) res.send(err);
        else res.render('onlineFormViews/' + HTMLSource, locals);
    });


});

router.post('/updateOrAddFilledForm', function (req, res) {
    let data = new formidable.IncomingForm();
    data.parse(req, function (err, fields) {
        let processName = fields.processName;
        let formName = fields.formName;
        let shouldLock = fields.shouldLock;
        let formFields = JSON.parse(fields.info);
        filledOnlineFormsController.updateOrAddFilledForm(processName, formName, formFields, shouldLock, (err) => {
            if (err) res.send(err);
            else res.send("success");
        });
    });
});

module.exports = router;
