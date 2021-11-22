import styled from 'styled-components'

interface IconProps {
  color?: string
}

export const Icon = styled.image<IconProps>`
  background-color: black;
  color: ${p=>p.color};
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`
