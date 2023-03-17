import Header from '../../components/Header/Header';
import { BasePageContainer, ContentWrapper } from './BasePageStyles';
import InfoBar from '../../components/BasePageComponents/InfoBar/InfoBar';
import Supplies from './Assets/Supplies';
import Borrows from './Assets/Borrows';
import Footer from '../../components/Footer/Footer';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styled from 'styled-components';
import { useState } from 'react';


const StyledTabs = styled(Tabs)`
  width: 90%;
  color: #767B7DD9;
  margin-bottom: 2rem;

  .ant-tabs-tab-btn {
    font-size: 2.2rem;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #fff;
  }

  .ant-tabs-ink-bar {
    background: #0381C5;
  }

  .ant-tabs-tab:hover {
    color: #0381C5;
  }
`


const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Main Pool`,    
    },
    {
      key: '2',
      label: `Ecosystem Pool`,
    },
  ];


const BasePage = () => {

  const [ tab, setTab ] = useState('1');


    return (
        <BasePageContainer>
            <Header />
            <InfoBar />
            <StyledTabs defaultActiveKey="1" items={items} onChange={setTab} />
            <ContentWrapper>
                <Supplies tab={tab}/>
                <Borrows tab={tab}/>
            </ContentWrapper>
            <Footer />
        </BasePageContainer>
    )
}

export default BasePage;