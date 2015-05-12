(function(){
    
    window.px = window.px || {};

    function makePoint(item) {
        if (item && item.length === 2){
            return {x: item[0], y: item[1]};
        }
        throw new Error('Invalid time series point format');
    }

    function makeSeries(result) {
        if(result.name && result.values && result.values.constructor === Array) {
            var values = result.values;
            var data = values.map(makePoint);
            return {name: result.name, data: data};
        }
        throw new Error('Invalid time series data format');
    }

    function transform(rawData) {
        if (rawData && rawData.constructor === Array){
            var result = [];
            rawData.forEach(function(query){
                if(query.results && query.results.constructor === Array) {
                    result = result.concat(query.results.map(makeSeries));
                }
                else {
                    throw new Error('Invalid time series data format');
                }
            });
            return result;
        }
        throw new Error('Invalid time series data format');
    }

    window.px.timeseries = window.px.timeseries || {};
    window.px.timeseries.adapter = window.px.timeseries.adapter || {};
    window.px.timeseries.adapter.kairosdb = window.px.timeseries.adapter.kairosdb || {};
    
    window.px.timeseries.adapter.kairosdb = {
        transform : transform
    };
})();
    

