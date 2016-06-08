'use strict';
var Classifier = require('watson-nlc-wrapper');
var Dialog = require('watson-dialog-wrapper');

var dialogCreds = {
    username: '580ed903-43d7-46e5-befb-00f29341368d',
    password: 'A0jheFNVwltf',
    version: 'v1'
};

var nlcCreds = {
    username: '7a24907f-1642-42fb-abc5-bd0bac33ba3c',
    password: 'kNlcyDDPUSIg',
    url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
    name: 'MyClassifier'
};

var dialog = new Dialog(dialogCreds);
var classifier = new Classifier(nlcCreds);
var dialog_object;
var nlc_object;

function qa() {

}

//INPUTS: Dialog Object and NLC Object
//OUTPUTS: Combined Object with properties dialog and nlc
qa.prototype.getCombinedObject = function (dObj, nObj) {
    var CombinedObject = {
        dialog: dObj,
        nlc: nObj
    }
    return CombinedObject;
}

//PARAMS: {classifier_id,text}
//OUTPUTS: classification object
qa.prototype.sendNLCObject = function (params, cb) {
    console.log(params);
    dialog.conversation(params, function (err, conversation) {
        if (err)
            cb(err)
        else
            cb(null, conversation);
    });
}

//PARAMS: {dialog_id: <id>,nlc_id: <id>,input: <text>, conversation_id: <id> (optional), client_id: <id> (optional)}
//OUTPUTS: combined object with properties dialog and nlc
qa.prototype.converse = function (params, cb) {
    classifier.classify({ classifier_id: params.nlc_id, text: params.input }, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        else {
            var dialogInput = {
                dialog_id: params.dialog_id,
                input: result.top_class,
                client_id: params.client_id,
                conversation_id: params.conversation_id
            };
            dialog.conversation(dialogInput, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    dialog_object = result;
                    var nlcInput = {
                        classifier_id: params.nlc_id,
                        text: result.input
                    }
                    classifier.classify(nlcInput, function (err, result) {
                        nlc_object = result;
                        if (err) {
                            console.log(err);
                            return;
                        }
                        else {
                            var final_result = {
                                dialog: dialog_object,
                                nlc: nlc_object
                            }
                            cb(null, final_result);
                        }
                    })
                }
            })
        }
    })
}

module.exports = qa;