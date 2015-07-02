define([
  'dojo/_base/declare',
  'esri/map',
  'app/config',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dijit/Dialog',
  'dojo/query',
  'layersWidget',
  'esri/layers/ArcGISDynamicMapServiceLayer',
], function (declare, map, config, array, lang, Dialog, query, Layers,
             ArcGISDynamicMapServiceLayer) {

  return declare([], {
    constructor: function () {
      this.map = new map('map', config.map);
      this.layers = [];
      this.map.on('layers-add-result', lang.hitch(this, 'addLayersWidget')); 
      this.addLayers();
    },

    addLayers: function () {
      this.layers = array.map(config.layerInfos, function (layerInfo) {
        layerInfo.layer = new ArcGISDynamicMapServiceLayer(layerInfo.url, layerInfo);
        layerInfo.layer.hideOnStartup = layerInfo.hideOnStartup;
        return layerInfo.layer;
      });
      this.map.addLayers(this.layers);
    },

    addLayersWidget: function () {
      this.layersWidget = new Layers({
        layers: this.layers,
        'class': 'layers-list'
      });

      this.layersDialog = new Dialog({
        title: 'Layers',
        content: this.layersWidget,
        id: 'layers-dialog'
      });

      query('#layers').on('click', lang.hitch(this, function (evt) {
        this.layersDialog.show();
      }));
    },
  });
});
