/*global chrome*/

chrome.contextMenus.create({
  title: 'add hub todo task',
  id: 'add-hub-todo-task',
  type: 'normal',
  contexts: ['selection'],
  onclick: addToDo(),
});

function addToDo(info, tab) {
  return function (info, tab) {
    const selectionText = info.selectionText;
    const pageUrl = info.pageUrl;
    addHubTodoTask(selectionText, pageUrl);
  };
}

chrome.omnibox.onInputEntered.addListener(function (text) {
  addHubTodoTask(text, null);
});

function addHubTodoTask(selectionText, pageUrl) {
  chrome.storage.sync.get('tasks', function (value) {
    let _tasks = [];
    if ('tasks' in value) {
      _tasks = value.tasks.slice();
    }
    let url = pageUrl + '#:~:text=' + selectionText;
    if (pageUrl === null) {
      url = null;
    }
    console.log(selectionText)
    _tasks.push({
      text: selectionText,
      done: false,
      url: url,
    });
    chrome.storage.sync.set({ tasks: _tasks }, function () {
      const not_done_tasks = _tasks.filter((v) => !v.done);
      chrome.browserAction.setBadgeText({
        text: String(not_done_tasks.length),
      });
      return true;
    });
    return true;
  });
}
