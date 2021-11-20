
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import { faCoffee, faLightbulb, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

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

	//const webcamRef = React.useRef(null);
	const [data, setData] = useState(null)

	const [action, setAction] = useState<OwnProps>({ setStatus: 'start'})
	const [loading, setLoading] = useState(false)

	const [card, setCard] = useState<any>({message: '', icon: faCoffee, return: true, show: 'none'})	
	const [notice, setNotice] = useState<any>({message: '', icon: faCoffee, return: true, show: 'none'})	
	const [toast, setToast] = useState<any>({message: '', icon: faCoffee, return: true, show: 'none'})

	const [showModal, setShowModal] = useState(false)
	const [showRetake, setShowRetake] = useState(false)
	
	useEffect(() => {

		if (debug) console.log('Action register changes!', action)

		setLoading(true)
		
		switch (action.setStatus) {

		/*	case 'take':
				setShowModal(true)

				//setCard(action.data)
				break;
*/
			case 'taking':
				setShowModal(true)
				//setShowRetake(false)
				//Do nothing while taking
				break;

			case 'expired':
				//Do nothing while taking
				//setToast(action.data)
				//setNotice(action.data)
				//setCard(action.data)
				//setShowRetake(true)
				break;

			case 'validating':
				//setCard(action.data)
				
				//var res = passRequirements('takingPicture')
				//if (res.return) {
				//	if (!debug) validateDocument()
				//	if (debug) setAction({ setStatus: res.state, data: res })
				//} else {
				//	setAction({ setStatus: 'rejected', data: res })
				//}
				//*/
				break;

			case 'error':
				//setCard(action.data)
				//Do nothing while taking
				break;

			case 'retake':
				//setCard(action.data)
				/*setShowToast(false)
				setData(null)
				setCard(action.setStatus)
				setShowToast(false)
				*/
				setShowRetake(false)
				break;
				
			case 'accepted':
			case 'rejected':
			case 'approved':
				setCard({message: 'pinga', icon: faCoffee, return: true, show: 'in-line'})
				setToast({message: 'pinga', icon: faCoffee, return: true, show: 'in-line'})
				setNotice({message: 'pinga', icon: faCoffee, return: true, show: 'in-line'})
				setShowRetake(true)
				//setCard(action.data)
				/*setToast(action.data)
				setShowRetake(true)*/
				break;

			case 'cancel':
				setShowModal(false)
				/*
				setShowModal(false)
				setShowRetake(false)
				setShowToast(false)
				setCard(action.data)*/
				break;

			case 'close':
				setShowModal(false)
				/*
				setShowModal(false)
				setShowRetake(false)
				setShowToast(false)
				setCard(action.data)*/
				break;

			default: //XXX: Also start is default ;)
				/*setShowModal(false)
				setShowModal(false)
				setData(null)
				setShowRetake(false)
				setShowToast(false)*/

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
					<Webcam setAction={setAction}/>
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