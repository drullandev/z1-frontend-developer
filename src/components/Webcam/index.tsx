
import React , { Component, useState, useEffect } from 'react'
//import './cameraStyles.css'
import Webcam from "react-webcam";
import './styles'

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: "user"
};
const WebcamComponent = () => <Webcam />;
const WebcamCapture: React.FC = () => {

	const webcamRef = React.useRef<Webcam>(null)

	
  useEffect(() => {
		//webcamRef.current.getScreenshot()
	},[])

  const capture = React.useCallback(
    () => {
      //const imageSrc = webcamRef.getScreenshot();
    },

    [webcamRef]
  );

	return (
    <div className="webcam-container">
      <Webcam
        height={200}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={220}
        videoConstraints={videoConstraints}
      />
      <button onClick={(e)=>{capture()}}>
      	Capture
			</button>
    </div>
	)
}

export default WebcamCapture