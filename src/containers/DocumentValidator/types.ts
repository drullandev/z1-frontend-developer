export interface StateProps {
	setStatus:
	'start' |
	'take' | 'retake' | 'taking' | 'expired' |
	'validating' | 'error' | 'accepted' |
	'rejected' | 'approved' | 'cancel' | string,
	data?: any
}