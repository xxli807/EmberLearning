window.App = Em.Application.create({
});
//App.ApplicationAdapter = DS.FixtureAdapter;
App.ApplicationAdapter = DS.WebAPIAdapter.extend({
    namespace: 'api',
    antiForgeryTokenSelector: "#antiForgeryToken",
});

Ember.Checkbox.reopen({
    attributeBindings: ['data-toggle', 'data-trigger', 'data-required', 'data-type']
});
Ember.Select.reopen({
    attributeBindings: ['data-toggle', 'data-trigger', 'data-required', 'data-type']
});
Ember.TextArea.reopen({
    attributeBindings: ['data-toggle', 'data-trigger', 'data-required', 'data-type']
});
Ember.TextField.reopen({
    attributeBindings: ['data-toggle', 'data-trigger', 'data-required', 'data-type']
});