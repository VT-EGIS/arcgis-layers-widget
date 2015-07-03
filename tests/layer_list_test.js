define([
  'intern!object',
  'intern/chai!assert',
  'intern/order!node_modules/sinon/lib/sinon',
  'dojo/query',
  'dojo/dom-class',
  'dojo/_base/array',
  'layersWidget/layer_list',
  'layersWidget/layer_item',
  'dojo/NodeList-manipulate',
], function (registerSuite, assert, sinon, dojoQuery, domClass,
             array, LayerList, LayerItem) {
  var createFixture;

  createFixture = function () {
    var body, div;

    div = document.createElement('div');
    div.id = 'layer-list';
    body = document.getElementsByTagName('body')[0];
    body.appendChild(div);
  };

  registerSuite({
    name: 'LayerList',

    'activate should trigger a cascading activate on each child': function () {
      var list, children, stubs;

      list = new LayerList();
      children = [
        new LayerItem({ name: 'layer item'}),
        new LayerItem({ name: 'layer item'}),
        new LayerItem({ name: 'layer item'})
      ];
      stubs = [];

      children.forEach(function (child) {
        stubs.push(sinon.stub(child, 'activate'));
        list.addChild(child);
      });

      list.activate();

      stubs.forEach(function (stub) {
        assert(stub.calledWith(true));
        stub.restore();
      });
    },

    'deactivate should trigger a cascading deactivate on each child': function () {
      var list, children, stubs;

      list = new LayerList();
      children = [
        new LayerItem({ name: 'layer item'}),
        new LayerItem({ name: 'layer item'}),
        new LayerItem({ name: 'layer item'})
      ];
      stubs = [];

      children.forEach(function (child) {
        stubs.push(sinon.stub(child, 'deactivate'));
        list.addChild(child);
      });

      list.deactivate();

      stubs.forEach(function (stub) {
        assert(stub.calledWith(true));
        stub.restore();
      });

    },

    'should update its state when a child is clicked': function () {
      var list, child, stub;
      
      createFixture();
      list = new LayerList({}, 'layer-list');
      child = new LayerItem({ name: 'layer item' });
      list.addChild(child);
      stub = sinon.stub(LayerList.prototype, 'updateVisibility');

      child.domNode.click();

      assert(stub.calledOnce);

      stub.restore();
      list.destroy();
    }
  });
});
