import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  AsyncStorage,
  Button,
  ScrollView
} from 'react-native';

export default class App extends Component {
  constructor() {
    super();
    this.getLocalTodos('todos');

    this.state = {
      todos: [],
      todo: {
        todoText: '',
        isDone: false,
        id: null,
        createdAt: new Date(),
        completedAt: '',
        updatedAt: ''
      },
      focus: true,
      showMsg: '',
      edit: false,
      todoEditId: ''
    };

    // this.interval();
  }

  interval = () => {
    setInterval(() => {
      this.setState({
        showMsg: this.state.showMsg += 'hello sam!'
      });
    }, 1000);
  };

  handleChange = e => {
    this.setState({ todo: { todoText: e }});
  };

  handleToggle = async id => {
    const todos = this.state.todos.map(todo => {
      if (todo.id === id) {
        return { 
          ...todo,
          isDone: !todo.isDone,
          completedAt: new Date(),
        };
      } else {
        return todo;
      }
    });

    await this.setState({ todos });
    this.setLocalStorage('todos', todos);
  };

  handleSubmit = async e => {
    console.log(e, '\n\n', e.nativeEvent, "submit target....");
    
    const { text } = e.nativeEvent;
    const todos = [
      {
        ...this.state.todo,
        id: Date.now(),
        createdAt: new Date(),
      },
      ...this.state.todos,
    ];

    await this.setState({
      todos,
      todo: {
        ...this.state.todo,
        todoText: '',
      },
    });

    if (this.state.todos.length) {
      await this.setLocalStorage('todos', this.state.todos);
    }
  };

  setLocalStorage = (key, data) => {
    AsyncStorage.setItem(key, JSON.stringify(data))
      .then(todos => {
        console.log(todos, 'success!');
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

  showTodoCreationDate = ( createdAt, updatedAt) => {
    let date = this.getDateTime('date', createdAt);
    let time = this.getDateTime('time', createdAt);

    if(createdAt && updatedAt) {
      // let date = this.getDateTime('date', createdAt);
      // let time = this.getDateTime('time', createdAt);

      let updateDate = this.getDateTime('date', updatedAt);
      let updateTime = this.getDateTime('time', updatedAt);

      alert('Created At \n' + date + '\nAt ' + time + '\n\nAnd Updated At\n' + updateDate + '\n' + updateTime);
    } else if (createdAt){
      // let date = this.getDateTime('date', createdAt);
      // let time = this.getDateTime('time', createdAt);
      alert('Created At \n' + date + '\nAt ' + time);
    } else if(!createdAt || !updatedAt ){
      let error = 'Error... \n Sorry No todo creation date available 😞';
      alert(error);
    } else {
      return '';
    }
  };

  getDateTime = (str,time) => {
    if(str === 'date') {
      return new Date(time).toDateString();
    } else if(str === 'time') {
      return new Date(time).toLocaleTimeString();
    }
  }

  handleEdit = id => {
    this.setState({ edit: !this.edit, todoEditId: id });
  }

  handleEditChange = async (e, id) => {
    const todos = this.state.todos.map((todo) => {
      if(todo.id === id){
        return {
          ...todo,
          todoText: e,
          updatedAt: new Date()
        }
      } else {
        return todo
      }
    })
    await this.setState({ todos });

    await this.setLocalStorage('todos', this.state.todos);
  }

  render() {
    const { todos, todo, focus, edit, todoEditId } = this.state;

    return (
      <View>
        <View
          style={{
            display:'flex',
            flexDirection: 'row',
            borderColor: '#111',
          }}
        >
          <TextInput
            style={{
              borderColor: '#111',
              borderBottomWidth: 0.5,
              flex: 1,
            }}
            value={ todo.todoText }
            // autoFocus={focus}
            name="todoText"
            onChangeText={ this.handleChange }
            placeholder="ADD TODO..."
            onSubmitEditing={ this.handleSubmit }
          />
          <Button
            title="ADD"
            style={{
              flex: 4,
            }}
            onPress={this.handleSubmit}
          />
        </View>

        <ScrollView
          style={{
            marginBottom: 30,
          }}
        >
            {
              todos.map((todo, i) => (
                <View
                  key={i}  
                >
                {
                  (todo.id === todoEditId) && edit
                  ?
                    <TextInput
                      style={{
                        borderColor: '#999',
                        borderBottomWidth: 0.5,
                        flex: 1,
                      }}
                      value={ todo.todoText }
                      name='editInput'
                      autoFocus={focus}
                      onBlur={() => this.setState({ edit: !edit })}
                      onChangeText={
                        (e) => this.handleEditChange(e, todo.id)
                      }
                    />
                  :
                    <View
                      key={i}
                      style={{
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}  
                    >
                      <Switch
                        value={ todo.isDone }
                        onChange={() => this.handleToggle(todo.id)}
                      />
                      <Text
                        style={
                          todo.isDone
                          ? 
                          {
                            textDecorationLine: 'line-through',
                            paddingLeft: 20,
                            flex: 1,
                            color: '#999'
                          } 
                          : 
                          {
                            paddingLeft: 20,
                            flex: 1
                          }
                        } 
                        onPress={() => this.handleEdit(todo.id)}
                      >
                        {todo.todoText}
                      </Text>

                    
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <Text
                          onPress={
                            () => this.showTodoCreationDate(todo.createdAt, todo.updatedAt)
                          }
                          style={{
                            marginRight: 20,
                          }}
                        >
                          ⌚
                        </Text>
                        <Text onPress={() => this.handleDelete(todo.id)}>❌</Text>
                      </View>
                    </View>
                  }
                </View>
              ))
            }
        </ScrollView>
      </View>
    );
  }
}