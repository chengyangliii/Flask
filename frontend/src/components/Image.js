import React, { useState, useEffect} from 'react'
import '../styled.css'
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { withRouter } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

function Image(props) {

  console.log("props in image: " + JSON.stringify(props.match.params.cam))

  const [data, setData] = useState([])
  const [value, setValue] = useState([])

  useEffect(() => {
    fetch('/api/getCam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: props.match.params.cam
      })
    })
    fetch("/members").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])
 
  const handleChange = (event) => {
    if (value.includes(event.target.value)) {
      const list = value;
      const index = list.indexOf(event.target.value)
      if (index > -1) {
        list.splice(index, 1);
      }
      setValue(list);
      console.log(value)
    } else {
      console.log(event.target.value)
      const list = value;
      list.push(event.target.value)
      setValue(list);
      // 1629266502.8616345.png
      // masks_ut_rgba/cam0/5
      console.log(value)
    }
  }

  const timeStampConverter = (timeStamp) => {
    var unixTimestamp = timeStamp
    var date = new Date(unixTimestamp * 1000)
    return "HH:mm:ss " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
  }

  const handleMerge = e => {
    e.preventDefault();
    console.log("value in submit " + value)
    fetch('/api/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: value
        })
    })
    setValue([])
    window.location.reload(false);
  }

  const handleSplit = e => {
    e.preventDefault();
    console.log("value in submit " + value)
    fetch('/split', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: value
        })
    })
    setValue([])
    window.location.reload(false);
  }

  const handleDelete = e => {
    e.preventDefault();
    console.log("value in submit " + value)
    fetch('/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: value
        })
    })
    setValue([])
    window.location.reload(false);
  }

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
      <div className='image_section'>
        {(typeof data.members === 'undefined') ? (null) : (
          <div>
            <p>* First chosen ID will be the destination in merge</p>
            <form className="merge_Button">
              <Button variant="contained" onClick={handleMerge}>Merge</Button>
            </form>
            <form className="split_Button">
              <Button color='success' variant="contained" onClick={handleSplit}>Split</Button>
            </form>
            <form className="delete_Button">
              <Button color='info' variant="contained" onClick={handleDelete}>Delete</Button>
            </form>
          </div>
        )}
        {(typeof data.members === 'undefined') ? (
          <p>Loading</p>
        ) : (
          data.members.map((member, i) => (
            <div className="flex-container">
              <div>
                <p className="id_Style">
                  <FormControlLabel value={member[0]} control={<Checkbox onClick={handleChange}/>} label={member[0].replace('masks_ut_rgba/cam0/', 'ID ')} />
                </p>
              </div>
              {
                member[1].sort().map(item => (
                  <ul>
                    <div>
                      {
                        timeStampConverter(item.slice(0, -4))
                      }
                    </div>
                    <li className="flex-item">
                      <img src={process.env.PUBLIC_URL + member[0] + '/' + item}  alt='not found'/>
                    </li>
                    <FormControlLabel value={member[0] + '///' + item} control={<Checkbox onClick={handleChange}/>} label={item}  />
                  </ul>
                ))
              }
            </div> 
          ))
        )}
      </div>
    </>
  );
}

export default withRouter(Image);
