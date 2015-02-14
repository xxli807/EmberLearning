App.TodoListController = Ember.ObjectController.extend({
    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError === null);
    }.property('error'),

    actions: {

        deleteTodoList: function (todoListId) {
            var self = this;
            this.store.find("todoList", todoListId).then(function (todoList) {
                todoList.deleteRecord();
                todoList.save().then(function () {
                    todoList.set('error', '');
                }, function (data) {
                    todoList.set('error', "Delete Error: " + data.message);
                });
            });
        },

        deleteTodo: function (todoItemId) {
            var self = this;
            this.store.find("todo", todoItemId).then(function (todoItem) {
                self.store.find("todoList", todoItem.get("todoListId")).then(function (todoList) {
                    todoList.get('todos').removeObject(todoItem);

                    todoItem.deleteRecord();
                    todoItem.save().then(function () {
                        todoList.set('error', '');
                        delete todoItem;
                    }, function (data) {
                        todoList.set('error', "Delete Error: " + data.message);
                    });
                });
            });
        },
    }

});