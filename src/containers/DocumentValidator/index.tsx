
import React, { useEffect, useState } from 'react'
import { colors, statusIcons } from '../../utils/CoreUtils'

import { CardProps } from '../../components/Document/types'
import { ToastProps } from '../../components/Toast/types'
import { NoticeProps } from '../../components/Notice/types'

import { CardStyle, CaptureStyle } from '../../components/Document/styles'
import { ModalStyle, loaderStyle, ModalContent } from './styles';

import Modal from 'react-modal'
import Toast from '../../components/Toast'
import Notice from '../../components/Notice'
import Loader from '../../components/Loader'
import Button from '../../components/Button'
import Document from '../../components/Document'

//EXTRA
import { StateProps } from '../../containers/DocumentValidator/types'

const debug = false

const testValidationUrl = 'https://front-exercise.z1.digital/evaluations'
const documentCaptureChecks = ['bright']

const initialState = { key: 'start', showRetake: false, card: { color: colors.grey }, toast: { show: 'none', bgColor: '' }, notice: { show: 'none' }}
const cardsDefault = { color: colors.false }

const DocumentValidator: React.FC = () => {

	const [savedCapture, setSavedCapture] = useState(null)

	const [action, setAction] = useState<StateProps>(initialState)
	const [loading, setLoading] = useState(false)
	const [feedback, setFeedback] = useState<any>()
	const [showModal, setShowModal] = useState(false)

	const [card, setCard] = useState<CardProps>(cardsDefault)
	const [toast, setToast] = useState<ToastProps>()
	const [notice, setNotice] = useState<NoticeProps>()
	const [toastModal, setToastModal] = useState<ToastProps>()
	const [showTake, setShowTake] = useState(true)
	const [showRetake, setShowRetake] = useState(false)

	useEffect(() => {

		setLoading(true)
		if (debug) console.log('- DocumentValidator: performing action', action)
		
		//Common
		setOutputs(action)

		//Extra
		switch (action.key) {

			case 'take':
				setShowModal(true)
				break

			case 'retake':
				cleanOutputs()
				setFeedback(action)
				break

			case 'validate':
				validateDocument(action.data.imageSrc)
				break

			case 'approved':
				setSavedCapture(action.data.imageSrc)
				setAction(action)
				setShowTake(false)
				setFeedback(action)
				setToast({
					show: 'inline',
					label: 'ACCEPTED',
					icon: statusIcons.true,
					iconColor: colors.true,
					bgColor: colors.true,
				})
				break

			case 'rejected':
				setSavedCapture(null)
				setFeedback(action)
				break

			case 'cancel':
				setShowModal(false)
				cleanOutputs()
				break

			case 'close':
				setShowModal(false)
				setFeedback({	key: 'close',	showRetake: false, card: colors.grey })
				break
			default:

		}
		setLoading(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [action])

	const setOutputs = (action: any) => {
		setCard(action.card)
		setNotice(action.notice)
		setToastModal(action.toast)
		setShowRetake(action.showRetake)
	}

	const cleanOutputs = () => {
		setCard({ color: colors.grey })
		setNotice(action.notice)
		setToastModal({ show: 'none', bgColor: '' })
		setShowRetake(false)
	}

	const validateDocument = (data: any) => {
		var myHeaders = new Headers()
		var myInit = {
			method: 'POST',
			headers: myHeaders,
			body: data
		}
		fetch(testValidationUrl, myInit)
			.then(res => res.json())
			.then((res: any) => {
				switch (res.summary.outcome) {
					case 'Approved':
						setAction({
							key: 'approved',
							showRetake: false,
							card: {
								color: colors.true
							},
							toast: {
								show: 'inline',//
								label: 'ACCEPTED',
								icon: statusIcons.true,
								iconColor: colors.true,
								bgColor: colors.true,
							},
							notice: {
								show: 'inline',
								icon: statusIcons.trueCircle,
								label: 'Picture taken!',
								iconColor: colors.true,
							},
							data: {
								debug: res,
								imageSrc: data
							}
						})
						break

					case 'Too Much Glare':
					default:
						setAction({
							key: 'rejected',
							showRetake: true,
							card: {
								color: colors.false,
							},
							toast: {
								show: 'inline',
								icon: statusIcons.false,
								label: 'REJECTED',
								bgColor: colors.false,
							},
							notice: {
								show: 'inline',
								icon: res.summary.outcome === 'Too Much Glare' ? statusIcons.bulb : statusIcons.false,
								label: res.summary.outcome ? res.summary.outcome : 'Something was wrong',
								iconColor: res.summary.outcome === 'Too Much Glare' ? colors.warning : colors.false,
							},
							data: {
								debug: res
							}
						})
						break
				}
			})
			.catch((err: any) => {
				if (debug) console.log('Call error!!!', err)
			})
	}

	return <>

		<h1>Scan your ID</h1>
		<h2>Take a picture. It may take time to validate your personal information.</h2>

		<CardStyle {...card} color={savedCapture ? colors.true : colors.grey} height={60} proportion={1.3}>
			{savedCapture
				? <div className='box' style={{height: '50%'}}>
						<img
						style={{
							maxWidth: '100%',
							marginBottom: '-4px',
							display: savedCapture ? 'inline' : 'none'
						}}
						src={savedCapture}
						alt='Accepted capture!!!'
					/>
				</div>
				/*<CaptureStyle
					src={savedCapture}
					alt='Final Capture'
				/>*/
				: <Loader params={loaderStyle} />
			}
		</CardStyle>

		{!showModal && savedCapture && <div style={{ marginTop: '-10px', width: '100%' }}>
			 <Toast {...toast as ToastProps} zIndex={0}/>
		</div>}

		{showTake && <div style={{ marginTop: '-186px', width: '100%' }}>
			 <Button
				disabled={loading}
				type='submit'
				label={showRetake ? 'RETAKE PICTURE' : 'TAKE PICTURE'}
				onClick={() => {
					setAction({
						key: 'take',
						showRetake: false,
						card: {
							color: colors.grey
						}
					})
				}}>
			</Button>
		</div>}

		<Modal
			className='cameraModal'
			style={ModalStyle}
			ariaHideApp={false}
			isOpen={showModal}>
			<ModalContent style={{padding: '6vh'}}>
				
				<h1 className='white'>Take a picture</h1>
				<p className='white paragraph'>Fit your ID card inside the frame.</p>
				<p className='white paragraph'>The picture will taken automatically.</p>

				<Document
					loader={loaderStyle}
					checks={documentCaptureChecks}
					setParentAction={setAction}
					feedback={feedback}
				/>
				
				<Notice {...notice as NoticeProps} />

				<Toast {...toastModal as ToastProps} />

			</ModalContent>

		</Modal>

	</>

}

export default DocumentValidator