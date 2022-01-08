import React, { useState, useEffect} from 'react'
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import '../styled.css'
import Image from './Image.js'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

function Cam() {

  const [cam, setCam] = useState([])

  useEffect(() => {
    fetch("/cam").then(
      res => res.json()
    ).then(
      cam => {
        setCam(cam)
        console.log(cam)
      }
    )
  }, [])

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="middle"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 10 }}
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Person Re-identification Annotator
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Router forceRefresh={true}>
        <p className="cam">
          Please select a camera:
        </p>
        <div className='cam_section'>
          {(cam.length < 1) ? (
            <p>Loading...</p>
          ) : (
            cam.cam.map((cam_num, i) => (
              <div className='cam_border'>
                <Link to={"/"+cam_num} >{cam_num}</Link>
              </div> 
            ))
          )}
          <Route path="/:cam" ><Image /></Route>
        </div>
      </Router>
    </>
  );
}
  
export default Cam;
  