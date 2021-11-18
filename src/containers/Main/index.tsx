import React from 'react'
import { MyApp, AppBody } from './styles'

import Header from '../../components/Header'
import DocumentValidator  from '../../components/DocumentValidator'

function Main() {
  return (
    <MyApp>
      <Header label='BankClient'/>
      <AppBody>
        <DocumentValidator/>
      </AppBody>
    </MyApp>
  )
}

export default Main