import { Styles } from 'react-modal'
import styled from 'styled-components'

export const ModalContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  height: 100%;
`

export const ModalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    textAlign: 'center',
  }
} as Styles

export const LoaderStyle = {
	rx: 10,
	ry: 10,
	height: 30,
	margin: 12,
	width: 10,
	config: {
		speed: 4,
		width: 400,
		height: 290,
		viewBox: '0 0 450 200',
		backgroundColor: '#f3f3f3',
		foregroundColor: '#ecebeb',
	},
	fields: [
		{ style: 'rect', x: 10, y: 0, width: 300 },
		{ style: 'rect', x: 10, y: 1, width: 130 },
		{ style: 'rect', x: 10, y: 2, width: 80 },
		{ style: 'rect', x: 58, y: 3, width: 41 },
    { style: 'rect', x: 58, y: 5, width: 41 },
		{ style: 'circle', r: 40 }
	]
}
