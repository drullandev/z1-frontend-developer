
import React from 'react'
import { AppHeader } from  './styles'
import { HeaderProps } from  './types'

const Header: React.FC<HeaderProps> = ({ label }) =>
	<AppHeader>{label}</AppHeader>

export default Header
