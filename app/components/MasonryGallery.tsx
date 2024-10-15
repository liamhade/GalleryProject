import "../Gallery.scss";
import * as React from 'react';
import { useState } from 'react';
import { Typography } from "@mui/material";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from "@mui/material/IconButton";
import Box from '@mui/material/Box';
import GalleryService from "../GalleryService";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';

export default function MasonryGallery(props: any) {
	const [popupVisible, setPopupIsVisible] = useState(false);
	const [emailIsValid, setEmailValidity] = useState(true);
	const [nameWasEntered, setNameEntered] = useState(true);

	// Used when the user tries to download an image, but they
	// haven't put in their information yet. Thus, while they are submitting there
	// data, we need somewhere to store the file that that they want to download
	const [requestedFileToDownload, setRequestedFileToDownload] = useState('');
	const [lastImageMounted, setLastImageMounted] = useState(false);
	let numImagesLoaded = 0;

	if (lastImageMounted) {
		console.log('lastImageMounted');
	}

	const [hoveredId, setHoveredId] = useState<string>("");
	const setImageIsDownloading = props.setImageIsDownloading;
	const imageItems = props.imageItems;
	const imagesAreLoaded = props.imagesAreLoaded;
	const showName = props.showName;
	
	// Storing our inputs values. Otherwise, if the the user inputs
	// an invalid email, the component refreshes and the name which
	// might be correct is lost.
	let name_input  = "";
	let email_input = "";
  
	const togglePopupVisibility = () => {
	  setPopupIsVisible(!popupVisible);
	};
	
	const checkLastImageMounted = (num_images: number, index: number) => {
		numImagesLoaded++;
		console.log(`numImagesLoaded, ${numImagesLoaded}`);

		if (index == (num_images-1)) {
			console.log(`checkLastImageMounted, ${index}, ${num_images}, true`);
			setLastImageMounted(true);
		};
		console.log(`checkLastImageMounted, ${index}, ${num_images}, false`);
	}

	const stringIsValidEmail = (str: string) => {
	  const email_regex = new RegExp("^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");
	  return email_regex.test(str);
	}
  
	// Shows up when the user tries to download an image without
	// having already put in their customer info
	function DownloadPopup() {
	  function InputPopup() {
		return (
		  <Box className="customer-inputs">
			<Typography id="inputTitle">
			  Before downloading your picture, we ask that you fill out the form below.
			</Typography>
  
			{ NameInput() }
			{ EmailInput() }
	
			<Box className="input-button-box">
			  <Button id="inputButton" variant="contained" onClick={submitInput}>
				Submit
			  </Button>
			</Box>
		  </Box>
		);
	  }
  
	  function NameInput() {
		function DefaultNameInput() {
		  return (
			<TextField required id="nameInput" label="Name"/>
		  );
		}
		function NameWasNotEntered () {
		  return (
			<TextField 
			  required 
			  error 
			  id="nameInput"
			  label="Name"
			  helperText="Please enter a name"
			/>
		  );
		}
	  
	  // Reseting the values stored in the inputs, in case
	  // the inputs were rerendered because of an invalid input.
	  return (nameWasEntered ? <DefaultNameInput /> : <NameWasNotEntered />);
	  }
  
	  function EmailInput() {
		function ValidEmail() {
		  return (
			<TextField required id="emailInput" label="Email"/>
		  )
		}
		function InvalidEmail() {
		  return (
			<TextField 
			  required 
			  error 
			  id="emailInput" 
			  label="Email"
			  helperText="Please enter a valid email"
			/>
		  )
		}
	  return (emailIsValid ? <ValidEmail /> : <InvalidEmail />);
	  }
  
	  function submitInput() {
		if (document.getElementById("nameInput") != null) {
			const nameElement = document.getElementById("nameInput");

			if (nameElement instanceof HTMLInputElement) {
				name_input = nameElement.value;
			}
		} else {
			console.error("[ERROR] name input is 'null'");
			name_input = '';
		}

		if (document.getElementById("emailInput") != null) {
			const emailElement = document.getElementById("emailInput");

			if (emailElement instanceof HTMLInputElement) {
				email_input = emailElement.value;
			}
		} else {
			console.error("[ERROR] email input is 'null'");
			email_input = '';
		}

		const nameIsValid = (s: string) => {
		  return (s != "")
		};
  
		const setLoginCookies = (email: string, name_: string) => {

			const expiration_days = 60;
			const expiration_ms = expiration_days * 24 * 60 * 60 * 1000
			const date = new Date();
			date.setTime(date.getTime() + expiration_ms);
			const expiration_string = date.toUTCString();

		  const user_data = {'email': email, 'user': name_, 'expires': expiration_string};
		  document.cookie = JSON.stringify(user_data);
		};
  
		console.log(name_input);
		console.log(email_input);
  
		if (stringIsValidEmail(email_input) && nameIsValid(name_input)) {
		  togglePopupVisibility();
		  setLoginCookies(email_input, name_input);
		  downloadImage(showName, requestedFileToDownload);
		  GalleryService.postUserInfo({name: name_input, email: email_input})
		} else {
		  if (stringIsValidEmail(email_input)) {
			setEmailValidity(true);
		  } else {
			setEmailValidity(false);
		  }
		  if (nameIsValid(name_input)) {
			setNameEntered(true);
		  } else {
			setNameEntered(false);
		  }
		}  
	  }
    
	  const handleClose = () => {
		setPopupIsVisible(false);
	  }
  
	  return (
		<Dialog 
		  open={popupVisible} 
		  id="inputPopup" 
		  sx={{
			outline: "solid rgb(26, 39, 177) 2px",
		  }}
		  onClose={handleClose}>
			{InputPopup()}
		</Dialog>
	  )
	}
  
	const loginCookiesSet = () => {
	  return document.cookie != '';
	}
  
	const downloadImageBlob = (image_blob: Blob, download_name: string) => {
	  const url = window.URL.createObjectURL(image_blob)
	  const a = document.createElement("a");
  
	  a.id  = "imageDownload";
	  a.href = url;
	  a.download = `${download_name}`;
  
	  document.body.appendChild(a);
	  a.click();
	  document.body.removeChild(a);
	  window.URL.revokeObjectURL(url);
	}
  
	async function downloadImage(show_name: string, file_name: string) {
	  // Displays a downloading-icon
	  setImageIsDownloading(true);
  
	  GalleryService.fetchImage(show_name, file_name)
		.then(response => response.blob())
		.then(blob => {
		  downloadImageBlob(blob, file_name);
		  setImageIsDownloading(false)
		})
	}
  
	return (
	  <ImageList className="image-list" variant="masonry" cols={4} gap={12}>
		{imagesAreLoaded && imageItems.map((image: any, index: any) => (
		  // Loads in each image from our list
		  <ImageListItem 
			key={image.url}
			onMouseEnter={() => {setHoveredId(image.url)}}
			onMouseLeave={() => {setHoveredId("")}}
		  >
			<img
			  src={`${image.url}`}
			  alt="image not loading"
			  onLoad={() => {checkLastImageMounted(imageItems.length, index)}}
			  loading="lazy"
			/>
			{hoveredId === image.url && (
			  <ImageListItemBar
				sx={{
				  background:
					'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
					'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
				}}
				actionIcon={
				  <IconButton
					sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
					onClick={() => {
					  if (loginCookiesSet()) {
						downloadImage(showName, image.name)
					  } else {
						setRequestedFileToDownload(image.name);
						togglePopupVisibility();
					  };
					}}
				  >
					<DownloadIcon/>
				  </IconButton>
				}
			  />
			)}
		  </ImageListItem>
		))}
	  {popupVisible && <DownloadPopup/>}
	  </ImageList>
	)
}
