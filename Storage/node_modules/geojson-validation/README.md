GeoJSON-Validation
==================

**A GeoJSON Validation Library**  
Check JSON objects to see whether or not they are valid GeoJSON. Validation is based off of the [GeoJSON Format Specification revision 1.0](http://geojson.org/geojson-spec.html#geojson-objects)

## Installation
`npm install geojson-validation`

## Functions
All Function return a boolean and take a JSON object that will be evalatued to see if it is a GeoJSON object, with the exception of [define](#definetype-function).  

**Arguments**  
* geoJSON - a JSON object that is tested to see if it is a valid GeoJSON object
* callback(boolean, errors) - `errors` is an array of validation errors for an invalid JSON object 

### valid(geoJSON, callback)  
**Alias:** isGeoJSONObject  
Checks if an object is a [GeoJSON Object](http://geojson.org/geojson-spec.html#geojson-objects).

### isGeoJSONObject(geoJSON, callback)
Checks if an object is a [GeoJSON Object](http://geojson.org/geojson-spec.html#geojson-objects).

### isGeometryObject(geoJSON, callback)
Checks if an object is a [Geometry Object](http://geojson.org/geojson-spec.html#geometry-objects)

### isPosition(array, callback)
Checks if an array is a [Position](http://geojson.org/geojson-spec.html#positions)

### isPoint(geoJSON, callback)
Checks if an object is a [Point](http://geojson.org/geojson-spec.html#point)

### isMultiPointCoor(array, callback)
Checks if an array can be interperted as coordinates for a MultiPoint

### isMultiPoint(geoJSON, callback)
Checks if an object is a [MultiPoint](http://geojson.org/geojson-spec.html#multipoint)

### isLineStringCoor(array, callback)
Checks if an array can be interperted as coordinates for a LineString

### isLineString(geoJSON, callback)
Checks if an object is a [Line String](http://geojson.org/geojson-spec.html#linestring)

### isMultiLineStringCoor(array, callback)
Checks if an array can be interperted as coordinates for a MultiLineString

### isMultiLineString(geoJSON, callback)
Checks if an object is a [MultiLine String](http://geojson.org/geojson-spec.html#multilinestring)

### isPolygonCoor(array, callback)
Checks an array can be interperted as coordinates for a Polygon

### isPolygon(geoJSON, callback)
Checks if an object is a [Polygon](http://geojson.org/geojson-spec.html#polygon)

### isMultiPolygonCoor(array, callback)
Checks if an array can be interperted as coordinates for a MultiPolygon

### isMultiPolygon(geoJSON, callback)
Checks if an object is a [MultiPolygon](http://geojson.org/geojson-spec.html#multipolygon)

### isGeometryCollection(geoJSON, callback)
Checks if an object is a [Geometry Collection](http://geojson.org/geojson-spec.html#geometry-collection)

### isFeature(geoJSON, callback)
Checks if an object is a [Feature Object](http://geojson.org/geojson-spec.html#feature-objects)

### isFeatureCollection(geoJSON, callback)
Checks if an object is a [Feature Collection Object](http://geojson.org/geojson-spec.html#feature-collection-objects)

### isBbox(array, callback)
Checks if an object is a [Bounding Box](http://geojson.org/geojson-spec.html#bounding-boxes)

### Define(type, function)
Define a Custom Validation for the give `type`. `type` can be "Feature", "FeatureCollection", "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Bbox", "Position", "GeoJSON" or "GeometryObject". 

The `function` is passed the `object` being validated and should return a `string` or an `array` of  strings representing errors. If there are no errors then the function should not return anything or an empty array. See the [example](#define-example) for more.

## Example
```javascript
GJV = require("geojson-validation");

var validFeatureCollection = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
            "properties": {"prop0": "value0"}
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                ]
            },
            "properties": {
                "prop0": "value0",
                "prop1": 0.0
            }
        }
    ]
};

//simple test
if(GJV.valid(validFeatureCollection)){
    console.log("this is valid GeoJSON!");
}

var invalidFeature =  {
    "type": "feature",
    "geometry": {
        "type": "LineString",
        "coordinates": [
            [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
        ]
    },
    "properties": {
        "prop0": "value0",
        "prop1": 0.0
    }
};

//test to see if `invalidFeature` is valid
GJV.isFeature(invalidFeature, function(valid, errs){
    //log the errors
    if(!valid){
    console.log(errs);
    }
});
```

## Define Example
Shout out to [@VitoLau](https://github.com/VitoLau>) for the code! Thanks!
```javascript
GJV = require("geojson-validation");

GJV.define("Position", function(position){
    //the postion must be valid point on the earth, x between -180 and 180
    errors = [];
    if(position[0] < -180 || position[0] > 180){
        errors.push("the x must be between -180 and 180");
    }
    if(position[1] < -90 || position[1] > 90){
        errors.push("the y must be between -90 and 90");
    }
    return errors;

});

gj = {type: "Point", coordinates: [-200,3]};
//returns false
GJV.isPoint(gj);
```

## Testing
To run tests `npm test`   
Test use mocha

## Cavets
* Does not check ordering of Bouding Box coordinates
* Does not check Coordinate Reference System Objects
* Does not check order of rings for polygons with multiple rings
