define([
  'intern!object',
  'intern/chai!assert',
  'intern/order!node_modules/sinon/lib/sinon',
  'layersWidget/feature_layer_visibility_controller',
  'tests/stubs/esri/layers/FeatureLayer'
], function (registerSuite, assert, sinon, FLVisibilityCtrl, FeatureLayer) {
  registerSuite({
    name: 'FLVisibilityCtrl',

    'Must take a feature layer': function () {
      var createFLVC, layer;

      createFLVC = function () {
        new FLVisibilityCtrl(layer);
      };

      assert.throw(createFLVC, Error, 'Argument "layer" is missing');
      layer = new FeatureLayer();
      assert.doesNotThrow(createFLVC, Error);
    },

    'showLayer must set layer visibility to true': function () {
      var visibilityCtrl, featureLayer, stub;

      featureLayer = new FeatureLayer();
      stub = sinon.stub(featureLayer, 'setVisibility');
      visibilityCtrl = new FLVisibilityCtrl(featureLayer);
      visibilityCtrl.showLayer();
      assert(stub.calledOnce);
      assert(stub.calledWith(true));
    },

    'hideLayer must set layer visibility to false': function () {
      var visibilityCtrl, featureLayer, stub;

      featureLayer = new FeatureLayer();
      stub = sinon.stub(featureLayer, 'setVisibility');
      visibilityCtrl = new FLVisibilityCtrl(featureLayer);
      visibilityCtrl.hideLayer();
      assert(stub.calledOnce);
      assert(stub.calledWith(false));
    }
  });
});
