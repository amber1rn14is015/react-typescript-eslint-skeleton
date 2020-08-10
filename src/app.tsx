import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './theme';
import TodoList from './components/TodoList';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button } from '@material-ui/core';
import { db } from './firebase';
import firebase from 'firebase';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    maxWidth: 540,
    margin: theme.spacing(3),
  },
  textBox: {
    margin: theme.spacing(1),
    width: '100%',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

interface snapDoc {
  id: string;
  todo: string;
}

const App = (): any => {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const [todoList, setTodoList] = useState(Array<snapDoc>());

  useEffect(() => {
    db.collection('todos')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setTodoList(
          snapshot.docs.map((doc) => ({ id: doc.id, todo: doc.data().todo })),
        );
      });
  }, []);

  const handleInput = (event: any) => {
    setInput(event.target.value);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    // setTodoList([...todoList, input]);
    db.collection('todos').add({
      todo: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <h4 className={classes.root}>Add a Todo item below:</h4>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            className={classes.textBox}
            label="Enter todo item"
            size="small"
            value={input}
            onChange={handleInput}
            variant="outlined"
          />
          <Button
            className={classes.button}
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={input === ''}
            disableElevation
          >
            Add
          </Button>
        </form>
      </div>
      <TodoList todoList={todoList} />
    </ThemeProvider>
  );
};

ReactDom.render(<App />, document.getElementById('root') as HTMLElement);
