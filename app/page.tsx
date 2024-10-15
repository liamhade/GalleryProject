"use client";
import "./Gallery.scss";
import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import GalleryService from "./GalleryService";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import MasonryGallery from "./components/MasonryGallery";


export default function Gallery() {
  const [ imageIsDownloading, setImageIsDownloading ] = useState(false);

  const [ allShowImages, setAllShowImages ] = useState<{ [key: string]: any[] }>({'': []});
	const [ imagesAreLoaded, setImagesAreLoaded ] = useState(false);
  const [ showName, setShowName ] = useState('');

  useEffect(() => {
		async function getAllShowsAndImages() {
      try {
        console.log('resp!')
        const resp = await GalleryService.getState();
        const resp_json = await resp.json(); 
        console.log('resp_json')
        console.log(resp_json);
        setAllShowImages(resp_json);
      } catch (error) {
        console.error("Error fetching gallery state:", error);
      } finally {
        setImagesAreLoaded(true);
        console.log('setImagesAreLoaded, true');
      }
      
    }
    getAllShowsAndImages();
	}, [])

  useEffect(() => {
    if (imagesAreLoaded && Object.keys(allShowImages).length > 0) {
      const default_show_name = Object.keys(allShowImages)[0]
      setShowName(default_show_name);
    }
  }, [allShowImages, imagesAreLoaded])
    
  return (
    <Box className="lg-container">
      <ResponsiveAppBar 
        imageIsDownloading={ imageIsDownloading } 
        showNames={ Object.keys(allShowImages) || []}
        setShowName={ setShowName }
      />

      <div className="gallery-and-footer">
        <GalleryTitle text={ showName }/>
        <MasonryGallery 
          imagesAreLoaded={ imagesAreLoaded } 
          showName={ showName } 
          imageItems={ allShowImages[showName] || [] } 
          setImageIsDownloading={ setImageIsDownloading } 
        />
        <Footer/>
      </div>
    </Box>
  );
}

function GalleryTitle(props: any) {
  return (
    <Box className="gallery-title-box">
      <Typography className="gallery-title">
          { props.text }
      </Typography>
    </Box>
  );
}

function Footer() {
  return (
    <div className="footer-container">
      <p className="footer-content">
        @ ComedyUO 2024
      </p>
    </div>
  )
}