
var points=[]
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
    this.setState({ text: event.target.value.replace(/(\r\n|\n|\r)/gm," ") });
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
       console.log("**" + msg.locations[0])
      //var mt=String(msg.modifiedtxt);
      //points=mt.split(',');
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
  
    event.preventDefault();

  }

  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit} className="form">
        <textarea rows="10" cols="100" className="textInput" placeholder="Copy and paste a news article here..." value={this.state.text} onChange={this.handleChange} />  
        <br/>
        <input type="text" value={this.state.pattern} onChange={this.handleChangepat}/>
        <input type="submit" value="Generate Summary" className="btn btn-outline-dark" id="submitButton"/>
        <p id="head">{this.state.locations}</p>
        {/* <ul id="points">
          {points.map(points => <li>{points}</li>)}
        </ul> */}
      </form>
      <form onSubmit={this.handleSubmit2} className="form" id="sec" >
      <input type="text" value={this.state.rword} onChange={this.handleChangerword}/>
      <input type="submit" value="Replace" className="btn btn-outline-dark" id="submitButton"/>
      <p id="head">{this.state.modifiedtxt}</p>
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