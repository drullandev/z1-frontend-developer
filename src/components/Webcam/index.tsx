import React, { useState, useEffect } from 'react';
import { faCoffee, faLightbulb, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

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
		repeatPicture()
	}, [capture, reload])

	const repeatPicture = () => {

		var repeater = setTimeout(() => {

			if (debug) console.log('Capture made each ' + (interval / 1000) + ' seconds until ' + ((interval / 1000) * maxAttempts) + ' !!! ' + Date.now())

			if (attempts === maxAttempts) {

				setAction({
					setStatus: 'expired',
					data: {
						icon: faCoffee,
						message: 'The quantity of times required to validate a capture has expired!!',
						show: 'in-line',
						color: 'red'
					}
				})
				clearTimeout(repeater)
				setAttempts(0)
				setLoading(false)
				setShowRetake(true)

			} else {

				let at = attempts
				const imageSrc = webcamRef.current as Webcam
				setCapture(imageSrc.getScreenshot())
				var req = passRequirements(imageContainerId, repeatPicture)
				console.log('req', req)
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
		return getTooDark(containerId, repeater)
		//}		
	}

	const getTooDark = (containerId: string, repeater: any) => {
		console.log('see the bright!!')
		var bright = getBright(containerId, true)
		var tooDark = bright < lowerLightLevelAccepted
		if (tooDark) {
			setAction({
				setStatus: 'error',
				data: {
					return: false,
					faicon: faLightbulb,
					message: 'Room lighting is to low',
					color: colors.false,
					state: 'rejected',
					show: true,
					rgbl: bright
				}
			})
			return true
		} else {
			setAction({
				setStatus: 'accepted',
				data: {
					return: true,
					faicon: faCheckCircle,
					message: 'Everything is ok!',
					color: colors.true,
					state: 'accepted',
					show: true,
					rgbl: bright
				}
			})
			clearTimeout(repeater)
		}
	}

	return <>
		<div>
			<div className="MyWebcam">
				<img
					id={imageContainerId}
					style={{ maxWidth: '100%', marginBottom: '-4px' }}
					src={capture}
					alt='Your Document Picture!!!'
				/> <Webcam
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