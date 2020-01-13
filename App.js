import React, {Component} from 'react';
import {View, Text, TextInput, Switch, AsyncStorage} from 'react-native';

export default class App extends Component {
  constructor() {
    super();
    this.getLocalTodos('todos');

    this.state = {
      todos: [],
      todo: {
        todoText: '',
        id: null,
        isDone: false,
      },
    };
  }

  handleAddTodo = e => {
    console.log(e, 'handleAddTodo....');
    this.handleSubmit(e);
  };

  handleChange = e => {
    this.setState({ todo: { todoText: e }});
  };

  handleToggle = async id => {
    const todos = this.state.todos.map(todo => {
      if (todo.id === id) {
        return {...todo, isDone: !todo.isDone};
      } else {
        return todo;
      }
    });

    await this.setState({todos});
    this.setLocalStorage('todos', todos);
  };

  handleSubmit = async e => {
    const { text } = e.nativeEvent;
    const todos = [
      ...this.state.todos,
      {
        ...this.state.todo,
        id: Date.now(),
      },
    ];

    await this.setState({
      todos,
      todo: {
        ...this.state.todo,
        todoText: '',
      },
    });

    if (this.state.todos.length) {
      this.setLocalStorage('todos', this.state.todos);
    }
  };

  setLocalStorage = (key, data) => {
    AsyncStorage.setItem(key, JSON.stringify(data))
      .then(data => {
        console.log(data, 'success!');
      })
      .catch(err => console.log(err, "err setting todos..."));
  };

  handleDelete = async id => {
    const todos = await this.state.todos.filter(todo => {
      return !(todo.id === id);
    });
    await this.setState({ todos });
    this.setLocalStorage('todos', todos);
  };

  getLocalTodos = todos => {
    AsyncStorage.getItem(todos)
      .then(res => JSON.parse(res))
      .then(data => {
        console.log('asyn todos...');
        if (data) {
          this.setState({ [todos]: data });
        };
      })
      .catch(err => console.log(err, "err getting todos..."));
  };

  render() {
    const { todos, todo } = this.state;

    return (
      <View>
        <TextInput
          value={ todo.todoText }
          name="todoText"
          onChangeText={ this.handleChange }
          placeholder="ADD TODO..."
          // onKeyPress={this.handleAddTodo}
          onSubmitEditing={ this.handleSubmit }
          style={{
            borderWidth: 1,
            borderColor: '#111',
          }}
        />
        <View>
          {
            todos.map((todo, i) => (
              <View
                key={i}
                style={{
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}  
              >
                <Switch
                  value={ todo.isDone }
                  onChange={() => this.handleToggle(todo.id)}
                />
                <Text style={todo.isDone ? {textDecorationLine: 'line-through', color: '#999'} : null }>{todo.todoText}</Text>
                <Text onPress={() => this.handleDelete(todo.id)}>❌</Text>
              </View>
            ))
          }
        </View>
      </View>
    );
  }
}