'use babel';

import { CompositeDisposable } from 'atom';
import textProcessor from './textProcessor';

export default {

  subscriptions: null,

  activate(state) {
    this.on = false;
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'nms-color-bracket:toggle': () => this.toggle()
    }));
    this.activePane = atom.workspace.getActivePane();
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {

    this.on = !this.on

    if(this.on)
    {
      console.log('color brackets turned on');
      this.subscriptionOne = this.activePane.onDidChangeActiveItem(this.process_current_page);
      editor = atom.workspace.getActiveTextEditor();
      if (this.activePane.activeItem == editor && this.activePane.focused == true)
      {
        this.process_current_page();
      }
    }
    else
    {
      this.cleanAll();
      this.subscriptionOne.dispose();
      console.log('color brackets turned off');
    }

  },

  process_current_page()
  {
    function process(editor)
    {
      if(editor.textProcessor!= null) editor.textProcessor.cleanUp();
      editor.textProcessor = new textProcessor(editor);
    }
    editor = atom.workspace.getActiveTextEditor();
    if(editor.saveSubscription!=null)
    {
      editor.saveSubscription.dispose();
    }
    editor.saveSubscription = editor.onDidSave(function(){process(editor);});
    process(editor);

  },
  cleanAll()
  {
      atom.workspace.getTextEditors().forEach(function(element)
      {
        if(element.textProcessor!=null)
        {
          element.textProcessor.cleanUp();
          element.textProcessor = null;
        }
        if(element.saveSubscription!=null)
        {
          element.saveSubscription.dispose();
        }
    });
  }

};
