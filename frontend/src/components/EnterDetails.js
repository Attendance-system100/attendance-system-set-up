import React, { Component } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardUser } from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default class EnterDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      year: 0,
      branch: "",
      section: "",
      courseid: "",
      class:"",
      isLoading: false,
      buttonText: "Get Started"
    };
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBranchChange = this.handleBranchChange.bind(this);
    this.handleSectionChange = this.handleSectionChange.bind(this);
    this.handleCourseChange = this.handleCourseChange.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
  }

  handleYearChange(event,value) {
    if(value)
    {
      this.setState({ year: value.label });
      }  
    }

  handleBranchChange(event,value) {
    if(value){
    this.setState({ branch: value.label });
  }

}

  handleSectionChange(event,value) {
    if(value){
      this.setState({ section: value.label });
    }
    
  }

  handleCourseChange(event,value) {
    if(value){
      this.setState({ courseid: value.label });
    }
    
  }
  handleClassChange(event,value) {
    if(value){
      this.setState({class:value.label})
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log(this.state);
    this.setState({ isLoading: true, buttonText: "Processing" });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: this.state.year,
        branch: this.state.branch,
        section: this.state.section,
        courseid: this.state.courseid,
        class:this.state.class,
      }),
    };

    fetch("/api/extract-data", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.props.history.push('/verify-attendance', { additionalProp: { data } });
        // this.setState({ isLoading: false, buttonText: "Get Started" });
      });


  }
  render() {
    return (
      <ThemeProvider theme={defaultTheme} >
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#075679' }}>
              <FontAwesomeIcon icon={faClipboardUser} />
            </Avatar>
            <Typography component="h1" variant="h5" color={'#075679'} fontFamily={'Comic Sans MS'}>
              Enter Details
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete 
                  onChange={this.handleYearChange} 
                  disablePortal
                  options={[{label:2021}]}
                  disabled={this.state.isLoading}
                  renderInput={(params)=><TextField {...params}
                    name="Year"
                    required
                    fullWidth
                    id="Year"
                    label="Year"
                    autoFocus
                  />}
                  />
                  
                </Grid>
                <Grid item xs={12} sm={6}>
                <Autocomplete 
                  disablePortal
                  options={[{label:"EAC"}]}
                  onChange={this.handleBranchChange}
                  disabled={this.state.isLoading}
                  renderInput={(params)=><TextField {...params}
                    required
                    fullWidth
                    id="Branch"
                    label="Branch"
                    name="lastName"
                  />}
                /> 
                </Grid>
                <Grid item xs={12} sm={6}>
                <Autocomplete 
                  onChange={this.handleSectionChange} 
                  disablePortal
                  options={[{label:"A"}]}
                  disabled={this.state.isLoading}
                  renderInput={(params)=> <TextField {...params}
                    required
                    fullWidth
                    id="Section"
                    label="Section"
                    name="Section"
                  />}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <Autocomplete 
                  onChange={this.handleClassChange} 
                  disablePortal
                  options={[{label:"C401"}]}
                  disabled={this.state.isLoading}
                  renderInput={(params)=> <TextField {...params}
                    required
                    fullWidth
                    id="Class"
                    label="Room Number"
                    name="Class"
                  />}
                />
                </Grid>
                <Grid item xs={12}>
                <Autocomplete 
                  onChange={this.handleCourseChange} 
                  disablePortal
                  options={[{label:"19MAT2015"},{label:"19EAC211"},{label:"19EAC212"},{label:"19EAC213"},{label:"19EAC214"},{label:"19AVP211"},{label:"19SSK211"}]}
                  disabled={this.state.isLoading}
                  renderInput={(params)=><TextField {...params}
                    required
                    fullWidth
                    name="CourseId"
                    label="Course ID"
                    id="CourseId"
                  />}
                />
                </Grid> 
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={this.handleSubmit}
                style={{
                  backgroundColor: this.state.isLoading ? '#2f6e88' : '#064560',
                  fontFamily: 'Comic Sans MS',
                  color: "white"
                }}
                disabled={this.state.isLoading}
              >
                {this.state.isLoading ? (
                  <React.Fragment>
                    <span>{this.state.buttonText}</span>
                    <CircularProgress size={24} style={{ marginLeft: 8, color: "white" }} />
                  </React.Fragment>
                ) : (
                  this.state.buttonText
                )}

              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}