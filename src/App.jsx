import Navbar from "./components/Navbar";
import VideoBackground from "./components/VideoBackground";
import Home from "./components/Home";
import { Box } from "@mui/material";

function App() {
  return (
    <VideoBackground>
      {/* Navbar - over the video */}
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Navbar />
      </Box>
      
      {/* Home Component - over the video with spacing */}
      <Box 
        sx={{ 
          position: "relative", 
          zIndex: 5,
          mt: { xs: 6, sm: 6, md: 6 }, // Adjust spacing to pull content up
        }}
      >
        <Home />
      </Box>
    </VideoBackground>
  );
}

export default App;