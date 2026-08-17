import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowForward, AutoAwesome, ChevronLeft, ChevronRight, Star, Speed, Shield, Diamond } from '@mui/icons-material';
import CarLogo from '../assets/Car.png';
import BMW from '../assets/BMW.png';
import AUDI from '../assets/AUDI.png';
import MERC from '../assets/MERC.png';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);

  const images = [
    { src: BMW, alt: "BMW", tag: "Potere ed eleganza", year: "2026", color: "#0066b1" },
    { src: AUDI, alt: "AUDI", tag: "comfort e lusso", year: "2026", color: "#bb0a1e" },
    { src: MERC, alt: "MERCEDES", tag: "Velocità e sicurezza", year: "2026", color: "#00a3e0" },
  ];

  const stats = [
    { icon: <Speed />, label: "0-100 km/h", value: "2.9s" },
    { icon: <Shield />, label: "Sicurezza", value: "★★★★★" },
    { icon: <Diamond />, label: "Edizione", value: "Limitata" },
  ];

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const imageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 2, md: 0 },
        pb: { xs: 4, md: 0 },
        background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)",
      }}
    >
      {/* Animated Background Particles */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.1 + Math.random() * 0.2,
            }}
            animate={{
              y: [null, -100, -200],
              opacity: [0.1, 0.3, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              background: "rgba(255,255,255,0.3)",
              borderRadius: "50%",
            }}
          />
        ))}
      </Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ alignItems: "center", minHeight: "80vh" }}>
          {/* Left Side - Content */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
                pl: { xs: 1, sm: 3, md: 5 },
                pr: { xs: 1, sm: 3, md: 0 },
              }}
            >
            

              {/* Main Title */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
                    fontSize: { xs: "3.5rem", sm: "4.5rem", md: "5.5rem", lg: "6.5rem" },
                    lineHeight: 0.95,
                    color: "#ffffff",
                    textShadow: "0 4px 40px rgba(0,0,0,0.4)",
                    letterSpacing: "-0.02em",
                    mb: 0.5,
                    mt: { xs: 2, md: 0 },
                    "&::after": {
                      content: '""',
                      display: "block",
                      width: "80px",
                      height: "4px",
                      background: "linear-gradient(90deg, #ffffff, rgba(255,255,255,0.1))",
                      borderRadius: "2px",
                      mt: 2,
                    },
                  }}
                >
                  Pristige
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
                    fontSize: { xs: "3.5rem", sm: "4.5rem", md: "5.5rem", lg: "6.5rem" },
                    lineHeight: 0.95,
                    color: "#ffffff",
                    textShadow: "0 4px 40px rgba(0,0,0,0.4)",
                    letterSpacing: "-0.02em",
                    mb: 3,
                    mt: -0.5,
                  }}
                >
                  Auto
                </Typography>
              </motion.div>

              {/* Subtitle with Glass Effect */}
              <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    p: { xs: 2, md: 3 },
                    mb: 4,
                    border: "1px solid rgba(255,255,255,0.08)",
                    maxWidth: "520px",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 500,
                      fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
                      color: "rgba(255,255,255,0.9)",
                      fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.3rem" },
                      textShadow: "0 2px 20px rgba(0,0,0,0.2)",
                      letterSpacing: "0.02em",
                      lineHeight: 1.6,
                    }}
                  >
                    Scopri l'eccellenza automobilistica.
                    <br />
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9em" }}>
                      Ogni vettura racconta una storia unica.
                    </span>
                  </Typography>
                </Box>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 2, sm: 4 },
                    mb: 4,
                    flexWrap: "wrap",
                  }}
                >
                  {stats.map((stat, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: "12px",
                        px: { xs: 1.5, sm: 2 },
                        py: { xs: 0.8, sm: 1 },
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Box sx={{ color: "rgba(255,255,255,0.6)" }}>{stat.icon}</Box>
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "0.6rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {stat.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
                            color: "#ffffff",
                            fontSize: "0.9rem",
                            fontWeight: 700,
                          }}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      borderRadius: "50px",
                      py: { xs: 1.5, sm: 1.8 },
                      px: { xs: 3, sm: 4 },
                      textTransform: "none",
                      fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
                      fontWeight: 700,
                      fontSize: { xs: "0.85rem", sm: "1rem" },
                      minWidth: "180px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.9)",
                        transform: "translateY(-3px) scale(1.02)",
                        boxShadow: "0 12px 48px rgba(0,0,0,0.4)",
                      },
                      "& .MuiButton-endIcon": {
                        transition: "transform 0.3s ease",
                      },
                      "&:hover .MuiButton-endIcon": {
                        transform: "translateX(8px)",
                      },
                    }}
                  >
                    Esplora Prodotti
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Box
                          component="img"
                          src={CarLogo}
                          alt="Car"
                          sx={{
                            width: "24px",
                            height: "24px",
                            objectFit: "contain",
                            filter: "brightness(0) invert(1)",
                          }}
                        />
                      </motion.div>
                    }
                    sx={{
                      borderColor: "rgba(255,255,255,0.4)",
                      color: "#ffffff",
                      borderRadius: "50px",
                      py: { xs: 1.5, sm: 1.8 },
                      px: { xs: 3, sm: 4 },
                      textTransform: "none",
                      fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
                      fontWeight: 700,
                      fontSize: { xs: "0.85rem", sm: "1rem" },
                      minWidth: "180px",
                      borderWidth: "2px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#ffffff",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        transform: "translateY(-3px) scale(1.02)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    La Mia Auto
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        mx: 0.5,
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      |
                    </Box>
                    Il Mio Sogno
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Grid>

          {/* Right Side - Premium Image Slider Frame */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                perspective: "1000px",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: { xs: "280px", sm: "350px", md: "400px" },
                  height: { xs: "320px", sm: "400px", md: "480px" },
                  margin: "0 auto",
                  position: "relative",
                  borderRadius: "24px",
                  boxShadow: `
                    0 30px 80px rgba(0,0,0,0.5),
                    0 0 0 1px rgba(255,255,255,0.05),
                    inset 0 1px 0 rgba(255,255,255,0.1)
                  `,
                  overflow: "hidden",
                  backgroundColor: "#0a0a0a",
                  cursor: "pointer",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.03) translateY(-5px)",
                    boxShadow: `
                      0 40px 100px rgba(0,0,0,0.6),
                      0 0 0 2px rgba(255,255,255,0.1),
                      inset 0 1px 0 rgba(255,255,255,0.15)
                    `,
                  },
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Decorative Frame Border */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    right: 12,
                    bottom: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "16px",
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />

                {/* Corner Decorations */}
                {[
                  { top: 12, left: 12, rotate: 0 },
                  { top: 12, right: 12, rotate: 90 },
                  { bottom: 12, left: 12, rotate: -90 },
                  { bottom: 12, right: 12, rotate: 180 },
                ].map((corner, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "absolute",
                      top: corner.top,
                      left: corner.left,
                      right: corner.right,
                      bottom: corner.bottom,
                      width: "20px",
                      height: "20px",
                      zIndex: 3,
                      pointerEvents: "none",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "2px",
                        background: "linear-gradient(90deg, rgba(255,255,255,0.3), transparent)",
                        transform: `rotate(${corner.rotate}deg)`,
                        transformOrigin: "top left",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "2px",
                        height: "100%",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.3), transparent)",
                        transform: `rotate(${corner.rotate}deg)`,
                        transformOrigin: "top left",
                      },
                    }}
                  />
                ))}

                {/* Hanging String with Glow */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -25,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "2px",
                    height: "40px",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)",
                    zIndex: 3,
                    boxShadow: "0 0 20px rgba(255,255,255,0.05)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: -30,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.3)",
                    boxShadow: "0 0 30px rgba(255,255,255,0.1), inset 0 2px 4px rgba(255,255,255,0.2)",
                    zIndex: 3,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />

                {/* Image Container */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentImageIndex}
                    custom={direction}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.5 },
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Box
                      component="img"
                      src={images[currentImageIndex].src}
                      alt={images[currentImageIndex].alt}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {/* Brand Color Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: `linear-gradient(135deg, ${images[currentImageIndex].color}22 0%, transparent 50%)`,
                        zIndex: 1,
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Gradient Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "60%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                    zIndex: 2,
                  }}
                />

                {/* Bottom Info */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: { xs: 2, sm: 3 },
                    zIndex: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
                          fontWeight: 700,
                          fontSize: { xs: "1.2rem", sm: "1.5rem" },
                          color: "#ffffff",
                          textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {images[currentImageIndex].alt}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
                          fontSize: { xs: "0.7rem", sm: "0.8rem" },
                          color: "rgba(255,255,255,0.6)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {images[currentImageIndex].tag}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        backgroundColor: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "20px",
                        px: 1.5,
                        py: 0.5,
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
                          fontSize: "0.6rem",
                          color: "rgba(255,255,255,0.5)",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {images[currentImageIndex].year}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Navigation Arrows */}
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 4,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    border: "1px solid rgba(255,255,255,0.08)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                      transform: "translateY(-50%) scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <ChevronLeft sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </IconButton>

                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 4,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    border: "1px solid rgba(255,255,255,0.08)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                      transform: "translateY(-50%) scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <ChevronRight sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </IconButton>

                {/* Dots Indicator */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: 70, sm: 85 },
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 1,
                    zIndex: 4,
                  }}
                >
                  {images.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => {
                        setDirection(index > currentImageIndex ? 1 : -1);
                        setCurrentImageIndex(index);
                      }}
                      sx={{
                        width: index === currentImageIndex ? 32 : 8,
                        height: 8,
                        borderRadius: "4px",
                        backgroundColor: index === currentImageIndex ? "#ffffff" : "rgba(255,255,255,0.2)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        boxShadow: index === currentImageIndex ? "0 0 20px rgba(255,255,255,0.2)" : "none",
                      }}
                    />
                  ))}
                </Box>

                {/* Glowing Ring Effect */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    height: "90%",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${images[currentImageIndex].color}05 0%, transparent 70%)`,
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;