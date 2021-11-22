export interface DocumentProps {
	setParentAction: any
	loader: any
	checks: any
	feedback?: {
		key: string
	}
}

export interface CardProps {
	show?: string
	color: string
	height?: number
	proportion?: number
}
