import { setUncaughtExceptionCaptureCallback } from 'process';
import React, { Component, useState, useEffect } from 'react';
import { faLightbulb, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
//import './cameraStyles.css'
import Webcam from "react-webcam"

const debug = true
const maxAttempts = 3
const interval = 1000

const videoConstraints = {
  facingMode: "user"
}

const colors = {
	blank: '#00000000',
	true: '#69CC8B',
	false: '#C00000',
	grey: '#F3F2F489'
}

const WebcamComponent = () => <Webcam />

const WebcamCapture: React.FC = () => {


  const [imgData, setImgData] = useState(null)
  const [capture, setCapture] = useState<any>(false)
  const [attempts, setAttempts ] = useState(0)
  const lowerLightLevelAccepted = 40
  const webcamRef = React.useRef<Webcam>(null)

  useEffect(()=>{
    var pinga = setTimeout(()=>{      
      if(debug) console.log('Captura hecha cada '+(interval/1000)+' segundos hasta '+((interval/1000)*maxAttempts)+' !!! '+Date.now())
      if(attempts === maxAttempts){
        console.log('Se han agotado la cantidad de intentos!!')
        clearTimeout(pinga)
        clearTimeout(pinga)
        setAttempts(0)
      }else{
        let at = attempts
        const imageSrc = webcamRef.current as Webcam
        setCapture(imageSrc.getScreenshot())
        setAttempts(++at)
      }

    },interval)
  },[capture])

  /**
	 * This function was performed to take the task to valuate if the image pass some requirements! ;)
	 * TODO: Move to the utilery!!
	 * @param camData
	 * @returns 
	 */
   const passRequirements = (imgId: string = 'takingPicture') => {
		var rgbLevels = getRGBLLevels(imgId)
		var tooDark = rgbLevels.l < lowerLightLevelAccepted
		if (tooDark) {
			return {
				return: false,
				icon: faLightbulb,
				message: 'Your picture bright is to low',
				color: colors.false,
				state: 'rejected',
				show: true,
			}
		} else {
			return {
				return: true,
				icon: faCheckCircle,
				message: 'Everything is ok!',
				color: colors.true,
				state: 'approved',
				show: true,
			}
		}
	}

  	/**
	 * This function recover the RGB and LigtBright by the image related with an ID
	 * - For this cae I want to help to avoid the unnecesary POSTS to the API service,
	 *   where the image is being reevaluated with computational costs
	 * TODO: Try to move to the utilery!!
	 * @param imgId string
	 * @param precision number
	 * @returns rgbl
	 */
	const getRGBLLevels = (imgId: string, precision: number = 2) => {

		if (debug) return { l: getRandomArbitrary(30, 50) }

		var defPrection = 50
		var img: any = document.getElementById(imgId)
		var defaultRGBL = { r: 0, g: 0, b: 0, l: 0 } // for non-supporting envs
		var canvas = document.createElement('canvas')
		var context = canvas.getContext && canvas.getContext('2d')
		var i = -4
		var length
		var rgbl = { r: 0, g: 0, b: 0, l: 0 }
		var count = 0

		if (!context) {
			return defaultRGBL
		}

		var data, width, height
		height = canvas.height = img.naturalHeight || img.offsetHeight || img.height
		width = canvas.width = img.naturalWidth || img.offsetWidth || img.width

		context.drawImage(img, 0, 0)

		try {
			data = context.getImageData(0, 0, width, height)
		} catch (e) {
			// security error, img on diff domain 
			return defaultRGBL
		}

		length = data.data.length
		var avg = 0
		var colorSum = 0
		var blockSize = defPrection / precision
		while ((i += blockSize * 4) < length) {
			++count;
			rgbl.r += data.data[i];
			rgbl.g += data.data[i + 1];
			rgbl.b += data.data[i + 2];
			avg = Math.floor((rgbl.r + rgbl.r + rgbl.r) / 3)
			colorSum += avg
		}

		//var brightness = Math.floor(colorSum / (width*height))

		// ~~ used to floor values
		rgbl.r = ~~(rgbl.r / count)
		rgbl.g = ~~(rgbl.g / count)
		rgbl.b = ~~(rgbl.b / count)
		rgbl.l = Math.floor(colorSum / count / 10000)

		return rgbl

	}

  const getRandomArbitrary = (min: number, max: number) => {
		return Math.random() * (max - min) + min;
	}

  return <div className="react-html5-camera-photo">
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
    />
  </div>

}

export default WebcamCapture