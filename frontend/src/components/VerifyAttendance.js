import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import styles from './VerifyAttendance.module.css'

class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: this.props.location.state.additionalProp.data.year,
      branch: this.props.location.state.additionalProp.data.branch,
      section: this.props.location.state.additionalProp.data.section,
      courseid: this.props.location.state.additionalProp.data.courseid,
      class:this.props.location.state.additionalProp.data.class,
      students: this.props.location.state.additionalProp.data.students
    };
    // this.state = {
    //   students: [
    //     { name: 'John', status: 'Unknown' },
    //     { name: 'Jane', status: 'Unknown' },
    //     { name: 'Michael', status: 'Unknown' },
    //     { name: 'Emily', status: 'Unknown' }
    //   ]
    // };
  }

  markStatus = (name, status) => {
    this.setState((prevState) => {
      const updatedStudents = prevState.students.map((student) => {
        if (student.name === name) {
          return { ...student, status: status };
        }
        return student;
      });
      return { students: updatedStudents };
    });
  };
  componentDidMount() {
    const { students } = this.state;
    if (students.length == 0) {
      let data = this.state;
      setTimeout(() => {
        this.props.history.push('/download-attendance', { additionalProp: { data } });
      }, 1000);
    }
    else {
      const allStudentsMarked = students.every(
        (student) => student.status !== 'Unknown'
      );

      if (allStudentsMarked) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year: this.state.year,
            branch: this.state.branch,
            section: this.state.section,
            courseid: this.state.courseid,
            class:this.state.class,
            students: this.state.students,
          }),
        };
        console.log(this.state);
        fetch("/api/update-data", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            this.props.history.push('/download-attendance', { additionalProp: { data } });

          });
      }
      // Redirect to next page when all students are marked
      // You can replace '/next-page' with your desired route
      // setTimeout(() => {
      //   // Redirect to next page when the loading animation finishes
      //   // You can replace '/next-page' with your desired route
      //   console.log("Screen Loadings");
      // }, 2000);
    }
  }


  componentDidUpdate() {
    const { students } = this.state;
    const allStudentsMarked = students.every(
      (student) => student.status !== 'Unknown'
    );
    if (allStudentsMarked) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: this.state.year,
          branch: this.state.branch,
          section: this.state.section,
          courseid: this.state.courseid,
          class:this.state.class,
          students: this.state.students,
        }),
      };

      fetch("/api/update-data", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          this.props.history.push('/download-attendance', { additionalProp: { data } });

        });
      // Redirect to next page when all students are marked
      // You can replace '/next-page' with your desired route
      // setTimeout(() => {
      //   // Redirect to next page when the loading animation finishes
      //   // You can replace '/next-page' with your desired route
      //   console.log("Screen Loadings");
      // }, 2000);
    }
  }

  render() {
    const { students } = this.state;
    const allStudentsMarked = students.every(
      (student) => student.status !== 'Unknown'
    );
    if (allStudentsMarked) {
      return (

        <div class={styles.container}>
          <div class={styles['dot-flashing']}></div>
          <span class={styles['updating-text']}>Updating</span>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <h2 class={styles.text}>Verify Attendance</h2>
        {students.map((student) => {
          if (student.status === 'Unknown') {
            return (
              <div className={styles['student-item']} key={student.name}>
                <span className={styles['student-name']}>{student.name}</span>

                <button
                  onClick={() => this.markStatus(student.name, 'present')}
                  className={`${styles['status-button']} ${styles.present}`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>

                <button
                  onClick={() => this.markStatus(student.name, 'absent')}
                  className={`${styles['status-button']} ${styles.absent}`}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
}

export default StudentList;
