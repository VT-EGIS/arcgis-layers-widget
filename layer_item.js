define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_Container',
  'dojo/_base/lang',
  'gameday/helpers',
  'dojo/query',
  'dojo/dom-class',
  'dojo/_base/array'
], function (declare, _WidgetBase, _TemplatedMixin, _Container, lang, Helpers,
             dojoQuery, domClass, array) {
  return declare([_WidgetBase, _TemplatedMixin, _Container], {
    templateString: '<li><a href="#">${formattedName}</a></li>', 

    postMixInProperties: function () {
      this.formattedName = Helpers.capitalize(this.name);
    },

    postCreate: function () {
      this.active ? this.activate() : this.deactivate();
      this.on('click', lang.hitch(this, '_processClick'));
    },

    activate: function (cascade) {
      var children;

      this.active = true;
      domClass.remove(dojoQuery('a', this.domNode)[0], 'hidden-layer');

      if(cascade) {
        children = this.getChildren();

        if(children.length) {
          array.forEach(children, function (child) { child.activate(); });
        } else {
          this.visibilityCtrl.showLayer(this);
        }
      }
    },

    deactivate: function (cascade) {
      var children;

      this.active = false;
      domClass.add(dojoQuery('a', this.domNode)[0], 'hidden-layer');

      if(cascade) {
        children = this.getChildren();

        if(children.length) {
          array.forEach(children, function (child) { child.deactivate(); });
        } else {
          this.visibilityCtrl.hideLayer(this);
        }
      }
    },

    toggle: function (cascade) {
      this.active ? this.deactivate(cascade) : this.activate(cascade);
    },

    updateVisibility: function () {
      var activeChildren;

      activeChildren = array.filter(this.getChildren(), function (child) {
        return child.active;
      });

      if(activeChildren.length === 0) {
        this.deactivate(false);
      } else {
        this.activate(false);
      }
    },

    _processClick: function (evt) {
      evt.preventDefault();
    
      if(evt.target === dojoQuery('a', this.domNode)[0]) {
        //Top down
        this.toggle(true);
      } else {
        //Bottom up
        this.updateVisibility();
      }
    }
  });
});
