import React from 'react';
import './CloseButton.scss';

export default class CloseButton extends React.PureComponent {
  render() {
    return (
      <div className="close-button-row">
        <div 
            className="close-button" 
            onClick={this.props.onClose} 
        />
      </div>
    );
  }
}