import React, { useState, useEffect, useRef } from 'react';
import { faCoffee, faLightbulb, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { getRandomArbitrary, getRGBLLevels, colors } from '../../utils/CoreUtils'
import { WebcamCaptureProps } from './types'

import Webcam from 'react-webcam'
import Loader from '../Loader';

import '../../assets/ccard.jpg'

const debug = true

const maxAttempts = 10 
const attemptsInterval = 1000
const startTimeout = 5000

const options = ['bright']
const lowestLightLevelAccepted = 40

const imageContainerId = 'captureImg'

const videoConstraints = { 
	facingMode: 'user'
}

/**
 * This is my feature to take pictures automathically...
 * TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param param0 
 * @returns 
 */
const WebcamCapture: React.FC<WebcamCaptureProps> = ({ setAction, restart, loader }) => {

	const webcamRef = useRef<Webcam>(null)
	const captureImg = useRef<any>()
	
	const [attempts, setAttempts] = useState(0)
	const [capturing, setCapturing] = useState(false)

	const [capture, setCapture] = useState<any>()
	const [evalutaing, setEvaluating] = useState(false)

	const [showCamera, setShowCamera] = useState(true)
	const [showCapture, setShowCapture] = useState(true)

	const [showRetake, setShowRetake] = useState(false)

	useEffect(() => {
		setTimeout(() => setCapturing(true), startTimeout)
		setCapturing(true)
	}, [restart])

	useEffect(() => {
		if(debug)
			takeCapture()
		else
			capturesLoop()
	}, [capturing])

	// Evaluate capture
	useEffect(() => {
		if(!capture) return
		console.log('Evaluating capture!', capture)
		captureImg.current.src = capture
		passRequirements(imageContainerId)
	}, [capture])

	// Take a new capture and set the capture data
	const takeCapture = () => {
		const imageSrc = webcamRef.current as Webcam		
		console.log('capture', imageSrc.getScreenshot())		
		setCapture(imageSrc.getScreenshot())
	}

	// Loop the captures until a acceptable one!
	const capturesLoop = () => {
		var repeater = setTimeout(() => {
			if (debug) console.log('Capture made each ' + (attemptsInterval / 1000) + ' seconds until ' + ((attemptsInterval / 1000) * maxAttempts) + ' !!! ' + Date.now())
			if (attempts === maxAttempts) {
				expired()
			} else {
				takeCapture()
				let at = attempts+1
				setAttempts(at)
			}
			return () => clearTimeout(repeater)
		}, attemptsInterval)
	}

	// The capture attemps has end without a good shot taken!	 
	const expired = () => {

		// Reset shooter
		setAttempts(0)
		setCapturing(false)

		setAction({
			setStatus: 'expired',
			data: {
				icon: faCoffee,
				message: 'Expired oportunities!!',
				show: 'in-line',
				color: 'red',
				label: 'REJECTED',
				iconToast: faCoffee,
				iconNotice: faCoffee,
			}
		})

		setShowRetake(true)
	}

	/**
	 * Not running well here o.o TODO see why??
	 * @returns 
	 */
	const sleep = async (ms: number) => {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 * This function was performed to take the task to valuate if the image pass some requirements! ;)
	 * TODO: Move to the utilery!!
	 * @param camData
	 * @returns 
	 */
	const passRequirements = (containerId: string) => {
		if (options.includes('bright')) {
			setAction(getTooDark(containerId))
		}
		if (options.includes('cardDetected')) {
			setAction(cardDetected(containerId))
		}
	}

	const getTooDark = (containerId: string) => {
		var bright = getBright(containerId, true)
		console.log('bright', bright)
		var tooDark = bright < lowestLightLevelAccepted
		if (tooDark) {
			return {
				setStatus: 'error',
				data: {
					return: false,
					show: true,
					rgbl: bright,
					state: 'rejected',
					label: 'REJECTED',
					message: 'Room lighting is to low',
					color: colors.bulb,
					gbColor: colors.true,
					iconToast: faLightbulb,
					iconNotice: faLightbulb,
				}
			}
		} else {
			return {
				setStatus: 'accepted',
				data: {
					return: true,
					show: true,
					rgbl: bright,
					state: 'accepted',
					label: 'ACCEPTED',
					message: 'Your light is accepted...',// TODO: Is not under control!....
					color: colors.true,
					gbColor: colors.true,
					iconToast: faCheckCircle,
					iconNotice: faCheckCircle,
				}
			}
		}
	}

	const cardDetected = (containerId: string) => {
		return {
			setStatus: 'accepted',
			data: {
				return: true,
				show: true,
				state: 'accepted',
				label: 'ACCEPTED',
				message: 'Your image has a card...',// TODO: Is not under control!....
				color: colors.true,
				gbColor: colors.true,
				iconToast: faCheckCircle,
				iconNotice: faCheckCircle,
			}
		}
	}

	const getBright = (img: any, debug: boolean = false) => {

		console.log('img', img)

		if (debug) return { l: getRandomArbitrary(30, 50) }

		var img: any = document.getElementById(imageContainerId)
		console.log('img', img)

		var canvas: any = document.createElement('canvas')
		var context: any = canvas.getContext && canvas.getContext('2d')

		var data, width, height
		width = canvas.height = img.naturalHeight || img.offsetHeight || img.height
		height = canvas.width = img.naturalWidth || img.offsetWidth || img.width

		context.drawImage(img, 0, 0)

		data = context.getImageData(0, 0, width, height)

		var res = getRGBLLevels(data.data, 2, true)

		return res.l

	}

	return <>
		<div>
			<div className='MyWebcam'>
				<img
					ref={captureImg}
					style={{ maxWidth: '100%', marginBottom: '-4px', visibility: showCapture ? 'visible' : 'hidden' }}
					alt='Your Capture!!!'
				/>
				<Loader params={loader} />
				<Webcam
					ref={webcamRef}
					style={{ maxWidth: '100%', marginBottom: '-4px', display: showCamera ? 'in-line' : 'none' }}
					audio={false}
					screenshotFormat='image/jpeg'
					videoConstraints={videoConstraints}
				/>
			</div>
		</div>
	</>

} /* , display: capture ? 'in-line' : 'none' */

export default WebcamCapture