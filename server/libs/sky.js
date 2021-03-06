/*jshint node: true */
(function () {
    'use strict';

    var constituentBaseUri,
        rq;

    constituentBaseUri = 'constituent/v1/';
    rq = require('request-promise');
    rq.debug = true;

    /**
     * Proxy method to the RENXT api.
     * Validates the session before initiating request.
     * @private
     * @name getProxy
     * @param {Object} request
     * @param {string} method
     * @param {string} endpoint
     * @param {Function} callback
     */
    function proxy(request, method, endpoint, body, callback) {
        var options;

        options = {
            json: true,
            method: method,
            body: body,
            timeout: 29000,
            url: 'https://api.sky.blackbaud.com/' + endpoint,
            headers: {
                'bb-api-subscription-key': process.env.AUTH_SUBSCRIPTION_KEY,
                'Authorization': 'Bearer ' + request.session.ticket.access_token
            }
        };

        rq(options).then(function (data) {
            callback(data);
        }).catch(function (err) {
            console.log("(!)[ERROR] ", err);
            callback(err);
        });
    }

    /**
     * Wrap all GET proxy calls.
     * @private
     * @name get
     * @param {Object} request
     * @param {String} endpoint
     * @param {Function} callback
     */
    function get(request, endpoint, callback) {
        proxy(request, 'GET', endpoint, '', callback);
    }

    /**
     * Wrap all POST proxy calls.
     * @private
     * @name get
     * @param {Object} request
     * @param {String} endpoint
     * @param {Function} callback
     */
    function post(request, endpoint, body, callback) {
        proxy(request, 'POST', endpoint, body, callback);
    }

    /**
     * Gets the requested constituent
     * @name getConstituent
     * @param {Object} request
     * @param {string} constituentId Id of the constituent to retrieve
     * @param {Function} callback
     */
    function getConstituent(request, constituentId, callback) {
        get(request, constituentBaseUri + 'constituents/' + constituentId, callback);
    }

    /**
     * Searches for a constituent.
     * @name getConstituent
     * @param {Object} request
     * @param {string} name Name of the constituent to search for.
     * @param {Function} callback
     */
    function getConstituentSearch(request, name, callback) {
        get(request, constituentBaseUri + 'constituents/search?searchText=' + name, callback);
    }

    function getConstituentProfilePicture(request, constituentId, callback) {
        get(request, constituentBaseUri + 'constituents/' + constituentId + '/profilepicture', callback);
    }

    /**
     * Posts a note to the specified constituent
     * @name postNotes
     * @param {Object} request
     * @param {string} constituentId Id of the constituent to retrieve
     * @param {Function} callback
     */
    function postNotes(request, body, callback) {
        post(request, constituentBaseUri + 'notes', body, callback);
    }

    /**
     * Class which lightly wraps a few of RENXT API endpoints.
     * @constructor
     * @returns {Object}
     *  {@link getConstituent}
     */
    module.exports = {
        getConstituent: getConstituent,
        getConstituentSearch: getConstituentSearch,
        getConstituentProfilePicture: getConstituentProfilePicture,
        postNotes: postNotes
    };
}());
