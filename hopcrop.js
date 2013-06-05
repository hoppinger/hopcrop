(function ($) {

var HopCrop = function(context, settings) {
      // Get the img tag where the Jcrop should be assigned to.
  var image = $('.hopcrop-image > img', context),

      // Make sure we have the elements in place to assign the navigation
      // elements to.
      nav = (function(c) {
        var container = $("<div />").addClass('hopcrop-navigation').insertBefore($('.hopcrop-image', c));
        setTimeout(function() {
          container.height($('.hopcrop-image', c).outerHeight());
        }, 100);

        return $("<ul />").appendTo(container);
      })(context),

      // Prepare a location to store the style objects.
      styles = {},

      // Setup our public interface. This will be passed into Style and used as
      // a return value;
      r = {
        nav: nav,
        image: image,
        deactivate: function() {
          $.each(styles, function(n, s) { s.deactivate(); });
        }
      };

  // Loop over every textfield.
  $('.form-type-textfield', context).each(function() {
    // Figure out the style name, and jump out if we can't.
    var name = $('input[type=text]', this).attr('name'),
        match = name.match(/\[(\w+)\]$/);
    if (!match || (settings.styles[match[1]] === undefined)) {
      return;
    }

    // Setup a Style for the textfield.
    settings.styles[match[1]].display_factor = settings.display_factor;
    styles[match[1]] = Style(r, match[1], this, settings.styles[match[1]]);
  });

  // Activate the first style. Returning false prevents the continuation of the
  // loop.
  $.each(styles, function(n, s) { s.activate(); return false; });

  return r;
}

var Style = function(c, style_name, style_item, settings) {
      // Figure out the label of the text field and remove the element.
  var label = $('label', style_item).remove().text(),

      // Get the input and make it hidden.
      input = $('input[type=text]', style_item).detach().attr('type', 'hidden').appendTo(style_item),

      // Create a navigation item.
      nav_item = $("<li />").appendTo(c.nav).append($("<a />").attr('href', '#').text(label)),

      active = false,
      jcrop,

      // Set the coordinates.
      set = function(c) {
        // If the crop spans 0px area, it's considered empty.
        if (c.x == c.x2 && c.y == c.y2) {
          input.val("");
          nav_item.removeClass('filled');
          return;
        }

        input.val("" + Math.floor(c.x / settings.display_factor) + ", " + Math.floor(c.y / settings.display_factor) + ", " + Math.floor(c.x2 / settings.display_factor) + ", " + Math.floor(c.y2 / settings.display_factor));
        if (!nav_item.hasClass('filled')) { nav_item.addClass('filled'); }
      },

      // Activate the cropper.
      activate = function() {
        if (active) { return; }

        // Setup Jcrop.
        jcrop = $.Jcrop(c.image, {
          onChange: set,
          onSelect: set,
          aspectRatio: settings.width / settings.height,
          minSize: [Math.floor(settings.min_width * settings.display_factor), Math.floor(settings.min_height * settings.display_factor)]
        });

        // Set the current value.
        if (input.val()) {
          jcrop.setSelect($.map(input.val().split(","), function(v) {
            return Math.floor(parseInt($.trim(v), 10) * settings.display_factor);
          }));
        }

        // Mark as activated.
        nav_item.addClass('active');
        active = true;
      },

      // Deactivate the cropper.
      deactivate = function() {
        if (!active) { return; }

        // Tear down Jcrop.
        jcrop.destroy();

        // Mark as deactivated.
        nav_item.removeClass('active');
        active = false;
      };

  // Add the filled class if we are filled.
  if (input.val()) { nav_item.addClass('filled'); }
  if (settings.warning !== undefined) { $("<p />").addClass('hopcrop-warning').text(settings.warning).appendTo(nav_item); }

  // Click binding on the style switcher.
  $('a', nav_item).bind('click', function(e) {
    e.preventDefault();
    if (active) { return; }

    c.deactivate();
    activate();
  });

  return { deactivate: deactivate, activate: activate };
}

Drupal.behaviors.HopCrop = {
  attach: function (context, settings) {
    $('.form-type-hopcrop', context).once('hopcrop', function() {
      if (settings.HopCrop === undefined || settings.HopCrop[$(this).attr('id')] === undefined) {
        return;
      }

      HopCrop(this, settings.HopCrop[$(this).attr('id')]);
    });
  }
}

})(jQuery);
