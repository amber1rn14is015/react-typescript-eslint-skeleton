import React, { ReactElement } from 'react';
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Theme,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles';
import { db } from '../firebase';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(3),
  },
  title: {
    color: theme.palette.primary.main,
  },
}));

interface snapDoc {
  id: string;
  todo: string;
}

interface todo {
  todoList: Array<snapDoc>;
}

const TodoList: React.FC<todo> = (props: todo): ReactElement => {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [editItem, setEditItem] = React.useState<snapDoc>({ id: '', todo: '' });

  const handleClickOpen = (item: snapDoc) => {
    setEditItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem({ id: '', todo: '' });
  };

  const handleUpdate = () => {
    db.collection('todos').doc(editItem.id).set(
      {
        todo: input,
      },
      { merge: true },
    );
    setOpen(false);
    setEditItem({ id: '', todo: '' });
  };

  const classes = useStyles();
  const isDone = true;
  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            placeholder={editItem.todo}
            margin="dense"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <List>
        {props.todoList.map((item: snapDoc) => (
          <div key={item.id}>
            <ListItem>
              <ListItemAvatar>
                {isDone ? (
                  <CheckBoxOutlinedIcon />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )}
              </ListItemAvatar>
              <ListItemText primary={item.todo} />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleClickOpen(item)} edge="end">
                  <EditIcon />
                </IconButton>
                <IconButton edge="end">
                  <DoneIcon />
                </IconButton>
                <IconButton
                  onClick={() => db.collection('todos').doc(item.id).delete()}
                  edge="end"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
};

export default TodoList;
