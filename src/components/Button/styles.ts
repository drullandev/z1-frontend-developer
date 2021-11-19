import styled from 'styled-components'

export const ButtonStyle = styled.button`
  width: 45%;
  height: 50%;
  padding: 10px;
  //font-family: 'Roboto', sans-serif;
  //font-size: calc(4px + 1vmin);
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  border: none;
  border-radius: 45px;
  background-color: #2f007999;
  transition: all 0.3s ease 0s;
  color: white;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 8px #2f007940;
  cursor: pointer;
  outline: none;
  position: 'absolute';
  
  &:hover {
    background-color: #2f0079;
    box-shadow: 0px 10px 20px #2f007940;
    color: #fff;
    transform: translateY(-6px);
  }

  &:disabled {
    color: grey;
    opacity: 0.7;
    cursor: default;
  }
`
export const AppLinkStyle = styled.button`
  width: 45%;
  padding: 10px;
  //font-family: 'Roboto', sans-serif;
  font-size: calc(10px + 2vmin);
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  border: none;
  transition: all 0.3s ease 0s;
  color: white;
  cursor: pointer;
  outline: none;
  position: 'absolute';
  background-color: #00000000;
  
  &:hover {
    transform: translateY(-6px);
  }

  &:disabled {
    color: grey;
    opacity: 0.7;
    cursor: default;
  }
`