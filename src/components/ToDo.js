import './ToDo.css';
import todo from '../data/todo';
import { useState, useEffect } from 'react';

function ToDo() {
  const [tasks, setTasks] = useState(todo), // Task data
    [filter, setFilter] = useState('all'), // Filter value
    [height, setHeight] = useState('100vh'); // To-do block height

  /* Create a new task */

  function addTodo(e) {
    let label = e.target.previousElementSibling,
      input = label.querySelector('.to-do-main-list__checkbox-create'),
      value = input.value;

    if (value) {
      let newTask = {
        text: value,
        status: 'active',
      };

      setTasks([...tasks, newTask]);
      input.value = '';
      input.placeholder = 'Create a new todo...';
    } else {
      input.focus();
      input.placeholder = 'Todo name can not be empty';
    }
  }

  /* Deleting a task */

  function deleteTodo(index) {
    let deleteTasks = [...tasks];

    deleteTasks.splice(index, 1);
    setTasks(deleteTasks);
  }

  /* Changing task status */

  function changeStatus(index) {
    let changeTasks = [...tasks];

    if (changeTasks[index].status == 'completed') {
      changeTasks[index].status = 'active';
    } else {
      changeTasks[index].status = 'completed';
    }

    setTasks(changeTasks);
  }

  /* Filtering tasks used in displaying a list of items, deleting completed tasks, counting active tasks */

  function filterTodo(task, value) {
    return value == 'all' ? task : task.status == value;
  }

  /* Changing the filter state */

  function filtration(e) {
    let activeFilter = document.querySelector(
      '.to-do-main-list__filter-button_active'
    );

    if (activeFilter) {
      activeFilter.classList.remove('to-do-main-list__filter-button_active');
    }

    let filter = e.target,
      filterValue = filter.textContent.toLowerCase();

    filter.classList.add('to-do-main-list__filter-button_active');

    setFilter(filterValue);
  }

  /* Deleting completed tasks */

  function deleteCompletedTodo() {
    let completedTasks = [...tasks],
      completedTasksIndex = tasks
        .map((task, index) => ({ task, index }))
        .filter(({ task }) => filterTodo(task, 'completed'))
        .map(({ index }) => index);

    completedTasksIndex.sort((a, b) => b - a);
    completedTasksIndex.forEach((index) => {
      completedTasks.splice(index, 1);
    });

    setTasks(completedTasks);
  }

  /* Calculating the height of the to-do block */

  useEffect(() => {
    function updateHeight() {
      let toDo = document.querySelector('.to-do'),
        toDoMain = document.querySelector('.to-do-main'),
        remValue = parseFloat(
          getComputedStyle(document.documentElement).fontSize
        ),
        oldHeight = toDo.offsetHeight,
        newHeight = toDoMain.offsetHeight + 4 * remValue;

      if (oldHeight !== newHeight || oldHeight < window.innerHeight) {
        setHeight(`${Math.max(newHeight, window.innerHeight)}px`);
      }
    }
    updateHeight();

    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [tasks, filter]);

  /* Changing the theme */

  function toggleTheme() {
    let root = document.querySelector('html'),
      theme = root.getAttribute('data-theme');

    if (theme) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }

  return (
    <div className="to-do" style={{ height }}>
      <div className="to-do-main">
        <div className="to-do-main-header">
          <h1 className="to-do-main-header__title">TODO</h1>
          <button
            className="to-do-main-header__switch"
            onClick={toggleTheme}
          ></button>
        </div>
        <div className="to-do-main-list">
          <div className="to-do-main-list__item to-do-main-list__item_create">
            <label className="to-do-main-list__checkbox">
              <input
                type="checkbox"
                className="to-do-main-list__checkbox-input"
                disabled
              />
              <div className="to-do-main-list__checkbox-state">
                <div className="to-do-main-list__checkbox-control">
                  <svg
                    className="to-do-main-list__checkbox-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="9"
                  >
                    <path
                      fill="none"
                      stroke="#FFF"
                      strokeWidth="2"
                      d="M1 4.304L3.696 7l6-6"
                    />
                  </svg>
                </div>
                <div className="to-do-main-list__checkbox-label">
                  <input
                    type="text"
                    placeholder="Create a new todo..."
                    className="to-do-main-list__checkbox-create"
                  />
                </div>
              </div>
            </label>
            <button
              className="to-do-main-list__control-button to-do-main-list__control-button_create"
              onClick={addTodo}
            ></button>
          </div>
          <div className="to-do-main-list__group">
            {tasks
              .map((task, index) => ({ task, index }))
              .filter(({ task }) => filterTodo(task, filter))
              .map(({ task, index }) => {
                return (
                  <div
                    className={
                      'to-do-main-list__item' +
                      `${index == 0 ? ' to-do-main-list__item_header' : ''}`
                    }
                    key={index}
                  >
                    <label className="to-do-main-list__checkbox">
                      <input
                        type="checkbox"
                        className="to-do-main-list__checkbox-input"
                        checked={task.status == 'completed' ? 'checked' : ''}
                        onChange={() => changeStatus(index)}
                      />
                      <div className="to-do-main-list__checkbox-state">
                        <div className="to-do-main-list__checkbox-control">
                          <svg
                            className="to-do-main-list__checkbox-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="9"
                          >
                            <path
                              fill="none"
                              stroke="#FFF"
                              strokeWidth="2"
                              d="M1 4.304L3.696 7l6-6"
                            />
                          </svg>
                        </div>
                        <div className="to-do-main-list__checkbox-label">
                          {task.text}
                        </div>
                      </div>
                    </label>
                    <button
                      className="to-do-main-list__control-button"
                      onClick={() => deleteTodo(index)}
                    ></button>
                  </div>
                );
              })}
          </div>
          <div className="to-do-main-list__item to-do-main-list__item_filter">
            <span className="to-do-main-list__counter">
              {tasks.filter((task) => filterTodo(task, 'active')).length} items
              left
            </span>
            <div className="to-do-main-list__status">
              <button
                className="to-do-main-list__filter-button to-do-main-list__filter-button_active"
                onClick={filtration}
              >
                All
              </button>
              <button
                className="to-do-main-list__filter-button"
                onClick={filtration}
              >
                Active
              </button>
              <button
                className="to-do-main-list__filter-button"
                onClick={filtration}
              >
                Completed
              </button>
            </div>
            <button
              className="to-do-main-list__filter-button"
              onClick={deleteCompletedTodo}
            >
              Clear completed
            </button>
          </div>
          <div className="to-do-main-list__item to-do-main-list__status-mobile">
            <div className="to-do-main-list__status">
              <button
                className="to-do-main-list__filter-button to-do-main-list__filter-button_active"
                onClick={filtration}
              >
                All
              </button>
              <button
                className="to-do-main-list__filter-button"
                onClick={filtration}
              >
                Active
              </button>
              <button
                className="to-do-main-list__filter-button"
                onClick={filtration}
              >
                Completed
              </button>
            </div>
          </div>
          <span className="to-do-main-list__help">
            Drag and drop to reorder list
          </span>
        </div>
      </div>
    </div>
  );
}

export default ToDo;
