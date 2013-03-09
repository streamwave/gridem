/*!
 * Grid 'Em - jQuery Plugin
 * 
 * Author: Yves Dagenais <yves@streamwave.com>
 * Copyright (c) 2013 Streamwave Communications Corp. <info@streamwave.com>
 */
(function( $ ) {

  var methods = {
    init : function ( options ) {
      gridItems(this, options);
      return this;
    }
  };


  $.fn.gridEm = function( method ) {
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
  function gridItems( $grid, options ) {
    if (!$grid.children().length) return;

    var settings = $.extend( {
      'minMargin' :  10,
      'maxMargin' : 100
    }, options);

    var inlineQuirk = 0
      , itemMargin  = 0
      , gridWidth   = $grid.innerWidth()
      , freeSpace   = 0
      , roundingAdj = 0;

    // Assuming all items are of equal width
    var $firstItem  = $grid.children().first()
      , itemWidth   = $firstItem.outerWidth();
    
    if ('inline-block' == $firstItem.css('display')) inlineQuirk = 4;

    // Calculate max items per row
    var itemsPerRow = Math.floor(gridWidth / itemWidth)
      , itemCount   = $grid.children().length;

    if (itemsPerRow > itemCount) itemsPerRow = itemCount;

    var allItemsWidth = itemsPerRow * itemWidth;

    if (itemsPerRow > 1) {
      itemMargin = Math.floor((gridWidth - allItemsWidth) / (itemsPerRow - 1));
      freeSpace  = gridWidth - allItemsWidth;
    } else {
      applyNewMargin($grid, { itemMargin: settings.minMargin });
      return;
    }

    // We may need to redistribute items on rows if we're below our min margin.
    var retryLimit = itemCount;
    while (itemMargin < settings.minMargin) {
      itemsPerRow--;

      if (itemsPerRow > 1) {
        allItemsWidth = itemsPerRow * itemWidth;
        itemMargin    = Math.floor((gridWidth - allItemsWidth) / (itemsPerRow - 1));
        freeSpace     = gridWidth - allItemsWidth;

      } else if (1 == itemsPerRow) {
        // We might need to force some margins to ensure single column display
        if (freeSpace > settings.minMargin) itemMargin = settings.minMargin;
      }
      retryLimit--;
      if (retryLimit <= 0 || itemsPerRow <= 1) break;
    }

    if (itemMargin > settings.maxMargin) { itemMargin = settings.maxMargin; } 

    // Check to see if we're short a pixel due to rounding
    var rndErr  = freeSpace - itemMargin*(itemsPerRow-1);
    roundingAdj = rndErr==1 ? rndErr : 0;

    if (inlineQuirk)    itemMargin -= inlineQuirk;
    if (itemMargin < 0) itemMargin = 0;

    // Adjust the grid items
    applyNewMargin($grid, { itemsPerRow: itemsPerRow,
                            itemMargin:   itemMargin,
                            roundingAdj:  roundingAdj });
  }


  /**
   * applyNewMargin()
   *
   * Applies the new calculated margin to the child elements.
   */
  function applyNewMargin( $grid, options ) {
    if (!$grid.children().length) return;

    var settings = $.extend( {
      'itemsPerRow' : 1,
      'itemMargin'  : 0,
      'roundingAdj' : 0
    }, options);

    var i=0;
    $grid.children().each(function() { 
      i++;
      if (i < settings.itemsPerRow || 1 == settings.itemsPerRow) {
        var newMargin = settings.itemMargin;
        if (1==i) newMargin+=settings.roundingAdj;
        $(this).css('margin-right', newMargin + 'px');
      }else {
        $(this).css('margin-right', 0);
        i=0;
      }
    });
  }


})( jQuery );