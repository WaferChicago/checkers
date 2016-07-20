/* eslint-disable react/prop-types, max-len */
import React from 'react';
import Square from './Square';

class Board extends React.Component {
  constructor(props) {
    super(props);
    const board = new Array(8);
    for (let y = 0; y < 8; y++) {
      board[y] = new Array(8).fill(null);
    }
    this.state = { board };
  }
  componentWillReceiveProps(nextProps) {
    const board = nextProps.board;
    // console.log('props board:', board);
    // build def
    this.state = { board };
    // console.log('board props this.state:', this.state);
  }

  render() {
    // console.log('board this.state:', this.state);
    return (
      <div className="Board" >
        {this.state.board.map((r, y) =>
          <div key={y} className="boardrow">
            {r.map((s, x) => (<Square key={x.toString() + y.toString()} x={x} y={y} piece={s} moveChecker={this.props.moveChecker} />))}
          </div>
          )
        }
      </div>
    );
  }
}
export default Board;
