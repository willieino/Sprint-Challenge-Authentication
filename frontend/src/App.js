import React, { Component } from 'react';
import axios from 'axios';
import User from './components/User';
import { Input } from 'reactstrap';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      username: "",
      password: "",
      display: true,
      disabled: true,
      userList: [],
      userInfo: []
    })
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

   handleSubmit = event => {
    event.preventDefault();
    const credentials = this.state;
    const endpoint = 'http://localhost:3300/api/login';
    axios.post(endpoint, credentials)
      .then(res => {
        console.log('reponse data from login', res.data);
        localStorage.setItem('jwt', res.data.token);
        alert("login successful")
        const name = "";
        const password = "";
        this.setState({ username: name, password: password })
        console.log("this.state is: ", this.state)
      }).catch(err => {
        console.log('err from login', err);
      });
  }
  // ********* USER LOGIN **************************
  login = (e) => {
    e.preventDefault();
    if (this.state.username && this.state.password) {
      const userInfo =
      {
        username: this.state.username,
        password: this.state.password
      };
      const endpoint = 'http://localhost:3300/api/login';
      axios
      .post('http://localhost:3300/api/login', userInfo)
        .then(res => {
          console.log('reponse data from login', res.data);
          localStorage.setItem('jwt', res.data.token);
          alert('Login successful...')
          const passWord = "";
          const userName = "";
          this.setState(() => ({ username: userName, password: passWord, display: false, disabled: false }))
        })
        .catch(err => {
          console.error('err from login', err);
        });
    } else {
      alert('Please enter a username, password')
    }
  }

  // ************ USER REGISTER ***************************
  register = (e) => {
    e.preventDefault();
    if (this.state.username && this.state.password) {
      const userInfo =
      {
        username: this.state.username,
        password: this.state.password
      };
      axios
        .post('http://localhost:3300/api/register', userInfo)
        .then(response => {
          alert('registration complete...')
          let passWord = "";
          let userName = "";
          this.setState(() => ({ username: userName, password: passWord }))
        })
        .catch(error => {
          console.error('Server Error', error);
        });
    } else {
      alert('Please enter a username and password')
    }
  }

  // ************ GET USER LIST *******************
  userList = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    const endpoint = 'http://localhost:3300/api/users';
    const options = {
      headers: {
        Authorization: token
      }
    };
     axios
      .get('http://localhost:3300/api/users/', options)
     
        .then(response => {
          console.log("response.data", response.data)
          let tmpArray = [];
          for (let x = 0; x < response.data.length; x++) {
  console.log("response.data[x].username:", response.data[x].username)
            tmpArray.push(response.data[x].username)

          }
         
           this.setState(() => ({ userList: tmpArray }))
        })

     
      .catch(error => {
        console.error('Server Error', error);
      });
    }
     
jokeList = (e) => {
  e.preventDefault();
  const requestOptions = {
    headers: { accept: 'application/json' },
  };
  axios
  .get('http://localhost:3300/api/jokes/', requestOptions)
 
    .then(response => {
      console.log("response.data", response.data)
      let tmpArray = [];
    //  response.status(200).json(response.data.results);
    for (let x = 0; x < response.data.length; x++) {
      console.log("response.data[x].username:", response.data[x].username)
                tmpArray.push(response.data[x].joke)
    
              }
             
               this.setState(() => ({ userList: tmpArray }))
  
  
  
  
  
  })
    .catch(err => {
      console.error('Server Error', err);
    });
  
  
      //function getJokes(req, res) {
    //const requestOptions = {
     // headers: { accept: 'application/json' },
    //};
  
 /*    axios
      .get('https://icanhazdadjoke.com/search', requestOptions)
      .then(response => {
        res.status(200).json(response.data.results); */
     
  

  
 
  
 
 
 
/*   const endpoint = 'http://localhost:3300/api/jokes';
axios.get(endpoint)
.then(response => {
  console.log("response.data", response.data.results)
  response.status(200).json(response.data.results);
})
  .catch(error => {
    console.error('Server Error', error);
  });
 */
}


  // ***************** USER LOGOUT **************************
 
  logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('jwt')
    alert("User has successfully signed out")
    this.setState(() => ({ userList: [], display: true, disabled: true }));
  }

  // **** USER MESSAGE JUST SOME HUMOR *****
  message = () => {
    alert("Sorry, we dont know it either... #BestSecurityEver");
  }

  render() {
    // *** CODE TO CHANGE THE LOGOUT AND USERLIST BUTTONS TEXT COLOR ****
    let classNames = require('classnames');

    let btnClass = classNames({
      btnLogout: true,
      'btnNoWork': this.state.display
    })
    return (
      <div className="App">
        <header className="main-header">
          <div className="title">Sprint Challenge:Authorization
          </div>
        </header>
        <div className="container-1">
          <div className="text"><p>This app uses web tokens to register,login. It also
            allows the user to display a protected list of users. </p> </div>
          <form className="main-form" onSubmit={this.login}>
            <Input type="text" id="username" value={this.state.username} name='username' className="form-control" placeholder="Enter Username" onChange={this.handleInputChange} />
            <Input type="text" id="password" value={this.state.password} name='password' className="form-control" placeholder="Enter Password" onChange={this.handleInputChange} />
          
            <button className="btn-register" value="register" onClick={this.register} name="viewHome" id="register">Register</button>
            <button type="submit" className="btn-login" value="login" onSubmit={this.login} name="viewHome" id="login">Login</button>
            <button className={btnClass} disabled={this.state.disabled} value="user-list" id="user-list" onClick={this.userList} name="viewHome">User List</button>
            <button className={btnClass} disabled={this.state.disabled} value="joke-list" id="joke-list" onClick={this.jokeList} name="viewHome">Joke List</button>
            <button className={btnClass} disabled={this.state.disabled} value="logout" id="logout" onClick={this.logout} name="viewHome">Logout</button>

          </form>
          <div className="message" onClick={this.message}><p>Click Here if you forgot your password.</p> </div>
          <div className={btnClass}>Joke List:{this.state.userList.map((user, index) => {
            return <User user={user} key={index} />;
          })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
