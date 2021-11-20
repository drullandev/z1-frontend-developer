import React, { useState, useEffect } from 'react';
import { faCoffee, faLightbulb, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import { getBright } from '../../utils/CoreUtils'

import Webcam from "react-webcam"

import Toast from '../Toast/index'
import Notice from '../Notice/index'

const debug = true
const maxAttempts = 2
const interval = 1000
const options = ['bright']

const videoConstraints = {
  facingMode: "user"
}

const colors = {
	blank: '#00000000',
	true: '#69CC8B',
	false: '#C00000',
	grey: '#F3F2F489'
}

const imageContainerId = 'takingPicture'
const lowerLightLevelAccepted = 40

//const WebcamComponent = () => <Webcam />

export interface WebcamCaptureProps {
	setAction: any
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ setAction }) => {

  const webcamRef = React.useRef<Webcam>(null)

  const [capture, setCapture] = useState<any>()
  const [attempts, setAttempts ] = useState(0)

	const [loading, setLoading] = useState(false)
	const [showCamera, setShowCamera] = useState(true)
	const [showCapture, setShowCapture] = useState(false)


	const [cameraLoaded, setCameraLoaded] = useState(true)
	const [showRetake, setShowRetake] = useState(false)

	//const process = { show: 'none', faicon: faCoffee, color: 'white', label: 'Taking the picture...' }

	useEffect(() => {
		setLoading(true)
	}, [])

  useEffect(()=>{

    var repeatPicture = setTimeout(()=>{

      if(debug) console.log('Capture made each '+(interval/1000)+' seconds until '+((interval/1000)*maxAttempts)+' !!! '+Date.now())

      if(attempts === maxAttempts){

				setAction({
					setStatus: 'expired',
					data: {
						message: 'The quantity of times required to validate a capture has expired!!'
					}}) 
        clearTimeout(repeatPicture)
        setAttempts(0)
				setLoading(false)
				
      }else{
				
				let at = attempts
        const imageSrc = webcamRef.current as Webcam
        setCapture(imageSrc.getScreenshot())
				
				//flipFlop()
				
				passRequirements(imageContainerId, repeatPicture)			
				setAttempts(++at)

      }

    },interval)

  },[capture])

	const flipFlop = () => {
		setTimeout(() => {
			setShowCapture(true)
			setShowCamera(false)
		}, 2000);
		setShowCapture(false)
		setShowCamera(true)
	}

  /**
	 * This function was performed to take the task to valuate if the image pass some requirements! ;)
	 * TODO: Move to the utilery!!
	 * @param camData
	 * @returns 
	 */
  const passRequirements = (containerId: string, repeater: any) => {
		if(options.indexOf('bright')){
			getTooDark(containerId, repeater)			
		}		
	}

	const getTooDark = (containerId: string, repeater: any) =>{
		var bright = getBright(containerId)
		var tooDark = bright < lowerLightLevelAccepted
		if (tooDark) {
			setAction({ setStatus: 'error', data: {
				return: false,
				faicon: faLightbulb,
				message: 'Room lighting is to low',
				color: colors.false,
				state: 'rejected',
				show: debug ? true : false,
				rgbl: bright
			}})
		} else {
			setAction({ setStatus: 'accepted', data: {
				return: true,
				faicon: faCheckCircle,
				message: 'Everything is ok!',
				color: colors.true,
				state: 'accepted',
				show: debug ? true : false,
				rgbl: bright
			}})
			clearTimeout(repeater)
		}
	}

  return <>
		<div>		
			<div className="MyWebcam">    
				{!loading && <img
					id={imageContainerId}
					style={{ maxWidth: '100%', marginBottom: '-4px' }}
					src={capture}
					alt='Your Document Picture!!!'
				/>}
				{loading && <Webcam
					audio={false}
					ref={webcamRef}
					screenshotFormat="image/jpeg"
					videoConstraints={videoConstraints}
				/>}
			</div>
		</div>
	</>

} /* , display: capture ? 'in-line' : 'none' */

export default WebcamCapture