import React, { useState, useEffect } from 'react'
import { colors, statusIcons } from '../../utils/CoreUtils'

import { StateProps } from '../../containers/DocumentValidator/types'
import { CardProps } from '../../components/Document/types'
import { DocumentProps } from './types'

import { CardStyle } from '../../components/Document/styles'

import Webcam from '../Webcam'
import Button from '../Button'

const debug = true

const desiredBrightFrom = 1
const initState = { key: 'start', showRetake: false, card: { color: colors.grey }, toast: { show: 'none', bgColor: '' }, notice: { show: 'none' }}
const videoConstraints = { facingMode: 'user' }
const retakeTimeout = 2400
const allowedAttempts = 15

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
	const [attempts, setAttempts] = useState(0)

	useEffect(()=>{
		if(!feedback) return
		switch(feedback.key){
			case 'rejected':
			case 'approved':
				handleOutputs(feedback)
			break
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[feedback])

	useEffect(() => {
		setLoading(true)
		if (debug) console.log('- Document: performing action', action)
		switch (action.key) {

			case 'shot':
				cleanOutputs()
				setShot(Date.now().toString())
				handleOutputs(action)
			break

			case 'getShot':
				if(attempts === allowedAttempts){
					if(debug) console.log('- Document: The capture has expired...')
					setParentAction({
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
							debug: '* Expired after ' + allowedAttempts + ' attempts'
						}
					})
				}
				if(passRequirements(action.data)){
					if(debug) console.log('- Document: The capture has passed requirements...')
					setParentAction({
						key: 'validate',
						data: {
							imageSrc: action.data.imageSrc
						}
					})
					let currAttempts = attempts+1
					setAttempts(currAttempts)
				}else{
					if(debug) console.log('- Document: The capture don\'t pass the local requirements. Reload in '+ retakeTimeout/1000+' seconds...')
					handleOutputs(action)
					let sleep = setTimeout(()=>{
						setShot(Date.now().toString())		
					}, retakeTimeout)
					setLoading(false)
					return ()=> clearTimeout(sleep)
				}
			break

			case 'error':
				if(debug) console.log('- Document: documents has an error', action)
				break
			default:
				
		}
		setLoading(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [action])

	const handleOutputs = (action: any) => {
		setCard(action.card)
		setShowRetake(action.showRetake)
	}

	const cleanOutputs = () => {
		setCard({ color: colors.grey, height: 60 })
		setShowRetake(false)
	}

	const passRequirements = (data: any) => {
		// Bright parameters to block the images
		if (checks.includes('bright')) {
			if (!getTooDark(data)) return false
		}
		// Other parameters to block the images
		if (checks.includes('cardDetected')) {
			if (!cardDetected(data)) return false
		}
		return true
	}

	const getTooDark = (data: any) => {
		var tooDark = data.bright < desiredBrightFrom
		var extra = {
			debug: '* Bright diff, ' + data.bright + ' < ' + desiredBrightFrom,
			imageSrc: ''
		}
		if (tooDark) {
			if(debug) console.log('- Document: capture is too dark!', extra)
			setParentAction({
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
			if(debug) console.log('- Document: capture is too dark!', extra)
			setParentAction({
				key: 'lightOk',
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
					show: 'inline',
					icon: statusIcons.bulb,
					iconColor: colors.bulb,
					label: 'Picture bright is accepted!',
				},
				data: {
					imasgeSrc: data.imageSrc
				}
			})
			return true
		}
	}

	const cardDetected = (data: any) => {
		////TODO: Set a card detector!!
		//var hasCard = getCardDetected(data)
		setAction({
			key: 'validate',
			showRetake: false,
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

	return <>

		<CardStyle {...card} height={60} proportion={1.3}>			
			<Webcam
				parentShot={shot}
				timeout={retakeTimeout}
				setParentAction={setAction}
				videoConstraints={videoConstraints}
			/>
		</CardStyle>

		{showRetake && <div style={{ position: 'absolute', marginTop: '33vh', width: '100%' }}>
			<Button
				type='submit'
				disabled={loading}
				label={'RETAKE PICTURE'}
				onClick={() => {
					setAction({
						key: 'shot',
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
				label='CLOSE'
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
