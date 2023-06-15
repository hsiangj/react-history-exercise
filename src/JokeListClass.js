import React from "react";
import axios from "axios";
// import Joke from "./Joke";
import Joke from "./JokeClass";
import "./JokeList.css";

class JokeList extends React.Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props){
    super(props)
    this.state = {
      jokes: []
    }

    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.vote = this.vote.bind(this);

  };
  
  /* at mount, get jokes */
  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }
    
  /* retrieve jokes from API */
  async getJokes() {
      let jokes = this.state.jokes;
      let seenJokes = new Set(jokes.map((j) => j.id));
    try {
      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;
  
        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          jokes.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({jokes});
    } catch (e) {
      console.log(e);
    } 

  }
  

  /* empty joke list and then call getJokes */

  generateNewJokes() {
    this.setState({jokes:[]});
  }

  /* change vote for this id by delta (+1 or -1) */

  vote(id, delta) {
    this.setState(allJokes => ({
      jokes: allJokes.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    }));
  }

  render() {
    /* render: either loading spinner or list of sorted jokes. */
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

    return(
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>
          Get New Jokes
        </button>
  
        {sortedJokes.map(j => (
          <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
        ))}

        {sortedJokes.length < this.props.numJokesToGet ? (
          <div className="loading">
            <i className="fas fa-4x fa-spinner fa-spin" />
          </div>
        ) : null}
      </div>
    )
  }
}

export default JokeList;