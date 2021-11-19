import styled from 'styled-components'

interface CardProps {
  color?: any
  height?: number
  proportion?: number
}

export const CardStyle = styled.div<CardProps>`
  border-radius: 38px;
  border: 3px solid ${p => p.color};
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 8px ${p => p.color};
  height:  ${p => p.height+'%'};
  max-width: ${p => (p.height?? 10)/(p.proportion??60)+'%'};
  overflow: hidden;
`
