/* eslint-disable max-len */
import React from 'react';

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = { piece: null };
  }
  componentWillReceiveProps(nextProps) {
    const x = nextProps.x;
    const y = nextProps.y;
    const piece = nextProps.piece;
    this.state = { x, y, piece };
    console.log('props Square:', this.state);
  }

  render() {
    // const key = `sq_${this.state.y}${this.state.x}`;
    // console.log('squareKey', key);
    let squareContent = <div></div>;
    let imgSrc;
    if (this.state.piece !== null) {
      if (this.state.piece.color === 'Red') {
        imgSrc = 'http://cliparts.co/cliparts/ATb/jRa/ATbjRan5c.png';
      } else {
        imgSrc = 'http://slugco.com/movies/009/blackcircle.png';
      }
      squareContent = <img className="checker" src={imgSrc} alt="" onDragStart="dragStart(event)" draggable="true" />;
    }
    return (
      <div className="boardsquare" >
          {squareContent}
      </div>
    );
  }
}
export default Square;
