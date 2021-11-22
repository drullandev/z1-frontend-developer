import styled from 'styled-components'
import { NoticeProps } from './types'

export const NoticeStyle = styled.div<NoticeProps>`
  overflow: hidden;
  display: ${p => p.show ? p.show : 'none'};
  margin: 20px 0px;
  font-size: calc(10px + 1vmin);
  cursor: 'arrow';
  color: white;
`