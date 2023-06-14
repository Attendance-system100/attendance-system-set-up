import React, { Component } from 'react';
import RoundedBox from './RoundedBox';
export default class StudentItem extends Component {
  constructor(props) {
    super(props);
  };

  handleMarkPresent = () => {
    const { student, markStatus } = this.props;
    markStatus(student.name, 'present');
  };

  handleMarkAbsent = () => {
    const { student, markStatus } = this.props;
    markStatus(student.name, 'absent');
  };


  render() {
    const { student } = this.props;

    return (
      <div key={student.name} style={{
        display: 'flex',
        justif: 'center',
      }} >
        <RoundedBox
          text={student.name}
          onPlusClick={this.handleMarkPresent}
          onMinusClick={this.handleMarkAbsent}
        />
        {/* <span>{student.name}</span>
        <button onClick={this.handleMarkAbsent}>-</button>
        <button onClick={this.handleMarkPresent}>+</button> */}
      </ div>
    );
  }
}