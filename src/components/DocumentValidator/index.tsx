
import React, { useEffect, useState } from 'react'
import Camera, { FACING_MODES } from 'react-html5-camera-photo'
import { faLightbulb, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal'


import Button from '../Button/index'
import Loader from '../Loader/index'
import Toast from '../Toast/index'
import Webcam from '../Webcam/index'

import 'react-html5-camera-photo/build/css/index.css'

import {
	CardStyle,
	ModalContent
	//ModalStyle // TODO: Try it again! uwu
} from './styles'

const testValidationUrl = 'https://front-exercise.z1.digital/evaluations'

const lowerLightLevelAccepted = 40

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

const videoConstraints = {
	width: 1280,
	height: 720,
	facingMode: "user"
}

const colors = {
	blank: '#00000000',
	true: '#69CC8B',
	false: '#C00000',
	grey: '#F3F2F489'
}

/*
const statusIcons = {
	true: faCoffee,
	false: faCoffee,
	lowLight: faCoffee
}
*/

export interface OwnProps {
	setStatus: 'start' | 'take' | 'retake' | 'taking' | 'validating' | 'rejected' | 'approved' | 'cancel' | string,
	data?: any
}

const DocumentValidator: React.FC = () => {

	const debug = true
	
	const webcamRef = React.useRef(null);
	const [data, setData] = useState(null)

	const [action, setAction] = useState<OwnProps>({ setStatus: 'start', data: null })
	const [loading, setLoading] = useState(false)
	const [cameraLoaded, setCameraLoaded] = useState(true)

	const [showToast, setShowToast] = useState(false)
	const [toastIcon, setToastIcon] = useState(faLightbulb)
	const [toastMessage, setToastMessage] = useState('')
	const [toastColor, setToastColor] = useState('')

	const [cardColor, setCardColor] = useState(colors.grey)

	const [showModal, setShowModal] = useState(false)
	const [showRetake, setShowRetake] = useState(false)

	const [showProcess, setShowProcess] = useState(false)
	const [processIcon, setProcessIcon] = useState(faLightbulb)
	const [processMessage, setProcessMessage] = useState('')
	const [processColor, setProcessColor] = useState('')

	useEffect(() => {

		if (debug) console.log('Action register changes!', action)

		setLoading(true)
		switch (action.setStatus) {

			case 'take':
				setShowModal(true)
				break;

			case 'taking':
				setData(action.data)
				break;

			case 'validating':
				/*var res = passRequirements('takingPicture')
				if (res.return) {
					if (!debug) validateDocument()
					if (debug) setAction({ setStatus: res.state, data: res })
				} else {
					setAction({ setStatus: 'rejected', data: res })
				}
				break;*/

			case 'retake':
				setShowToast(false)
				setData(null)
				setCard(action.setStatus)
				setShowToast(false)
				setShowRetake(false)
				break;

			case 'rejected':
			case 'approved':
				setToast(action.data)
				setCard(action.data)
				setShowRetake(true)
				break;

			case 'cancel':
				setShowModal(false)
				setLoading(false)
				setShowModal(false)
				setShowRetake(false)
				setShowToast(false)
				setCard(action.data)
				break;

			default: //XXX: Also start is default ;)
				setShowModal(false)
				setLoading(false)
				setShowModal(false)
				setData(null)
				setShowRetake(false)
				setShowToast(false)

		}
		setLoading(false)
	}, [action])

	const setToast = (pars: any) => {
		setShowToast(pars.show)
		setToastIcon(pars.icon)
		setToastMessage(pars.message)
		setToastColor(pars.color)
	}

	const setProcess = (pars: any) => {
		setShowProcess(pars.show)
		setProcessIcon(pars.icon)
		setProcessMessage(pars.message)
		setProcessColor(pars.color)
	}

	const setCard = (state: any) => {
		setCardColor(state.color)
	}


	const evCameraError = (error: any) => {
		if (debug) console.log('evCameraError', error)
	}

	const evCameraStart = () => {
		if (debug) console.log('evCameraStart')
		setCameraLoaded(true)
	}

	const evCameraStop = () => {
		if (debug) console.log('evCameraStop')
		setCameraLoaded(true)
		//var screenshot = webcamRef.getScreenshot();
	}

	// OTHERS




	/**
	  * This call allows to send the image content in order to be evaluated
	  * @param data
	  */
	const validateDocument = () => {
		var myHeaders = new Headers()
		var myInit = {
			method: 'POST',
			headers: myHeaders,
			body: data
		}
		fetch(testValidationUrl, myInit)
			.then(res => res.json())
			.then((res: any) => {
				setProcess({
					return: true,
					icon: faCheckCircle,
					message: 'ACCEPTED',
					color: colors.true,
					state: 'approved',
					show: true,
				})
				setToast({
					return: true,
					icon: faCheckCircle,
					message: 'Picture taken!',
					color: colors.true,
					state: 'approved',
					show: true,
				})
			})
			.then((err: any) => {
				setProcess({
					return: false,
					icon: faTimesCircle,
					message: 'REJECTED',
					color: colors.false,
					state: 'rejected',
					show: true,
				})
				setToast({
					return: false,
					icon: faTimesCircle,
					message: 'There was an error!',
					color: colors.false,
					state: 'rejected',
					show: true,
				})
			})
	}

	const getRandomArbitrary = (min: number, max: number) => {
		return Math.random() * (max - min) + min;
	}

	// WITH THE SERVICE

	const callError = (err: any) => {
		if (debug) console.log('Call error!!!', err)
	}

	return <>

		<h1>Scan your ID</h1>
		<h2>Take a picture. It may take time to validate your personal information.</h2>

		<CardStyle color={colors.grey} height={60} proportion={1.3}>
			<Button disabled={loading} type='submit' label={'TAKE PICTURE'} onClick={() => { setAction({ setStatus: 'take' }) }}></Button>
			<Loader params={loaderSheet} />
		</CardStyle>

		<Modal
			className='cameraModal'
			style={{
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
			}}
			isOpen={showModal}>

{/*text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center; */}

			<ModalContent>

				<h2 className='white'>Fit your ID card inside the frame.</h2>
				<h2 className='white'>The picture will taken automatically</h2>

				<CardStyle color={cardColor} height={60} proportion={1.3}>

					{data
						? <img
							id='takingPicture'
							style={{ maxWidth: '100%', marginBottom: '-4px' }}
							src={data}
							alt='Your Document Picture!!!'
						/>
						: cameraLoaded
							? <Webcam/>
							: <Loader params={loaderSheet} />
					}


				</CardStyle>

				{showRetake && <Button disabled={loading} type='submit' label={'RETAKE PICTURE'} onClick={(e: any) => { setAction({ setStatus: 'retake', data: '' }) }}></Button>}

				{showToast && <Toast icon={toastIcon} message={toastMessage} color={toastColor} height={23} proportion={324} />}

				{showProcess && <Toast icon={processIcon} message={processMessage} color={processColor} height={23} proportion={324} />}

				<Button disabled={loading} label={'CANCEL'} onClick={(e: any) => { setAction({ setStatus: 'cancel', data: { color: colors.grey } }) }} />

			</ModalContent>

		</Modal>

	</>

}

export default DocumentValidator