import React, { useState, useEffect } from 'react'
import { colors, statusIcons } from '../../utils/CoreUtils'

import { StateProps } from '../../containers/DocumentValidator/types'
import { CardProps } from '../../components/Document/types'
import { DocumentProps } from './types'

import { CardStyle } from '../../components/Document/styles'

import Webcam from '../Webcam'
import Button from '../Button'

const debug = false

const desiredBrightFrom = 1
const initState = { key: 'start', showRetake: false }
const videoConstraints = { facingMode: 'user' }

/**
 * This is my feature to take pictures automathically...
 * //TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param DocumentProps 
 * @returns 
 */
const Document: React.FC<DocumentProps> = ({
	setParentAction,
	loader,
	checks,
	feedback
}) => {

	const [action, setAction] = useState<StateProps>(initState)
	const [card, setCard] = useState<CardProps>({ color: colors.grey, height: 50 })
	const [shot, setShot] = useState('')
	const [loading, setLoading] = useState(false)
	const [showRetake, setShowRetake] = useState(false)

	useEffect(() => {
		if (!feedback) return
		setAction(feedback as StateProps)
	}, [feedback])

	useEffect(() => {

		setLoading(true)
		if (debug) console.log('- Document: performing action', action)

		// Common
		handleOutputs(action)

		// Extra
		switch (action.key) {

			case 'shot':
				setShot(Date.now().toString())
				break

			case 'retake':
				setShot(Date.now().toString())
				break

			case 'shotReturn':
				passRequirements(action.data)
				setParentAction({
					key: 'validate',
					data: {
						imageSrc: action.data.imageSrc
					}
				})
				break

			case 'error':
				setShot(Date.now().toString())
				break

			default:
				
		}

		setLoading(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [action])

	const passRequirements = (data: any) => {
		// Bright parameters to block the images
		if (checks.includes('bright')) {
			if (!getTooDark(data)) return
		}
		// Other parameters to block the images
		if (checks.includes('cardDetected')) {
			if (!cardDetected(data)) return
		}
	}

	const getTooDark = (data: any) => {
		var tooDark = data.bright < desiredBrightFrom
		var extra = {
			debug: '* Bright diff, ' + data.bright + ' < ' + desiredBrightFrom,
			imageSrc: ''
		}
		if (tooDark) {
			setAction({
				key: 'error',
				showRetake: false,
				card: {
					color: colors.moregrey,
				},
				toast: {
					show: 'none',
					icon: statusIcons.false,
					label: 'REJECTED',
					iconColor: colors.bulb,
					bgColor: colors.false,
				},
				notice: {
					show: 'inline',
					icon: statusIcons.bulb,
					label: 'Room lighting is to low',
					iconColor: colors.bulb,
				},
				data: extra
			})
			return false
		} else {
			setAction({
				key: 'accepted',
				showRetake: false,
				card: {
					color: colors.grey,
				},
				toast: {
					show: 'none',
					icon: statusIcons.true,
					iconColor: colors.bulb,
					label: 'ACCEPTED',
					bgColor: colors.true,
				},
				notice: {
					show: 'inline',//mostly none
					icon: statusIcons.bulb,
					iconColor: colors.bulb,
					label: 'Picture bright is accepted!',
				},
				data: {
					imasgeSrc: data.imageSrc
				}
			})
		}
		return true
	}

	const cardDetected = (data: any) => {
		////TODO: Set a card detector!!
		//var hasCard = getCardDetected(data)
		setAction({
			key: 'validate',
			showRetake: true,
			card: {
				color: colors.true,
			},
			toast: {
				show: 'inline',
				icon: statusIcons.true,
				iconColor: colors.true,
				label: 'ACCEPTED',
				bgColor: colors.true,
			},
			notice: {
				show: 'inline',
				icon: statusIcons.true,
				iconColor: colors.true,
				label: 'Your image has a card...',
			},
			data: {
				debug: '* A card was detected!'
			}
		})
		return true
	}

	const handleOutputs = (action: any) => {
		setCard(action.card)
		setShowRetake(action.showRetake)
	}

	return <>

		<CardStyle {...card} height={60} proportion={1.3}>
			<Webcam
				shot={shot}
				timeout={3000}
				setParentAction={setAction}
				videoConstraints={videoConstraints}
			/>
		</CardStyle>

		{showRetake && <div style={{ position: 'absolute', marginTop: '30vh', width: '100%' }}>
			<Button
				type='submit'
				disabled={loading}
				label={'RETAKE PICTURE'}
				onClick={() => {
					setParentAction({
						key: 'retake',
						showRetake: false,
						card: {
							color: colors.grey
						}
					})
				}}
			/>
		</div>}

		<div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
			<Button
				disabled={loading}
				label={action.key === 'approved' ? 'CLOSE' : 'CANCEL'}
				onClick={() => {
					setParentAction({
						key: 'cancel',
						showRetake: false,
						card: {
							color: colors.grey
						},
					})
				}}
			/>
		</div>

		<div style={{ display: false ? 'inline' : 'none' }}>
			<Button
				type='submit'
				disabled={loading}
				label={'DEBUG CHILD RESHOT'}
				onClick={() => {
					setAction({
						key: 'shot',
						showRetake: false,
						card: {
							color: colors.grey
						},
					})
				}}
			/>
		</div>

	</>

}

export default Document

// Missed options

/*
setAction({
	key: 'expired',
	return: false,
	showRetake: true,
	card: {
		color: 'red',
	},
	toast: {
		show: 'inline',
		icon: statusIcons.false,
		label: 'EXPIRED',
		iconColor: colors.false,
		bgColor: colors.false,
	},
	notice: {
		show: 'inline',
		icon: statusIcons.expired,
		label: 'Expired oportunities',
		iconColor: colors.warning,
		lblColor: colors.false,
	},
	data: {
		debug: '* Expired after ' + maxAttempts + ' attempts'
	}
})

	return true
*/