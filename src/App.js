import './App.css';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Button} from '@mui/material';
import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'
import {useState, useEffect} from "react"
const { Configuration, OpenAIApi } = require("openai");

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));


const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#999999' : '#999999',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#eeeeee',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));


//const tags = 'tribal,action,kids,neo-classic,run 130,pumped,jazz / funk,ethnic,dubtechno,reggae,acid jazz,liquidfunk,funk,witch house,tech house,underground,artists,mystical,disco,sensorium,r&b,agender,psychedelic trance / psytrance,peaceful,run 140,piano,run 160,setting,meditation,christmas,ambient,horror,cinematic,electro house,idm,bass,minimal,underscore,drums,glitchy,beautiful,technology,tribal house,country pop,jazz & funk,documentary,space,classical,valentines,chillstep,experimental,trap,new jack swing,drama,post-rock,tense,corporate,neutral,happy,analog,funky,spiritual,sberzvuk special,chill hop,dramatic,catchy,holidays,fitness 90,optimistic,orchestra,acid techno,energizing,romantic,minimal house,breaks,hyper pop,warm up,dreamy,dark,urban,microfunk,dub,nu disco,vogue,keys,hardcore,aggressive,indie,electro funk,beauty,relaxing,trance,pop,hiphop,soft,acoustic,chillrave / ethno-house,deep techno,angry,dance,fun,dubstep,tropical,latin pop,heroic,world music,inspirational,uplifting,atmosphere,art,epic,advertising,chillout,scary,spooky,slow ballad,saxophone,summer,erotic,jazzy,energy 100,kara mar,xmas,atmospheric,indie pop,hip-hop,yoga,reggaeton,lounge,travel,running,folk,chillrave & ethno-house,detective,darkambient,chill,fantasy,minimal techno,special,night,tropical house,downtempo,lullaby,meditative,upbeat,glitch hop,fitness,neurofunk,sexual,indie rock,future pop,jazz,cyberpunk,melancholic,happy hardcore,family / kids,synths,electric guitar,comedy,psychedelic trance & psytrance,edm,psychedelic rock,calm,zen,bells,podcast,melodic house,ethnic percussion,nature,heavy,bassline,indie dance,techno,drumnbass,synth pop,vaporwave,sad,8-bit,chillgressive,deep,orchestral,futuristic,hardtechno,nostalgic,big room,sci-fi,tutorial,joyful,pads,minimal 170,drill,ethnic 108,amusing,sleepy ambient,psychill,italo disco,lofi,house,acoustic guitar,bassline house,rock,k-pop,synthwave,deep house,electronica,gabber,nightlife,sport & fitness,road trip,celebration,electro,disco house,electronic';
//const genres = ['jazz / funk', 'jazz', 'neo-classic', 'liquidfunk', 'underground', 'r&b', 'classical', 'disco', 'witch house', 'tech house', 'cinematic', 'funky', 'pop', 'hippop', 'electric guitar'];
const emotions = {
  "happy": ['happy','joyful'],
  "calm": ['peaceful', 'neutral', 'orchestral'],
  "angry": ['angry','orchestral','piano'],
  "sad": ['sad','orchestral', 'piano'],
  "scared": ['mystical', 'horror', 'orchestral'],
  "excited": ['energizing', 'energy 100', 'orchestral']
}
const emotion_opts = 'happy,calm,angry,sad,scared, excited';
const find_emotions = (text) => {
  console.log(text);
  for (const [key, value] of Object.entries(emotions)) {
    if (text.includes(key)) {
      return value;
    }
  }
  return ['chill'];
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0971f1',
      darker: '#053e85',
    },
    neutral: {
      main: '#aaaaaa88',
      contrastText: '#ffffffff',
    },
    white: {
      main: '#ffffff',
      contrastText: '#aaaaaa',
    },
  },
});

const openaiKey = new URLSearchParams(window.location.search).get('key') || "none";
console.log(openaiKey);

const configuration = new Configuration({
  apiKey: openaiKey,
});

const openai = new OpenAIApi(configuration);

function App() {

  const [audioList, setAudioList] = useState([{
    "name": "Background",
    "singer": "AI", 
    "musicSrc": "bg.mp3",
    //"musicSrc": "sample0.wav",
  }
  ]);
  const [onlyPiano, setOnlyPiano] = useState(false);
  const [text, setText] = useState("");
  const [patToken, setPatToken] = useState(null);
  const [musicInstance, setMusicInstance] = useState(null);
  const [musicLink, setMusicLink] = useState([
  {
    "name": "Background",
    "singer": "AI", 
    "musicSrc": "bg.mp3",
    //"musicSrc": "sample0.wav",
  }]

  );
  const [targetMusicId, setTargetMusicId] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAudioList(musicLink);
    setTargetMusicId(targetMusicId+1);
  }, [musicLink])

  const getPiano = async () => {
    fetch('https://andymusic.xyz/piano?text='+text,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
      }
    }).then(async (res) => {
      let  resJson = await res.json();
      console.log(resJson);
      if (!resJson['ok']) {
        alert("Error generating music, try again later.");
        setLoading(false);
        return;
      }
      let songn = resJson['songn'];
      let song_link = 'https://andymusic.xyz/' + songn;
      let tmpList = [{
          singer: "AI",
          cover: "icon.png",
          name: "Music That Undertands U",
          musicSrc: song_link 
      }] 
      setMusicLink(tmpList);
      
    }).catch(err => {
      setLoading(false);
      console.log(err);
      alert('fetch error, try again later');
    })

  }

  const getPatToken = async () => {
    if (text == "") {
      console.log('empty');
      return;
    }
    setLoading(true);
    if (onlyPiano) {
      getPiano()
      return;
    }

    const gen_music = async (response) => {
      const openaiResponse = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: text + "\nwhat the sentiment of the above text based on the options. Options:"+emotion_opts+".\n",
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
      console.log(openaiResponse);
      let tags = find_emotions(openaiResponse['data']['choices'][0]['text']);
      console.log(tags)
      let resJson;
      if (patToken) {
        resJson = patToken;
      } else {
        resJson = await response.json();
        setPatToken(resJson);
      }
      console.log(resJson);
      let token =  resJson['data']['pat'];
      console.log(token);
      fetch('https://api-b2b.mubert.com/v2/RecordTrackTTM',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "method":"RecordTrackTTM",
          "params": {
              "pat": token, 
              "duration": 60,
              "tags": onlyPiano?["piano"]:tags,
              "mode": "track"
          }
        }) 
      }).then(async (response) => {
        let resJson = await response.json();
        console.log(resJson);
        let trackurl = resJson['data']['tasks'][0]['download_link']
        console.log(trackurl)
        let tmpList = [{
          singer: "AI",
          cover: "icon.png",
          name: "Music That Undertands U",
          musicSrc: trackurl
        }] 
        setMusicLink(tmpList);
      })
    }
    if (patToken) {
      gen_music(patToken);
    } else {
      let res = await fetch('https://api-b2b.mubert.com/v2/GetServiceAccess',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "method":"GetServiceAccess",
          "params": {
              "email": "lewas.ad@gmail.com",
              "license":"ttmmubertlicense#f0acYBenRcfeFpNT4wpYGaTQIyDI4mJGv5MfIhBFz97NXDwDNFHmMRsBSzmGsJwbTpP1A6i07AXcIeAHo5",
              "token":"4951f6428e83172a4f39de05d5b3ab10d58560b8",
              "mode": "loop"
          }
        })
      })
      gen_music(res);
    }
  };

  return (
    <Container className="App" sx={{height: "100vh"}}>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar variant="regular" elevation="0">
          <Typography variant="h3" color="inherit" component="div" align="left"
            sx={{fontFamily: "'Dancing Script', cursive", color: "rgb(220,220,220)", flexGrow: 1}}
          >
            Music Feels You 
          </Typography>
          <IOSSwitch sx={{ marginRight: "10px" }} onChange={()=>{console.log(onlyPiano);setOnlyPiano(!onlyPiano);}} />
          <Typography
            sx={{color: "rgb(220,220,220)"}}
          >Piano Only</Typography>
        </Toolbar>
      </AppBar>
    </Box>
    <Container sx={{marginTop: "20vh"}} ></Container>
    <ThemeProvider theme={darkTheme}>
      <Container sx={{ width: "100%", alignItems: "center", align:"center"}}>
        <Grid container spacing={5} sx={{width: "100%", alignItems: "center", align:"center"}}>
          <Grid item xs={12}>
            <Typography variant="h4" 
              sx={{fontFamily: "'Dancing Script', cursive", color: "rgb(210,210,210)"}}>
              Create Your Own Music
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" 
              sx={{fontFamily: "'Dancing Script', cursive", color: "rgb(210,210,210)"}}>
              to Connect with The Entire Universe and Every Soul
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField onChange={(event) => setText(event.target.value)} id="standard-basic" color="neutral" placeholder="Tell us about your soul..." variant="standard" multiline sx={{width: "80%"}} inputProps={{ style: { textAlign: "center" } }} />
          </Grid>
          <Grid item xs={12}>
            { loading?
            <Button variant='outlined' color="white" startIcon={<CircularProgress color="white" size="1rem" />}>
              Muse Me
            </Button>
            :
            <Button variant='outlined' color="white" onClick={getPatToken} startIcon={<MusicNoteIcon/>}>
              Muse Me
            </Button>
            }
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
    <Container sx={{height: "80px"}} ></Container>
    <ReactJkMusicPlayer theme="dark" mode="full" audioLists={audioList} autoPlay={true} toggleMode={false} autoHiddenCover={true}
      autoPlayInitLoadPlayList={true} responsive={false} preload={true} quietUpdate={true} clearPriorAudioLists={false}
      showReload={false} showThemeSwitch={false} showPlayMode={false} onAudioListsChange={async (currentPlayId,audioLists,audioInfo) => {
        console.log(audioLists);
        console.log(currentPlayId);
        console.log(audioInfo);
        console.log(targetMusicId);
        if (audioLists.length > 0) {
          await new Promise(r => setTimeout(r, onlyPiano?1000:10000));
          setLoading(false);
          musicInstance.updatePlayIndex(targetMusicId);
          musicInstance.updatePlayIndex(0);
          await new Promise(r => setTimeout(r, 500));
          musicInstance.updatePlayIndex(targetMusicId);
        }
      }}
      getAudioInstance={(instance) => {
      setMusicInstance(instance);
      }}
    />
    </Container>
  );
}

export default App;
