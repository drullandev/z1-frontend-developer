
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import { ModalStyle, CardStyle, LoaderStyle, ModalContent } from './styles'
import { StateProps } from './types'
import { colors, statusIcons } from '../../utils/CoreUtils'

import Button from '../../components/Button/index'
import Loader from '../../components/Loader/index'
import Toast from '../../components/Toast/index'
import Notice from '../../components/Notice/index'
import Webcam from '../../components/Webcam/index'

const debug = true

const testValidationUrl = 'https://front-exercise.z1.digital/evaluations'

const def = { message: '', icon: statusIcons.default, return: true, show: 'none' }

const DocumentValidator: React.FC = () => {

	const [savedCapture, setSavedCapture] = useState(null)

	const [action, setAction] = useState<StateProps>({ setStatus: 'start' })
	const [loading, setLoading] = useState(false)

	const [card, setCard] = useState<any>(def)
	const [toast, setToast] = useState<any>(def)
	const [notice, setNotice] = useState<any>(def)

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
				setShowModal(true)
				break

			case 'expired':
				setShowRetake(true)
				break

			case 'error':
				setShowRetake(true)
				break

			case 'retake':
				setSavedCapture(null)
				let rel = reload
				setReload(++rel)
				setShowRetake(false)
				break

			case 'accepted':
				if(!debug) setAction({ setStatus: 'validating', data: action.data })
				break

			case 'validating':
				validateDocument()
				break

			case 'rejected':
			case 'approved':
				setShowRetake(true)
				break

			case 'saveLocal':
				setSavedCapture(action.data)
				break;

			case 'cancel':
				setShowRetake(false)
				setShowModal(false)
				break

			case 'close':
				setShowRetake(false)
				setShowModal(false)
				break

			default:
				setCard(def)
				setToast(def)
				setNotice(def)
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
			body: savedCapture
		}
		fetch(testValidationUrl, myInit)
			.then(res => res.json())
			.then((res: any) => {

				switch (res.summary.outcome) {
					case 'Approved':
						setAction({
							setStatus: 'approved',
							data: {
								return: true,
								iconToast: statusIcons.true,
								iconNotice: statusIcons.true,
								label: 'ACCEPTED',
								message: 'Picture taken!',
								color: colors.true,
								state: 'approved',
								show: 'in-line',
							}
						})
						break

					default:
					case 'Too Much Glare':
						setAction({
							setStatus: 'rejected',
							data: {
								return: false,
								iconToast: statusIcons.false,
								iconNotice: statusIcons.false,
								label: 'REJECTED',
								message: res.summary.outcome,
								color: colors.false,
								state: 'rejected',
								show: 'in-line',
							}
						})
						break
				}
			})
			.then((err: any) => {
				callError(err)
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
			{savedCapture
				? <img src={savedCapture} alt='Final Capture'/>
				: <Loader params={LoaderStyle} />
			}
		</CardStyle>

		<div style={{ marginTop: '-186px', width: '100%' }}>
			<Button
				disabled={loading}
				type='submit'
				label={'TAKE PICTURE'}
				onClick={() => {
					setAction({
						setStatus: 'taking',
						data: {
							color: colors.grey
						}
					})
				}}>
			</Button>
		</div>

		<Modal
			className='cameraModal'
			style={ModalStyle}
			isOpen={showModal}>
			<ModalContent>

				<h2 className='white'>Fit your ID card inside the frame.</h2>
				<h2 className='white'>The picture will taken automatically</h2>

				<CardStyle color={card.color} height={50}>
					<Webcam setAction={setAction} loader={LoaderStyle} restart={reload} />
				</CardStyle>

				<Notice params={notice} />

				<Toast params={toast} />

				{showRetake && <div style={{ position: 'absolute', marginTop: '35%', width: '100%' }}>
					<Button
						type='submit'
						disabled={loading}
						label={'RETAKE PICTURE'}
						onClick={() => {
							setAction({
								setStatus: 'retake',
								data: {
									color: colors.grey,
								}
							})
						}}
					/>
				</div>}
				<div style={{ position: 'absolute', bottom: '10px', marginTop: '35%', width: '100%' }}>
					<Button
						disabled={loading}
						label={action.setStatus === 'approved' ? 'CLOSE' : 'CANCEL'}
						onClick={() => {
							setAction({
								setStatus: 'cancel',
								data: {
									color: colors.grey
								}
							})
						}}
					/>
				</div>

			</ModalContent>

		</Modal>

	</>

}

export default DocumentValidator