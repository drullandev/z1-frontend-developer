
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { StateProps } from '../../containers/DocumentValidator/types'
import { CardProps } from '../../components/Document/types'
import { ToastProps } from '../../components/Toast/types'
import { NoticeProps } from '../../components/Notice/types'

import { ModalStyle, LoaderStyle, ModalContent } from './styles'
import { CardStyle } from '../../components/Document/styles'

import { colors, statusIcons } from '../../utils/CoreUtils'

import Toast from '../../components/Toast'
import Notice from '../../components/Notice'
import Loader from '../../components/Loader'
import Button from '../../components/Button'
import Document from '../../components/Document'

const debug = false

const testValidationUrl = 'https://front-exercise.z1.digital/evaluations'
const documentCaptureChecks = ['bright']

const initialState = { key: 'start', showRetake: false }
const cardsDefault = { color: colors.grey }

const DocumentValidator: React.FC = () => {

	const [savedCapture, setSavedCapture] = useState(null)

	const [action, setAction] = useState<StateProps>(initialState)
	const [loading, setLoading] = useState(false)
	const [feedback, setFeedback] = useState<any>()
	const [showModal, setShowModal] = useState(false)

	const [card, setCard] = useState<CardProps>(cardsDefault)
	const [toast, setToast] = useState<ToastProps>()
	const [notice, setNotice] = useState<NoticeProps>()

	useEffect(() => {
		setLoading(true)
		if (debug) console.log('- DocumentValidator: performing action', action)

		//Common
		handleOutputs(action)

		//Extra
		switch (action.key) {

			case 'take':
				setShowModal(true)
				break

			case 'retake':
				setFeedback(action)
				break

			case 'validate':
				validateDocument(action.data.imageSrc)
				break

			case 'approved':
				setSavedCapture(action.data.imageSrc)
				setFeedback(action)
				setAction(action)
				break

			case 'rejected':
				setSavedCapture(null)
				setFeedback(action)
				break

			case 'cancel':
			case 'close':
				setShowModal(false)
				setFeedback(
					{ key: 'close', showRetake: false }
				)
				break

			default:

		}
		setLoading(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [action])

	const handleOutputs = (action: any) => {
		setCard(action.card)
		setToast(action.toast)
		setNotice(action.notice)
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
								icon: statusIcons.true,
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
								label: res.summary.outcome,
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
				? <img src={savedCapture} alt='Final Capture' style={{ marginBottom: '-5px' }} />
				: <Loader params={LoaderStyle} />
			}
		</CardStyle>

		<Notice {...notice as NoticeProps} />

		<div style={{ marginTop: '-186px', width: '100%' }}>
			<Button
				disabled={loading}
				type='submit'
				label={savedCapture ? 'RETAKE PICTURE' : 'TAKE PICTURE'}
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
		</div>

		<Modal
			className='cameraModal'
			style={ModalStyle}
			ariaHideApp={false}
			isOpen={showModal}>
			<ModalContent>
				
				<h1 className='white'>Take a picture</h1>
				<p className='white' style={{fontSize: '22px', marginTop: '0px'}}>Fit your ID card inside the frame.</p>
				<p className='white' style={{fontSize: '22px', marginTop: '0px'}}>The picture will taken automatically.</p>

				<Document
					loader={LoaderStyle}
					checks={documentCaptureChecks}
					setParentAction={setAction}
					feedback={feedback}
				/>
				
				<Notice {...notice as NoticeProps} />

				<Toast {...toast as ToastProps} />

			</ModalContent>

		</Modal>

	</>

}

export default DocumentValidator