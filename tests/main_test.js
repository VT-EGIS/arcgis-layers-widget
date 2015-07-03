define([
  'intern!object',
  'intern/chai!assert',
  'intern/order!node_modules/sinon/lib/sinon',
  'layersWidget',
  'tests/stubs/esri/layers/FeatureLayer',
  'dojo/query',
  'tests/test_data/dynamic_map_service_data',
  'tests/stubs/esri/layers/ArcGISDynamicMapServiceLayer',
  'dojo/NodeList-manipulate'
], function (registerSuite, assert, sinon, LayersWidget, FeatureLayer,
             dojoQuery, layerInfos, ArcGISDynamicMapServiceLayer) {
  registerSuite({
    name: 'Layers Widget',

    'Must take an array': function () {
      var createWidget, layers;

      createWidget = function () {
        new LayersWidget({ layers: layers });
      };

      assert.throw(createWidget, Error, 'The option "layers" is required');
      layers = [];
      assert.doesNotThrow(createWidget, Error);
    },

    'Should add feature layers as layer items': function () {
      var widget;

      widget = new LayersWidget({ layers: [new FeatureLayer({id: 'layer1'})] });

      assert.equal(widget.getChildren().length, 1);
      assert.strictEqual(dojoQuery(widget.getChildren()[0].domNode).text(), 'Layer1');
    },

    'should reflect the tree structure of the layers in a map service': function () {
      var widget, dynamicServiceLayer;

      dynamicServiceLayer = new ArcGISDynamicMapServiceLayer({ layerInfos: layerInfos });
      widget = new LayersWidget({ layers: [dynamicServiceLayer]});

      assert.strictEqual(widget.getChildren().length, 1);

      assert.strictEqual(widget.getChildren()[0].getChildren().length, 1);

      assert.strictEqual(widget.getChildren()[0].getChildren()[0].getChildren().length, 3);

      assert.strictEqual(widget.getChildren()[0].getChildren()[0].getChildren()[0]
          .getChildren().length, 1);
      assert.strictEqual(widget.getChildren()[0].getChildren()[0].getChildren()[0]
          .getChildren()[0].getChildren().length, 2);
      assert.strictEqual(widget.getChildren()[0].getChildren()[0].getChildren()[0]
          .getChildren()[0].getChildren()[0].getChildren().length, 0);
      assert.strictEqual(widget.getChildren()[0].getChildren()[0].getChildren()[0]
          .getChildren()[0].getChildren()[1].getChildren().length, 0);

      assert.strictEqual(widget.getChildren()[0].getChildren()[0].getChildren()[1]
          .getChildren().length, 1);
      assert.strictEqual(widget.getChildren()[0].getChildren()[0].getChildren()[1]
          .getChildren()[0].getChildren().length, 2);
      assert.strictEqual(widget.getChildren()[0].getChildren()[0].getChildren()[1]
          .getChildren()[0].getChildren()[0].getChildren().length, 0);
      assert.strictEqual(widget.getChildren()[0].getChildren()[0].getChildren()[1]
          .getChildren()[0].getChildren()[1].getChildren().length, 0);

      assert.strictEqual(widget.getChildren()[0].getChildren()[0].getChildren()[2]
          .getChildren().length, 0);
    },

    'should replace active group layers with their children in the service': function () {
      var widget, dynamicServiceLayer;

      dynamicServiceLayer = new ArcGISDynamicMapServiceLayer({ layerInfos: layerInfos });
      widget = new LayersWidget({ layers: [dynamicServiceLayer]});
      assert.strictEqual(dynamicServiceLayer.visibleLayers.length, 5);
      assert.includeMembers(dynamicServiceLayer.visibleLayers, [2, 3, 5, 6, 7]);
    }
  });
});
