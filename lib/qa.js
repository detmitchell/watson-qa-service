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

qa.prototype.stringToQAObj = function (o) {
    var anObject = JSON.parse(o);
    return anObject;
}

qa.prototype.createInputs = function (s_arr, dialog_id, start_time, end_time, c) {
    var dialogObject = {
        dialogID: dialog_id,
        startTime: start_time,
        endTime: end_time,
        dialog: null,
        completed: c
    }
    var arr = [];
    var i = 0;
    s_arr.forEach(function (s) {
        var jObj = JSON.parse(s);
        arr[i] = jObj;
        i++;
    }, this);
    dialogObject.dialog = arr;
    return JSON.stringify(dialogObject);
}

qa.prototype.getNLCOutput = function (i, input, o) {
    var params = {
        text: input,
        classifier_id: '2373f5x67-nlc-484'
    };
    classifier.classify(params, function (response) {
        o(null, response);
    });
}

qa.prototype.getCombinedObject = function (dObj, nObj) {
    var CombinedObject = {
        dialog_object: dObj,
        nlc_object: nObj
    }
    return CombinedObject;
}

qa.prototype.sendNLCObject = function (nObj, cb) {
    var params = {
        dialog_id: '48cf4fbf-d452-4bc7-a405-0110aceaf240',
        input: nObj.top_class
    };
    dialog.conversation(params, function (err, conversation) {
        if (err)
            cb(err)
        else
            cb(null, conversation);
    });
}

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