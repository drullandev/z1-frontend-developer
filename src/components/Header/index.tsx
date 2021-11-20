
import React from 'react'
import { AppHeader } from  './styles'
import { HeaderProps } from  './types'

/**
 * A nice BUT absolutely WIP header, only for this test ;)
 * TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param param0 
 * @returns 
 */
const Header: React.FC<HeaderProps> = ({ label }) =>
	<AppHeader>{label}</AppHeader>

export default Header
