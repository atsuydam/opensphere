goog.provide('plugin.file.gml.GMLImportUI');
goog.require('os.ui.im.FileImportUI');
goog.require('os.ui.window');
goog.require('os.ui.wiz.OptionsStep');
goog.require('os.ui.wiz.step.TimeStep');
goog.require('plugin.file.gml.GMLParserConfig');
goog.require('plugin.file.gml.gmlImportDirective');



/**
 * @extends {os.ui.im.FileImportUI.<plugin.file.gml.GMLParserConfig>}
 * @constructor
 */
plugin.file.gml.GMLImportUI = function() {
  plugin.file.gml.GMLImportUI.base(this, 'constructor');
};
goog.inherits(plugin.file.gml.GMLImportUI, os.ui.im.FileImportUI);


/**
 * @inheritDoc
 */
plugin.file.gml.GMLImportUI.prototype.getTitle = function() {
  return 'GML';
};


/**
 * @inheritDoc
 */
plugin.file.gml.GMLImportUI.prototype.launchUI = function(file, opt_config) {
  plugin.file.gml.GMLImportUI.base(this, 'launchUI', file, opt_config);

  var config = new plugin.file.gml.GMLParserConfig();

  // if an existing config was provided, merge it in
  if (opt_config) {
    this.mergeConfig(opt_config, config);
  }

  config['file'] = file;
  config['title'] = file.getFileName();

  var scopeOptions = {
    'config': config
  };
  var windowOptions = {
    'label': 'Import GML',
    'icon': 'fa fa-file-text',
    'x': 'center',
    'y': 'center',
    'width': 400,
    'min-width': 400,
    'max-width': 800,
    'height': 'auto',
    'modal': true,
    'show-close': true
  };
  var template = '<gmlimport></gmlimport>';
  os.ui.window.create(windowOptions, template, undefined, undefined, undefined, scopeOptions);
};
