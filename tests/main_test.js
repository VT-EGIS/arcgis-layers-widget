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
  var createFixture, clickEvent;

  clickEvent = function () {
    var evt;

    evt = document.createEvent('MouseEvent');
    evt.initMouseEvent('click', true, false);
    return evt;
  };

  createFixture = function (id) {
    var body, div;

    div = document.createElement('div');
    div.id = id;
    body = document.getElementsByTagName('body')[0];
    body.appendChild(div);
    return div;
  };

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
    },

    'should honor the hideOnStartup flag': {
      'dynamicServiceLayer': function () {
        var widget, dynamicServiceLayer;

        dynamicServiceLayer = new ArcGISDynamicMapServiceLayer({ layerInfos: layerInfos });
        dynamicServiceLayer.hideOnStartup = true;
        widget = new LayersWidget({ layers: [dynamicServiceLayer]});
        assert.strictEqual(dynamicServiceLayer.visibleLayers.length, 0);
        assert.includeMembers(dynamicServiceLayer.visibleLayers, []);
      },

      'featurelayer': function () {
        var widget, stub, flayer1, flayer2;

        flayer1 = new FeatureLayer({id: 'layer1'});
        flayer1.hideOnStartup = true;
        flayer2 = new FeatureLayer({id: 'layer2'});
        stub = sinon.stub(FeatureLayer.prototype, 'setVisibility');
        widget = new LayersWidget({ layers: [flayer1, flayer2] });
        assert(stub.calledOnce);
        assert(stub.calledWith(false));
        stub.restore();
      }
    },

    'calls the onLayerOn callback when a hidden layer is activated': function () {
      var widget, flayer, dynamicServiceLayer, fixture, dfd;

      dfd = this.async(1000);
      fixture = createFixture('layers-widget');
      flayer = new FeatureLayer({id: 'layer1'});
      dynamicServiceLayer = new ArcGISDynamicMapServiceLayer({ layerInfos: layerInfos });
      widget = new LayersWidget({ 
        layers : [flayer, dynamicServiceLayer],
        onLayerOn: sinon.stub(),
        onLayerOff: sinon.stub(),
      }, 'layers-widget');
      dojoQuery('a')[0].dispatchEvent(clickEvent());
      dojoQuery('a')[3].dispatchEvent(clickEvent());
      setTimeout(dfd.callback(function () {
        var args;

        assert(widget.onLayerOff.calledTwice);
        args = widget.onLayerOff.getCall(0).args;
        assert.lengthOf(args, 1);
        assert.strictEqual(args[0], 'layer1');
        args = widget.onLayerOff.getCall(1).args;
        assert.lengthOf(args, 1);
        assert.strictEqual(args[0], 'layer-2');
        widget.destroy();
        fixture.remove(); 
      }), 100);
    },

    'calls the onLayerOff callback when a visible layer is deactivated': function () {
      var widget, flayer, dynamicServiceLayer, fixture, dfd;

      dfd = this.async(1000);
      fixture = createFixture('layers-widget');
      flayer = new FeatureLayer({id: 'layer1'});
      flayer.hideOnStartup = true
      dynamicServiceLayer = new ArcGISDynamicMapServiceLayer({ layerInfos: layerInfos });
      dynamicServiceLayer.hideOnStartup = true;
      widget = new LayersWidget({ 
        layers : [flayer, dynamicServiceLayer],
        onLayerOn: sinon.stub(),
        onLayerOff: sinon.stub(),
      }, 'layers-widget');
      dojoQuery('a')[0].dispatchEvent(clickEvent());
      dojoQuery('a')[3].dispatchEvent(clickEvent());
      setTimeout(dfd.callback(function () {
        var args;

        assert(widget.onLayerOn.calledTwice);
        args = widget.onLayerOn.getCall(0).args;
        assert.lengthOf(args, 1);
        assert.strictEqual(args[0], 'layer1');
        args = widget.onLayerOn.getCall(1).args;
        assert.lengthOf(args, 1);
        assert.strictEqual(args[0], 'layer-2');
        widget.destroy();
        fixture.remove(); 
      }), 100);
    }
  });
});
