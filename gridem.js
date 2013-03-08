/*!
 * Grid 'Em - jQuery Plugin
 * 
 * Author: Yves Dagenais <yves@streamwave.com>
 * Copyright (c) 2013 Streamwave Communications Corp. <info@streamwave.com>
 */
(function( $ ) {

  var methods = {
    init : function (options) {
      gridItems(this, options);
    }
  };

  $.fn.gridEm = function(method) {
    if (methods[method]) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || !method ){
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method' + method + ' does not exist on jQuery.gridEm' );
    }
  };

  /**
   * gridItems()
   */
  function gridItems(grid, options) {

    var settings = $.extend( {
      'min_margin'     :  10,
      'max_margin'     : 100,
      'default_margin' :  25,
      'equal_widths'   : true
    }, options);

    var inline_quirk = 0;
    var item_margin  = 0;
    var grid_width   = $(grid).innerWidth();
    var free_space   = 0;
    var rounding_adj = 0;

    // Assuming all items are of equal width
    var first_item  = $(grid).children().first();
    var item_width  = first_item.outerWidth();
    
    // See if we need to apply the inline-block quirk adjustment
    if (first_item.css('display') == 'inline-block') settings.inline_quirk = 4;

    // Calculate max items per row
    var items_per_row = Math.floor(grid_width / item_width);
    var item_count    = $(grid).children().length;
    if (items_per_row > item_count) items_per_row = item_count;

    var all_items_width = items_per_row * item_width;

    // Calculate the item margins
    if (items_per_row > 1) {
      item_margin = Math.floor((grid_width - all_items_width) / (items_per_row - 1));
      free_space = grid_width - all_items_width;
    }

    // We can end up with a negative value as we're injecting that quirks adjustment.
    if (item_margin < 0) item_margin = 0;

    // We may need to redistribute items on rows if we're below our min margin.
    if (item_margin < settings.min_margin) {
      items_per_row--;

      // Re-calculate the item margins
      if (items_per_row > 1) {
        all_items_width = items_per_row * item_width;
        item_margin = Math.floor((grid_width - all_items_width) / (items_per_row - 1));
        free_space = grid_width - all_items_width;

      } else if (1 == items_per_row) {
        // We might need to force some margins to ensure single column display
        if (free_space > settings.min_margin) item_margin = settings.min_margin;
      }
    }

    // We don't want to spread things two far apart
    if (item_margin > settings.max_margin) { item_margin = settings.max_margin; } 

    // Check to see if we're short a pixel due to rounding
    var rnd_err  = free_space - item_margin*(items_per_row-1);
    rounding_adj = rnd_err==1 ? rnd_err : 0;

    // Apply Inline Quicks adjustment
    item_margin -= settings.inline_quirk;

    // Adjust the grid items
    var i=0;
    $(grid).children().each(function() { 
      i++;
      if (i < items_per_row || 1 == items_per_row) {
        var new_margin = item_margin;
        if (i==1) new_margin+=rounding_adj;
        $(this).css('margin-right', new_margin + 'px');
      }else {
        $(this).css('margin-right', 0);
        i=0;
      }
    });
  };
})( jQuery );