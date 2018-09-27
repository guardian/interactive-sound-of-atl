var request = require('sync-request');
var fs = require('fs-extra');
var gsjson = require('google-spreadsheet-to-json');
var deasync = require('deasync');
var config = require('../config.json');
var userHome = require('user-home');
var keys = require(userHome + '/.gu/interactives.json');

var data;

function fetchData(callback) {
    gsjson({
        spreadsheetId: config.data.id,
        allWorksheets: true,
        credentials: keys.google
    })
    .then(function(result) {
        callback(result);
    })
    .then(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function setFurniture() {
    var furniture = {}

    for (var i = 0; i < data.furniture.length; i++) {
        data[data.furniture[i].option] = data.furniture[i].value
    }

    delete data.furniture;

    return data;
}

function sortResults() {
    if (data.length === 0) {
        data = data[0]
    } else {
        data = {
            'furniture': data[0],
            'playlist': data[1]
        }
    }

    return data;
}

function convertImageLinks() {
    for (var i = 0; i < data.playlist.length; i++) {
        if (data.playlist[i].artistimage) {
            data.playlist[i].artistimage = convertToGridUrl(data.playlist[i].artistimage, 1000);
        }
        if (data.playlist[i].pickedbyimage) {
            data.playlist[i].pickedbyimage = convertToGridUrl(data.playlist[i].pickedbyimage, 140);
        }
    }

    return data;
}

function convertToGridUrl(url, size) {
    var crop = url.split('?crop=')[1];
        
        url = url.replace('gutools.co.uk', 'guim.co.uk');
        url = url.replace('http://', 'https://');
        url = url.replace('images/', '');
        url = url.split('?')[0];

    return url + '/' + crop + '/' + size + '.jpg';
}

module.exports = function getData() {
    var isDone = false;

    console.log('hey');

    fetchData(function(result) {
        data = result;
        data = sortResults();
        data = setFurniture();
        data = convertImageLinks();

        console.log(data);

        isDone = true;
    });

    deasync.loopWhile(function() {
        return !isDone;
    });

    return data;
};