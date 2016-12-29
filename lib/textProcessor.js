'use babel';

export default class textProcessor {

  constructor(editor)
  {
    this.myEditor = editor;
  //  this.cleanUp();
    var count =0;
    atom.workspace.getActiveTextEditor().scan(/{|}/g,onFind)

    function onFind(result)
    {
     if(result.matchText == '{')
     {
        count ++;
     }
     marker = atom.workspace.getActiveTextEditor().markScreenRange(result.range,{invalidate: 'touch'});
     colorClass = 'color'+count;
     decoration = atom.workspace.getActiveTextEditor().decorateMarker(marker, {type: 'highlight', class: colorClass, stamp: 'nms', blinker: (count == 0), BNumber: count});
     if(result.matchText == '}')
     {
        count --;
     }
     if( count < 0) count = 0;
    }

    blinkers = this.myEditor.getHighlightDecorations({stamp: 'nms', blinker: true});
  //  console.log(blinkers);

    var blinkSpeed = 100
    window.clearInterval(atom.workspace.getActiveTextEditor().blinker);
    function hide()
    {
      blinkers.forEach(function(element){element.setProperties({type: 'highlight', class: 'color0', stamp: 'nms', blinker: true})});
      window.setTimeout(function() {unhide();}, blinkSpeed);

    }
    function unhide()
    {
      blinkers.forEach(function(element){element.setProperties({type: 'highlight', class: 'colorAlert', stamp: 'nms', blinker: true})});
    }
    if(blinkers.length > 0) this.myEditor.blinker = window.setInterval(function() {hide();}, blinkSpeed*2);
  }

  cleanUp()
  {
    window.clearInterval(this.myEditor.blinker);
    this.decorations = this.myEditor.getHighlightDecorations({stamp: 'nms'});
    this.decorations.forEach(function(dec){ dec.destroy();})
  }
}
