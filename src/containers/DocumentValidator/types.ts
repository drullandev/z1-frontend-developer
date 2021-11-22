import { ToastProps } from '../../components/Toast/types'
import { NoticeProps } from '../../components/Notice/types'
import { CardProps } from '../../components/Document/types'
export interface StateProps {
	key:
		'start' |
		'take' 				| 'retake' 		| //'expired' |
		'validating' 	| 'error' 		| 'accepted' 	|
		'rejected' 		| 'approved' 	| 
		'cancel' 			| string,
	return?: boolean,	
	showRetake: boolean
	card?: CardProps,
	toast?: ToastProps,
	notice?: NoticeProps,
	data?: any
}