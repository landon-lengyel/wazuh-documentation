/* -----------------------------------------------------------------------------
  Index page
----------------------------------------------------------------------------- */

if ( $('.index') ) {
  const maxShowItems = 3;
  const blockColumns = 3;
  const bottomMargin = 60;
  const deltaOverflow = [];
  const offsets = [];

  $('.loading').removeClass('loading');

  $(document).delegate('.toctree-l1 .toggle', 'click', function(e) {
    e.preventDefault();
    const indexBlock = $(e.target).closest('.collapsible');
    const position = $('.toctree-l1').index(indexBlock);
    let increase;
    console.log(deltaOverflow);
    if ( indexBlock.hasClass('collapsed') ) {
      indexBlock.removeClass('collapsed');
      indexBlock.css('margin-bottom', (bottomMargin - deltaOverflow[position]) + 'px');
      increase = true;
    } else {
      indexBlock.addClass('collapsed');
      indexBlock.css('margin-bottom', bottomMargin + 'px');
      increase = false;
    }
    verticalShift(position, increase);
  });

  /* Set collapsible index blocks */
  setCollapsibleIndexBlocks();
  /**
  * Checks the index blocks marks the ones with exceeding number of items.
  */
  function setCollapsibleIndexBlocks() {
    const indexBlocks = $('.toctree-l1');
    const a = document.createElement('a');

    // Create dropdown toggle button
    a.setAttribute('href', '#');
    a.setAttribute('class', 'toggle');
    a.innerHTML = 'More';

    // Mark collapsible blocks and add button
    indexBlocks.each( function() {
      const singleIndexBlock = $(this);
      const childList = singleIndexBlock.find('ul');
      if ( childList.length > 0 ) {
        deltaOverflow.push(childList[0].scrollHeight);
        if ( singleIndexBlock.find('ul .toctree-l2').length > maxShowItems ) {
          singleIndexBlock.addClass('collapsible').addClass('collapsed');
          singleIndexBlock.append(a.cloneNode(true));
        }
      } else {
        deltaOverflow.push(0);
      }
    });

    // Calculate the overflow difference and init offsets
    let position;
    indexBlocks.each( function() {
      const singleIndexBlock = $(this);
      const childList = singleIndexBlock.find('ul');
      position = $('.toctree-l1').index(singleIndexBlock);
      if ( childList.length > 0 ) {
        deltaOverflow[position] = deltaOverflow[position] - singleIndexBlock.find('ul')[0].scrollHeight;
      }
      offsets.push(0);
    });
  }

  /**
   * Adjust the vertical position to simulate column shifting on dropdown.
   * @param  {Int} startingBlockIndex    Index of the block that was clicked to drop down.
   * @param  {Bool} mustIncrease         Indicates if the column shift must be increased (true when uncollapsing)
   *                                     or decreased (false when collapsing).
   */
  function verticalShift(startingBlockIndex, mustIncrease) {
    $('.toctree-l1:nth-of-type(' + blockColumns + 'n+' + (startingBlockIndex + 1 + blockColumns) + ')').each(function() {
      const currentBlock = $(this);
      const position = $('.toctree-l1').index(currentBlock);
      if (mustIncrease) {
        offsets[position] = offsets[position] + deltaOverflow[startingBlockIndex];
      } else {
        offsets[position] = offsets[position] - deltaOverflow[startingBlockIndex];
      }
      currentBlock.css('top', offsets[position] +'px');
    });
    colShift = columnVerticalShift();
    $('.toctree-wrapper').css('padding-bottom', (Math.max.apply(null, colShift)) + 'px');
  }

  /**
   * Calculates the accumulated shift per column, depending on the uncollpased collapsible blocks.
   * @return {array} Total shift per column
   */
  function columnVerticalShift() {
    const columnShift = [];
    let i;
    for (i = 0; i < blockColumns; i++) {
      columnShift.push(0);
    }
    for (i = 0; i < $('.toctree-l1').length; i++) {
      const currentBlock = $('.toctree-l1').eq(i);
      if (currentBlock.hasClass('collapsible') & !currentBlock.hasClass('collapsed') ) {
        const column = i % blockColumns;
        columnShift[column] = columnShift[column] + deltaOverflow[i];
      }
    }
    return columnShift;
  }
}
