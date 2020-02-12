import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  AsyncStorage,
  Button,
  ScrollView,
  CheckBox
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
      todoEditId: '',

      url: 'http://localhost:8000/api/v1/users/login',
      user : {
        email: 'test_user@gmail.com',
        password: 'qwerty123'
      },
      editedTodo: {
        previousValue: '',
        id: '',
      }
    };

    // this.interval();
  }

  componentDidMount() {
    const { url, user } = this.state;
    this.fetchData(url, 'POST', user);
  }

  fetchData = (url, method='GET', data={}) => {
    console.log('inside fetch data...');
    
    fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(res => {
      console.log(res, 'login response...')
      res.json()
    })
    .then(user => console.log(user, 'login data...'))
    .catch(err => console.log(err, 'login error...'));
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

  handleSubmit = async (e, btn) => {    
    const name = e._dispatchInstances.pendingProps.name;
    const { text } = e.nativeEvent;
        
    let addTodo = async () => {
      
      if(this.state.todo.todoText.trim()){
        const todos = [
          {
            ...this.state.todo,
            id: Date.now(),
            todoText: this.state.todo.todoText,
            createdAt: new Date(),
          },
          ...this.state.todos,
        ];

        await this.setState({
          todos: todos,
          todo: {
            ...this.state.todo,
            todoText: '',
          },
        });

        if (this.state.todos.length) {
          await this.setLocalStorage('todos', this.state.todos);
        }
      } else {
        return;
      }
    }

    if(e._dispatchInstances.pendingProps.name === 'editInput'){

      if(text){
        addTodo();
      }
      if(!text){
        
        const todos = this.state.todos.map(todo => {
          if(todo.id === this.state.editedTodo.id){
            return {
              ...todo,
              todoText: this.state.editedTodo.previousValue
            }
          } else {
            return todo;
          }
        })

        await this.setState({
          todos: todos,
        });

        if (this.state.todos.length) {
          await this.setLocalStorage('todos', this.state.todos);
        }
      }
    } else if(e._dispatchInstances.pendingProps.name === 'todoText' || btn){
      addTodo();
    }
  };

  setLocalStorage = (key, data) => {
    AsyncStorage.setItem(key, JSON.stringify(data))
      .then(todos => {
        console.log(todos, 'asysn storage todod set success!');
      })
      .catch(err => console.log(err, "err setting todos in async storage..."));
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
        console.log('get async storage todos...');
        if (data) {
          this.setState({ [todos]: data });
        };
      })
      .catch(err => console.log(err, "err getting async storage todos..."));
  };

  showTodoCreationDate = ( createdAt, updatedAt) => {
    let date = this.getDateTime('date', createdAt);
    let time = this.getDateTime('time', createdAt);

    if(createdAt && updatedAt) {
      let updateDate = this.getDateTime('date', updatedAt);
      let updateTime = this.getDateTime('time', updatedAt);

      alert('Created At \n' + date + '\nAt ' + time + '\n\nAnd Updated At\n' + updateDate + '\n' + updateTime);
    } else if (createdAt){
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
        return todo;
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
            id="todoText"
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
            onPress={(e) => this.handleSubmit(e, 'btn')}
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
                      id='editInput'
                      name='editInput'
                      onFocus={
                        () => {
                          this.setState({
                            editedTodo: {
                              previousValue: todo.todoText,
                              id: todo.id
                            }
                          })
                        }
                      }

                      autoFocus={focus}
                      onBlur={() => this.setState({ edit: !edit })}
                      onChangeText={
                        (e) => this.handleEditChange(e, todo.id)
                      }
                      onSubmitEditing={ this.handleSubmit }
                    />
                  :
                    <View
                      key={i}
                      style={{
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems:'center'
                      }}  
                    >
                      <CheckBox
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