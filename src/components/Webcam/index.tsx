import React, { useState, useEffect } from 'react';
import { faCoffee, faLightbulb, faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons'

import { getBright } from '../../utils/CoreUtils'

import Webcam from "react-webcam"

const debug = true
const maxAttempts = 1
const interval = 1000
//const options = ['bright']

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

export interface WebcamCaptureProps {
	setAction: any
	reload: any
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ setAction, reload }) => {

	const webcamRef = React.useRef<Webcam>(null)

	const [capture, setCapture] = useState<any>()
	const [attempts, setAttempts] = useState(0)

	const [loading, setLoading] = useState(false)
	const [showRetake, setShowRetake] = useState(false)

	useEffect(() => {
		setLoading(true)
	}, [])

	
	useEffect(() => {
		launchCapture()
	}, [capture, reload])

	const launchCapture = () => {

		var repeater = setTimeout(() => {

			if (debug) console.log('Capture made each ' + (interval / 1000) + ' seconds until ' + ((interval / 1000) * maxAttempts) + ' !!! ' + Date.now())

			if (attempts === maxAttempts) {
				
				clearTimeout(repeater)

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

				setLoading(false)
				setShowRetake(true)

				setAttempts(0)
				
			} else {

				const imageSrc = webcamRef.current as Webcam
				passRequirements(imageContainerId, launchCapture)
				setCapture(imageSrc.getScreenshot())


				
				let at = attempts
				setAttempts(++at)

			}

			return () => clearTimeout(repeater)

		}, interval)

	}

	/**
	 * This function was performed to take the task to valuate if the image pass some requirements! ;)
	 * TODO: Move to the utilery!!
	 * @param camData
	 * @returns 
	 */
	const passRequirements = (containerId: string, repeater: any) => {
		//if(options.indexOf('bright')){
		setAction(getTooDark(containerId, repeater))

		//}		
	}

	const getTooDark = (containerId: string, repeater: any) => {
		console.log('see the bright!!')
		var bright = getBright(containerId, true)
		var tooDark = bright < lowerLightLevelAccepted
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
					color: colors.false,
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
					message: 'Your image is accepted...',// TODO: Is not under control!....
					color: colors.true,
					gbColor: colors.true,
					iconToast: faCircle,
					iconNotice: faCircle,
				}
			}
		}
	}

	return <>
		<div>
			<div className="MyWebcam">
				<img
					id={imageContainerId}
					style={{ maxWidth: '100%', marginBottom: '-4px', visibility: true ? 'visible' : 'hidden' }}
					alt='Your Document Picture!!!'
					src={capture ?? '../assets/ccard.jpg' }
				/>
				<Webcam
					style={{ maxWidth: '100%', marginBottom: '-4px', visibility: true ? 'visible' : 'hidden' }}
					audio={false}
					ref={webcamRef}
					screenshotFormat="image/jpeg"
					videoConstraints={videoConstraints}
				/>
			</div>
		</div>
	</>

} /* , display: capture ? 'in-line' : 'none' */

export default WebcamCapture