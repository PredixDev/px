'use strict';

describe('polymer property to attribute test', function () {
    it('can convert camelcase name to slug name', function () {
        var attr = px.slugify('myProperty');
        expect(attr).toBe('my-property');
    });

    it('when all lower case will not convert', function () {
        var attr = px.slugify('myproperty');
        expect(attr).toBe('myproperty');
    });

    it('when all upper case will convert to all lowercase', function () {
        var attr = px.slugify('MYPROPERTY');
        expect(attr).toBe('myproperty');
    });

    it('when all upper case will convert to all lowercase', function () {
        var attr = px.slugify('MyProperty');
        expect(attr).toBe('my-property');
    });
});


