
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import { ModalStyle, CardStyle, LoaderStyle, ModalContent } from './styles'
import { StateProps, CardProps } from './types'

import { ToastProps } from '../../components/Toast/types'
import { NoticeProps } from '../../components/Notice/types'

import { colors, statusIcons } from '../../utils/CoreUtils'

import Button from '../../components/Button/index'
import Loader from '../../components/Loader/index'
import Toast from '../../components/Toast/index'
import Notice from '../../components/Notice/index'
import Webcam from '../../components/Webcam/index'

const debug = true

const testValidationUrl = 'https://front-exercise.z1.digital/evaluations'

const DocumentValidator: React.FC = () => {

	const [savedCapture, setSavedCapture] = useState(null)

	const [action, setAction] = useState<StateProps>({ setStatus: 'start' })
	const [loading, setLoading] = useState(false)

	const [card, setCard] = useState<CardProps>()
	const [toast, setToast] = useState<ToastProps>()
	const [notice, setNotice] = useState<NoticeProps>()

	const [showModal, setShowModal] = useState(false)
	const [showRetake, setShowRetake] = useState(false)

	const [reload, setReload] = useState(0)

	useEffect(() => {

		if (debug) console.log('- Action register changes!', action)

		setLoading(true)

		if (action.data) {
			setCard(action.data.card)
			setToast(action.data.toast)
			setNotice(action.data.notice)
			setShowRetake(action.data.showRetake)
		}

		switch (action.setStatus) {

			case 'taking':
				setShowModal(true)
				break

			case 'expired':

				break

			case 'error':

				break

			case 'retake':
				setSavedCapture(null)
				let rel = reload + 1
				setReload(rel)
				break

			case 'accepted':
				if (!debug) setAction({ setStatus: 'validating', data: action.data })
				break

			case 'validating':
				validateDocument()
				break

			case 'rejected':
			case 'approved':

				break

			case 'saveLocal':
				//setSavedCapture(action.data)
				break;

			case 'cancel':
			case 'close':
				setShowModal(false)
				break

			default:
				//setCard(undefined)
				//setToast(undefined)
				//setNotice(undefined)
				//setShowRetake(false)
				break
		}
		setLoading(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
								showRetake: false,
								card: {
									color: colors.true
								},
								toast: {
									show: 'in-line',//
									label: 'ACCEPTED',
									icon: statusIcons.true,
									iconColor: colors.true,
									bgColor: colors.true,
								},
								notice: {
									show: 'in-line',
									icon: statusIcons.true,
									label: res.summary.outcome,
									iconColor: colors.true,
								}
							}
						})
						break

					case 'Too Much Glare':
					default:
						setAction({
							setStatus: 'rejected',
							data: {
								showRetake: true,
								card: {
									color: colors.false,
								},
								toast: {
									show: 'in-line',
									icon: statusIcons.false,
									label: 'REJECTED',
									bgColor: colors.false,
								},
								notice: {
									show: 'in-line',
									icon: statusIcons.false,
									label: res.summary.outcome,
									iconColor: colors.false,
								}
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
				? <img src={savedCapture} alt='Final Capture' />
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
							showRetake: false,
							card: {
								color: colors.grey
							}
						}
					})
				}}>
			</Button>
		</div>

		<Modal
			className='cameraModal'
			style={ModalStyle}
			ariaHideApp={false}
			isOpen={showModal}>
			<ModalContent>
				<h1 className='white'>Take a picture</h1>
				<p className='white'>Fit your ID card inside the frame.</p>
				<p className='white'>The picture will taken automatically</p>

				{card && <CardStyle color={card.color} height={50}>
					<Webcam setAction={setAction} loader={LoaderStyle} restart={reload} />
				</CardStyle>}

				<Notice {...notice as NoticeProps} />

				<Toast {...toast as ToastProps} />

				{showRetake && <div style={{ position: 'absolute', marginTop: '35%', width: '100%' }}>
					<Button
						type='submit'
						disabled={loading}
						label={'RETAKE PICTURE'}
						onClick={() => {
							setAction({
								setStatus: 'retake',
								data: {
									showRetake: false,
									card: {
										color: colors.grey
									}
								},
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
									showRetake: false,
									card: {
										color: colors.grey
									}
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