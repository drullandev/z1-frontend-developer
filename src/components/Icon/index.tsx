
import React from 'react'
import { ButtonProps } from './types'
import './styles'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * A nice component to set all the icons based on FontAwesome!!
 * TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param param0 
 * @returns 
 */
const Icon: React.FC<ButtonProps> = ({ icon, color }) =>
	<FontAwesomeIcon color={color} icon={icon}/>

export default Icon