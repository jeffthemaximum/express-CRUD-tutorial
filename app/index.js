import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render(){
        debugger;
        return(
            <div>
                <h1>Howdy from React!</h1>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));