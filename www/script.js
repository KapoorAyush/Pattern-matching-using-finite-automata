
var ans=''
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: '',pattern:'',locations:'',rword:'',modifiedtxt:''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
    this.handleChangepat = this.handleChangepat.bind(this);
    this.handleChangerword = this.handleChangerword.bind(this);
  }
  
  handleChange(event) {
    this.setState({ text: (event.target.value.replace(/(\r\n|\n|\r)/gm," ")).replace(/[^\x00-\x7F]/g, "").replace(/["]/g, "") });
    // this.setState({text: event.target.value,summary:'',points:''});
  }
  handleChangepat(event){
    this.setState({pattern:event.target.value});
  }
  handleChangerword(event){
    this.setState({rword:event.target.value});
  }
  handleSubmit(event) {
   
    var txt="{\"text\":\""+ this.state.text +"\",\"pattern\":\""+ this.state.pattern +"\"}";
    var xhr = new XMLHttpRequest();
    var z = this;
      
    xhr.open('post', '/api/mpg', true);
      
    xhr.onload = function () {
      var msg = JSON.parse(this.response)
      //  console.log("**" + msg.locations[0])
      //var mt=String(msg.modifiedtxt);
      //points=mt.split(',');
      if(msg.pattern==''){
        ans='Please Enter some pattern/string.'
        msg.locations=''
      }
      else if((String(msg.locations).split(','))[0]!=''){
        ans='Pattern Found at index : '
      }
      else{
        ans='Pattern not found!!'
      }
      z.setState({locations:`${msg.locations}`})
    };

    xhr.send(txt);
    console.log(z.state)
    document.getElementById("sec").style.display="block";
    event.preventDefault();

  }
  handleSubmit2(event) {
   
    var txt="{\"text\":\""+ this.state.text +"\",\"pattern\":\""+ this.state.pattern +"\",\"rword\":\""+ this.state.rword +"\"}";
    console.log("**" + txt)
    var xhr = new XMLHttpRequest();
    var z = this;
      
    xhr.open('post', '/rep', true);
      
    xhr.onload = function () {
      console.log("**" + this.response)  
      var msg = JSON.parse(this.response)
      //  console.log("**" + msg.locations[0])
      //var mt=String(msg.modifiedtxt);
      //points=mt.split(',');
      z.setState({modifiedtxt:`${msg.modifiedtxt}`})
    };

    xhr.send(txt);
    console.log(z.state)
    document.getElementById("hid").style.display="block";
    event.preventDefault();

  }

  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit} className="form">
        <textarea rows="10" cols="100" className="textInput" placeholder="Enter or copy some text here..." value={this.state.text} onChange={this.handleChange} />  
        <br/>
        <input type="text" value={this.state.pattern} className="inp" placeholder="Enter a Pattern/String to find" onChange={this.handleChangepat}/>
        <input type="submit" value="Find" className="btn btn-outline-dark" id="submitButton"/>
        <p id="head">{ans+this.state.locations}</p>
        {/* <ul id="points">
          {points.map(points => <li>{points}</li>)}
        </ul> */}
      </form>
      <form onSubmit={this.handleSubmit2} className="form" id="sec" >
      <input type="text" value={this.state.rword} className="inp" placeholder="Enter the Pattern/String to replace with" onChange={this.handleChangerword}/>
      <input type="submit" value="Replace" className="btn btn-outline-dark" id="submitButton"/>
      <h2 id="hid">Modified Text</h2>
      <p id="mod">{this.state.modifiedtxt}</p>
      {/* <ul id="points">
        {points.map(points => <li>{points}</li>)}
      </ul> */}
      </form>
      </div>
    );
  }
}

ReactDOM.render(
  <NameForm />,
  document.getElementById('root')
);