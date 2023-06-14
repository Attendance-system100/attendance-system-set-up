import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

export default class RoundedBox extends Component {
  render() {
    const { text, onPlusClick, onMinusClick } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '8px',
          padding: '10px',
          margin: '10px',
          width: '200px',
          border: 'solid 2px grey'
        }}
      >
        <span style={{ flex: 1 }}>{text}</span>
        <button
          onClick={onPlusClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            marginRight: '5px',
          }}
        >
          <FontAwesomeIcon icon={faPlus} color={'#43A047'} />
        </button>
        <button
          onClick={onMinusClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
          }}
        >
          <FontAwesomeIcon icon={faMinus} color={'#D32F2F'} />
        </button>
      </div>
    );
  }
}

