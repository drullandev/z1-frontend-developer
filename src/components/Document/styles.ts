import styled from 'styled-components'
import { CardProps } from './types'

export const CardStyle = styled.div<CardProps>`
  margin-top: 3vh;
  border-radius: 38px;
  border: 4px solid ${p => p.color ?? 'grey'};
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 8px ${p => p.color};
  //height:  ${p => p.height+'%'};
  min-height:  ${p => p.height ? p.height/6+'%' : 10+'%'};
  //min-width: 450px;
  width: 450px;
  //max-width:  ${p => (p.height?? 10)*(0.9)+10+'%'};
  overflow: hidden;
`