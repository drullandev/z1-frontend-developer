
import React, { useEffect, useState } from 'react'
import Camera, { FACING_MODES } from 'react-html5-camera-photo'

import Webcam from '../Webcam/index'
import 'react-html5-camera-photo/build/css/index.css'

export { CardStyle } from './styles'



export interface OwnProps {
	setStatus: 'start' | 'take' | 'retake' | 'taking' | 'validating' | 'rejected' | 'approved' | 'cancel' | string,
	data?: any
}

const MyCard: React.FC = (data) => {
  
	return <div>{/*}
			<CardStyle color={cardColor} height={60} proportion={1.3}>

				{data
					? <img
							id='takingPicture'
							style={{ maxWidth: '100%', marginBottom: '-4px' }}
							src={data}
							alt='Your Document Picture!!!'
						/>
					: cameraLoaded
						? <><Webcam/><Camera 
								idealFacingMode={FACING_MODES.ENVIRONMENT}
								onTakePhoto={(data: string) => { setAction({setStatus: 'taking', data: data}) }}
								onTakePhotoAnimationDone={(data: string) => { setAction({setStatus: 'validating', data: 'takingPicture'}) }}
								onCameraError={(error) => { evCameraError(error) }}
								imageType={'jpg'}
								imageCompression={0.97}
								isMaxResolution={true}
								isImageMirror={false}
								isSilentMode={false}
								isDisplayStartCameraError={true}
								isFullscreen={false}
								sizeFactor={1}
								onCameraStop={() => { evCameraStop() }}					  
								onCameraStart={() => { evCameraStart() }}			
							/></>
						: <Loader params={loaderSheet} />
				}


			</CardStyle>
			
			{showRetake && <Button disabled={loading} type='submit' label={'RETAKE PICTURE'} onClick={(e: any)=> {setAction({setStatus: 'retake', data: ''})}}></Button>}					
				
			{showToast && <Toast icon={toastIcon} message={toastMessage} color={toastColor} height={23} proportion={324}/>}

			{showProcess && <Toast icon={processIcon} message={processMessage} color={processColor} height={23} proportion={324}/>}

			<Button disabled={loading} label={'CANCEL'} onClick={(e: any) => { setAction({setStatus: 'cancel', data:{ color: colors.grey }})}} />
			*/}
		</div>

}

export default MyCard