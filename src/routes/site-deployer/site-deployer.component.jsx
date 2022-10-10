import {
  Card,
  CardHeader,
  Form,
  FormItem,
  Input,
  InputType,
  Select,
  MultiComboBox,
  MultiComboBoxItem,
  Option,
  FormGroup,
  CheckBox,
  TextArea,
  Label,
  Bar,
  Title,
  Text,
  TitleLevel,
  FlexBox,
} from '@ui5/webcomponents-react';
import { spacing } from '@ui5/webcomponents-react-base';
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js';
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js';
import '@ui5/webcomponents-icons/dist/add.js';
import '@ui5/webcomponents-icons/dist/decline.js';
import '@ui5/webcomponents-icons/dist/overflow.js';

import SitesTable from '../../components/sites-table/sites-table.component';

import dataCenters from '../../dataCenters.json';
import siteStructures from '../../sitesStructures.json';

const BarStart = (props) => (
  <Title
    level={TitleLevel.H3}
    slot={props.slot}
    style={spacing.sapUiSmallMarginBegin}
  >
    <span style={spacing.sapUiTinyMarginBegin}>Site Deployer</span>
  </Title>
);

const SiteDeployer = () => {
  return (
    <div className="cdc-tools-app-container" name="site-deployer">
      <Bar design="Header" startContent={<BarStart />}></Bar>
      <div style={{ overflow: 'scroll', height: 'calc(100vh - 100px)' }}>
        <div style={spacing.sapUiSmallMargin}>
          <div style={spacing.sapUiTinyMargin}>
            <FlexBox style={spacing.sapUiSmallMarginBottom}>
              <Text style={{ color: 'var(--sapNeutralElementColor)' }}>
                Use Site Structures to quickly create complex implementations
                from a curated list of structures based on best practices.
              </Text>
            </FlexBox>
            <Card header={<CardHeader titleText="Site Structures" />}>
              <FlexBox justifyContent="SpaceBetween">
                <div
                  style={{
                    ...spacing.sapUiSmallMargin,
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Label
                    for="cdctools-siteDomain"
                    style={{ ...spacing.sapUiTinyMarginTopBottom }}
                  >
                    Site Domain: *
                  </Label>
                  <Input
                    id="cdctools-siteDomain"
                    type={InputType.Text}
                    style={{ width: '100%' }}
                    placeholder="e.g. mysite.com"
                    onInput={(e) => console.log('changed', e.target.value)}
                  />
                </div>
                <div
                  style={{
                    ...spacing.sapUiSmallMargin,
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Label
                    for="cdctools-dataCenter"
                    style={{ ...spacing.sapUiTinyMarginTopBottom }}
                  >
                    Choose Data Centers: *
                  </Label>
                  <MultiComboBox
                    id="cdctools-dataCenter"
                    style={{ width: '100%' }}
                  >
                    {dataCenters.map(({ value }) => (
                      <MultiComboBoxItem key={value} text={value} selected />
                    ))}
                  </MultiComboBox>
                </div>
              </FlexBox>

              <div
                style={{
                  ...spacing.sapUiSmallMargin,
                  marginTop: 0,
                  textAlign: 'left',
                }}
              >
                <Label
                  for="cdctools-siteStructure"
                  style={{ ...spacing.sapUiTinyMarginTopBottom }}
                >
                  Select a Site Structure: *
                </Label>

                <Select id="cdctools-siteStructure" style={{ width: '100%' }}>
                  <Option></Option>
                  {siteStructures.map(({ _id, name }) => (
                    <Option key={_id} value={_id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Card>
          </div>
        </div>
        <div style={spacing.sapUiSmallMargin}>
          <div style={spacing.sapUiTinyMargin}>
            <Card
              header={
                <CardHeader
                  titleText="Site Creation Preview"
                  subtitleText="Quickly add or remove sites, change the structure, update the domains naming, description and select data centers."
                  // subtitleText="Quickly change the domains naming and structure. You can also set policies, and other configurations to be copied from an existing site seed."
                ></CardHeader>
              }
            >
              <SitesTable />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDeployer;
