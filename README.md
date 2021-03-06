Usage
-----

**JavaScript**
```javascript
require([
  ...
  'layersWidget'
], function (..., Layers) {
  ...
  var layersWidget = new Layers({
    layers: layersList,
    onLayerOn: function (layerName) {
     ...
    },
    onLayerOff: function (layerName) {
     ...
    },
    'class': 'layers-list' //This class is going to be applied to all ul elements (even nested ones)
  }, 'id-of-widget');
  ...
}); 
```

* The `layersList` is an array of esri layers. For now only FeatureLayer and ArcGISDynamicMapServiceLayer types are supported.
* The `id` of the layer is used as the label.
* To hide a layer at the start, set the `hideOnStartup` flag of the layer to true.
* onLayerOn will be called when a user clicks on one of the deactivated layers in the list to turn it on.
* onLayerOff will be called when a user clicks on one of the activated layers in the list to turn it off.

**Basic CSS Styling**
```css
.layers-list {
  list-style-type: none;
}

.hidden-layer, .hidden-layer:active, .hidden-layer:visited{
  color: #888;
}
```

Feel free to apply styles that you prefer. The classes that need to be overridden are

* .hidden-layer
* .visible-layer

For a complete example, please see the [example directory](http://vt-egis.github.io/arcgis-layers-widget/) in the source repository.

Demo
----
Check out the working example [here](http://vt-egis.github.io/arcgis-layers-widget/)
