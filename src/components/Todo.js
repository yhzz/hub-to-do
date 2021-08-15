/*global chrome*/
import React, { useEffect, useState } from 'react';
import {
  ButtonGroup,
  IconButton,
  Divider,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import MoodIcon from '@material-ui/icons/Mood';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { Container, Draggable } from 'react-smooth-dnd';
import { arrayMoveImmutable } from 'array-move';

const styles = {
  done: {
    textDecoration: 'line-through',
    opacity: '.5',
    display: 'flex',
    width: '100%',
  },
  main: {
    width: '100%',
    maxWidth: '400px',
    margin: '20px auto',
  },
  todo: {
    position: 'relative',
    display: 'flex',
    flexFow: 'row',
    alignContent: 'space-between',
  },
  label: {
    display: 'flex',
    width: '100%',
  },
  divider: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
};

export default function Todo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    chrome.storage.sync.get('tasks', function (value) {
      if (Array.isArray(value.tasks)) {
        updateState(value.tasks, '');
      } else {
        console.error('invalid tasks data', value.tasks);
        updateState([], '');
      }
      return true;
    });
  }, []);

  const updateState = (_tasks, _newTask) => {
    setTasks(_tasks);
    setNewTask(_newTask);
    chrome.storage.sync.set({ tasks: _tasks }, function () {
      const not_done_tasks = _tasks.filter((v) => !v.done);
      chrome.browserAction.setBadgeText({
        text: String(not_done_tasks.length),
      });
      return true;
    });
  };

  const deleteTask = (task) => {
    let _tasks = tasks.slice();
    _tasks.splice(_tasks.indexOf(task), 1);
    updateState(_tasks, '');
  };

  const toggle = (task) => {
    let _tasks = tasks.slice();
    _tasks[_tasks.indexOf(task)].done = !_tasks[_tasks.indexOf(task)].done;
    updateState(_tasks, '');
  };

  const moveTaskPage = (task) => {
    if (task.url) {
      chrome.tabs.create({ url: task.url }, (tab) => {});
    }
  };

  const onDrop = ({ removedIndex, addedIndex }) => {
    const _tasks = arrayMoveImmutable(tasks, removedIndex, addedIndex);
    updateState(_tasks, '');
  };

  return (
    <div id="main" style={styles.main}>
      {tasks.length > 0 ? (
        <Container
          dragHandleSelector=".drag-handle"
          lockAxis="y"
          onDrop={onDrop}
        >
          {tasks.map((task, id) => (
            <Draggable key={id}>
              <div key={id} style={styles.todo}>
                {id > 0 ? <Divider style={styles.divider} /> : ''}
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={task.done}
                      onChange={() => toggle(task)}
                    />
                  }
                  label={task.text}
                  style={task.done ? styles.done : styles.label}
                />
                <ButtonGroup
                  size="small"
                  color="primary"
                  aria-label="button group"
                >
                  {task.url && (
                    <IconButton
                      aria-label="link"
                      onClick={() => moveTaskPage(task)}
                      title="task link"
                    >
                      <LinkIcon />
                    </IconButton>
                  )}
                  <IconButton
                    aria-label="delete"
                    onClick={() => deleteTask(task)}
                    title="delete task"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    aria-label="drag"
                    className="drag-handle"
                    title="drag task"
                  >
                    <DragHandleIcon />
                  </IconButton>
                </ButtonGroup>
              </div>
            </Draggable>
          ))}
        </Container>
      ) : (
        <>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <MoodIcon />
            </Grid>
            <Grid item>
              <Typography>You're all done!</Typography>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
}
