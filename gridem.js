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
   *
   * Main function that figures out how to lay out the grid item.
   */
  function gridItems(grid, options) {
    if (!grid.children().length) return;

    var settings = $.extend( {
      'min_margin'     :  10,
      'max_margin'     : 100,
    }, options);

    var inline_quirk = 0;
    var item_margin  = 0;
    var grid_width   = grid.innerWidth();
    var free_space   = 0;
    var rounding_adj = 0;

    // Assuming all items are of equal width
    var first_item  = grid.children().first();
    var item_width  = first_item.outerWidth();
    
    if ('inline-block' == first_item.css('display')) inline_quirk = 4;

    // Calculate max items per row
    var items_per_row = Math.floor(grid_width / item_width);
    var item_count    = grid.children().length;
    if (items_per_row > item_count) items_per_row = item_count;

    var all_items_width = items_per_row * item_width;

    if (items_per_row > 1) {
      item_margin = Math.floor((grid_width - all_items_width) / (items_per_row - 1));
      free_space = grid_width - all_items_width;
    } else {
      applyNewMargin(grid, { item_margin: settings.min_margin });
      return;
    }

    // We may need to redistribute items on rows if we're below our min margin.
    var retry_limit=item_count;
    while (item_margin < settings.min_margin) {
      items_per_row--;

      if (items_per_row > 1) {
        all_items_width = items_per_row * item_width;
        item_margin = Math.floor((grid_width - all_items_width) / (items_per_row - 1));
        free_space = grid_width - all_items_width;

      } else if (1 == items_per_row) {
        // We might need to force some margins to ensure single column display
        if (free_space > settings.min_margin) item_margin = settings.min_margin;
      }
      retry_limit--;
      if (retry_limit<=0 || items_per_row<=1) break;
    }

    if (item_margin > settings.max_margin) { item_margin = settings.max_margin; } 

    // Check to see if we're short a pixel due to rounding
    var rnd_err  = free_space - item_margin*(items_per_row-1);
    rounding_adj = rnd_err==1 ? rnd_err : 0;

    if (inline_quirk)    item_margin -= inline_quirk;
    if (item_margin < 0) item_margin = 0;

    // Adjust the grid items
    applyNewMargin(grid, { items_per_row: items_per_row,
                           item_margin: item_margin,
                           rounding_adj: rounding_adj });
  }


  /**
   * applyNewMargin()
   *
   * Applies the new calculated margin to the child elements.
   */
  function applyNewMargin(grid, options) {
    if (!grid.children().length) return;

    var settings = $.extend( {
      'items_per_row' : 1,
      'item_margin'   : 0,
      'rounding_adj'  : 0
    }, options);

    var i=0;
    grid.children().each(function() { 
      i++;
      if (i < settings.items_per_row || 1 == settings.items_per_row) {
        var new_margin = settings.item_margin;
        if (1==i) new_margin+=settings.rounding_adj;
        $(this).css('margin-right', new_margin + 'px');
      }else {
        $(this).css('margin-right', 0);
        i=0;
      }
    });
  }


})( jQuery );