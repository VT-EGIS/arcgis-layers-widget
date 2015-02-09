define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  './layer_item',
  './layer_list',
  'dijit/_Container',
  'dojo/_base/array',
  'dojo/_base/lang',
  './feature_layer_visibility_controller',
  './dynamic_layer_visibility_controller'
], function (declare, _WidgetBase, _TemplatedMixin,
             LayerItem, LayerList, _Container, array, lang,
             FLVisibilityCtrl, DLVisibilityCtrl) {

  return declare([_WidgetBase, _TemplatedMixin, _Container], {
    templateString: '<ul></ul>',

    postCreate: function () {
      array.map(this.layers, lang.hitch(this, 'processLayer'));
    },

    processLayer: function (layer) {
      var visited, visibilityCtrl;

      if(layer.layerInfos) {
        visited = [];
        visibilityCtrl = new DLVisibilityCtrl(layer);
        for(var i = 0; i < layer.layerInfos.length; i++) {
          this.traverseLayerHierarchy(layer.layerInfos, i, visited, layer, this, visibilityCtrl);
        }
      } else {
        this.addChild(new LayerItem({
          name: layer.id,
          active: layer.defaultVisibility,
          visibilityCtrl: new FLVisibilityCtrl(layer)
        }));
      }
    },

    hasChildren: function (layerInfo) {
      return layerInfo.subLayerIds && layerInfo.subLayerIds.length > 0;
    },

    //DFS
    traverseLayerHierarchy: function (layerInfos, index, visited, parentLayer,
                                      list, visibilityCtrl, parentVisibility) {
      var layerInfo, newListItem, subList, isGroupLayer, active;

      if(visited[index]) { return; }

      layerInfo = layerInfos[index];
      isGroupLayer = this.hasChildren(layerInfo);

      if(isGroupLayer) {
        active = false;
        visibilityCtrl.hideLayer({ layerId: layerInfo.id });
      } else if(parentVisibility === true) {
        active = true;
        visibilityCtrl.showLayer({ layerId: layerInfo.id });
      } else {
        active = layerInfo.defaultVisibility;
      }

      visited[index] = true;

      newListItem = new LayerItem({
        name: layerInfo.name || layerInfo.id,
        layerId: layerInfo.id,
        active: active,
        visibilityCtrl: visibilityCtrl
      });
      list.addChild(newListItem);

      if(isGroupLayer) {
        subList = new LayerList({ 'class': this['class'] });
        newListItem.addChild(subList);

        for(var i = 0; i < layerInfo.subLayerIds.length; i++) {
          this.traverseLayerHierarchy(layerInfos, layerInfo.subLayerIds[i],
                                 visited, parentLayer, subList, visibilityCtrl,
                                 layerInfo.defaultVisibility); 
        }
        subList.updateVisibility();
        newListItem.updateVisibility();
      }
    }
  });
});
