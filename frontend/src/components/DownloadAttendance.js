import React, { Component } from 'react';
import styles from './DownloadAttendance.css';

export default class DownloadAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: this.props.location.state.additionalProp.data.year,
      branch: this.props.location.state.additionalProp.data.branch,
      section: this.props.location.state.additionalProp.data.section,
      courseid: this.props.location.state.additionalProp.data.courseid,
      class:this.props.location.state.additionalProp.data.class,
    };
  }

  goToHome = () => {
    this.props.history.push('/details')
  }

  downloadFile = () => {
    console.log(this.state);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: this.state.year,
        branch: this.state.branch,
        section: this.state.section,
        courseid: this.state.courseid,
        class:this.state.class,
        downloaded: false
      }),
    }
    fetch("/api/download-sheet", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ downloaded: true });
      });
  }

  render() {
    const { downloaded } = this.state;
    return (
      <div className={styles['box-container']}>
        <div className={styles.box}>
          <h2 className={styles['sample-text']}>Your File is Ready</h2>
          {downloaded && (
            <p className={styles['success-text']}>Successfully downloaded</p>
          )}
          <div className={styles['button-container']}>
            <button className={styles['download-button']} onClick={this.downloadFile}>Download</button>
            <button className={styles['home-button']} onClick={this.goToHome}>Home</button>
          </div>
        </div>
      </div>
    );
  }
}
