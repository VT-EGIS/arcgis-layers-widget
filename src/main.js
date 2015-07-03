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
  './dynamic_service_visibility_controller'
], function (declare, _WidgetBase, _TemplatedMixin, LayerItem, LayerList,
             _Container, array, lang, FLVisibilityCtrl, DSVisibilityCtrl) {

  return declare([_WidgetBase, _TemplatedMixin, _Container], {
    templateString: '<ul></ul>',

    postCreate: function () {
      if(!(this.layers && (this.layers instanceof Array))) {
        throw new Error('The option "layers" is required');
      }
      array.map(this.layers, lang.hitch(this, 'processLayer'));
    },

    processLayer: function (layer) {
      var visited, visibilityCtrl, visibility;

      // A dynamic map service
      if(layer.layerInfos) {
        visited = [];
        visibilityCtrl = new DSVisibilityCtrl(layer);
        visibility = layer.hideOnStartup === true ? false : undefined;
        array.forEach(layer.layerInfos, lang.hitch(this, function (layerInfo, index) {
          this.traverseLayerHierarchy(layer.layerInfos,
                                      index,
                                      visited,
                                      this,
                                      visibilityCtrl,
                                      visibility);
        }));
      // A feature layer
      } else {
        if(layer.hideOnStartup) { layer.hide(); }
        this.addChild(new LayerItem({
          name: layer.id,
          active: layer.hideOnStartup ? false : layer.defaultVisibility,
          visibilityCtrl: new FLVisibilityCtrl(layer),
          onLayerOn: this.onLayerOn,
          onLayerOff: this.onLayerOff
        }));
      }
    },

    hasChildren: function (layerInfo) {
      return layerInfo.subLayerIds && layerInfo.subLayerIds.length > 0;
    },

    // DFS
    traverseLayerHierarchy: function (layerInfos, index, visited,
                                      list, visibilityCtrl, parentVisibility) {
      var layerInfo, newListItem, subList, isGroupLayer, active, visibility;

      if(visited[index]) { return; }

      layerInfo = layerInfos[index];
      isGroupLayer = this.hasChildren(layerInfo);

      // If the group layer is visible then hide it and
      // make all of its children visible instead
      // Or if the configuration specifies hideOnStartup then hide it
      if(isGroupLayer || parentVisibility === false) {
        active = false;
        visibilityCtrl.hideLayer({ layerId: layerInfo.id });
      } else if(parentVisibility === true) {
        active = true;
        visibilityCtrl.showLayer({ layerId: layerInfo.id });
      // Otherwise just use the default visibility (parentVisibility is undefined)
      } else {
        active = layerInfo.defaultVisibility;
      }

      visited[index] = true;

      newListItem = new LayerItem({
        name: layerInfo.name || layerInfo.id,
        layerId: layerInfo.id,
        active: active,
        visibilityCtrl: visibilityCtrl,
        onLayerOn: this.onLayerOn,
        onLayerOff: this.onLayerOff
      });
      list.addChild(newListItem);

      // Recurse down the tree
      if(isGroupLayer) {
        subList = new LayerList({ 'class': this['class'] });
        newListItem.addChild(subList);

        visibility = parentVisibility ? parentVisibility : layerInfo.defaultVisibility;
        
        array.forEach(layerInfo.subLayerIds, lang.hitch(this, function (id, index) {
          this.traverseLayerHierarchy(layerInfos, layerInfo.subLayerIds[index],
                                      visited, subList, visibilityCtrl,
                                      visibility);
        }));

        // After all children have been processed, update the visibility of parent
        // ul and parent li
        subList.updateVisibility();
        newListItem.updateVisibility();
      }
    }
  });
});
