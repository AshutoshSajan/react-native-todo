import React, {Component} from 'react';
import {View, Text, TextInput, ListView} from 'react-native';

export default class App extends Component {
  state = {
    todos: [],
    todo: {
      todoText: '',
      id: '',
      isDone: false,
    },
  };

  handleAddTodo = (e) => {
    console.log(e, 'handleAddTodo....');
  };

  handleChange = (e) => {
    console.log(e, 'handleAddTodo....');
  }

  render() {
    const {todos,todo} = this.state;

    return (
      <View>
        <TextInput
          value={todo.todoText}
          onChange={this.handleChange}
          placeholder="ADD TODO..."
          onKeyPress={this.handleAddTodo}
        />
        <View>
          {todos.map(todo => (
            <Text>{todo.todoText}</Text>
          ))}
        </View>
      </View>
    );
  }
}
