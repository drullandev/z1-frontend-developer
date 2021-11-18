
import React, { useEffect, useState } from 'react'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal'

import Button from '../Button/index'
import Loader from '../Loader/index'
import Icon from '../Icon/index'


import 'react-html5-camera-photo/build/css/index.css'
import {
	Card,
	//ModalStyle // TODO: Try it again! uwu
} from './styles'

//const img = require('../../assets/Rain-1-reworked.jpg')
const testValidationUrl = 'https://front-exercise.z1.digital/evaluations'

const loaderSheet = {
	rx: 10,
	ry: 10,
	height: 30,
	margin: 12,
	width: 10,
	config: {
		speed: 4,
		width: 400,
		height: 290,
		viewBox: '0 0 400 100',
		backgroundColor: '#f3f3f3',
		foregroundColor: '#ecebeb',
	},
	fields: [
		{ style: 'rect', x: 10, y: 0, width: 300 },
		{ style: 'rect', x: 10, y: 1, width: 130 },
		{ style: 'rect', x: 10, y: 2, width: 80 },
		{ style: 'rect', x: 58, y: 3, width: 41 },
		{ style: 'circle', r: 40 }
	]
}

var canvas;
var context;

const colors = {
	blank: '#00000000',
	true: '#69CC8B',
	false: '#C00000',
	grey: '#F3F2F4'
}

const statusColors = {
	blank: '#00000000',
	true: '#69CC8B',
	false: '#C00000',
	grey: '#F3F2F4'
}

const statusIcons = {
	true: faCoffee,
	false: faCoffee,
	lowLight: faCoffee
}


const button = {
	take: {
		label: 'TAKE PICTURE',
		style: 'submitStyle'
	},
	retake: {
		label: 'RETAKE PICTURE',
		style: 'submitStyle'
	}
}

export interface OwnProps {
	status: 'start' | 'taking' | 'rejected'
}

const DocumentValidator: React.FC = () => {

	const [data, setData] = useState()

	const [action, setAction] = useState<OwnProps>({ status: 'start' })

	const [errorMessage, setErrorMessage] = useState('')
	const [requestStatus, setRequestStatus] = useState(null)
	const [buttonData, setButtonData] = useState({ style: {}, label: '' })

	const [showCamera, setShowCamera] = useState(false)
	const [showModal, setShowModal] = useState(false)

	const states = {
		true: {
			label: 'ACCEPTED',
			message: 'Picture taken',
			icon: statusIcons.true,
			color: colors.true
		},
		false: {
			label: 'REJECTED',
			message: errorMessage,
			icon: statusIcons.false,
			color: colors.false
		}

	}

	useEffect(() => {
		setAction({ status: 'start' })
	}, [])

	useEffect(() => {
		switch (action.status) {
			case 'start':

				break;

			default:
				break;
		}
		//setButtonData(button.take)
	}, [action])

	const validateDocument = (data: any) => {
		var myHeaders = new Headers()
		var myInit = {
			method: 'POST',
			headers: myHeaders,
			body: data
		}
		fetch(testValidationUrl, myInit)
			.then(res => res.json())
			.then((res: any) => {
				handlerValidated(res)
			})
			.then((err: any) => {
				handlerError(err)
			})
	}

	const handlerValidated = (res: any) => {
		console.log('handlerValidated', res)
	}

	const handlerError = (err: any) => {
		//setButtonData(button.retake)
		setErrorMessage(err)
		console.log('handleTakePhoto!!', err)
	}

	const handleTakePhoto = (data: any) => {
		//setShowModal(false)
		getImageLightness(data)
		setData(data)
	}

	const handleTakePhotoDone = (camData: string) => {
		//validateDocument(camData)
		console.log('avg ',getAverageRGB())
		getImageLightness(camData)
		console.log('handleTakePhotoAnimationDone')
		//console.log('handleTakePhotoAnimationDone', camData)
	}

	const handleCameraError = (error: any) => {
		console.log('handleCameraError', error)
	}

	const handleCameraStop = () => {
		console.log('handleCameraStop')
	}


	// THE NEW FUNCTIONS!!!!!!!!!!!!!!!!!!!!!

	const handleStartTakePicture = () => {
		setShowModal(true)
		setAction({ status: 'taking' })
	}

	const handleCancel = () => {
		setShowModal(false)
	}



	const getImageLightness = (imageSrc:any) => {

		/*	var image = document.getElementById('takenPicture')
		canvas = document.getElementById('imgCanvas')
		context = canvas.getContext('2d')
	  
		drawImage(image)

	var img = new Image();
		img.onload = function() {
		  alert(100 + 'x' + 100);
		}
		img.src = 'http://www.google.com/intl/en_ALL/images/logo.gif';
		*/
		/*

		var canvas : any = document.getElementById('canvas');
		var ctx = canvas.getContext('2d');
		ctx.rect(10, 10, 100, 100);
		ctx.fill();

		console.log(ctx.getImageData(50, 50, 100, 100));
*/
		/*var img : HTMLImageElement = document.getElementById("takenPicture")
		var colorSum = 0;
		img.onload = function() {


	
			for(var x = 0, len = imageSrc.length; x < len; x+=4) {
				r = data[x];
				g = data[x+1];
				b = data[x+2];
	
				avg = Math.floor((r+g+b)/3);
				colorSum += avg;
			}
	
			var brightness = Math.floor(colorSum / (this.width*this.height));
			console.log('brillo pestillo', brightness);
		}*/

	}

	function getAverageRGB() {
		var colorSum = 0;
		var imgEl : any = document.getElementById('takenPicture')
		var blockSize = 5, // only visit every 5 pixels
			defaultRGB = {r:0,g:0,b:0, brigth: 0}, // for non-supporting envs
			canvas = document.createElement('canvas'),
			context = canvas.getContext && canvas.getContext('2d'),
			data, width, height,
			i = -4,
			length,
			rgb = {r:0,g:0,b:0, bright: 0},
			count = 0;
	
		if (!context) {
			return defaultRGB;
		}
	
		height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
		width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
	
		context.drawImage(imgEl, 0, 0);
	
		try {
			data = context.getImageData(0, 0, width, height);
		} catch(e) {
			/* security error, img on diff domain */
			return defaultRGB;
		}
	
		length = data.data.length;
		var avg = 0
		while ( (i += blockSize * 4) < length ) {
			++count;
			rgb.r += data.data[i];
			rgb.g += data.data[i+1];
			rgb.b += data.data[i+2];
			avg = Math.floor((rgb.r+rgb.r+rgb.r)/3);
			colorSum += avg
		}

		var brightness = Math.floor(colorSum / (width*height));
	
		// ~~ used to floor values
		rgb.r = ~~(rgb.r/count);
		rgb.g = ~~(rgb.g/count);
		rgb.b = ~~(rgb.b/count);
		rgb.bright = brightness
	

		return rgb;


	}

	return <>

		<h1>Scan your ID</h1>
		<h2>Take a picture. It may take time to validate your personal information.</h2>

		<Card color={colors.grey}>
			{!showCamera && <Button type='submit' label={'TAKE PICTURE'} onClick={handleStartTakePicture}></Button>}
			<Loader params={loaderSheet} />
		</Card>

		<Modal style={{
			overlay: {
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				//backgroundImage: 'url(' + img + ')',
			},
			content: {
				backgroundImage: '../assets/Rain-1-reworked.jpg',
				position: 'absolute',
				top: '0px',
				left: '0px',
				right: '0px',
				bottom: '0px',
				//border: '1px solid #ccc',
				background: '#fff',
				overflow: 'auto',
				WebkitOverflowScrolling: 'touch',
				borderRadius: '4px',
				outline: 'none',
				padding: '20px',
				textAlign: 'center',
			}
		}} isOpen={showModal}>
			<div>
				<h2>Fit your ID card inside the frame.</h2>
				<h2>The picture will taken automatically</h2>

				<Card color={colors.grey}>
					{data
					? <img
						id='takenPicture'
						style={{ maxWidth: '100%', marginBottom: '-4px' }}
						src={data}
						alt='Your Picture!!!'
						/>
					: <Camera 
						idealFacingMode={FACING_MODES.ENVIRONMENT}
						onTakePhoto={(data: string) => { handleTakePhoto(data) }}
						onTakePhotoAnimationDone={(camData) => { handleTakePhotoDone(camData) }}
						onCameraError={(error) => { handleCameraError(error) }}
						imageType={'jpg'}
						imageCompression={0.97}
						isMaxResolution={true}
						isImageMirror={false}
						isSilentMode={false}
						isDisplayStartCameraError={true}
						isFullscreen={false}
						sizeFactor={1}
						onCameraStop={() => { handleCameraStop() }}
					  
					  />}

					{requestStatus === true && <button onClick={(e: any) => {handleCancel()}}><Icon icon={faCoffee} /> REJECTED</button>}

				</Card>

				<p><Icon icon={faCoffee} /> Room lighting is to low</p>

				<Button label={'CANCEL'} onClick={(e: any) => { handleCancel() }} />
			</div>

		</Modal>

	</>

}

export default DocumentValidator