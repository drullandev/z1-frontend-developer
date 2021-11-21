import { ToastProps } from '../../components/Toast/types'
import { NoticeProps } from '../../components/Notice/types'

export interface CardProps {
	show?: string
	color?: string
	height?: number
	proportion?: number
}

export interface StateProps {
	setStatus?:
	'start' |
	'take' 				| 'retake' 		| 'taking' 		| 'expired' |
	'validating' 	| 'error' 		| 'accepted' 	|
	'rejected' 		| 'approved' 	| 
	'cancel' 			| string,
	return?: boolean,
	data?: {
		showRetake: boolean
		card?: CardProps,
		toast?: ToastProps,
		notice?: NoticeProps
	}
}