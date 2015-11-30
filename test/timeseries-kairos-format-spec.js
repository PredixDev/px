'use strict';

var transformer = px.timeseries.adapter.kairosdb;


describe('time series kairos DB Format transformation', function () {

    it('should transform the kairos db format with 1 result into array of objects', function () {

        var expectedFormat = [
            {
                name: 'Series A',
                data: [
                    {x: 1, y: 2},
                    {x: 3, y: 4}
                ]
            },
            {
                name: 'Series B',
                data: [
                    {x: 9, y: 10},
                    {x: 12, y: 14}
                ]
            }
        ];
        var kairosDbFormat = [
            {
                results: [
                    {
                        name: 'Series A',
                        values: [
                            [1, 2],
                            [3, 4]
                        ]
                    },
                    {
                        name: 'Series B',
                        values: [
                            [9, 10],
                            [12, 14]
                        ]
                    }
                ]
            }
        ];
        expect(transformer.transform(kairosDbFormat)).toEqual(expectedFormat);
    });

    it('should transform the kairos db format with 2 results into array of objects', function () {

        var expectedFormat = [
            {
                name: 'Series A',
                data: [
                    {x: 1, y: 2},
                    {x: 3, y: 4}
                ]
            },
            {
                name: 'Series B',
                data: [
                    {x: 9, y: 10},
                    {x: 12, y: 14}
                ]
            }
        ];
        var kairosDbFormat = [
            {
                results: [
                    {
                        name: 'Series A',
                        values: [
                            [1, 2],
                            [3, 4]
                        ]
                    }
                ]
            },
            {
                results: [
                    {
                        name: 'Series B',
                        values: [
                            [9, 10],
                            [12, 14]
                        ]
                    }
                ]
            }
        ];
        expect(transformer.transform(kairosDbFormat)).toEqual(expectedFormat);
    });


    it('when result array is empty, returns an empty array', function () {
        var expectedFormat = [];
        var kairosDbFormat = [
            {
                results: []
            }
        ];
        expect(transformer.transform(kairosDbFormat)).toEqual(expectedFormat);
    });

    it('outputs an empty array if input array has no elements', function () {
        expect(transformer.transform([])).toEqual([]);
    });

    function expectThrowsError(rawData) {
        try {
            transformer.transform(rawData);
            expect('This should have thrown an error').toBe('');
        } catch (e) {
            expect(e.message).toBe('Invalid time series data format');
        }
    }

    describe('should throw invalid format error ', function () {

        it('when input is null', function () {
            expectThrowsError(null);
        });

        it('when input is not an array', function () {
            expectThrowsError({'a': 5});
        });

        it('when input array has 1 element but no result property', function () {
            expectThrowsError([
                {a: 1}
            ]);
        });

        it('when input array has 1 element with result property but not an array', function () {
            expectThrowsError([
                {results: 1}
            ]);
        });

        it('when result array object does not have name property', function () {
            expectThrowsError([
                {results: [
                    {values: []}
                ]}
            ]);
        });

        it('when result array object does not have values property', function () {
            expectThrowsError([
                {results: [
                    {name: 'My Series'}
                ]}
            ]);
        });

        it('when result values is not an array', function () {
            expectThrowsError([
                {results: [
                    {name: 'My Name', values: 'Bad Values'}
                ]}
            ]);
        });

        it('when point does not have 2 items in the array', function () {
            try {
                transformer.transform([
                    {results: [
                        {name: 'My Name', values: [
                            [1, 2],
                            [3]
                        ]}
                    ]}
                ]);
                expect('This should have thrown an error').toBe('');
            } catch (e) {
                expect(e.message).toBe('Invalid time series point format');
            }
        });

    });

});