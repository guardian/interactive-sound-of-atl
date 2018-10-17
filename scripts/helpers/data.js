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
        if (data.playlist[i].artistImage) {
            data.playlist[i].artistImage = convertToGridUrl(data.playlist[i].artistImage, 1000);
        }

        if (data.playlist[i].pickedByImage) {
            data.playlist[i].pickedByImage = convertToGridUrl(data.playlist[i].pickedByImage, 140);
        }

        if (data.playlist[i].artistThumbnail) {
            data.playlist[i].artistThumbnail = convertToGridUrl(data.playlist[i].artistThumbnail, 140);
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

    fetchData(function(result) {
        data = result;
        data = sortResults();
        data = setFurniture();
        data = convertImageLinks();

        isDone = true;
    });

    deasync.loopWhile(function() {
        return !isDone;
    });

    return data;
};