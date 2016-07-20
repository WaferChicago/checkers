/* eslint-disable max-len, react/prop-types */
import React from 'react';

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = { piece: null };
    // this.props.moveChecker.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const x = nextProps.x;
    const y = nextProps.y;
    const piece = nextProps.piece;
    this.state = { x, y, piece };
    // console.log('props Square:', this.state);
  }

  render() {
    // const key = `sq_${this.state.y}${this.state.x}`;
    // console.log('squareKey', key);
    let squareContent = <div className="emptySquare" data-x={this.state.x} data-y={this.state.y} onClick={this.props.moveChecker} />;
    let imgSrc;
    if (this.state.piece !== null) {
      if (this.state.piece.color === 'Red') {
        imgSrc = 'http://cliparts.co/cliparts/ATb/jRa/ATbjRan5c.png';
      } else {
        imgSrc = 'http://slugco.com/movies/009/blackcircle.png';
      }
      const imgClassName = (this.state.piece.isKinged) ? 'checkerKing' : 'checker';
      squareContent = <img className={imgClassName} data-x={this.state.x} data-y={this.state.y} src={imgSrc} onClick={this.props.moveChecker} alt="" />;
    }
    return (
      <div className="boardsquare" >
        <p className="coords">{this.state.y},{this.state.x}</p>
        {squareContent}
      </div>
    );
  }
}
export default Square;
