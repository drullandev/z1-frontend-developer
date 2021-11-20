
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import { faCoffee } from '@fortawesome/free-solid-svg-icons'

import Button from '../Button/index'
import Loader from '../Loader/index'
import Toast from '../Toast/index'
import Notice from '../Notice/index'
import Webcam from '../Webcam/index'

import { ModalStyle, CardStyle, LoaderStyle, ModalContent } from './styles'


const debug = true
	
const testValidationUrl = 'https://front-exercise.z1.digital/evaluations'

const colors = {
	blank: '#00000000',
	true: '#69CC8B',
	false: '#C00000',
	grey: '#F3F2F489'
}

/*
const statusIcons = {
	true: faCoffee,
	false: faCoffee,
	lowLight: faCoffee
}
*/

export interface OwnProps {
	setStatus:
		'start' |
		'take' | 'retake' | 'taking' | 'expired' |
		'validating' | 'error' | 'accepted' | 
		'rejected' | 'approved' | 'cancel' | string,
	data?: any
}

const DocumentValidator: React.FC = () => {

	//const webcamRef = React.useRef(null)
	const [data, setData] = useState(null)

	const [action, setAction] = useState<OwnProps>({ setStatus: 'start'})
	const [loading, setLoading] = useState(false)

	const [card, setCard] = useState<any>({message: '', icon: faCoffee, return: true, show: 'none'})	
	const [notice, setNotice] = useState<any>({message: '', icon: faCoffee, return: true, show: 'none'})	
	const [toast, setToast] = useState<any>({message: '', icon: faCoffee, return: true, show: 'none'})

	const [showModal, setShowModal] = useState(false)
	const [showRetake, setShowRetake] = useState(false)

	const [reload, setReload] = useState(0)
	
	useEffect(() => {

		if (debug) console.log('Action register changes!', action)

		setLoading(true)
		
		setCard(action.data)
		setToast(action.data)
		setNotice(action.data)
		
		switch (action.setStatus) {

			case 'taking':
				// Show the Webcam capturing modal windows to take the picture...
				setShowModal(true)
			break

			case 'expired':
				// The camera timeout to take a good picture has expired...
				setShowRetake(true)
			break

			case 'error':
				setShowRetake(true)
			break

			case 'retake':
				setData(null)
				setShowRetake(false)
				let rel = reload
				setReload(++rel)
			break
				
			case 'accepted':
				// TODO: For now you must get to validate against the service (debug === false)!!!!
			break

			case 'validating':
				// TODO: For now you must get to validate against the service (debug === false)!!!!
				//setCard(action.data)
				
				//var res = passRequirements('takingPicture')
				//if (res.return) {
				//	if (!debug) validateDocument()
				//	if (debug) setAction({ setStatus: res.state, data: res })
				//} else {
				//	setAction({ setStatus: 'rejected', data: res })
				//}
				//*/
			break

			case 'rejected':
			case 'approved':
				setShowRetake(true)
			break

			case 'cancel':
				setShowRetake(false)
				setShowModal(false)
			break

			case 'close':
				setShowRetake(false)
				setShowModal(false)
			break

			default:
				setCard({message: '', icon: faCoffee, return: true, show: 'none'})
				setToast({message: '', icon: faCoffee, return: true, show: 'none'})
				setNotice({message: '', icon: faCoffee, return: true, show: 'none'})
				setShowRetake(false)
			break
		}
		setLoading(false)
	}, [action])

	// OTHERS

	/**
		* This call allows to send the image content in order to be evaluated
		* @param data
		*/
	const validateDocument = () => {
		var myHeaders = new Headers()
		var myInit = {
			method: 'POST',
			headers: myHeaders,
			body: data
		}
		fetch(testValidationUrl, myInit)
			.then(res => res.json())
			.then((res: any) => {
				/*setProcess({
					return: true,
					faicon: faCheckCircle,
					message: 'ACCEPTED',
					color: colors.true,
					state: 'approved',
					show: 'in-line',
				})
				setToast({
					return: true,
					faicon: faCheckCircle,
					message: 'Picture taken!',
					color: colors.true,
					state: 'approved',
					show: 'in-line',
				})*/
			})
			.then((err: any) => {
				callError(err)
				/*setProcess({
					return: false,
					faicon: faTimesCircle,
					message: 'REJECTED',
					color: colors.false,
					state: 'rejected',
					show: 'in-line',
				})
				setToast({
					return: false,
					faicon: faTimesCircle,
					message: 'There was an error!',
					color: colors.false,
					state: 'rejected',
					show: 'in-line',
				})*/
			})
	}
	

	// WITH THE SERVICE

	const callError = (err: any) => {
		if (debug) console.log('Call error!!!', err)
	}

	return <>

		<h1>Scan your ID</h1>
		<h2>Take a picture. It may take time to validate your personal information.</h2>

		<CardStyle color={colors.grey} height={60} proportion={1.3}>
			<Button
				disabled={loading}
				type='submit'
				label={'TAKE PICTURE'}
				onClick={() => { setAction({
					setStatus: 'taking',
					data: {
						color: colors.grey
					}})}}>					
			</Button>
			<Loader params={LoaderStyle} />
		</CardStyle>

		<Modal
			className='cameraModal'
			style={ModalStyle}
			isOpen={showModal}>
			<ModalContent>

				<h2 className='white'>Fit your ID card inside the frame.</h2>
				<h2 className='white'>The picture will taken automatically</h2>
					
				<CardStyle color={card.color} height={60} proportion={1.3}>
					<Webcam setAction={setAction} reload={reload}/>
				</CardStyle>				

				<Notice params={notice}/>

				<Toast params={toast}/>

				{showRetake && <Button
					type='submit'
					disabled={loading}
					label={'RETAKE PICTURE'}
					onClick={() => { setAction({
						setStatus: 'retake',
						data: {
							color: colors.grey,							
						}})}
					}
				/>}

				<Button
					disabled={loading}
					label={action.setStatus === 'approved' ? 'CLOSE' : 'CANCEL'}
					onClick={() => { setAction({
						setStatus: 'cancel',
						data: {
							color: colors.grey
						}})}
					}
				/>

			</ModalContent>

		</Modal>

	</>

}

export default DocumentValidator