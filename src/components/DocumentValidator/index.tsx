
import React, { useEffect, useState } from 'react'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal'

import Button from '../Button/index'
import Loader from '../Loader/index'
import Icon from '../Icon/index'


import 'react-html5-camera-photo/build/css/index.css'
import { Card, 
	//ModalStyle // TODO: Try it again! uwu
} from './styles'

const img = require('../../assets/Rain-1-reworked.jpg')
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
		{	style: 'rect', x: 10, y: 1, width: 130 },
		{	style: 'rect', x: 10, y: 2, width: 80 },
		{ style: 'rect', x: 58, y: 3, width: 41 },
		{	style: 'circle', r: 40	}
	]
}

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

	const [action, setAction] = useState<OwnProps>({status: 'start'})

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
		setAction({status: 'start'})
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
		setData(data)
	}

	const handleTakePhotoDone = (camData: string) => {
		//validateDocument(camData)
		console.log('handleTakePhotoAnimationDone', camData)
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
		setAction({status: 'taking'})
	}

	const handleCancel = () => {
		setShowModal(false)
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
				backgroundImage: 'url('+ img +')',
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

					<Camera	idealFacingMode={FACING_MODES.ENVIRONMENT}
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
					/>

					{data && <img style={{ height: '30vh', width: '80%' }} src={data} alt='Your Picture!!!'/> }

					{requestStatus === true && <button onClick={(e: any) => {
						handleCancel() }}><Icon icon={faCoffee}/> REJECTED</button>
					}

				</Card>

				<p><Icon icon={faCoffee}/> Room lighting is to low</p>

				<Button label={'CANCEL'} onClick={(e: any) => { handleCancel() }}/>
			</div>

		</Modal>

	</>
	
}

export default DocumentValidator