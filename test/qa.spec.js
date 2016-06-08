'use strict';
var expect = require('chai').expect;
var qa = require('../lib/qa');

var qaLib = new qa();

//Test object that would be produced by dialog service
var dialog_test_obj = {
  reponse: 'Hi this is dialog_test_obj',
  conversation_id: '11231',
  confidence: '1',
  client_id: '4435'
};

//Test object that would be produced by nlc service
var nlc_test_obj = {
  classifier_id: '2373f5x67-nlc-484',
  url: 'https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/2373f5x67-nlc-484',
  text: 'Hello from nlc_test_obj',
  top_class: 'conditions'
};

//Functionalities of qa class
describe('qaLib', function (done) {
  it('returns dialog object and nlc classification as one json object', function (done) {
    expect(qaLib.getCombinedObject).to.be.a('function');
    var cObj = qaLib.getCombinedObject(dialog_test_obj, nlc_test_obj);
    expect(cObj).to.have.property('dialog');
    expect(cObj).to.have.property('nlc');
    console.log(cObj);
    done();
  });
  it('sends a nlc object class to a dialog service', function (done) {
    this.timeout(4000);
    var res;
    var params = {
      dialog_id: '48cf4fbf-d452-4bc7-a405-0110aceaf240',
      input: nlc_test_obj.top_class
    };
    expect(qaLib.sendNLCObject).to.be.a('function');
    qaLib.sendNLCObject(params, function (err, response) {
      if (err)
        console.log(err);
      else
        res = response;
      console.log(response);
      expect(res).to.be.a('object');
      expect(res).to.have.property('response');
      expect(res).to.have.property('input');
      expect(res).to.have.property('conversation_id');
      expect(res).to.have.property('confidence');
      expect(res).to.have.property('client_id');
      done();
    });
  });
  it('should use converse to do all steps', function (done) {
    this.timeout(10000);
    var res;
    var params = {
      dialog_id: '48cf4fbf-d452-4bc7-a405-0110aceaf240',
      input: 'Hi from params',
      nlc_id: '2373f5x67-nlc-484',
      conversation_id: '3092980',
      client_id: '3128126'
    };
    expect(qaLib.converse).to.be.a('function');
    qaLib.converse(params, function (err, response) {
      if (err)
        console.log(err);
      else
        res = response;
      console.log(response);
      expect(res).to.be.a('object');
      expect(res).to.have.property('dialog');
      expect(res).to.have.property('nlc');
      done();
    });
  });
});