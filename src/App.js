import React from 'react';
import './App.css';
import * as firebase from 'firebase';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: '',
      progress: 0,
      linkList: []
    }
  }
  componentDidMount() {
    var firebaseConfig = {
      apiKey: "AIzaSyARkGivkBwOtOOx1ZPcP-F0v_AemEEa3eY",
      authDomain: "class-assignment-2308b.firebaseapp.com",
      databaseURL: "https://class-assignment-2308b.firebaseio.com",
      projectId: "class-assignment-2308b",
      storageBucket: "class-assignment-2308b.appspot.com",
      messagingSenderId: "240772103617",
      appId: "1:240772103617:web:48c26435fa72a0ff"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  async handleChange(e) {
    var that = this;
    let arr = Array.from(e.target.files);
    var linkList = [];
    var progress = 0;
    if (arr.length <= 10) {
      arr.map(item => {
        let uploadTask = firebase.storage().ref(`/image/${item.name}`).put(item);
        uploadTask.on('state_changed', function (snapshot) {
          progress += (snapshot.bytesTransferred / snapshot.totalBytes);
          let perc = (progress / arr.length) * 100
          that.setState({ progress: perc })
        }, function (error) {
          alert(error.message)
        }, function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            linkList.push({ imageLink: downloadURL, name: item.name })
            if (linkList.length === arr.length) {
              axios.post('https://imageuploadingapp.herokuapp.com/api/uploadImageList', linkList)
                .then(() => that.setState({ linkList }))
                .catch(e => alert('error' + e.message ))
              // that.setState({ linkList })
            }
          });
        });
      })
    } else {
      alert('you can choose only 10 files')
      const file = document.querySelector('#aaa');
      file.value = '';
    }
  }

  render() {
    return (
      <div className="App" style={{ width: '100%' }} >
        <div className="row">
          <div className="col-md-6  center">
            <input type='file' multiple={true} id='aaa' onChange={(e) => this.handleChange(e)} accept="image/*" />
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 40, }} >{this.state.progress > 100 ? 100 : Math.floor(this.state.progress)}% Completed... </p>
        <div className="progress" style={{ width: '40%', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="progress-bar" role="progressbar" style={{ width: ` ${this.state.progress}%` }}  ></div>
        </div>
        <div className='container' >
          <ol>
            {
              this.state.linkList.length !== 0 ?
                this.state.linkList.map((v, i) => {
                  return (
                    <li key={i} ><a href={v.link}>{v.name}</a></li>
                  )
                }) : null
            }
          </ol>
        </div>
      </div>
    );
  }
}

export default App;
