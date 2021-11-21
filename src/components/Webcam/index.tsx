import React, { useState, useEffect, useRef, useCallback } from 'react';
import { faCoffee, faLightbulb, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { getRGBLLevels, colors, getRandomArbitrary, statusIcons } from '../../utils/CoreUtils'
import { WebcamCaptureProps } from './types'

import Webcam from 'react-webcam'
import Loader from '../Loader';

import '../../assets/ccard.jpg'

const debug = true

const maxAttempts = 100
const attemptsInterval = 1000
const startTimeout = 3000

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
	const [reshot, setReshot] = useState('')
	const [evalutaing, setEvaluating] = useState(false)

	const [showCamera, setShowCamera] = useState(true)
	const [showCapture, setShowCapture] = useState(true)

	const [showRetake, setShowRetake] = useState(false)

	useEffect(() => {
		setTimeout(() => {
			setCapturing(true)
		}, startTimeout)
	},[])
	
	useEffect(() => {
		capturesLoop()
	}, [capturing, restart])

	useEffect(() => {
		//setShowCamera(capturing)
		//setShowCapture(!capturing)
	}, [capturing])

	// Evaluate capture
	useEffect(() => {
		if(!capture) return
		console.log('- Evaluating capture!')
		passRequirements(imageContainerId)
	}, [capture])

	const takeCapture = useCallback(() => {
		let imageSrc = webcamRef.current as Webcam		
		let screenShot = imageSrc.getScreenshot()
		if(screenShot){
			setCapture(imageSrc.getScreenshot())
		}else{
			let now = Date.now().toString()
			setReshot(now)
		}
	},[webcamRef, setCapture])

		// Loop the captures until a acceptable one!
	const capturesLoop = () => {
		console.log('- Running pictures loop!')
		let repeater = setTimeout(() => {
			if ( attempts === maxAttempts) {
				console.log('- Expire; many attempts /�\\ ')
				expired()
				clearTimeout(repeater)
			}else {
				console.log('- Taking new picture...')
				takeCapture()
				let at = attempts+1
				setAttempts(at)
			}
		}, attemptsInterval)
	}

	// The capture attemps has end without a good shot taken!	 
	const expired = () => {

		// Reset shooter
		setAttempts(0)
		setCapturing(false)

		setAction({
			setStatus: 'expired',
			return: false,
			data: {	
				card: {
					color: 'red',
				},
				toast: {
					show: 'in-line',
					icon: statusIcons.default,
					label: 'EXPIRED',
					iconColor: colors.false,
					bgColor: colors.false,
				},
				notice: {
					show: 'in-line',
					icon: statusIcons.false,
					label: 'Expired oportunities',
					bgColor: colors.false,
					lblColor: colors.false,
				}
			}
		})

		setShowRetake(true)
	}

	const passRequirements = (containerId: string) => {
		// Bright parameters to block the images
		if (options.includes('bright')) {
			setAction(getTooDark(containerId))
		}
		// Other parameters to block the images
		if (options.includes('cardDetected')) {
			setAction(cardDetected(containerId))
		}
	}

	const getTooDark = (containerId: string) => {
		var bright = getBright(true)
		var tooDark = bright < lowestLightLevelAccepted
		//console.log(bright+' < '+lowestLightLevelAccepted)
		if (tooDark) {
			// Continue traking the webcam
			return {
				setStatus: 'error',
				data: {		
					showRetake: false,
					card: {
						color: colors.moregrey,					
					},				
					toast: {
						show: 'none',
						icon: statusIcons.false,
						label: 'REJECTED',
						iconColor: colors.bulb,
						bgColor: colors.false,
					},				
					notice: {
						show: 'in-line',
						icon: statusIcons.bulb,
						label: 'Room lighting is to low',
						iconColor: colors.bulb,
					}
				}
			}

		} else {
			setCapturing(false)
			return {
				setStatus: 'accepted',				
				data: {
					showRetake: true,
					card: {
						color: colors.moregrey,
					},
					toast: {
						show: 'in-line',
						icon: statusIcons.true,
						iconColor: colors.bulb,
						label: 'ACCEPTED',
						bgColor: colors.true,
					},
					notice: {
						show: 'in-line',
						icon: statusIcons.bulb,
						iconColor: colors.bulb,
						label: 'Picture bright is accepted!',
					}
				}
			}
		}
	}

	const cardDetected = (containerId: string) => {
		return {
			setStatus: 'accepted',
			data: {
				showRetake: true,
				card: {
					color: colors.true,
				},
				toast: {
					show: 'in-line',
					icon: statusIcons.true,
					iconColor: colors.true,
					label: 'ACCEPTED',
					bgColor: colors.true,
				},
				notice: {
					show: 'in-line',
					icon: statusIcons.true,
					iconColor: colors.true,
					label: 'Your image has a card...',
				}
			}
		}
	}

	const getBright = (debug: boolean = false) => {		
			
		if (debug) return getRandomArbitrary(30, 50)

		var img: any = document.getElementById(imageContainerId)
		var canvas: any = document.createElement('canvas')
		var context: any = canvas.getContext && canvas.getContext('2d')
	
		var data, width, height
		 width = canvas.height = img.naturalHeight || img.offsetHeight || img.height
		 height = canvas.width = img.naturalWidth || img.offsetWidth || img.width
	
		context.drawImage(img, 0, 0)	
	
		data = context.getImageData(0, 0, width, height)

		console.log('imageData', data)
	
		var res  = getRGBLLevels(data.data, 2, true)
	
		return res.l
		
	}

	return <>
		<div>
			<div className='MyWebcam'>
				<img
					id={imageContainerId}
					ref={captureImgRef}
					style={{
						maxWidth: '100%',
						marginBottom: '-4px',
						visibility: showCapture ? 'visible' : 'hidden'
					}}
					src={capture}
					alt='Your Capture!!!'
				/>
				{/*<canvas	ref={captureCanvasRef}></canvas>*/}
				{attempts === 0 && <Loader params={loader} />}
				<Webcam
					ref={webcamRef}
					style={{
						maxWidth: '100%',
						marginBottom: '-4px',
						display: showCamera ? 'in-line' : 'none'
					}}
					audio={false}
					screenshotFormat='image/jpeg'
					videoConstraints={videoConstraints}
				/>
			</div>
		</div>
	</>

}

export default WebcamCapture