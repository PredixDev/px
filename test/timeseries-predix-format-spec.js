'use strict';

describe('Predix Timeseries DB transformer', function () {
    describe('With default getSeriesName option', function () {
        var predixTimeSeriesTransformer;
        beforeEach(function () {
            predixTimeSeriesTransformer = new px.timeseries.dataTransformer();
        });

        it('should transform 1 tag into 1 series and ignore the 3rd point item', function () {
            var timeSeriesServiceResponse = {
                "tags": [
                    {
                        "name": "Tag1234",
                        "results": [
                            {
                                "datapoints": [
                                    [1, 2, 'good'],
                                    [3, 4, 'bad']
                                ]
                            }
                        ]
                    }
                ]
            };

            var expectedFormat = [
                {
                    name: 'Tag1234',
                    data: [
                        {x: 1, y: 2},
                        {x: 3, y: 4}
                    ]
                }
            ];

            expect(predixTimeSeriesTransformer.transform(timeSeriesServiceResponse.tags)).toEqual(expectedFormat);
        });

        it('should transform 1 tag group by quality into 2 series', function () {
            var timeSeriesServiceResponse = {
                "tags": [
                    {
                        "name": "Tag1234",
                        "results": [
                            {
                                "groups": [
                                    {
                                        "name": "quality1",
                                        "values": [
                                            "good1", "good2", "good3"
                                        ]
                                    },
                                    {
                                        "name": "quality2",
                                        "values": [
                                            "good1", "good2", "good3"
                                        ]
                                    }
                                ],
                                "datapoints": [
                                    [1, 2],
                                    [3, 4]
                                ]
                            },
                            {
                                "groups": [
                                    {
                                        "name": "quality",
                                        "values": [
                                            "bad"
                                        ]
                                    }
                                ],
                                "datapoints": [
                                    [9, 10],
                                    [12, 14]
                                ]
                            }
                        ]
                    }
                ]
            };

            var expectedFormat = [
                {
                    name: 'Tag1234_quality1_good1_good2_good3_quality2_good1_good2_good3',
                    data: [
                        {x: 1, y: 2},
                        {x: 3, y: 4}
                    ]
                },
                {
                    name: 'Tag1234_quality_bad',
                    data: [
                        {x: 9, y: 10},
                        {x: 12, y: 14}
                    ]
                }
            ];

            expect(predixTimeSeriesTransformer.transform(timeSeriesServiceResponse.tags)).toEqual(expectedFormat);
        });

        it('should transform 2 tags 2 group by quality into 4 series', function () {
            var timeSeriesServiceResponse = {
                "tags": [
                    {
                        "name": "Tag1234",
                        "results": [
                            {
                                "groups": [
                                    {
                                        "name": "quality",
                                        "values": [
                                            "good"
                                        ]
                                    }
                                ],
                                "datapoints": [
                                    [1, 2],
                                    [3, 4]
                                ]
                            },
                            {
                                "groups": [
                                    {
                                        "name": "quality",
                                        "values": [
                                            "bad"
                                        ]
                                    }
                                ],
                                "datapoints": [
                                    [9, 10],
                                    [12, 14]
                                ]
                            }
                        ]
                    },
                    {
                        "name": "Tag5678",
                        "results": [
                            {
                                "groups": [
                                    {
                                        "name": "quality",
                                        "values": [
                                            "good"
                                        ]
                                    }
                                ],
                                "datapoints": [
                                    [11, 12],
                                    [13, 14]
                                ]
                            },
                            {
                                "groups": [
                                    {
                                        "name": "quality",
                                        "values": [
                                            "bad"
                                        ]
                                    }
                                ],
                                "datapoints": [
                                    [19, 110],
                                    [112, 114]
                                ]
                            }
                        ]
                    }
                ]
            };

            var expectedFormat = [
                {
                    name: 'Tag1234_quality_good',
                    data: [
                        {x: 1, y: 2},
                        {x: 3, y: 4}
                    ]
                },
                {
                    name: 'Tag1234_quality_bad',
                    data: [
                        {x: 9, y: 10},
                        {x: 12, y: 14}
                    ]
                },
                {
                    name: 'Tag5678_quality_good',
                    data: [
                        {x: 11, y: 12},
                        {x: 13, y: 14}
                    ]
                },
                {
                    name: 'Tag5678_quality_bad',
                    data: [
                        {x: 19, y: 110},
                        {x: 112, y: 114}
                    ]
                }
            ];

            expect(predixTimeSeriesTransformer.transform(timeSeriesServiceResponse.tags)).toEqual(expectedFormat);
        });

        it('when result array is empty, returns an empty array', function () {
            var expectedFormat = [];
            var timeSeriesTagArray = [
                {
                    name: '123',
                    results: []
                }
            ];
            expect(predixTimeSeriesTransformer.transform(timeSeriesTagArray)).toEqual(expectedFormat);
        });

        it('outputs an empty array if input array has no elements', function () {
            expect(predixTimeSeriesTransformer.transform([])).toEqual([]);
        });

        function expectThrowsError(rawData) {
            try {
                predixTimeSeriesTransformer.transform(rawData);
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

            it('when tag object does not have name property', function () {
                expectThrowsError([
                    {
                        results: [
                            {datapoints: []}
                        ]
                    }
                ]);
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

            it('when result array object does not have values property', function () {
                expectThrowsError([
                    {
                        results: [
                            {name: 'My Series'}
                        ]
                    }
                ]);
            });

            it('when result values is not an array', function () {
                expectThrowsError([
                    {
                        name: 'My Name',
                        results: [
                            {datapoints: 'Bad Values'}
                        ]}
                ]);
            });

            it('when point does not have 2 items in the array', function () {
                try {
                    predixTimeSeriesTransformer.transform([
                        {
                            name: 'My Name',
                            results: [
                                {datapoints: [
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
    describe('With custom getSeriesName option', function(){
        it('can get my own series name', function(){


            var predixTimeSeriesTransformer1 = new px.timeseries.dataTransformer({
                getSeriesName: function (tagname, groups) {
                    return tagname + "_group_name1";
                }
            });

            var predixTimeSeriesTransformer2 = new px.timeseries.dataTransformer({
                getSeriesName: function (tagname, groups) {
                    return tagname + "_group_name2";
                }
            });

            var timeSeriesServiceResponse = {
                "tags": [
                    {
                        "name": "Tag1234",
                        "results": [
                            {
                                "groups": [
                                    {name: "123"}
                                ],
                                "datapoints": [
                                    [1, 2],
                                    [3, 4]
                                ]
                            }
                        ]
                    }
                ]
            };

            var expectedFormat1 = [
                {
                    name: 'Tag1234_group_name1',
                    data: [
                        {x: 1, y: 2},
                        {x: 3, y: 4}
                    ]
                }
            ];

            var expectedFormat2 = [
                {
                    name: 'Tag1234_group_name2',
                    data: [
                        {x: 1, y: 2},
                        {x: 3, y: 4}
                    ]
                }
            ];

            expect(predixTimeSeriesTransformer1.transform(timeSeriesServiceResponse.tags)).toEqual(expectedFormat1);
            expect(predixTimeSeriesTransformer2.transform(timeSeriesServiceResponse.tags)).toEqual(expectedFormat2);
        });
    });
});