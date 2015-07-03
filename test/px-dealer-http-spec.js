'use strict';

describe('px dealer http request', function () {
    var $httpBackend, $rootScope, successCallback, errorCallback, $http;

    angular.module('testModule',[]);
    angular.bootstrap(document.querySelector('body'), ['testModule']);

    beforeEach(function () {
        module('testModule');
    });

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _$http_) {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;

        window.px.dealer.setHttpProvider(_$http_);
    }));

    describe('when getData', function(){

        describe('without header', function(){
            beforeEach(function () {
                successCallback = jasmine.createSpy('successCallback');
                errorCallback = jasmine.createSpy('errorCallback');

                $httpBackend.when('GET', 'http://www.weather.com').respond({temp:10});
                window.px.dealer.getData('http://www.weather.com').then(successCallback, errorCallback);
            });

            it('will get data with correct url', function () {
                $httpBackend.expectGET('http://www.weather.com');
                $httpBackend.flush();
            });


            it('with success will get temperature', function (done) {
                $httpBackend.flush();
                setTimeout(function(){
                    expect(successCallback).toHaveBeenCalledWith({temp:10});
                    done();
                }, 0);
            });

        });

        describe('with header', function(){
            beforeEach(function () {
                successCallback = jasmine.createSpy('successCallback');
                errorCallback = jasmine.createSpy('errorCallback');

                $httpBackend.when('GET', 'http://www.weather.com').respond({temp:10});
                window.px.dealer.getData('http://www.weather.com', {headers: {'header-name': 'header-value'}}).then(successCallback, errorCallback);
            });

            it('will get data with correct url', function () {
                $httpBackend.expectGET('http://www.weather.com', {"header-name": "header-value", "Accept": "application/json, text/plain, */*"});
                $httpBackend.flush()
            });
        });

        describe('with jsonp', function(){
            beforeEach(function () {
                successCallback = jasmine.createSpy('successCallback');
                errorCallback = jasmine.createSpy('errorCallback');

                $httpBackend.whenJSONP('http://www.weather.com?callback=123').respond({temp:10});
                window.px.dealer.getData('http://www.weather.com?callback=123').then(successCallback, errorCallback);
            });

            it('will get data with correct url', function () {
                $httpBackend.expectJSONP('http://www.weather.com?callback=123');
                $httpBackend.flush();
            });
        });


    });


});

