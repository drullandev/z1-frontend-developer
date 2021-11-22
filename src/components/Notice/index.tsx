import React from 'react'
import { NoticeStyle } from './styles'
import { NoticeProps } from './types'

import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import Icon from '../Icon'

/**
 * A simple notice component
 * //TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param NoticeProps
 * @returns 
 */
const MyNotice: React.FC<NoticeProps> = ({ show, label, icon, iconColor, lblColor }) =>
	<NoticeStyle show={show}>
		<Icon color={iconColor} icon={icon ?? faCoffee} /> <span>{label}</span>
	</NoticeStyle>

export default MyNotice
