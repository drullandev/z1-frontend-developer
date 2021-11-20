import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const imageContainerId = 'captureImgRef'

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
	const captureImgRef = useRef<any>()
	const captureCanvasRef = useRef<any>()
	
	const [attempts, setAttempts] = useState(0)
	const [capturing, setCapturing] = useState(false)

	const [capture, setCapture] = useState<any>()
	const [retry, setRetry] = useState('')
	const [evalutaing, setEvaluating] = useState(false)

	const [showCamera, setShowCamera] = useState(true)
	const [showCapture, setShowCapture] = useState(true)

	const [showRetake, setShowRetake] = useState(false)

	setTimeout(() => {setCapturing(true)}, startTimeout)
	
	useEffect(() => {
		capturesLoop()
	}, [webcamRef])

	const takeCapture = useCallback(() => {
		let imageSrc = webcamRef.current as Webcam		
		var screenShot = imageSrc.getScreenshot()
		if(screenShot){
			setCapture(imageSrc.getScreenshot())
		}else{
			let now = Date.now().toString()
			setRetry(now)
		}
	},[webcamRef, setCapture])

	// Loop the captures until a acceptable one!
	const capturesLoop = () => {
		console.log('I capture loop picture')
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

	// Evaluate capture
	useEffect(() => {
		if(!capture) return
		console.log('Evaluating capture!')
		passRequirements(imageContainerId)
	}, [capture])

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

	const sleep = async (ms: number) => {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	const passRequirements = (containerId: string) => {
		if (options.includes('bright')) {
			setAction(getTooDark(containerId))
		}
		if (options.includes('cardDetected')) {
			setAction(cardDetected(containerId))
		}
	}

	const getTooDark = (containerId: string) => {
		var bright = getBright(true)
		console.log('bright', bright, bright < lowestLightLevelAccepted)
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

	const getBright = (debug: boolean = false) => {		
		
		var webcam: any = webcamRef.current
		var canvas = webcam.canvas
		var context = webcam.context
		var data, width, height
			width = canvas.width = webcam.width
			height = canvas.height = webcam.height


	data = context.getImageData(0, 0, width, height)
		console.log(data)

		var canvas: any = captureCanvasRef.current
		var context: any = canvas.getContext && canvas.getContext('2d')

		return 10
/*


		var res = getRGBLLevels(data.data, 2, true)

		return res.l
*/
	}

	return <>
		<div>
			<div className='MyWebcam'>

				<canvas	ref={captureCanvasRef}>
					<img
						ref={captureImgRef}
						style={{
							maxWidth: '100%',
							marginBottom: '-4px',
							visibility: showCapture ? 'visible' : 'hidden'
						}}
						src={capture}
						alt='Your Capture!!!'
					/>
				</canvas>
				{attempts === 0 && <Loader params={loader} />}
				{showCamera && <Webcam
					ref={webcamRef}
					style={{
						maxWidth: '100%',
						marginBottom: '-4px',
						display: showCamera ? 'in-line' : 'none'
					}}
					audio={false}
					screenshotFormat='image/jpeg'
					videoConstraints={videoConstraints}
				/>}
			</div>
		</div>
	</>

}

export default WebcamCapture