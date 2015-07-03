define([
  'intern!object',
  'intern/chai!assert',
  'intern/order!node_modules/sinon/lib/sinon',
  'layersWidget/dynamic_service_visibility_controller',
  'tests/stubs/esri/layers/ArcGISDynamicMapServiceLayer'
], function (registerSuite, assert, sinon, DSVisibilityCtrl, ArcGISDynamicMapServiceLayer) {
  registerSuite({
    name: 'DSVisibilityCtrl',

    'Must take a dynamic map service': function () {
      var createVC, layer;

      createVC = function () {
        new DSVisibilityCtrl(layer);
      };

      assert.throw(createVC, Error, 'Argument "layer" is missing');
      layer = new ArcGISDynamicMapServiceLayer();
      assert.doesNotThrow(createVC, Error);
    },

    'showLayer must uniquely add layer id to visible layers': function () {
      var visibilityCtrl, layer;

      layer = new ArcGISDynamicMapServiceLayer();
      layer.setVisibleLayers([1, 2, 3]);
      visibilityCtrl = new DSVisibilityCtrl(layer);

      visibilityCtrl.showLayer({ layerId: 1 });

      assert.deepEqual(layer.visibleLayers, [1, 2, 3]);

      visibilityCtrl.showLayer({ layerId: 4 });

      assert.deepEqual(layer.visibleLayers, [1, 2, 3, 4]);
    },

    'hideLayer must remove layer id from visible layers': function () {
      var visibilityCtrl, layer;

      layer = new ArcGISDynamicMapServiceLayer();
      layer.setVisibleLayers([1, 2, 3]);
      visibilityCtrl = new DSVisibilityCtrl(layer);

      visibilityCtrl.hideLayer({ layerId: 4 });

      assert.deepEqual(layer.visibleLayers, [1, 2, 3]);

      visibilityCtrl.hideLayer({ layerId: 1 });

      assert.deepEqual(layer.visibleLayers, [2, 3]);
    },
  });
});
