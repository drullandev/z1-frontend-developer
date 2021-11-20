import { Styles } from 'react-modal'
import styled from 'styled-components'

interface CardProps {
  color?: any
  height?: number
  proportion?: number
}

export const CardStyle = styled.div<CardProps>`
  border-radius: 38px;
  border: 4px solid ${p => p.color};
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 8px ${p => p.color};
  height:  ${p => p.height+'%'};
  width: ${p => (p.height?? 10)*(0.9)+'%'};
  max-width: 560px;
  overflow: hidden;
`

export const ModalContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ModalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    //backgroundImage: 'url(' + img + ')',
  },
  content: {
    backgroundImage: '../assets/Rain-1-reworked.jpg',
    position: 'absolute',
    top: '0px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    //border: '1px solid #ccc',
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