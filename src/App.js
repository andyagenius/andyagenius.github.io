import logo from './logo.svg';
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
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Button} from '@mui/material';
import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'
import {useState, useEffect} from "react"
import { ConnectingAirportsOutlined } from '@mui/icons-material';
const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const tags = 'tribal,action,kids,neo-classic,run 130,pumped,jazz / funk,ethnic,dubtechno,reggae,acid jazz,liquidfunk,funk,witch house,tech house,underground,artists,mystical,disco,sensorium,r&b,agender,psychedelic trance / psytrance,peaceful,run 140,piano,run 160,setting,meditation,christmas,ambient,horror,cinematic,electro house,idm,bass,minimal,underscore,drums,glitchy,beautiful,technology,tribal house,country pop,jazz & funk,documentary,space,classical,valentines,chillstep,experimental,trap,new jack swing,drama,post-rock,tense,corporate,neutral,happy,analog,funky,spiritual,sberzvuk special,chill hop,dramatic,catchy,holidays,fitness 90,optimistic,orchestra,acid techno,energizing,romantic,minimal house,breaks,hyper pop,warm up,dreamy,dark,urban,microfunk,dub,nu disco,vogue,keys,hardcore,aggressive,indie,electro funk,beauty,relaxing,trance,pop,hiphop,soft,acoustic,chillrave / ethno-house,deep techno,angry,dance,fun,dubstep,tropical,latin pop,heroic,world music,inspirational,uplifting,atmosphere,art,epic,advertising,chillout,scary,spooky,slow ballad,saxophone,summer,erotic,jazzy,energy 100,kara mar,xmas,atmospheric,indie pop,hip-hop,yoga,reggaeton,lounge,travel,running,folk,chillrave & ethno-house,detective,darkambient,chill,fantasy,minimal techno,special,night,tropical house,downtempo,lullaby,meditative,upbeat,glitch hop,fitness,neurofunk,sexual,indie rock,future pop,jazz,cyberpunk,melancholic,happy hardcore,family / kids,synths,electric guitar,comedy,psychedelic trance & psytrance,edm,psychedelic rock,calm,zen,bells,podcast,melodic house,ethnic percussion,nature,heavy,bassline,indie dance,techno,drumnbass,synth pop,vaporwave,sad,8-bit,chillgressive,deep,orchestral,futuristic,hardtechno,nostalgic,big room,sci-fi,tutorial,joyful,pads,minimal 170,drill,ethnic 108,amusing,sleepy ambient,psychill,italo disco,lofi,house,acoustic guitar,bassline house,rock,k-pop,synthwave,deep house,electronica,gabber,nightlife,sport & fitness,road trip,celebration,electro,disco house,electronic';
const genres = ['jazz / funk', 'jazz', 'neo-classic', 'liquidfunk', 'underground', 'r&b', 'classical', 'disco', 'witch house', 'tech house', 'cinematic', 'funky', 'pop', 'hippop', 'electric guitar'];
const emotions = {
  "happy": ['happy','joyful', 'fun'],
  "calm": ['peaceful', 'neutral', 'soft'],
  "angry": ['angry'],
  "sad": ['sad'],
  "scared": ['mystical', 'horror'],
  "excited": ['energizing', 'energy 100',]
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

function App() {
  const [audioList, setAudioList] = useState([{
    "name": "Background",
    "singer": "AI", 
    "musicSrc": "bg.mp3",
  }
  ]);
  const [text, setText] = useState("sadness, lonely");
  const [patToken, setPatToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [license, setLicense] = useState(null);
  const [musicInstance, setMusicInstance] = useState(null);
  const [musicLink, setMusicLink] = useState([
  {
    "name": "Background",
    "singer": "AI", 
    "musicSrc": "bg.mp3",
  }]

  );
  const [targetMusicId, setTargetMusicId] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAudioList(musicLink);
    setTargetMusicId(targetMusicId+1);
  }, [musicLink])

  const changeLoadingStatus = () => {};

  const getPatToken = async () => {
    setLoading(true);

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
              "tags": tags,
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
              "email": "lewus.ad@gmail.com",
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
      <AppBar position="static" color="transparent" elevation="0">
        <Toolbar variant="regular" elevation="0">
          <Typography variant="h3" color="inherit" component="div"
            sx={{fontFamily: "'Dancing Script', cursive", color: "rgb(220,220,220)", margin: "20px"}}
          >
            Music Feels You 
          </Typography>
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
          await new Promise(r => setTimeout(r, 10000));
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
