goog.provide('os.ui.tab.FeatureTab');

goog.require('os.ui.tab.Tab');



/**
 * Model class representing a pluggable feature tab.
 * @param {string} id The ID to track the element by
 * @param {string} label The user facing label of the tab
 * @param {string} icon The icon to display
 * @param {string} template The template to compile
 * @param {Object=} opt_data The optional data for the tab
 * @param {function(Object, boolean)=} opt_enableFunc The optional tab enable function
 * @extends {os.ui.tab.Tab}
 * @constructor
 */
os.ui.tab.FeatureTab = function(id, label, icon, template, opt_data, opt_enableFunc) {
  /**
   * @inheritDoc
   */
  this['id'] = id;

  /**
   * @inheritDoc
   */
  this['label'] = label;

  /**
   * @inheritDoc
   */
  this['icon'] = icon;

  /**
   * @inheritDoc
   */
  this['template'] = template;

  /**
   * @inheritDoc
   */
  this['data'] = opt_data || null;

  /**
   * @type {boolean}
   */
  this['isShown'] = true;

  /**
   * The function that returns if tab should be shown.
   * @type {?function(*, boolean)}
   */
  this['enableFunc'] = opt_enableFunc;
};
goog.inherits(os.ui.tab.FeatureTab, os.ui.tab.Tab);
