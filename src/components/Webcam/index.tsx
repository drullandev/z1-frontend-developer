import React, { useState, useEffect, useRef } from 'react'
import { WebcamCaptureProps } from './types'
import './styles'

import { getRGBLLevels, getRandomArbitrary } from '../../utils/CoreUtils'
//import { CaptureStyle } from '../Document/styles'

import Webcam from 'react-webcam'
import Button from '../../components/Button'
//import Loader from '../../components/Loader'

const debug = false

const imageContainerId = 'captureImgRef'

/**
 * This component was designed to get a webcam with the desired shape
 * //TODO: Study problems with capture bright detection (fails on load jeje)
 * @param WebcamCaptureProps 
 * @returns 
 */
const WebcamCapture: React.FC<WebcamCaptureProps> = ({
	timeout,
	parentShot,
	setParentAction,
	videoConstraints
}) => {
		
	const webcamRef = useRef<Webcam>(null)
	const captureImgRef = useRef<any>()

	const [shot, setShot] = useState(Date.now().toString())
	const [capture, setCapture] = useState<any>(null)
	const [bright, setBright] = useState<number>(0)

	const [showCamera, setShowCamera] = useState(true)
	const [showCapture, setShowCapture] = useState(false)

	useEffect(() => {
		startCapturing()
		const shooting = setTimeout(()=>{			
			var imageSrc = webcamRef.current as Webcam
			var screenShot = imageSrc.getScreenshot()
			stopCapturing(screenShot)
		}, timeout/2)
		return () =>{	clearTimeout(shooting) }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shot, parentShot])

	const startCapturing = () => {
		if (debug) console.log('- Webcam: The webcam will perform a call in '+timeout+' seconds.')
		setShowCapture(false)
		setShowCamera(true)
		setCapture(undefined)
	}
	
	const stopCapturing = (src: any) => {
		setShowCamera(false)				
		setCapture(src)
		setShowCapture(true)
		getBright()
		if (debug) console.log('- Webcam: Capture was done!!')
		returnCapture(src)
	}

	const returnCapture = (src: any) => {
		let data = {
			timestamp: shot,
			imageSrc: src,
			shotTimeout: timeout,
			bright: bright
		}
		if (debug) console.log('- Webcam: returning capture', data)
		setParentAction({
			key: 'getShot',
			data: data
		})
	}

	const getBright = (debug: boolean = true) => {

		if(debug) getRandomArbitrary(0, 4)

		var img: any = document.getElementById(imageContainerId)
		var canvas: any = document.createElement('canvas')
		var context: any = canvas.getContext && canvas.getContext('2d')

		var data, width, height
		width = canvas.height = img.naturalHeight || img.offsetHeight || img.height
		height = canvas.width = img.naturalWidth || img.offsetWidth || img.width
		
		try {
			context.drawImage(img, 0, 0)
			data = context.getImageData(0, 0, width, height)
			var res = getRGBLLevels(data.data, 2)
			setBright(res.l)
		} catch (error) {
			setBright(10)
		}
	}

	return <>
		<div className='MyWebcam'>
			<img
				id={imageContainerId}
				ref={captureImgRef}
				style={{
					maxWidth: '100%',
					marginBottom: '-4px',
					display: showCapture ? 'inline' : 'none'
				}}
				src={capture ?? '../assets/ccard.jpg'}
				alt='Your Capture!!!'
			/>
			{/*<Loader params={loaderStyle} />*/}
			{/*<CaptureStyle id={imageContainerId+'2'} ref={captureImgRef} src={capture} alt='Final Capture'/>*/}
			{/*<canvas	ref={captureCanvasRef}></canvas>*/}
			{/*!showCamera && !showCapture && attempts === 0 && <Loader params={loader} />*/}
			<Webcam
				ref={webcamRef}
				style={{
					maxWidth: '100%',
					marginBottom: '-4px',
					display: showCamera ? 'inline' : 'none'
				}}
				audio={false}
				screenshotFormat='image/jpeg'
				videoConstraints={videoConstraints}
			/> 
			{debug && false &&
				<div style={{
					position: 'absolute',
					alignItems: 'center',
					width: '100%'
				}}>
					<Button
						type='submit'
						disabled={false}
						label={'DEBUG RESHOT'}
						onClick={() => { setShot(Date.now().toString())	}}
					/>
				</div>
			}
		</div>
	</>

}

export default WebcamCapture
