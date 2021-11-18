
import React from 'react'
import { ButtonProps } from './types'
import './styles'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Icon: React.FC<ButtonProps> = ({ icon, label }) =>
	<FontAwesomeIcon icon={icon}/>

export default Icon