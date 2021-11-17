
import React, { useEffect, useState } from 'react'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo'
import ContentLoader from 'react-content-loader'
import Modal from 'react-modal'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

import 'react-html5-camera-photo/build/css/index.css'
import './styles'


const submitStyle = {
	borderRadius: '15px',
	padding: '10px',
	color: 'white',
	backgroundColor: '#3013b3'
}

const statusColors = {
	blank: '#00000000', // No color
	true: '#000000',// certain green
	false: '#000000', // certain red
}

const statusIcons = {
	true: 'AiOutlineCheckCircle',
	false: 'icon2',//cross
}

const fakeImageOrigin = 'https://www.gettyimages.es/gi-resources/images/500px/983794168.jpg'

const testValidationUrl = 'https://front-exercise.z1.digital/evaluations'

const DocumentValidator: React.FC = () => {

	const [data, setData] = useState()

	const [errorMessage, setErrorMessage] = useState('')

	const [showCamera, setShowCamera] = useState(false)

	const [showModal, setShowModal] = useState(false);

	const [requestStatus, setRequestStatus] = useState(null)

	const [buttonData, setButtonData] = useState({ style: {}, label: '' })

	const button = {
		take: {
			label: 'TAKE PICTURE',
			style: submitStyle
		},
		retake: {
			label: 'RETAKE PICTURE',
			style: submitStyle
		}
	}

	const status = {
		true: {
			label: 'ACCEPTED',
			message: 'Picture taken',
			icon: statusIcons.true,
			color: statusColors.true
		},
		false: {
			label: 'REJECTED',
			message: errorMessage,
			icon: statusIcons.false,
			color: statusColors.false
		}
	}

	useEffect(() => {
		setButtonData(button.take)
	}, [])

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
		setButtonData(button.retake)
		setErrorMessage(err)
		console.log('handleTakePhoto!!', err)
	}

	const handleTakePhoto = (data: any) => {
		//setShowModal(false)
		setData(data)
	}

	// Do stuff with the photo...
	const handleTakePhotoAnimationDone = (camData: string) => {
		//validateDocument(camData)
		console.log('handleTakePhotoAnimationDone', camData)
	}

	const handleCameraError = (error: any) => {
		console.log('handleCameraError', error)
	}

	const handleCameraStop = () => {
		console.log('handleCameraStop')
	}

	const handleCancel = (close: boolean) => {
		setShowModal(false)
		console.log('handleClose!!', close)
	}

	return (
		<div className='flex flex-col justify-center items-center select-none min-h-screen bg-gradient-to-br from-gray-900  to-blue-700'>
		<h1 className='text-6xl text-green-500 border-b-4 pb-4'>Scan your ID</h1>
			<h2 className='text-2xl text-gray-300 mt-10'>
				<p>Take a picture. It may take time to validate your personal information.</p>
				<div style={{ padding: '50px', border: '2px solid palevioletred', width: '50%' }}>
					<div>
						{!showCamera && <button style={buttonData.style} onClick={(e: any) => { setShowModal(true) }}>
							{buttonData.label}
						</button>}
						<div style={{ border: '2px line' }}>
							<ContentLoader
								speed={2}
								width={400}
								height={190}
								viewBox='0 0 400 100'
								backgroundColor='#f3f3f3'
								foregroundColor='#ecebeb'
							>
								<rect x='48' y='8' rx='3' ry='3' width='88' height='6' />
								<rect x='48' y='26' rx='3' ry='3' width='52' height='6' />
								<rect x='0' y='56' rx='3' ry='3' width='410' height='6' />
								<rect x='0' y='72' rx='3' ry='3' width='380' height='6' />
								<rect x='0' y='88' rx='3' ry='3' width='178' height='6' />
								<circle cx='20' cy='20' r='20' />
							</ContentLoader>

							<Modal
								isOpen={showModal}
								contentLabel="Example Modal"
							>
								<p>Fit your ID card inside the frame.</p>
								<p>The picture will taken automatically</p>
								<div style={{ border: '2px solid palevioletred', width: '80%' }}>
									<Camera
										idealFacingMode={FACING_MODES.ENVIRONMENT}
										onTakePhoto={(data: string) => { handleTakePhoto(data) }}
										onTakePhotoAnimationDone={(camData) => { handleTakePhotoAnimationDone(camData) }}
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
									{data && <img style={{ height: '30vh', width: '80%' }} src={data} alt='pinga'></img>}
									{requestStatus === true && <button onClick={(e: any) => { handleCancel(true) }}><FontAwesomeIcon icon={faCoffee}/> REJECTED</button>}
								</div>
								<p><FontAwesomeIcon icon={faCoffee}/> Room lighting is to low</p>
								<button style={submitStyle} onClick={(e: any) => { handleCancel(true) }}>CANCEL</button>
								<button style={submitStyle} onClick={(e: any) => { handleCancel(true) }}></button>
							</Modal>
						</div>
					</div>
				</div>

			</h2>
		</div>
	)
}

export default DocumentValidator