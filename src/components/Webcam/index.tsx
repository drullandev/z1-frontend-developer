import React, { useState, useEffect, useRef } from 'react'
import { getRGBLLevels, getRandomArbitrary } from '../../utils/CoreUtils'
import { WebcamCaptureProps } from './types'
import { StateProps } from '../../containers/DocumentValidator/types'

import Webcam from 'react-webcam'
import Button from '../../components/Button'

import '../../assets/ccard.jpg' // o.o

const debug = true

const imageContainerId = 'captureImgRef'
const videoConstraints = { facingMode: 'user' }
const initState = { key:'start', showRetake: false }

/**
 * This component was designed to get a webcam with the desired shape
 * //TODO: Study problems with capture bright detection (fails on load jeje)
 * @param WebcamCaptureProps 
 * @returns 
 */
const WebcamCapture: React.FC<WebcamCaptureProps> = ({ timeout, shot, setParentAction }) => {
		
	const webcamRef = useRef<Webcam>(null)
	const captureImgRef = useRef<any>()

	const [action, setAction] = useState<StateProps>(initState)

	const [capture, setCapture] = useState<any>(null)
	const [bright, setBright] = useState<number>(0)

	const [showCamera, setShowCamera] = useState(true)
	const [showCapture, setShowCapture] = useState(false)

	const [retake, setRetake] = useState('')

	useEffect(() => {
		if(bright < 0) return
		if(debug) console.log('- WEBCAM: Bright was seted as '+bright)
	}, [bright])

	useEffect(() => {

		if(debug) console.log('- WEBCAM: Restarting retake!')

		startCapturing()

		const capturing = setTimeout(()=>{

			const shooting = setTimeout(()=>{
				
				// Clearing capture and initialice camera
				var imageSrc = webcamRef.current as Webcam
				var screenShot = imageSrc.getScreenshot()

				stopCapturing(screenShot)

			}, timeout/2)
			
			return () =>{	clearTimeout(shooting) }
			
		}, timeout)

		return () =>{	clearTimeout(capturing)	} 
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [retake])

	const startCapturing = () => {
		setShowCamera(true)				
		setShowCapture(false)
		setCapture(undefined)
	}
	
	const stopCapturing = (src: any) => {
		if(src){
			setShowCamera(false)				
			setCapture(src)
			setShowCapture(true)
			getBright()
			setParentAction({
				key: 'shotReturn',
				data: {
					imageSrc: src,
					bright: bright
				}
			})
		}else{
			startCapturing()
		}
	}

	// EXTRA

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
						onClick={() => { setRetake(Date.now().toString())	}}
					/>
				</div>
			}
		</div>
	</>

}

export default WebcamCapture
