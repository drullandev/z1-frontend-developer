import styled from 'styled-components'

const color = ''
const height = 180
const proportion = 1.618

export const Card = styled.div`
  border-radius: 38px;
  border: 8px solid ${color};
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 8px ${color};
  width: ${proportion*180+'%'}
  height: ${proportion*180+'%'}
`
