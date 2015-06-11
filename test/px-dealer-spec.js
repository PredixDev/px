
'use strict';

var dealer = px.dealer;

describe('the dealer', function() {

    var deckDefinition = {
        'sample-cards': {
            name: 'SampleCards',
            url: 'views/sample-cards.html'
        },
        'fetch-data': {
            name: 'FetchData',
            url: 'views/fetch-data.html'
        },
        'card-to-card': {
            name: 'CardToCard',
            url: 'views/card-to-card.html'
        }
    };

    var decksByClassification = {
        'dashboard1': {
            '/classification/country': ['sample-cards', 'fetch-data'],
            'state': ['card-to-card'],
            'county': ['sample-cards', 'card-to-card', 'fetch-data']
        },
        'dashboard2': {
            '/classification/country': ['card-to-card'],
            'county': ['sample-cards', 'card-to-card', 'fetch-data']
        }
    };

    beforeEach(function() {
        // always clear the global px.dealer
        px.dealer.deckDefinitions = null;
        px.dealer.decksByClassification = null;
    });

    afterEach(function() {
        // always clear the global px.dealer
        px.dealer.deckDefinitions = null;
        px.dealer.decksByClassification = null;
    });

    var beforeEachAsync = function(fn){
        beforeEach(function (done) {
            fn();
            setTimeout(function () {
                done();
            }, 0)
        });
    };

    describe('with a normal use case', function() {

        describe('when there are decks for that classification', function() {
            var decks;
            beforeEachAsync(function(){
                dealer.init(deckDefinition, decksByClassification);

                dealer.getDecksByClassification('dashboard1', '/classification/country').then(function(data){
                    decks = data;
                });
            });

            it('returns the decks', function () {
                expect(decks[0].url).toBe('views/sample-cards.html');
                expect(decks[1].url).toBe('views/fetch-data.html');
                expect(decks.length).toBe(2);
            });
        });

        describe('when there are NO decks for that classification', function() {
            var decks;
            beforeEachAsync(function(){
                dealer.init(deckDefinition, decksByClassification);

                dealer.getDecksByClassification('dashboard1', '/classification/coGARBAGEuntry').then(function(data){
                    decks = data;
                });
            });

            it('returns no decks', function () {
                expect(decks.length).toBe(0);
            });
        });

        describe('when there multiple dashboards', function() {
            var decks;
            beforeEachAsync(function(){
                dealer.init(deckDefinition, decksByClassification);

                dealer.getDecksByClassification('dashboard2', '/classification/country').then(function(data){
                    decks = data;
                });
            });

            it('returns the decks', function () {
                expect(decks[0].url).toBe('views/card-to-card.html');
                expect(decks.length).toBe(1);
            });
        });
    });

    describe('with a abnormal use case', function(){
        describe('when the dealer is not initialized', function() {
            var decks;

            beforeEachAsync(function(){
                dealer.getDecksByClassification('dashboard1', '/classification/country').then(function(data){
                    decks = data;
                });
            });

            it('will return no decks', function () {
                expect(decks.length).toBe(0);
            });
        });

        describe('when missing dashboard id to find decks', function(){
            var decks;

            beforeEachAsync(function(){
                dealer.init(deckDefinition, decksByClassification);
                dealer.getDecksByClassification('', '/classification/country').then(function(data){
                    decks = data;
                });
            });

            it('will return no decks', function () {
                expect(decks.length).toBe(0);
            });

        });

        describe('when the dashboard id doesnt exist in the decksByClassification', function(){
            var decks;

            beforeEachAsync(function(){
                dealer.init(deckDefinition, decksByClassification);
                dealer.getDecksByClassification('my-AWESOME-dashboard', '/classification/country').then(function(data){
                    decks = data;
                });
            });

            it('will return no decks', function () {
                expect(decks.length).toBe(0);
            });

        });

        describe('if the user makes a mistake and is missing the deck definition', function(){
            var decks;

            var badDeckDefinition = {
                'sample-cards': {
                    name: 'SampleCards',
                    url: 'views/sample-cards.html'
                }
            };

            beforeEachAsync(function(){
                dealer.init(badDeckDefinition, decksByClassification);
                dealer.getDecksByClassification('dashboard1', '/classification/country').then(function(data){
                    decks = data;
                });
            });

            it('will return whatever decks it can find', function () {
                expect(decks[0].url).toBe('views/sample-cards.html');
                expect(decks.length).toBe(1);
            });

        });

        describe('if the user makes a mistake and put view definition in wrong format', function(){
            var decks;

            var badDeckDefinition = "View Definition"

            beforeEachAsync(function(){
                dealer.init(badDeckDefinition, decksByClassification);
                dealer.getDecksByClassification('dashboard1', '/classification/country').then(function(data){
                    decks = data;
                });
            });

            it('will return no decks', function () {
                expect(decks.length).toBe(0);
            });

        });




    });



});


