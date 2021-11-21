import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getRGBLLevels, colors, getRandomArbitrary, statusIcons } from '../../utils/CoreUtils'
import { WebcamCaptureProps } from './types'

import Webcam from 'react-webcam'
import Loader from '../Loader';

import '../../assets/ccard.jpg'

const debug = true

const maxAttempts = 3
const startTimeout = 3000

const lowestLightLevelAccepted = 1
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
const WebcamCapture: React.FC<WebcamCaptureProps> = ({ setAction, restart, loader, checks, setSavedCapture }) => {

	const webcamRef = useRef<Webcam>(null)
	const captureImgRef = useRef<any>()
	const captureCanvasRef = useRef<any>()
	
	const [attempts, setAttempts] = useState(0)
	const [capturing, setCapturing] = useState(false)
	const [expired, setExpired] = useState(false)

	const [capture, setCapture] = useState<any>()
	const [evaluating, setEvaluating] = useState(false)
	const [accepted, setAccepted] = useState(false)

	const [showCamera, setShowCamera] = useState(true)
	const [showCapture, setShowCapture] = useState(true)

	useEffect(() => {
		setTimeout(() => {
			setCapturing(true)
		}, startTimeout)
	},[restart])
	
	useEffect(() => {
		if(stopped()) return
		//setShowCamera(capturing)
		//setShowCapture(!capturing)
	}, [capturing])

	// Evaluate capture
	useEffect(() => {
		if(!capture) return
		passRequirements()
	}, [capture])

	const takeCapture = useCallback(() => {
		let imageSrc = webcamRef.current as Webcam		
		let screenShot = imageSrc.getScreenshot()
		if(screenShot){
			setShowCapture(true)
			setCapture(imageSrc.getScreenshot())
		}
	},[webcamRef, setCapture])

	useEffect(() => {
		if(stopped()) return
		if ( attempts === maxAttempts) {
			console.log('- Expired; '+attempts+' attempts exhausted /�\\ ')
			setExpired(true)
		}else {
			takeCapture()
			let at = attempts+1
			setAttempts(at)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[evaluating, capturing, restart])

	useEffect(()=>{

	},[accepted])

	useEffect(() => {

		if(!expired) return

		resetShooter()

		setAction({
			setStatus: 'expired',
			return: false,
			showRetake: true,
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
				icon: statusIcons.expired,
				label: 'Expired oportunities',
				bgColor: colors.warning,
				lblColor: colors.false,
			},
			data: {
				debug: '* Expired after '+maxAttempts+' attempts'
			}
		})

	}, [expired])

	// STATES

	const stopped = () => {
		if(evaluating) return true
		if(!capturing) return true
		return false
	}

	// ACTIONS

	const resetShooter = () => {		
		setAttempts(0)
		setCapturing(false)
	}

	// SHOT REQUIREMENTS

	/**
	 * This routine allows to know if the image pass some requirements
	 */
	const passRequirements = () => {

		setEvaluating(true)

		// Bright parameters to block the images
		if (checks.includes('bright')) {
			setAction(getTooDark())
		}

		// Other parameters to block the images
		if (checks.includes('cardDetected')) {
			setAction(cardDetected())
		}

		setEvaluating(false)

	}

	/**
	 * Evaluates if the picture has light enough
	 */
	const getTooDark = () => {

		var bright = getBright(true)
		var tooDark = bright < lowestLightLevelAccepted
		
		if (tooDark) {
			setCapturing(true)
			setAccepted(false)
			return {
				setStatus: 'error',
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
				},
				data: {
					debug: '* Bright diff, '+bright+' < '+lowestLightLevelAccepted
				}
			}

		} else {
			setCapturing(false)
			setAccepted(true)
			return {
				setStatus: 'accepted',				
				showRetake: false,
				card: {
					color: colors.grey,
				},
				toast: {
					show: 'none',
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
				},
				data: {
					debug: '* Bright diff, '+bright+' < '+lowestLightLevelAccepted
				}
			}

		}

	}

	/**
	 * Pretend to be the first step to extrarequirements over detection... I cannot will go so deep with this case!
	 */
	const cardDetected = () => {
		// TODO: Set a card detector!!
		//var hasCard = getCardDetected(false)
		return {
			setStatus: 'accepted',
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
			},
			data: {
				debug: '* A card suposes to be detected here!'
			}
		}
	}

	// EXTRA

	/**
	 * Gettign the capture bright! 
	 */
	const getBright = (debug: boolean = false) => {		
			
		if (debug) return getRandomArbitrary(0, 4)

		var img: any = document.getElementById(imageContainerId)
		var canvas: any = document.createElement('canvas')
		var context: any = canvas.getContext && canvas.getContext('2d')
	
		var data, width, height
		 width = canvas.height = img.naturalHeight || img.offsetHeight || img.height
		 height = canvas.width = img.naturalWidth || img.offsetWidth || img.width
	
		context.drawImage(img, 0, 0)
		data = context.getImageData(0, 0, width, height)
		var res  = getRGBLLevels(data.data, 2)
	
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
				{!showCamera && attempts === 0 && <Loader params={loader} />}
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