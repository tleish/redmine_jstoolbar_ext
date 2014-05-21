(function () {
  if(typeof jsToolBar === 'undefined') return false;
  // Namespace
  window.RedmineWikiToolbarExt = window.RedmineWikiToolbarExt || {};

  RedmineWikiToolbarExt.button_class_name_prefix = 'jstb_';
  /**
   * @class BuildOpts
   * @desc Default button opts
   * @methods init()
   */
  RedmineWikiToolbarExt.BuildOpts = (function () {
    var opts;

    var init = function(button_opts){
      opts = button_opts;
      set_defaults();
      return opts;
    };

    var set_defaults = function(){
      if(opts.type === undefined) opts.type = 'button';
      if(opts.name === undefined) opts.name = opts.title.toLowerCase().replace(/ /g, '_');
      if(opts.class === undefined) opts.class = class_name();
    };

    var class_name = function(){
      return RedmineWikiToolbarExt.button_class_name_prefix + opts.name;
    }

    return {
      init: init
    };

  })();

  RedmineWikiToolbarExt.Paths = (function () {

    var this_script_path = function(){
      var $script = $("head script[src*='/redmine_jstoolbar_ext.js']");
      return $script.attr('src');
    };

    var web_root = function(){
      return this_script_path().replace(/redmine_jstoolbar_ext\/.*/, '');
    };

    return {
      web_root: web_root
    };

  })();


  RedmineWikiToolbarExt.Markup = (function (jsToolBar) {
    var textile_strong_fn = "function () { this.singleTag('*') }";

    var type = function(){
      return (is_textile()) ? 'textile' : 'markdown'
    };

    var is_textile = function(){
      return String(jsToolBar.prototype.elements.strong.fn.wiki) == textile_strong_fn;
    };

    return {
      type: type
    };
  })(jsToolBar);



  /**
   * @class Buttons
   * @desc Draw buttons on the toolbar
   * @methods draw()
   */
  RedmineWikiToolbarExt.ToolbarElements = (function (jsToolBar, BuildOpts) {

    var buttons;

    var add = function(buttons_array){
      buttons = buttons_array;
      draw_buttons();
    };

    var draw_buttons = function(){
      $.each(buttons, function(index, button){
        append(button);
      })
    };

    var append = function(opts) {
      var button = BuildOpts.init(opts);
      if (button.after === undefined) {
        jsToolBar.prototype.elements[button.name] = button
      } else {
        jsToolBar.prototype.elements = append_after(button);
      }
    };

    var append_after = function(button){
      var elements_new = {};
      for (var i in jsToolBar.prototype.elements) {
        elements_new[i] = jsToolBar.prototype.elements[i];
        if (i == button.after) {
          elements_new[button.name] = button;
        }
      }
      return elements_new;
    };

    return {
      add: add
    };
  })(jsToolBar, RedmineWikiToolbarExt.BuildOpts);


  /**
   * @class SubMenu
   * @desc Open or Close image menu
   * @methods open(), close()
   */
  RedmineWikiToolbarExt.SubMenu = (function () {
    var $toolbar, $button, close_on_blur_initialized = false;

    var open = function(toolbar, button, buttons){
      $toolbar = $(toolbar);
      $button = $(button);
      if( buttons.length === 0 ) return false;
      close_all_menus();
      init_close_on_blur_once();
      if(!is_open()) build_menu(buttons);
      return true;
    };

    var build_menu = function(buttons){
      $('<div/>')
        .addClass('jstb_ext_submenu')
        .addClass(uniq_menu_class())
        .css({left: $button.position().left + 'px'})
        .append(buttons)
        .insertAfter( $button );
    };

    var button_opener_class = function(){
      return $button.attr('class');
    };

    var uniq_menu_class = function(){
      return button_opener_class() + '_submenu';
    };

    var menu = function(){
      return $('.' + uniq_menu_class());
    };

    var is_open = function(){
      return menu().length;
    };

    var close = function(){
      menu().remove();
    };

    var close_all_menus = function(){
      $('.jstb_ext_submenu').remove();
    };

    var init_close_on_blur_once = function(){
      if( close_on_blur_initialized ) return true;
      $(document).click(close_if_open);
      close_on_blur_initialized = true;
    };

    var close_if_open = function(event){
      var button_opener_clicked = $(event.target).hasClass(button_opener_class());
      if (!button_opener_clicked && is_open()) {
        event.preventDefault();
        close();
      }
    };

    return {
      close: close,
      open: open
    };
  })();


}());