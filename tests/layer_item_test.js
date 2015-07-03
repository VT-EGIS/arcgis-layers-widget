define([
  'intern!object',
  'intern/chai!assert',
  'intern/order!node_modules/sinon/lib/sinon',
  'layersWidget/layer_item',
  'dojo/query',
  'dojo/dom-class',
  'dojo/_base/array',
  'layersWidget/layer_list',
  'dojo/NodeList-manipulate',
], function (registerSuite, assert, sinon, LayerItem, dojoQuery,
             domClass, array, LayerList) {
  var visibilityCtrl, createFixture;

  visibilityCtrl = {
    showLayer: function () {},
    hideLayer: function () {}
  };

  createFixture = function () {
    var body, div;

    div = document.createElement('div');
    div.id = 'layer-item';
    body = document.getElementsByTagName('body')[0];
    body.appendChild(div);
  };

  registerSuite({
    name: 'LayerItem',

    'Should capitalize the name': function () {
      var item;

      item = new LayerItem({ name: 'abc' });
      assert.strictEqual(dojoQuery(item.domNode).text(), 'Abc');
    },

    'activate should not update layer visibility when update flag is false': function () {
      var item, stub;

      stub = sinon.stub(visibilityCtrl, 'showLayer');
      item = new LayerItem({ name: 'abc', visibilityCtrl: visibilityCtrl });

      item.activate(false);

      sinon.assert.notCalled(stub);

      stub.restore();
    },

    'deactivate should not update layer visibility when update flag is false': function () {
      var item, stub;

      stub = sinon.stub(visibilityCtrl, 'hideLayer');
      item = new LayerItem({ name: 'abc', visibilityCtrl: visibilityCtrl });

      item.deactivate(false);

      sinon.assert.notCalled(stub);

      stub.restore();
    },

    'activate should update layer visibility when flag is true and not a group layer': function () {
      var item, stub;

      stub = sinon.stub(visibilityCtrl, 'showLayer');
      item = new LayerItem({ name: 'abc', visibilityCtrl: visibilityCtrl });

      item.activate(true);

      assert(stub.calledOnce);

      stub.restore();
    },

    'deactivate should update layer visibility when flag is true and not a group layer': function () {
      var item, stub;

      stub = sinon.stub(visibilityCtrl, 'hideLayer');
      item = new LayerItem({ name: 'abc', visibilityCtrl: visibilityCtrl });

      item.deactivate(true);

      assert(stub.calledOnce);

      stub.restore();
    },

    'activate should not update layer visibility if it is a parent and flag is true': function () {
      var item, children, stub;

      stub = sinon.stub(visibilityCtrl, 'showLayer');
      item = new LayerItem({ name: 'abc', visibilityCtrl: visibilityCtrl });
      children = [ new LayerList(), new LayerList(), new LayerList() ];
      array.forEach(children, function (child) { item.addChild(child); });

      item.activate(true);

      sinon.assert.notCalled(stub);

      stub.restore();
    },

    'deactivate should not update layer visibility if it is a parent and flag is true': function () {
      var item, children, stub;

      stub = sinon.stub(visibilityCtrl, 'hideLayer');
      item = new LayerItem({ name: 'abc', visibilityCtrl: visibilityCtrl });
      children = [ new LayerList(), new LayerList(), new LayerList() ];
      array.forEach(children, function (child) { item.addChild(child); });

      item.deactivate(true);

      sinon.assert.notCalled(stub);

      stub.restore();
    },

    'activate should update children if it is a parent and flag is true': function () {
      var item, children, stubs;

      item = new LayerItem({ name: 'abc', visibilityCtrl: visibilityCtrl });
      children = [ new LayerList(), new LayerList(), new LayerList() ];
      stubs = array.map(children, function (child) {
        item.addChild(child);
        return sinon.stub(child, 'activate');
      });
      item.activate(true);
      array.forEach(stubs, function (stub) {
        assert(stub.calledOnce);
        stub.restore();
      });
    },

    'deactivate should update children if it is a parent and flag is true': function () {
      var item, children, stubs;

      item = new LayerItem({ name: 'abc', visibilityCtrl: visibilityCtrl });
      children = [ new LayerList(), new LayerList(), new LayerList() ];
      stubs = array.map(children, function (child) {
        item.addChild(child);
        return sinon.stub(child, 'deactivate');
      });

      item.deactivate(true);

      array.forEach(stubs, function (stub) {
        assert(stub.calledOnce);
        stub.restore();
      });
    },

    'Should remove the hidden layer class when active': function () {
      var item;

      item = new LayerItem({ name: 'abc', active: true });
      assert.isFalse(domClass.contains(dojoQuery('a', item.domNode)[0], 'hidden-layer'));
    },

    'Should add the visible layer class when active': function () {
      var item;

      item = new LayerItem({ name: 'abc', active: true });
      assert.isTrue(domClass.contains(dojoQuery('a', item.domNode)[0], 'visible-layer'));
    },

    'Should add the hidden layer class when deactivated': function () {
      var item;

      item = new LayerItem({ name: 'abc', active: false });
      assert.isTrue(domClass.contains(dojoQuery('a', item.domNode)[0], 'hidden-layer'));
    },

    'Should remove the visible layer class when deactivated': function () {
      var item;

      item = new LayerItem({ name: 'abc', active: false });
      assert.isFalse(domClass.contains(dojoQuery('a', item.domNode)[0], 'visible-layer'));
    },

    'toggle should toggle activation': function () {
      var item, stub1, stub2;

      item = new LayerItem({ name: 'abc', active: false });
      stub1 = sinon.stub(item, 'activate');
      stub2 = sinon.stub(item, 'deactivate');

      item.toggle(true);

      assert(stub1.calledWith(true));
      sinon.assert.notCalled(stub2);
      stub1.restore(); stub2.restore();

      item = new LayerItem({ name: 'abc', active: true });
      stub1 = sinon.stub(item, 'activate');
      stub2 = sinon.stub(item, 'deactivate');

      item.toggle(false);

      assert(stub2.calledWith(false));
      sinon.assert.notCalled(stub1);
    },

    'updateVisibility should activate if some children are active': function () {
      var item, children, stub;

      item = new LayerItem({ name: 'abc' });
      stub = sinon.stub(item, 'activate');
      assert.isFalse(item.active);

      children = [ new LayerList(), new LayerList(), new LayerList() ];
      array.forEach(children, function (child) {
        item.addChild(child);
        child.active = true;
      });
      children[0].active = false;
      item.updateVisibility();
      assert(stub.calledWith(false));
      stub.restore();
    },

    'updateVisibility should deactivate if all children are inactive': function () {
      var item, children, stub;

      item = new LayerItem({ name: 'abc' });
      stub = sinon.stub(item, 'deactivate');
      assert.isFalse(item.active);

      children = [ new LayerList(), new LayerList(), new LayerList() ];
      array.forEach(children, function (child) {
        item.addChild(child);
        child.active = false;
      });
      item.updateVisibility();
      assert(stub.calledWith(false));
      stub.restore();
    },

    // Last test to test the click event handler
    
    'Should trigger a cascading toggle when the link inside it is clicked': function () {
      var item, stub;

      createFixture();

      item = new LayerItem({ name: 'abc' }, 'layer-item');
      stub = sinon.stub(item, 'toggle');

      dojoQuery('a', item.domNode)[0].click();

      assert(stub.calledWith(true));

      stub.restore();
      item.destroy();
    },

    'Should update its state when a child is clicked': function () {
      var item, child, stub;

      createFixture();

      item = new LayerItem({ name: 'abc' }, 'layer-item');
      stub = sinon.stub(item, 'updateVisibility');

      child = new LayerList();
      item.addChild(child);

      child.domNode.click();

      assert(stub.calledOnce);

      stub.restore();
      item.destroy();
    }
  });
});
