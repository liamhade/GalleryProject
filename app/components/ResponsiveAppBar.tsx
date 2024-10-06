import "../Gallery.scss";
import { useState, useRef } from 'react';
import Image from "next/image";
import Logo from "../cuologo.png";
import DownloadIcon from '@mui/icons-material/Download';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from "@mui/material";

export default function ResponsiveAppBar(props: any) {
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const galleriesButtonRef = useRef<HTMLButtonElement>(null);

	function GalleriesDropdown() {
		return (
			<Paper 
				sx={{ 
					position: 'absolute',
					top: galleriesButtonRef.current ? galleriesButtonRef.current.offsetTop + galleriesButtonRef.current.clientHeight : 0,
					left: galleriesButtonRef.current ? galleriesButtonRef.current.offsetLeft : 0,
				}}
				onMouseEnter={ () => { setDropdownVisible(true) } }
				onMouseLeave={ () => { setDropdownVisible(false) } }
			>
				<MenuList dense>
					{props.showNames.map((show_name: string) => (
						<MenuItem
							onClick={ () => {props.setShowName(show_name)} }
						>
							<ListItemText key={ show_name }>  
								<Typography className="galleriesDropdownItem">
									{ show_name }
								</Typography> 
							</ListItemText>
						</MenuItem>
					))}
				</MenuList>
			</Paper>
		)
	}

	return (
	  <AppBar className="app-bar">
		<Container>
		  <Toolbar disableGutters>
			<Box className="menu-box">
			  <LogoLink/>
				<Button
					ref={ galleriesButtonRef }
					className="header-button" 
					key="galleries" 
					sx={ {fontSize: 20} }
					onMouseEnter={ () => { setDropdownVisible(true) } }
					onMouseLeave={ () => { setDropdownVisible(false) } }
				>
					Galleries
				</Button>
				{ dropdownVisible && <GalleriesDropdown /> }
			</Box>
				
			{ props.imageIsDownloading && <DownloadIcon className="download-icon" /> }
			
		  </Toolbar>
		</Container>
	  </AppBar>
	)
}

const LogoLink = () => {
	return (
		<a 
		href="https://www.comedyuo.com" 
		rel="noopener noreferrer"
		target="_blank" 
		>
		<Image
			src={Logo}
			alt="comedyuo-logo"
			id="comedyuo-logo"
		/> 
		</a>
	)
}
