define([
  'dojo/_base/declare',
  'esri/layers/FeatureLayer'
], function (declare, FeatureLayer) {
  return declare([], {
    constructor: function (layer) {
      if(!(layer && layer instanceof FeatureLayer)) {
        throw new Error('Argument "layer" is missing');
      }
      this._layer = layer;
    },

    showLayer: function () {
      this._layer.setVisibility(true); 
    },

    hideLayer: function () {
      this._layer.setVisibility(false);
    }
  });
});
