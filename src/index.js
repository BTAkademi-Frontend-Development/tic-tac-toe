import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
//redux - flux
class Square extends React.PureComponent {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

const Square = ({props}) => {
  return (
      ...
    );
};

*/

function Square(props) {
  return (
    <button className= {props.classes} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.PureComponent {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} 
      classes={this.props.lastClickedIndex === i ? 'square green' : 'square'}/>; //onClick={() => this.handleClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastClickedIndex: -1
      }],
      stepNumber: 0,
      xIsNext: true, //true: X, false: O
      remaining: 9
    };
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const tiles = this.state.remaining - 1;
    this.setState({
      history: history.concat([{
        squares: squares,
        lastClickedIndex: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      remaining: tiles
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      remaining: 9 - step
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      const tile = this.state.remaining;
      if (tile === 0)
        status = 'Game Tie!';
      else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O') + ', Remaining available tiles:' + tile;
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            lastClickedIndex={current.lastClickedIndex}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Merhaba {this.props.name}
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  //react component lifecycle
  componentDidMount() {
    this.interval = setInterval(() => this.setState(state => ({ //setState react hook
      seconds: this.state.seconds + 1
    })), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Saniye: {this.state.seconds} oldu {this.props.name}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);