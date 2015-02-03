define([
  'dojo/_base/declare'
], function (declare) {
  return declare([], {
    constructor: function (parentLayer) {
      this._parentLayer = parentLayer;
    },

    showLayer: function (view) {
      var visibleLayers;

      visibleLayers = this._parentLayer.visibleLayers;
      //show if not already shown
      if(visibleLayers.indexOf(view.id) === -1) {
        this._parentLayer.setVisibleLayers([].concat(visibleLayers, view.id));
      }
    },

    hideLayer: function (view) {
      var index, visibleLayers;

      visibleLayers = this._parentLayer.visibleLayers;
      index = visibleLayers.indexOf(view.id);
      //hide if not already hidden
      if(index !== -1) {
        visibleLayers.splice(index, 1)
        this._parentLayer.setVisibleLayers(visibleLayers);
      }
    }
  });
});
