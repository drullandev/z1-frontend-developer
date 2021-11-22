import React from 'react'
import { ToastStyle } from './styles'
import { ToastProps } from './types'
import Icon from '../Icon'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

/**
 * This is a very simple toast under construction...
 * //TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param ToastProps
 * @returns 
 */
const MyToast: React.FC<ToastProps> = ({ show, label, icon, bgColor }) =>
	<ToastStyle show={show} bgColor={bgColor}>
		<Icon icon={icon ?? faCoffee} /> {label}
	</ToastStyle>

export default MyToast
